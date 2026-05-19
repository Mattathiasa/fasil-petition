const photos = [
  { src: '/fan1.jpg' },
  { src: '/fan2.jpg' },
  { src: '/fan3.jpg' },
  { src: '/fan4.jpg' },
  { src: '/fan5.jpg' },
  { src: '/fan6.jpg' },
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
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
