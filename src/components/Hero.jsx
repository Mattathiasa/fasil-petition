import { useCount } from '../hooks/useCount'

export default function Hero() {
  const { count } = useCount()

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(170deg,#1c0000 0%,#0f0000 50%,#0a0a0a 100%)' }}
    >
      {/* Red glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%,rgba(204,0,0,0.28) 0%,transparent 65%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-10">

          {/* ── LEFT: crest + petition text ── */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">

            {/* Crest */}
            <div className="flex justify-center lg:justify-start mb-6">
              <img
                src="/crest.jpg"
                alt="ፋሲል ከነማ"
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover object-top"
                style={{ border: '3px solid #CC0000', boxShadow: '0 0 60px rgba(204,0,0,0.55)' }}
              />
            </div>

            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#CC0000' }}>
              ፋሲል ከነማ FC · ባህር ዳር · ከ1968 ዓ.ም
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              አቶ አቢዮት ብርሃኑን
              <br />
              <span style={{ color: '#CC0000' }}>ከስራ ያንሱ!</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
              ለ56 ዓመት ታሪክ ያለው ፋሲል ከነማ ብቁ አመራር ይፈልጋል።
              ይህ ፔቲሽን ለጎንደር ከተማ ክቡር ከንቲባ ቀርቧል።
            </p>

            {/* Counter — mobile only */}
            <div
              className="lg:hidden inline-flex flex-col items-center rounded-2xl px-6 py-3 mx-auto"
              style={{ background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.35)' }}
            >
              <p className="text-4xl font-black text-white tabular-nums">
                {count === null ? '—' : count.toLocaleString()}
              </p>
              <p className="text-red-300 text-xs mt-1 font-semibold">ፊርማዎች ተሰብስበዋል</p>
            </div>
          </div>

          {/* ── RIGHT: large manager photo + counter ── */}
          <div className="flex flex-col items-center gap-4 lg:flex-shrink-0">

            {/* Photo */}
            <div className="relative" style={{ width: '300px' }}>
              <img
                src="/manager.jpg"
                alt="አቶ አቢዮት ብርሃኑ"
                className="w-full rounded-2xl object-cover object-top"
                style={{
                  height: '380px',
                  border: '2px solid rgba(204,0,0,0.6)',
                  boxShadow: '0 0 40px rgba(204,0,0,0.25)',
                }}
              />

              {/* OUT badge */}
              <div
                className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl"
                style={{ background: '#CC0000', boxShadow: '0 0 20px rgba(204,0,0,0.9)' }}
              >✕</div>

              {/* Name overlay at bottom */}
              <div
                className="absolute bottom-0 inset-x-0 rounded-b-2xl px-4 py-4"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)' }}
              >
                <p className="text-white font-black text-lg">አቶ አቢዮት ብርሃኑ</p>
                <p className="text-red-400 text-sm font-semibold">ስራ አስኪያጅ — ፋሲል ከነማ FC</p>
              </div>
            </div>

            {/* Counter — desktop only */}
            <div
              className="hidden lg:flex flex-col items-center rounded-2xl px-6 py-4 w-full text-center"
              style={{ background: 'rgba(204,0,0,0.15)', border: '1px solid rgba(204,0,0,0.35)' }}
            >
              <p className="text-5xl font-black text-white tabular-nums">
                {count === null ? '—' : count.toLocaleString()}
              </p>
              <p className="text-red-300 text-xs mt-1 font-semibold">ፊርማዎች ተሰብስበዋል</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
