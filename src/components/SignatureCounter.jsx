import { useEffect, useRef, useState } from 'react'
import { useCount } from '../hooks/useCount'

const GOAL = 10000
const MILESTONES = [500, 1000, 2500, 5000, 10000]

function useCountUp(target, duration = 1000) {
  const [display, setDisplay] = useState(0)
  const from = useRef(0)
  const raf = useRef(null)

  useEffect(() => {
    if (target === null) return
    const start = from.current
    const diff = target - start
    if (diff === 0) return
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(start + diff * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else from.current = target
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return display
}

function nextMilestone(n) {
  return MILESTONES.find((m) => m > n) ?? GOAL
}

export default function SignatureCounter() {
  const { count, status } = useCount()
  const display = useCountUp(count)

  const safeCount = count ?? 0
  const pct = Math.min((safeCount / GOAL) * 100, 100)
  const next = nextMilestone(safeCount)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
      {/* Status bar */}
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: '#CC0000' }}>
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: status === 'live' ? '#fff' : status === 'error' ? '#ff0' : '#fffa',
            animation: status === 'live' ? 'pulse 2s infinite' : 'none',
          }}
        />
        <span className="text-white text-xs font-semibold">
          {status === 'connecting' && 'Firebase ጋር በማገናኘት ላይ...'}
          {status === 'error'      && '⚠️ ግንኙነት ስህተት — ድጋሚ ይጫኑ'}
          {status === 'live' && count !== null &&
            `ቀጣዩ ዒላማ ${next.toLocaleString()} ፊርማ — ቀሪ ${(next - safeCount).toLocaleString()} ብቻ!`}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Big number */}
        <div className="flex items-end justify-between">
          <div>
            {count === null ? (
              <div className="h-16 w-32 rounded-lg animate-pulse" style={{ background: '#1e1e1e' }} />
            ) : (
              <p className="text-6xl font-black text-white tabular-nums leading-none">
                {display.toLocaleString()}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-2">ደጋፊዎች ፈርመዋል</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black" style={{ color: '#CC0000' }}>{GOAL.toLocaleString()}</p>
            <p className="text-gray-600 text-xs">ዒላማ</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="relative h-4 rounded-full overflow-hidden" style={{ background: '#222' }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.max(pct, count !== null ? 0.5 : 0)}%`,
                background: 'linear-gradient(90deg, #CC0000, #ff4444)',
              }}
            />
            {MILESTONES.slice(0, -1).map((m) => (
              <div
                key={m}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${(m / GOAL) * 100}%`,
                  background: safeCount >= m ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-gray-600">
            <span>{pct.toFixed(1)}%</span>
            <span>ዒላማ {GOAL.toLocaleString()}</span>
          </div>
        </div>

        {/* Share */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'ፋሲል ከነማ — አቶ አቢዮት ብርሃኑን ያንሱ',
                text: `${safeCount.toLocaleString()} ደጋፊዎች ፈርመዋል! እርስዎም ይቀላቀሉ።`,
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('ሊንኩ ተቀድቷል!')
            }
          }}
          className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
          style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid #2a2a2a' }}
        >
          📤 ለጓደኞችዎ ያጋሩ
        </button>
      </div>
    </div>
  )
}
