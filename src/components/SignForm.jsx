import { useState, useEffect } from 'react'
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../firebase'

export default function SignForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSigned, setHasSigned] = useState(false)

  useEffect(() => {
    setHasSigned(!!localStorage.getItem('fasil_petition_signed'))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('ሙሉ ስምዎን ያስገቡ።')
      return
    }

    setLoading(true)
    setError('')

    try {
      const batch = writeBatch(db)

      // 1. Save the signature document
      const sigRef = doc(collection(db, 'signatures'))
      batch.set(sigRef, {
        name: trimmedName,
        phone: phone.trim() || null,
        comment: comment.trim() || null,
        createdAt: serverTimestamp(),
      })

      // 2. Atomically increment the shared counter
      batch.set(
        doc(db, 'stats', 'count'),
        { total: increment(1) },
        { merge: true }
      )

      // Both writes succeed together or both fail — no partial saves
      await batch.commit()

      // Only mark as signed AFTER confirmed save
      localStorage.setItem('fasil_petition_signed', '1')
      setHasSigned(true)
    } catch (err) {
      console.error('[Petition] Save failed:', err.code, err.message)

      // Show user-friendly Amharic errors
      if (err.code === 'permission-denied') {
        setError('ፊርማ ለማስቀመጥ ፍቃድ የለም። Firestore Rules ይፈትሹ።')
      } else if (err.code === 'unavailable' || err.code === 'network-request-failed') {
        setError('ኢንተርኔት ግንኙነት ችግር አለ። ድጋሚ ይሞክሩ።')
      } else {
        setError('ችግር ተፈጥሯል። ድጋሚ ይሞክሩ። (' + (err.code ?? 'unknown') + ')')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'ፋሲል ከነማ — አቶ አቢዮት ብርሃኑን ያንሱ',
        text: 'ፋሲል ከነማን ለማዳን ፊርማዎን ይስጡ!',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('ሊንኩ ተቀድቷል!')
    }
  }

  if (hasSigned) {
    return (
      <div
        id="sign-form"
        className="rounded-2xl p-8 text-center"
        style={{ background: '#0a1f0a', border: '1px solid #1a4d1a' }}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-white font-black text-2xl mb-2">ፊርማዎ ተመዝግቧል!</h3>
        <p className="text-gray-400 mb-2 leading-relaxed">
          ለፋሲል ከነማ ደጋፊነትዎን አሳይተዋል።
        </p>
        <p className="text-gray-500 text-sm mb-6">
          ለጓደኞችዎ ያጋሩ — ፊርማ ሲጨምር ኃይላችን ይጠናከራል!
        </p>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-base transition-all hover:scale-105 active:scale-95"
          style={{ background: '#CC0000', boxShadow: '0 4px 20px rgba(204,0,0,0.4)' }}
        >
          📤 ለሌሎች ያጋሩ
        </button>
      </div>
    )
  }

  return (
    <div
      id="sign-form"
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111', border: '1px solid #222' }}
    >
      <div className="px-6 py-5" style={{ background: '#CC0000' }}>
        <h2 className="text-white font-black text-xl">✍️ ፊርማዎን ይስጡ</h2>
        <p className="text-red-200 text-xs mt-1">ስምዎ ብቻ ያስፈልጋል — 30 ሰከንድ ይወስዳል</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            ሙሉ ስም <span style={{ color: '#CC0000' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ለምሳሌ፦ አበበ ከበደ"
            className="w-full rounded-xl px-4 py-3 text-white text-base placeholder-gray-600 outline-none"
            style={{ background: '#1a1a1a', border: '1.5px solid #2a2a2a' }}
            onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
          />
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            ስልክ ቁጥር{' '}
            <span className="text-gray-600 normal-case font-normal">(አማራጭ)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9xx xxx xxx"
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none"
            style={{ background: '#1a1a1a', border: '1.5px solid #2a2a2a' }}
            onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
          />
        </div>

        <div>
          <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            ለምን ፈረምኩ?{' '}
            <span className="text-gray-600 normal-case font-normal">(አማራጭ)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ለፋሲል ከነማ ያለዎን ፍቅር ያካፍሉ..."
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none resize-none"
            style={{ background: '#1a1a1a', border: '1.5px solid #2a2a2a' }}
            onFocus={(e) => (e.target.style.borderColor = '#CC0000')}
            onBlur={(e) => (e.target.style.borderColor = '#2a2a2a')}
          />
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{
              background: 'rgba(204,0,0,0.1)',
              border: '1px solid rgba(204,0,0,0.4)',
              color: '#ff6666',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl text-white font-black text-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: '#CC0000',
            boxShadow: loading ? 'none' : '0 4px 25px rgba(204,0,0,0.5)',
          }}
        >
          {loading ? '⏳ በማስቀመጥ ላይ...' : '✊ ፊርማ ስጥ'}
        </button>

        <p className="text-gray-700 text-xs text-center">
          🔒 ፊርማዎ ለሕዝብ ይታያል · ስምዎ ይታያል
        </p>
      </form>
    </div>
  )
}
