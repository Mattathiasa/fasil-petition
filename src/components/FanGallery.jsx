import { useState } from 'react'
import { colors } from '../lib/theme'

const photos = [
  { src: '/fan1.jpg', alt: 'የደጋፊ ቅጽበት 1' },
  { src: '/fan2.jpg', alt: 'የደጋፊ ቅጽበት 2' },
  { src: '/fan3.jpg', alt: 'የደጋፊ ቅጽበት 3' },
  { src: '/fan4.jpg', alt: 'የደጋፊ ቅጽበት 4' },
  { src: '/fan5.jpg', alt: 'የደጋፊ ቅጽበት 5' },
  { src: '/fan6.jpg', alt: 'የደጋፊ ቅጽበት 6' },
]

function FanPhoto({ src, alt }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2"
        style={{ background: colors.control, border: `1px dashed ${colors.borderInput}` }}
      >
        <span className="text-3xl opacity-40">📸</span>
        <span className="text-gray-600 text-xs font-semibold">ደጋፊ</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setError(true)}
    />
  )
}

export default function FanGallery() {
  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: colors.surface }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: colors.control, borderBottom: `1px solid ${colors.borderMid}` }}
      >
        <span className="text-2xl">📸</span>
        <h2 className="text-white font-bold text-lg">የደጋፊዎች ድምፅ</h2>
        <span className="text-gray-500 text-sm ml-auto">ከስታዲዩም</span>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {photos.map((p, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <FanPhoto src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
