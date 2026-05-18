import { useEffect, useState, useRef } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const GOAL = 10000
const MILESTONES = [500, 1000, 2500, 5000, 10000]

function useCountUp(target, duration = 1200) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const start = prev.current
    const diff = target - start
    if (diff === 0) return
    const startTime = performance.now()
    const frame = (now) => {
      const elapsed = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setDisplay(Math.round(start + diff * eased))
      if (elapsed < 1) requestAnimationFrame(frame)
      else prev.current = target
    }
    requestAnimationFrame(frame)
  }, [target, duration])

  return display
}

function nextMilestone(count) {
  return MILESTONES.find((m) => m > count) ?? GOAL
}

export default function SignatureCounter() {
  const [count, setCount] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const animated = useCountUp(count)

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'stats', 'count'), (snap) => {
      setCount(snap.exists() ? snap.data().total ?? 0 : 0)
      setLoaded(true)
    })
    return unsub
  }, [])

  const percent = Math.min((count / GOAL) * 100, 100)
  const next = nextMilestone(count)
  const remaining = next - count

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111', border: '1px solid #222' }}
    >
      {/* Top momentum bar */}
      <div
        className="px-6 py-3 flex items-center gap-2 text-sm font-semibold"
        style={{ background: '#CC0000' }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-white">
          {loaded
            ? `ቀጣዩ ዒላማ ${next.toLocaleString()} ፊርማ — ቀሪ ${remaining.toLocaleString()} ብቻ!`
            : 'ፊርማዎች በቀጥታ ይቆጠራሉ…'}
        </span>
      </div>

      <div className="p-6">
        {/* Big number */}
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-6xl sm:text-7xl font-black text-white tabular-nums leading-none">
              {animated.toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm mt-2">ደጋፊዎች ፈርመዋል</p>
          </div>
          <div className="text-right pb-1">
            <p className="font-black text-2xl" style={{ color: '#CC0000' }}>
              {GOAL.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs">ዒላማ</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative w-full rounded-full h-5 overflow-hidden mt-4 mb-2" style={{ background: '#222' }}>
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${Math.max(percent, 0.5)}%`,
              background: 'linear-gradient(90deg, #CC0000 0%, #ff3333 100%)',
            }}
          />
          {/* Milestone ticks */}
          {MILESTONES.slice(0, -1).map((m) => (
            <div
              key={m}
              className="absolute top-0 bottom-0 w-0.5"
              style={{
                left: `${(m / GOAL) * 100}%`,
                background: count >= m ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between text-xs text-gray-600 mb-4">
          <span>{percent.toFixed(1)}% ተሟልቷል</span>
          <span>ዒላማ: {GOAL.toLocaleString()}</span>
        </div>

        {/* Share nudge */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'ፋሲል ከነማ — አቶ አቢዮት ብርሃኑን ያንሱ',
                text: `${count.toLocaleString()} ደጋፊዎች ፈርመዋል! እርስዎም ይቀላቀሉ።`,
                url: window.location.href,
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
              alert('ሊንኩ ተቀድቷል!')
            }
          }}
          className="w-full rounded-xl py-3 text-sm font-bold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
          style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333' }}
        >
          📤 ለጓደኞችዎ ያጋሩ — ፊርማዎቹ ይጨምሩ!
        </button>
      </div>
    </div>
  )
}
