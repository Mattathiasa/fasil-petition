import { useEffect, useState } from 'react'
import {
  collection, doc, runTransaction, serverTimestamp, increment,
} from 'firebase/firestore'
import { db } from '../firebase'
import { isValidEmail, normalizeEmail, signatureStorageKey } from '../lib/validation'
import { useToast } from '../context/ToastContext'

export default function SignForm() {
  const { toast } = useToast()
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [city, setCity]       = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  useEffect(() => {
    // legacy single-key check (keeps already-signed users in done state)
    if (localStorage.getItem('fasil_petition_signed')) setDone(true)
  }, [])

  async function submit(e) {
    e.preventDefault()
    const trimName  = name.trim()
    const trimEmail = normalizeEmail(email)
    if (!trimName)  { setError('ሙሉ ስምዎን ያስገቡ።'); return }
    if (!trimEmail) { setError('ኢሜይልዎን ያስገቡ።'); return }
    if (!isValidEmail(trimEmail)) {
      setError('ትክክለኛ ኢሜይል ያስገቡ።'); return
    }
    if (trimName.length > 100)          { setError('ሙሉ ስምዎ በጣም ረጅም ነው።'); return }
    if (city.trim().length > 60)        { setError('የከተማ ስም በጣም ረጅም ነው።'); return }
    if (comment.trim().length > 500)    { setError('አስተያየትዎ ከ500 ቁጥር በላይ ነው።'); return }

    // cross-device duplicate check via localStorage cache
    if (localStorage.getItem(signatureStorageKey(trimEmail))) {
      setDone(true); return
    }

    setLoading(true)
    setError('')

    try {
      // One transaction: check the email lock, then write both signature
      // docs, the lock, and the counter — atomic, so two devices racing on
      // the same email cannot double-count.
      await runTransaction(db, async (tx) => {
        const emailRef = doc(db, 'signed_emails', trimEmail)
        const existing = await tx.get(emailRef)
        if (existing.exists()) return 'duplicate'

        // 1 — public feed doc: first initial + city + comment only
        const publicRef = doc(collection(db, 'signatures'))
        tx.set(publicRef, {
          nameInitial: trimName.charAt(0),
          city:        city.trim() || null,
          comment:     comment.trim() || null,
          createdAt:   serverTimestamp(),
        })

        // 2 — identity doc (same id): full name + email, admin read only
        tx.set(doc(db, 'signatures_private', publicRef.id), {
          name:      trimName,
          email:     trimEmail,
          city:      city.trim() || null,
          comment:   comment.trim() || null,
          createdAt: serverTimestamp(),
        })

        // 3 — email lock (write-once, prevents duplicate across devices)
        tx.set(emailRef, { createdAt: serverTimestamp() })

        // 4 — atomic counter increment (rules allow exactly +1)
        tx.set(doc(db, 'stats', 'count'), { total: increment(1) }, { merge: true })

        return 'signed'
      })

      localStorage.setItem(signatureStorageKey(trimEmail), '1')
      localStorage.setItem('fasil_petition_signed', '1')
      setDone(true)
    } catch (err) {
      console.error('[SignForm]', err.code, err.message)
      const msg = {
        'permission-denied':      'ፍቃድ ተከልክሏል። Firestore Rules ይፈትሹ።',
        'unavailable':            'ኢንተርኔት ችግር አለ። ድጋሚ ይሞክሩ።',
        'network-request-failed': 'ኢንተርኔት ግንኙነት የለም። ድጋሚ ይሞክሩ።',
        'aborted':                'ብዙ ፊርማ በአንድ ሰዓት መጣ — ድጋሚ ይሞክሩ።',
        'failed-precondition':    'ብዙ ፊርማ በአንድ ሰዓት መጣ — ድጋሚ ይሞክሩ።',
      }
      setError(msg[err.code] ?? `ችግር ተፈጥሯል (${err.code ?? 'unknown'})`)
    } finally {
      setLoading(false)
    }
  }

  function share() {
    if (navigator.share) {
      navigator.share({
        title: 'ፋሲል ከነማ እግርኳስ ክለብ — አቶ አቢዮት ብርሃኑ ከሃላፊነት ይነሱ',
        text:  'ፋሲል ከነማ እግርኳስ ክለብን ለማዳን ፊርማዎን ይስጡ!',
        url:   window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast('ሊንኩ ተቀድቷል!', 'success')
    }
  }

  // ── Signed state ───────────────────────────────────────────────
  if (done) {
    return (
      <div
        id="sign-form"
        className="rounded-2xl p-6 text-center space-y-4"
        style={{ background: '#0c1f0c', border: '1px solid #1a4a1a' }}
      >
        <p className="text-5xl">🎉</p>
        <div>
          <p className="text-white font-black text-xl">ፊርማዎ ተመዝግቧል!</p>
          <p className="text-gray-400 text-sm mt-1">ለፋሲል ከነማ እግርኳስ ክለብ ደጋፊነትዎን አሳይተዋል።</p>
        </div>
        <button
          onClick={share}
          className="w-full py-3 rounded-xl text-white font-bold transition-opacity hover:opacity-90"
          style={{ background: '#CC0000' }}
        >
          📤 ለጓደኞችዎ ያጋሩ
        </button>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────
  return (
    <div
      id="sign-form"
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111', border: '1px solid #1e1e1e' }}
    >
      <div className="px-5 py-4" style={{ background: '#CC0000' }}>
        <p className="text-white font-black text-lg">✍️ ፊርማዎን ይስጡ</p>
        <p className="text-red-200 text-xs mt-0.5">ስም እና ኢሜይል ያስፈልጋል — 30 ሰከንድ ይወስዳል</p>
      </div>

      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="ሙሉ ስም" required>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ለምሳሌ፦ አበበ ከበደ"
            autoComplete="name"
          />
        </Field>

        <Field label="ኢሜይል" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abebe@example.com"
            autoComplete="email"
          />
        </Field>

        <Field label="ከየት ከተማ ነዎት?" hint="አማራጭ">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="ለምሳሌ፦ ጎንደር"
          />
        </Field>

        <Field label="ለምን ፈረምኩ?" hint="አማራጭ">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ለፋሲል ከነማ እግርኳስ ክለብ ያለዎን ፍቅር ያካፍሉ..."
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none resize-none transition-colors"
            style={{ background: '#181818', border: '1.5px solid #2a2a2a' }}
            onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
            onBlur={(e)  => (e.target.style.borderColor = '#2a2a2a')}
          />
        </Field>

        {error && (
          <p
            className="text-sm rounded-xl px-4 py-3"
            style={{ background: 'rgba(204,0,0,0.12)', border: '1px solid rgba(204,0,0,0.35)', color: '#ff7070' }}
          >
            ⚠️ {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: '#CC0000',
            boxShadow: loading ? 'none' : '0 4px 24px rgba(204,0,0,0.45)',
          }}
        >
          {loading ? '⏳ በማስቀመጥ ላይ...' : '✊ ፊርማ ስጥ'}
        </button>

        <p className="text-gray-700 text-xs text-center">
          🔒 ስምዎ ለሕዝብ አይታይም — ፊርማዎ ይጠበቃል
        </p>
      </form>
    </div>
  )
}

function Field({ label, hint, required, children }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">
        {label}
        {required && <span style={{ color: '#CC0000' }}>*</span>}
        {hint && <span className="text-gray-600 normal-case font-normal tracking-normal">({hint})</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors"
      style={{ background: '#181818', border: '1.5px solid #2a2a2a' }}
      onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
      onBlur={(e)  => (e.target.style.borderColor = '#2a2a2a')}
    />
  )
}
