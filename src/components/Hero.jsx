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

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-12">

        {/* ── Large manager photo — full width, above the title ── */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ height: '420px' }}>
          <img
            src="/manager.jpg"
            alt="አቶ አቢዮት ብርሃኑ"
            className="w-full h-full object-cover object-top"
            style={{ objectPosition: 'center 15%' }}
          />

          {/* Dark gradient at bottom so text is readable */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }}
          />

          {/* Crest — top left */}
          <div className="absolute top-4 left-4">
            <img
              src="/crest.jpg"
              alt="ፋሲል ከነማ እግርኳስ ክለብ"
              className="w-16 h-16 rounded-full object-cover object-top"
              style={{ border: '2px solid #CC0000', boxShadow: '0 0 20px rgba(204,0,0,0.6)' }}
            />
          </div>

          {/* OUT badge — top right */}
          <div
            className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl"
            style={{ background: '#CC0000', boxShadow: '0 0 24px rgba(204,0,0,0.9)' }}
          >✕</div>

          {/* Name at bottom of photo */}
          <div className="absolute bottom-0 inset-x-0 px-6 pb-5">
            <p className="text-white font-black text-2xl sm:text-3xl">አቶ አቢዮት ብርሃኑ</p>
            <p className="text-red-400 text-sm font-semibold mt-1">ስራ አስኪያጅ — ፋሲል ከነማ እግርኳስ ክለብ</p>
          </div>
        </div>

        {/* ── Title + description + counter ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2" style={{ color: '#CC0000' }}>
              ፋሲል ከነማ እግርኳስ ክለብ · ባህር ዳር · ከ1968 ዓ.ም
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              አቶ አቢዮት ብርሃኑ
              <br />
              <span style={{ color: '#CC0000' }}>ከሃላፊነት ይነሱ!</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              የ56 ዓመት ታሪክና ክብር ያለው ፋሲል ከነማ እግርኳስ ክለብ፣ ካለበት የአመራር ብቃት ማነስ እና
              የውጤት ማሽቆልቆል ለመታደግ የደጋፊው አንድነት የሚያስፈልግበት ወሳኝ ሰዓት ላይ እንገኛለን።
              ይህ ፔቲሽን ለጎንደር ከተማ ክቡር ከንቲባ እና ለክለቡ የበላይ አመራሮች የሚቀርብ ነው።
            </p>
          </div>

          {/* Counter */}
          <div
            className="rounded-2xl px-8 py-5 text-center flex-shrink-0"
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
  )
}
