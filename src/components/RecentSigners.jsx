import { useSigners } from '../hooks/useSigners'

function timeAgo(ts) {
  if (!ts) return ''
  const s = Math.floor((Date.now() - ts.toMillis()) / 1000)
  if (s < 60)  return 'አሁን'
  const m = Math.floor(s / 60)
  if (m < 60)  return `ከ${m} ደቂቃ`
  const h = Math.floor(m / 60)
  if (h < 24)  return `ከ${h} ሰዓት`
  return `ከ${Math.floor(h / 24)} ቀን`
}

function Avatar({ name }) {
  const ch  = [...(name ?? '?')]
  const hue = ch.reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div
      className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
      style={{ background: `hsl(${hue},55%,32%)`, border: '2px solid rgba(255,255,255,0.08)' }}
    >
      {(name ?? '?')[0].toUpperCase()}
    </div>
  )
}

export default function RecentSigners() {
  const { signers, status } = useSigners(30)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: '#181818', borderBottom: '1px solid #1e1e1e' }}
      >
        {status === 'live' ? (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#22c55e', animation: 'pulse 2s infinite' }} />
        ) : (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#555' }} />
        )}
        <p className="text-white font-bold">የቅርቡ ፊርማዎች</p>
        {status === 'live' && (
          <span
            className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}
          >
            ቀጥታ
          </span>
        )}
      </div>

      {/* List */}
      {status === 'connecting' && (
        <div className="py-12 text-center text-gray-600 text-sm animate-pulse">
          ፊርማዎችን በመጫን ላይ...
        </div>
      )}
      {status === 'error' && (
        <div className="py-12 text-center text-gray-600 text-sm">
          ⚠️ ፊርማዎችን ማሳየት አልተቻለም
        </div>
      )}
      {status === 'live' && signers.length === 0 && (
        <div className="py-12 text-center text-gray-600 text-sm">
          እስካሁን ምንም ፊርማ የለም — ፊርማ ሲሰጥ ይታያል
        </div>
      )}
      {status === 'live' && signers.length > 0 && (
        <ul>
          {signers.map((s, i) => (
            <li
              key={s.id}
              className="flex gap-3 items-start px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
              style={{ borderTop: i > 0 ? '1px solid #1a1a1a' : 'none' }}
            >
              <Avatar name={s.name} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm leading-tight">{s.name}</span>
                  {i === 0 && (
                    <span
                      className="text-xs px-1.5 py-px rounded font-semibold"
                      style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}
                    >
                      አዲስ
                    </span>
                  )}
                  <span className="text-gray-600 text-xs ml-auto">{timeAgo(s.createdAt)}</span>
                </div>
                {s.comment && (
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">"{s.comment}"</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
