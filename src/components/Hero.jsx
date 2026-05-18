export default function Hero() {
  function scrollToForm() {
    document.getElementById('sign-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1c0000 0%, #0f0000 45%, #0d0d0d 100%)' }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(204,0,0,0.3) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 text-center">
        {/* Club badge */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <img
              src="/crest.jpg"
              alt="ፋሲል ከነማ"
              className="w-28 h-28 rounded-full object-cover object-top"
              style={{
                border: '3px solid #CC0000',
                boxShadow: '0 0 50px rgba(204,0,0,0.6), 0 0 100px rgba(204,0,0,0.2)',
              }}
            />
          </div>
        </div>

        <p
          className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
          style={{ color: '#CC0000' }}
        >
          ፋሲል ከነማ FC — ባህር ዳር · ከ1968 ዓ.ም ጀምሮ
        </p>

        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-2">
          አቶ አቢዮት ብርሃኑን
          <br />
          <span style={{ color: '#CC0000' }}>ከስራ ያንሱ!</span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          ለጎንደር ከተማ ክቡር ከንቲባ ለሚቀርበው ክፍት ደብዳቤ — ፊርማዎን ይስጡ።
        </p>

        {/* Manager card — "wanted out" style */}
        <div
          className="inline-flex items-center gap-4 rounded-2xl px-5 py-4 mb-8 text-left"
          style={{
            background: 'rgba(204,0,0,0.12)',
            border: '1px solid rgba(204,0,0,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="relative flex-shrink-0">
            <img
              src="/manager.jpg"
              alt="አቶ አቢዮት ብርሃኑ"
              className="w-14 h-14 rounded-full object-cover object-top"
              style={{ border: '2px solid rgba(204,0,0,0.8)' }}
            />
            <div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black"
              style={{ background: '#CC0000', boxShadow: '0 0 8px rgba(204,0,0,0.8)' }}
            >
              ✕
            </div>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">አቶ አቢዮት ብርሃኑ</p>
            <p className="text-gray-500 text-xs">ስራ አስኪያጅ — ፋሲል ከነማ FC</p>
            <p className="text-xs font-bold mt-1" style={{ color: '#ff5555' }}>
              ⚠️ ይህ ሰው ሊወርድ ይገባዋል
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={scrollToForm}
            className="px-10 py-4 rounded-full text-white font-black text-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background: '#CC0000',
              boxShadow: '0 4px 30px rgba(204,0,0,0.6)',
            }}
          >
            ✊ ፊርማ ስጥ
          </button>
          <button
            onClick={() => {
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
            }}
            className="px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            📤 ያጋሩ
          </button>
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-8 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { icon: '📅', value: '56', label: 'ዓመት ታሪክ' },
            { icon: '🏆', value: '5×', label: 'ሻምፒዮን' },
            { icon: '🏟️', value: 'ፕሪሚዬር', label: 'ሊግ' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-xl">{s.icon}</span>
              <span className="text-white font-black text-sm">{s.value}</span>
              <span className="text-gray-600 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
