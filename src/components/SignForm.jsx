import { useEffect, useState } from 'react'
import {
  collection, doc, writeBatch, serverTimestamp, increment,
} from 'firebase/firestore'
import { db } from '../firebase'

export default function SignForm() {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)

  useEffect(() => {
    if (localStorage.getItem('fasil_petition_signed')) setDone(true)
  }, [])

  async function submit(e) {
    e.preventDefault()
    const trimName = name.trim()
    if (!trimName) { setError('ሙሉ ስምዎን ያስገቡ።'); return }

    setLoading(true)
    setError('')

    try {
      const batch = writeBatch(db)

      // 1 — save signature
      batch.set(doc(collection(db, 'signatures')), {
        name:      trimName,
        phone:     phone.trim()   || null,
        comment:   comment.trim() || null,
        createdAt: serverTimestamp(),
      })

      // 2 — atomic counter increment (creates doc if missing via merge)
      batch.set(
        doc(db, 'stats', 'count'),
        { total: increment(1) },
        { merge: true }
      )

      await batch.commit()                          // both save or both fail
      localStorage.setItem('fasil_petition_signed', '1')
      setDone(true)
    } catch (err) {
      console.error('[SignForm]', err.code, err.message)
      const msg = {
        'permission-denied':     'ፍቃድ ተከልክሏል። Firestore Rules ይፈትሹ።',
        'unavailable':           'ኢንተርኔት ችግር አለ። ድጋሚ ይሞክሩ።',
        'network-request-failed':'ኢንተርኔት ግንኙነት የለም። ድጋሚ ይሞክሩ።',
      }
      setError(msg[err.code] ?? `ችግር ተፈጥሯል (${err.code ?? 'unknown'})`)
    } finally {
      setLoading(false)
    }
  }

  function share() {
    if (navigator.share) {
      navigator.share({
        title: 'ፋሲል ከተማ እግርኳስ ክለብ — አቶ አቢዮት ብርሃኑን ያንሱ',
        text:  'ፋሲል ከተማ እግርኳስ ክለብን ለማዳን ፊርማዎን ይስጡ!',
        url:   window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('ሊንኩ ተቀድቷል!')
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
          <p className="text-gray-400 text-sm mt-1">ለፋሲል ከተማ እግርኳስ ክለብ ደጋፊነትዎን አሳይተዋል።</p>
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
        <p className="text-red-200 text-xs mt-0.5">ስምዎ ብቻ ያስፈልጋል — 30 ሰከንድ ይወስዳል</p>
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

        <Field label="ስልክ ቁጥር" hint="አማራጭ">
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9xx xxx xxx"
          />
        </Field>

        <Field label="ለምን ፈረምኩ?" hint="አማራጭ">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ለፋሲል ከተማ እግርኳስ ክለብ ያለዎን ፍቅር ያካፍሉ..."
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
          🔒 ስምዎ ለሕዝብ ይታያል
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
