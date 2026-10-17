import { useEffect, useRef, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getCountFromServer,
  getDocs,
  limit,
  startAfter,
  doc,
  setDoc,
} from 'firebase/firestore'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'
import { buildSignaturesCsv } from '../lib/csv'
import { useToast } from '../context/ToastContext'
import { colors, fonts } from '../lib/theme'

const PAGE_SIZE = 50

const AUTH_ERRORS = {
  'auth/invalid-email':        'ትክክለኛ ኢሜይል ያስገቡ።',
  'auth/missing-password':     'የይለፍ ቃል ያስገቡ።',
  'auth/invalid-credential':   'ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም።',
  'auth/wrong-password':       'ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም።',
  'auth/user-not-found':       'ኢሜይል ወይም የይለፍ ቃል ትክክል አይደለም።',
  'auth/too-many-requests':    'ብዙ ሙከራ ተደርጓል — ትንሽ ይጠብቁ።',
  'auth/network-request-failed':'ኢንተርኔት ግንኙነት የለም።',
  'auth/operation-not-allowed': 'Email/Password sign-in በ Firebase Console አልተفعالም።',
}

function formatDate(ts) {
  if (!ts) return '—'
  return ts.toDate().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPanel() {
  const { toast } = useToast()
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [hasClaim, setHasClaim] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(null)
  const rowsRef = useRef([])
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const [recounting, setRecounting] = useState(false)
  const [recount, setRecount] = useState(null)

  const authed = !!user && hasClaim

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setAuthLoading(false)
      if (!u) {
        setHasClaim(false)
        return
      }
      try {
        const token = await u.getIdTokenResult()
        setHasClaim(token.claims.admin === true)
      } catch {
        setHasClaim(false)
      }
    })
  }, [])

  useEffect(() => {
    rowsRef.current = rows
  }, [rows])

  useEffect(() => {
    if (!authed) {
      setRows([])
      setLoading(true)
      setHasMore(false)
      setTotal(null)
      return
    }
    // Live first page only — older pages are fetched on demand via loadMore.
    const q = query(
      collection(db, 'signatures_private'),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE)
    )
    return onSnapshot(
      q,
      (snap) => {
        setLoadError('')
        const page1 = snap.docs.map((d) => ({ id: d.id, snap: d, ...d.data() }))
        const page1Ids = new Set(page1.map((r) => r.id))
        setRows((prev) => [...page1, ...prev.slice(PAGE_SIZE).filter((r) => !page1Ids.has(r.id))])
        setHasMore(snap.docs.length === PAGE_SIZE)
        setLoading(false)
      },
      (err) => {
        console.error('[AdminPanel]', err.code, err.message)
        setLoadError(
          err.code === 'permission-denied'
            ? 'ፍቃድ የለም — ይህ ተጠቃሚ አድሚን መቼት የለውም። `npm run admin:grant -- <ኢሜይል>` ያጫኑ።'
            : 'ፊርማዎችን ማጫን አልተቻለም — ድጋሚ ይሞክሩ።'
        )
        setLoading(false)
      }
    )
  }, [authed])

  useEffect(() => {
    if (!authed) return
    let cancelled = false
    getCountFromServer(collection(db, 'signatures_private'))
      .then((snap) => {
        if (!cancelled) setTotal(snap.data().count)
      })
      .catch((err) => console.error('[AdminPanel total]', err.code))
    return () => {
      cancelled = true
    }
  }, [authed])

  async function login(e) {
    e.preventDefault()
    if (!email.trim() || !pw) {
      setPwError('ኢሜይልና የይለፍ ቃል ያስገቡ።')
      return
    }
    setLoggingIn(true)
    setPwError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pw)
      // onAuthStateChanged flips the authed state (and checks the claim)
    } catch (err) {
      console.error('[AdminLogin]', err.code)
      setPwError(AUTH_ERRORS[err.code] ?? `ግባት አልተሳካም (${err.code ?? 'unknown'})`)
    } finally {
      setLoggingIn(false)
    }
  }

  async function refreshClaim() {
    if (!user) return
    setRefreshing(true)
    try {
      const token = await user.getIdToken(true)
      setHasClaim(token.claims.admin === true)
      if (token.claims.admin !== true) {
        setPwError('አድሚን መቼት አልተሰጠም — grant script ያጫኑ።')
      }
    } finally {
      setRefreshing(false)
    }
  }

  function logout() {
    signOut(auth)
    setPw('')
    setEmail('')
    setPwError('')
  }

  async function fetchAllSignatures() {
    const snap = await getDocs(
      query(collection(db, 'signatures_private'), orderBy('createdAt', 'desc'))
    )
    return snap.docs.map((d) => d.data())
  }

  async function exportCSV() {
    try {
      const all = await fetchAllSignatures()
      const blob = new Blob([buildSignaturesCsv(all)], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fasil-petition-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('[AdminPanel export]', err.code, err.message)
      toast('CSV ማውርድ አልተቻለም — ድጋሚ ይሞክሩ።', 'error')
    }
  }

  async function verifyCount() {
    setRecounting(true)
    try {
      const snap = await getCountFromServer(collection(db, 'signatures'))
      const real = snap.data().count
      // Fix the stats document to match reality
      await setDoc(doc(db, 'stats', 'count'), { total: real }, { merge: true })
      setRecount(real)
    } catch (err) {
      console.error(err)
      toast(`Recount failed: ${err.message}`, 'error')
    } finally {
      setRecounting(false)
    }
  }

  async function loadMore() {
    const last = rowsRef.current.at(-1)
    if (!last?.snap) return
    setLoadingMore(true)
    try {
      const snap = await getDocs(
        query(
          collection(db, 'signatures_private'),
          orderBy('createdAt', 'desc'),
          startAfter(last.snap),
          limit(PAGE_SIZE)
        )
      )
      const more = snap.docs.map((d) => ({ id: d.id, snap: d, ...d.data() }))
      setRows((prev) => {
        const ids = new Set(prev.map((r) => r.id))
        return [...prev, ...more.filter((r) => !ids.has(r.id))]
      })
      setHasMore(snap.docs.length === PAGE_SIZE)
    } catch (err) {
      console.error('[AdminPanel loadMore]', err.code, err.message)
      toast('ተጨማሪ መጫን አልተቻለም — ድጋሚ ይሞክሩ።', 'error')
    } finally {
      setLoadingMore(false)
    }
  }

  async function copyAll() {
    try {
      const all = await fetchAllSignatures()
      const text = all
        .map((s, i) => `${i + 1}. ${s.name}${s.city ? ' · ' + s.city : ''}${s.email ? ' | ' + s.email : ''}${s.comment ? '\n   "' + s.comment + '"' : ''}`)
        .join('\n')
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[AdminPanel copy]', err.code, err.message)
      toast('Clipboard ላይ መቅዳት አልተቻለም።', 'error')
    }
  }

  const filtered = rows.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.comment?.toLowerCase().includes(q)
    )
  })

  const withCity = rows.filter((s) => s.city).length
  const withComment = rows.filter((s) => s.comment).length
  const distinctCities = new Set(
    rows.map((s) => s.city).filter(Boolean)
  ).size

  // ── Auth bootstrapping ─────────────────────────────────────────
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: colors.bgAlt, fontFamily: fonts.body }}
      >
        <p className="text-gray-600 text-sm animate-pulse">በመፈትሽ ላይ...</p>
      </div>
    )
  }

  // ── Signed in via Firebase Auth, but no admin claim yet ───────
  if (user && !hasClaim) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: colors.bgAlt, fontFamily: fonts.body }}
      >
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="text-5xl">🗝️</div>
          <h1 className="text-white font-black text-2xl">አድሚን መቼት የለም</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            {user.email} በ Firebase Auth ገብተዋል፤ ግን የአድሚን መቼት
            አልተሰጣቸውም። ከላይ ያለውን ትዕዛዝ ያጫኑ ከዚያ እንደገና ይፈትሹ።
          </p>
          <code
            className="block text-xs rounded-xl px-4 py-3 text-left break-all"
            style={{ background: colors.control, border: `1px solid ${colors.borderInput}`, color: colors.success }}
          >
            npm run admin:grant -- {user.email}
          </code>
          {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
          <div className="flex gap-2">
            <button
              onClick={refreshClaim}
              disabled={refreshing}
              className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-50"
              style={{ background: colors.brand }}
            >
              {refreshing ? '⏳ በመፈትሽ ላይ...' : 'ድጋሚ ፈትሽ'}
            </button>
            <button
              onClick={logout}
              className="flex-1 py-3 rounded-xl font-bold"
              style={{ background: colors.control, border: `1px solid ${colors.borderInput}`, color: colors.textMuted }}
            >
              ውጣ
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Login screen ──────────────────────────────────────────────
  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: colors.bgAlt, fontFamily: fonts.body }}
      >
        <div className="w-full max-w-xs">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-white font-black text-2xl">Admin</h1>
            <p className="text-gray-500 text-sm mt-1">ፋሲል ከነማ እግርኳስ ክለብ Petition</p>
          </div>
          <form
            onSubmit={login}
            className="rounded-2xl p-6 space-y-4"
            style={{ background: colors.surface, border: `1px solid ${colors.borderStrong}` }}
          >
            <input
              type="email"
              value={email}
              autoFocus
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ኢሜይል"
              className="w-full rounded-xl px-4 py-3 text-white outline-none"
              style={{ background: colors.control, border: `1px solid ${colors.borderInput}` }}
            />
            <input
              type="password"
              value={pw}
              autoComplete="current-password"
              onChange={(e) => setPw(e.target.value)}
              placeholder="የይለፍ ቃል"
              className="w-full rounded-xl px-4 py-3 text-white outline-none"
              style={{ background: colors.control, border: `1px solid ${colors.borderInput}` }}
            />
            {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl text-white font-bold text-base disabled:opacity-50"
              style={{ background: colors.brand }}
            >
              {loggingIn ? '⏳ በመግባት ላይ...' : 'ግባ'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Admin dashboard ───────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: colors.bgAlt, fontFamily: fonts.body }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3 flex-wrap"
        style={{ background: colors.surface, borderBottom: `1px solid ${colors.borderStrong}` }}
      >
        <div>
          <h1 className="font-black text-base text-white leading-tight">
            ፋሲል ፔቲሽን — ፊርማዎች
          </h1>
          <p className="text-gray-500 text-xs">
            {loading
              ? 'በመጫን ላይ...'
              : total !== null
                ? `${rows.length.toLocaleString()} / ${total.toLocaleString()} የታወቁ`
                : `${rows.length.toLocaleString()} የታወቁ`}
            {user?.email && <span className="text-gray-600"> · {user.email}</span>}
          </p>
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <button
            onClick={verifyCount}
            disabled={recounting}
            title="Count all documents and fix the counter"
            className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{ background: colors.control, border: `1px solid ${colors.borderInput}`, color: recount !== null ? colors.success : colors.textMuted }}
          >
            {recounting ? '⏳' : recount !== null ? `✓ ${recount.toLocaleString()}` : '🔄 Recount'}
          </button>
          <button
            onClick={copyAll}
            className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{ background: colors.control, border: `1px solid ${colors.borderInput}`, color: copied ? colors.success : colors.text }}
          >
            {copied ? '✓ ተቀድቷል' : '📋 ቅዳ'}
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-lg text-xs font-bold text-white"
            style={{ background: colors.brand }}
          >
            📥 CSV
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg text-xs font-bold text-gray-400"
            style={{ background: colors.control, border: `1px solid ${colors.borderInput}` }}
          >
            ውጣ
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: total ?? rows.length, label: 'ጠቅላላ ፊርማዎች', color: colors.text },
            { value: distinctCities, label: 'የተለያዩ ከተማዎች', color: colors.brand },
            { value: withCity, label: 'ከተማ ያለው', color: colors.info },
            { value: withComment, label: 'አስተያየት ያለው', color: colors.success },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: colors.surface, border: `1px solid ${colors.borderStrong}` }}
            >
              <p className="text-3xl sm:text-4xl font-black" style={{ color: s.color }}>
                {s.value.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Load error */}
        {loadError && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: colors.brandTint,
              border: `1px solid ${colors.brandEdge}`,
              color: colors.danger,
            }}
          >
            ⚠️ {loadError}
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ፈልግ — ስም፣ ኢሜይል፣ ከተማ፣ ወይም አስተያየት..."
          className="w-full rounded-xl px-4 py-3 text-white outline-none"
          style={{ background: colors.surface, border: `1px solid ${colors.borderMid}` }}
        />

        {/* Results label */}
        {search && (
          <p className="text-gray-500 text-sm">
            {filtered.length.toLocaleString()} ውጤት ተገኝቷል
          </p>
        )}

        {/* Signature list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.borderCard}` }}>
          {/* Column headers — hidden on mobile, shown on sm+ */}
          <div
            className="hidden sm:grid text-xs font-bold text-gray-600 uppercase tracking-wider px-5 py-3"
            style={{
              background: colors.surface2,
              gridTemplateColumns: '44px 1fr 150px 100px 1fr 155px',
              borderBottom: `1px solid ${colors.borderCard}`,
            }}
          >
            <span>#</span>
            <span>ሙሉ ስም</span>
            <span>ኢሜይል</span>
            <span>ከተማ</span>
            <span>አስተያየት</span>
            <span>ቀን / ሰዓት</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-600">በመጫን ላይ...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-600">
              {search ? 'ምንም ውጤት አልተገኘም' : 'ምንም ፊርማ የለም'}
            </div>
          ) : (
            filtered.map((s, i) => (
              <div
                key={s.id}
                style={{
                  background: i % 2 === 0 ? colors.rowAlt : colors.surface,
                  borderTop: i === 0 ? 'none' : `1px solid ${colors.border}`,
                }}
              >
                {/* Desktop row */}
                <div
                  className="hidden sm:grid items-start px-5 py-3 gap-3 text-sm"
                  style={{ gridTemplateColumns: '44px 1fr 150px 100px 1fr 155px' }}
                >
                  <span className="text-gray-700 text-xs pt-0.5 tabular-nums">{i + 1}</span>
                  <span className="text-white font-semibold break-words">{s.name}</span>
                  <span className="text-gray-400 font-mono text-xs break-all">
                    {s.email || <span className="text-gray-700">—</span>}
                  </span>
                  <span className="text-gray-400 text-xs break-words">
                    {s.city || <span className="text-gray-700">—</span>}
                  </span>
                  <span className="text-gray-400 text-xs leading-relaxed break-words">
                    {s.comment ? `"${s.comment}"` : <span className="text-gray-700">—</span>}
                  </span>
                  <span className="text-gray-600 text-xs">{formatDate(s.createdAt)}</span>
                </div>

                {/* Mobile card */}
                <div className="sm:hidden px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-700 text-xs mt-1 w-7 flex-shrink-0 tabular-nums">
                      {i + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">{s.name}</p>
                      {s.email && (
                        <p className="text-gray-400 font-mono text-xs mt-0.5">{s.email}</p>
                      )}
                      {s.city && (
                        <p className="text-gray-500 text-xs mt-0.5">📍 {s.city}</p>
                      )}
                      {s.comment && (
                        <p className="text-gray-400 text-xs mt-1 italic">"{s.comment}"</p>
                      )}
                      <p className="text-gray-700 text-xs mt-1">{formatDate(s.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="text-center pb-4 space-y-3">
            {hasMore && (
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                style={{ background: colors.control, border: `1px solid ${colors.borderInput}`, color: colors.text }}
              >
                {loadingMore
                  ? '⏳ በመጫን ላይ...'
                  : `ተጨማሪ ጫን (+${PAGE_SIZE.toLocaleString()})`}
              </button>
            )}
            <p className="text-gray-700 text-xs">
              {filtered.length.toLocaleString()} ፊርማዎች ይታያሉ
              {total !== null && rows.length < total && (
                <span> · ጠቅላላ {total.toLocaleString()} ነው</span>
              )}
            </p>
            {total !== null && rows.length < total && (
              <p className="text-gray-700 text-xs">
                ከተማ/አስተያየት ስታቲስቲኮች የሚሆኑት የታወቁትን {rows.length.toLocaleString()} ላይ ነው
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
