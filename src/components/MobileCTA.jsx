import { useEffect, useState } from 'react'
import { useCount } from '../hooks/useCount'

export default function MobileCTA() {
  const { count } = useCount()
  const [hidden, setHidden] = useState(true)   // hidden when form is visible

  useEffect(() => {
    const el = document.getElementById('sign-form')
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Only on mobile (lg screens use sticky sidebar)
  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${hidden ? 'translate-y-full' : 'translate-y-0'}`}
      style={{ padding: '12px 16px 20px', background: 'linear-gradient(to top, #0a0a0a 70%, transparent)' }}
    >
      <button
        onClick={() => document.getElementById('sign-form')?.scrollIntoView({ behavior: 'smooth' })}
        className="w-full py-4 rounded-2xl text-white font-black text-lg"
        style={{ background: '#CC0000', boxShadow: '0 -4px 30px rgba(204,0,0,0.5)' }}
      >
        ✊ ፊርማ ስጥ
        {count !== null && count > 0 && (
          <span className="text-red-200 font-normal text-sm ml-2">
            · {count.toLocaleString()} ፈርመዋል
          </span>
        )}
      </button>
    </div>
  )
}
