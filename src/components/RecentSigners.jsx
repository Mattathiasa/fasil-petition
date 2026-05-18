import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

function timeAgo(timestamp) {
  if (!timestamp) return ''
  const seconds = Math.floor((Date.now() - timestamp.toMillis()) / 1000)
  if (seconds < 10) return 'አሁን ደርሷል'
  if (seconds < 60) return `ከ${seconds} ሰከንድ በፊት`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `ከ${minutes} ደቂቃ በፊት`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `ከ${hours} ሰዓት በፊት`
  const days = Math.floor(hours / 24)
  return `ከ${days} ቀን በፊት`
}

function Avatar({ name }) {
  const letter = name?.[0]?.toUpperCase() || '?'
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
      style={{ background: `hsl(${hue}, 60%, 35%)`, border: '2px solid rgba(255,255,255,0.1)' }}
    >
      {letter}
    </div>
  )
}

export default function RecentSigners() {
  const [signers, setSigners] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, 'signatures'),
      orderBy('createdAt', 'desc'),
      limit(25)
    )
    const unsub = onSnapshot(q, (snap) => {
      setSigners(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [])

  if (signers.length === 0) return null

  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: '#111111' }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
      >
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
        <h2 className="text-white font-bold text-lg">የቅርቡ ፊርማዎች</h2>
        <span
          className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(204,0,0,0.2)', color: '#ff6666' }}
        >
          ቀጥታ
        </span>
      </div>

      <div>
        {signers.map((s, i) => (
          <div
            key={s.id}
            className="px-5 py-4 flex gap-3 items-start transition-colors hover:bg-white/[0.02]"
            style={{ borderBottom: i < signers.length - 1 ? '1px solid #1e1e1e' : 'none' }}
          >
            <Avatar name={s.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold text-sm">{s.name}</span>
                {i === 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}
                  >
                    አዲስ
                  </span>
                )}
                <span className="text-gray-600 text-xs">{timeAgo(s.createdAt)}</span>
              </div>
              {s.comment && (
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  "{s.comment}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
