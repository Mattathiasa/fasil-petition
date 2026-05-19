import { useEffect, useState } from 'react'
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getCountFromServer,
  doc,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

const ADMIN_PASSWORD = 'FasilKenema2024'

function formatDate(ts) {
  if (!ts) return '—'
  return ts.toDate().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)
  const [recounting, setRecounting] = useState(false)
  const [recount, setRecount] = useState(null)

  useEffect(() => {
    if (sessionStorage.getItem('fasil_admin') === '1') setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    const q = query(collection(db, 'signatures'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      setSignatures(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [authed])

  function login() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('fasil_admin', '1')
      setAuthed(true)
    } else {
      setPwError('የተሳሳተ የይለፍ ቃል')
    }
  }

  function logout() {
    sessionStorage.removeItem('fasil_admin')
    setAuthed(false)
    setPw('')
  }

  function exportCSV() {
    const header = ['#', 'ሙሉ ስም', 'ስልክ ቁጥር', 'አስተያየት', 'ቀን/ሰዓት']
    const rows = signatures.map((s, i) => [
      i + 1,
      s.name ?? '',
      s.phone ?? '',
      s.comment ?? '',
      s.createdAt ? s.createdAt.toDate().toISOString() : '',
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fasil-petition-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
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
      alert('Recount failed: ' + err.message)
    } finally {
      setRecounting(false)
    }
  }

  function copyAll() {
    const text = filtered
      .map((s, i) => `${i + 1}. ${s.name}${s.phone ? ' | ' + s.phone : ''}${s.comment ? '\n   "' + s.comment + '"' : ''}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filtered = signatures.filter((s) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      s.name?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.comment?.toLowerCase().includes(q)
    )
  })

  const withPhone = signatures.filter((s) => s.phone).length
  const withComment = signatures.filter((s) => s.comment).length

  // ── Login screen ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#0d0d0d', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}
      >
        <div className="w-full max-w-xs">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h1 className="text-white font-black text-2xl">Admin</h1>
            <p className="text-gray-500 text-sm mt-1">ፋሲል ከተማ እግርኳስ ክለብ Petition</p>
          </div>
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{ background: '#111', border: '1px solid #222' }}
          >
            <input
              type="password"
              value={pw}
              autoFocus
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="የይለፍ ቃል"
              className="w-full rounded-xl px-4 py-3 text-white outline-none"
              style={{ background: '#1a1a1a', border: '1px solid #333' }}
            />
            {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
            <button
              onClick={login}
              className="w-full py-3 rounded-xl text-white font-bold text-base"
              style={{ background: '#CC0000' }}
            >
              ግባ
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Admin dashboard ───────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: '#0d0d0d', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}
    >
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3 flex-wrap"
        style={{ background: '#111', borderBottom: '1px solid #222' }}
      >
        <div>
          <h1 className="font-black text-base text-white leading-tight">
            ፋሲል ፔቲሽን — ፊርማዎች
          </h1>
          <p className="text-gray-500 text-xs">
            {loading ? 'በመጫን ላይ...' : `${signatures.length.toLocaleString()} ጠቅላላ`}
          </p>
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <button
            onClick={verifyCount}
            disabled={recounting}
            title="Count all documents and fix the counter"
            className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{ background: '#1a1a1a', border: '1px solid #333', color: recount !== null ? '#4ade80' : '#aaa' }}
          >
            {recounting ? '⏳' : recount !== null ? `✓ ${recount.toLocaleString()}` : '🔄 Recount'}
          </button>
          <button
            onClick={copyAll}
            className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{ background: '#1a1a1a', border: '1px solid #333', color: copied ? '#4ade80' : '#fff' }}
          >
            {copied ? '✓ ተቀድቷል' : '📋 ቅዳ'}
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-lg text-xs font-bold text-white"
            style={{ background: '#CC0000' }}
          >
            📥 CSV
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg text-xs font-bold text-gray-400"
            style={{ background: '#1a1a1a', border: '1px solid #333' }}
          >
            ውጣ
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: signatures.length, label: 'ጠቅላላ ፊርማዎች', color: '#fff' },
            { value: withPhone, label: 'ስልክ ያለው', color: '#CC0000' },
            { value: withComment, label: 'አስተያየት ያለው', color: '#4ade80' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: '#111', border: '1px solid #222' }}
            >
              <p className="text-3xl sm:text-4xl font-black" style={{ color: s.color }}>
                {s.value.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ፈልግ — ስም፣ ስልክ፣ ወይም አስተያየት..."
          className="w-full rounded-xl px-4 py-3 text-white outline-none"
          style={{ background: '#111', border: '1px solid #2a2a2a' }}
        />

        {/* Results label */}
        {search && (
          <p className="text-gray-500 text-sm">
            {filtered.length.toLocaleString()} ውጤት ተገኝቷል
          </p>
        )}

        {/* Signature list */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #1e1e1e' }}>
          {/* Column headers — hidden on mobile, shown on sm+ */}
          <div
            className="hidden sm:grid text-xs font-bold text-gray-600 uppercase tracking-wider px-5 py-3"
            style={{
              background: '#181818',
              gridTemplateColumns: '44px 1fr 150px 1fr 155px',
              borderBottom: '1px solid #1e1e1e',
            }}
          >
            <span>#</span>
            <span>ሙሉ ስም</span>
            <span>ስልክ</span>
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
                  background: i % 2 === 0 ? '#0f0f0f' : '#111',
                  borderTop: i === 0 ? 'none' : '1px solid #1a1a1a',
                }}
              >
                {/* Desktop row */}
                <div
                  className="hidden sm:grid items-start px-5 py-3 gap-3 text-sm"
                  style={{ gridTemplateColumns: '44px 1fr 150px 1fr 155px' }}
                >
                  <span className="text-gray-700 text-xs pt-0.5 tabular-nums">{i + 1}</span>
                  <span className="text-white font-semibold break-words">{s.name}</span>
                  <span className="text-gray-400 font-mono text-xs break-all">
                    {s.phone || <span className="text-gray-700">—</span>}
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
                      {s.phone && (
                        <p className="text-gray-400 font-mono text-xs mt-0.5">{s.phone}</p>
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
          <p className="text-center text-gray-700 text-xs pb-4">
            {filtered.length.toLocaleString()} ፊርማዎች ይታያሉ
          </p>
        )}
      </div>
    </div>
  )
}
