const photos = [
  {
    src: '/fan1.jpg',
    caption: '"አቶ አብዮት ብርሃኑ እባክዎትን ክለቡን በክብር ይልቀቁልን"',
  },
  {
    src: '/fan2.jpg',
    caption: '"ፋሲል ከነማ ሃይወታችን ነዉ"',
  },
  {
    src: '/fan3.jpg',
    caption: '"እባካችሁ ስታዲዮማችንን አድሱልን!!"',
  },
  {
    src: '/fan4.jpg',
    caption: '"ክለባችን የማሰሪ አሰራርቻን እንዲ የምበቃ ሃድ አያስፈልገዉም — ለማሰሪ ልቀቅልን"',
  },
  {
    src: '/fan5.jpg',
    caption: '"ስራአስኪያጅነት ቅጥር እንጂ ርስት አይደለም"',
  },
  {
    src: '/fan6.jpg',
    caption: '"አብዮት OUT" — ደጋፊዎች ድምፃቸውን አሰሙ',
  },
]

export default function FanGallery() {
  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: '#111111' }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
      >
        <span className="text-2xl">📸</span>
        <h2 className="text-white font-bold text-lg">የደጋፊዎች ድምፅ</h2>
        <span className="text-gray-500 text-sm ml-auto">ከስታዲዩም</span>
      </div>

      {/* Horizontal scroll on mobile, 2-col grid on sm+ */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src={p.src}
                alt={p.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Gradient overlay with caption */}
              <div
                className="absolute inset-0 flex items-end p-3"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
                }}
              >
                <p className="text-white text-xs leading-snug font-medium">{p.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
