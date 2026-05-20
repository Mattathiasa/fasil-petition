import { useEffect, useRef, useState } from 'react'
import { useCount } from '../hooks/useCount'

const GOAL = 20000
const MILESTONES = [1000, 2500, 5000, 10000, 15000, 20000]

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
        <div>
          {count === null ? (
            <div className="h-16 w-48 rounded-lg animate-pulse" style={{ background: '#1e1e1e' }} />
          ) : (
            <p className="text-6xl font-black text-white tabular-nums leading-none">
              {display.toLocaleString()}
            </p>
          )}
          <p className="text-gray-400 text-sm mt-2">
            ከ <span className="font-bold" style={{ color: '#CC0000' }}>{GOAL.toLocaleString()}</span> ድምፅ ውስጥ{' '}
            <span className="text-white font-bold">{safeCount.toLocaleString()} ፈርመዋል</span>
          </p>
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

        {/* Petition outcome note */}
        <div
          className="rounded-xl px-4 py-3 text-xs leading-relaxed"
          style={{ background: 'rgba(204,0,0,0.08)', border: '1px solid rgba(204,0,0,0.2)', color: '#ccc' }}
        >
          📋 <strong className="text-white">20,000 ፊርማ ሲሞላ</strong> ይህ አቤቱታ በቀጥታ ለጎንደር
          ከተማ አስተዳደር እና ለክለቡ ቦርድ በይፋ ይሰጣል።
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              const url  = encodeURIComponent(window.location.href)
              const text = encodeURIComponent(`${safeCount.toLocaleString()} ደጋፊዎች ፈርመዋል! አቶ አቢዮት ብርሃኑ ከሃላፊነት ይነሱ — ፔቲሽኑን ይፈርሙ፣ ለሌሎችም ያጋሩ!`)
              window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80"
            style={{ background: '#0088cc22', color: '#4fc3f7', border: '1px solid #0088cc44' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.4 13.93l-2.95-.924c-.64-.203-.658-.64.135-.953l11.566-4.46c.537-.194 1.006.131.743.628z"/></svg>
            Telegram
          </button>
          <button
            onClick={async () => {
              const shareData = {
                title: 'ፋሲል ከነማ እግርኳስ ክለብ — ፔቲሽን',
                text: `${safeCount.toLocaleString()} ደጋፊዎች ፈርመዋል! 👊🔴 አቶ አቢዮት ብርሃኑ ከሃላፊነት ይነሱ — ፋሲል ከነማ ደጋፊ ሁሉ ይፈርሙ፣ ያጋሩ!\n`,
                url: window.location.href,
              }
              if (navigator.share && navigator.canShare?.(shareData)) {
                await navigator.share(shareData)
              } else {
                const caption = `${shareData.text}${window.location.href}`
                await navigator.clipboard.writeText(caption)
                alert('ሊንኩ እና caption ተቀድቷል — TikTok ላይ paste አድርጉ!')
              }
            }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80"
            style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid #2a2a2a' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/></svg>
            TikTok
          </button>
        </div>
      </div>
    </div>
  )
}
