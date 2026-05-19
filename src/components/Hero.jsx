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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8">

          {/* Crest */}
          <div className="flex-shrink-0">
            <img
              src="/crest.jpg"
              alt="ፋሲል ከነማ"
              className="w-28 h-28 lg:w-36 lg:h-36 rounded-full object-cover object-top"
              style={{ border: '3px solid #CC0000', boxShadow: '0 0 60px rgba(204,0,0,0.55)' }}
            />
          </div>

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#CC0000' }}>
              ፋሲል ከነማ FC · ባህር ዳር · ከ1968 ዓ.ም
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              አቶ አቢዮት ብርሃኑን
              <br />
              <span style={{ color: '#CC0000' }}>ከስራ ያንሱ!</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl lg:max-w-none mb-6">
              ለ56 ዓመት ታሪክ ያለው ፋሲል ከነማ ብቁ አመራር ይፈልጋል።
              ይህ ፔቲሽን ለጎንደር ከተማ ክቡር ከንቲባ ቀርቧል።
            </p>

            {/* Manager card */}
            <div
              className="inline-block rounded-2xl overflow-hidden text-left"
              style={{ border: '2px solid rgba(204,0,0,0.5)', maxWidth: '260px' }}
            >
              <div className="relative">
                <img
                  src="/manager.jpg"
                  alt="አቶ አቢዮት ብርሃኑ"
                  className="w-full object-cover object-top"
                  style={{ height: '300px' }}
                />
                {/* Red diagonal banner */}
                <div
                  className="absolute top-4 left-0 px-4 py-1 text-white text-xs font-black tracking-widest uppercase"
                  style={{ background: '#CC0000', letterSpacing: '0.15em' }}
                >
                  ሊወርዱ ይገባቸዋል
                </div>
                {/* Big X overlay */}
                <div
                  className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-black"
                  style={{ background: '#CC0000', boxShadow: '0 0 12px rgba(204,0,0,0.8)' }}
                >✕</div>
                {/* Gradient footer */}
                <div
                  className="absolute bottom-0 inset-x-0 px-4 py-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)' }}
                >
                  <p className="text-white font-black text-base">አቶ አቢዮት ብርሃኑ</p>
                  <p className="text-gray-400 text-xs">ስራ አስኪያጅ — ፋሲል ከነማ FC</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: counter pill (desktop only) */}
          <div className="hidden lg:flex flex-col items-center gap-1 flex-shrink-0">
            <div
              className="rounded-2xl px-6 py-4 text-center"
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
