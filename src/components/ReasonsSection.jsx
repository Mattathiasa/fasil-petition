const qualities = [
  {
    num: '፩',
    title: 'ረጅም ልምድ',
    desc: 'ቢያንስ 5 ዓመት የፕሮፌሽናል ኮቺንግ ልምድ — በኢትዮጵያ ፕሪሚዬር ሊግ ወይም ከፍተኛ የውጭ ሊግ',
  },
  {
    num: '፪',
    title: 'ተጨባጭ ዕቅድ',
    desc: 'ፋሲል ከነማን ወደ ሊጉ ቁንጮ ሊወስድ የሚችል ግልፅ እና ሊለካ የሚችል ዕቅድ',
  },
  {
    num: '፫',
    title: 'ወጣቶችን ማሳደግ',
    desc: 'የክለቡ ወጣቶችን ለፕሮፌሽናል ደረጃ ማሳደግ — ለሃገር ቡድን ዝግጁ ማድረግ',
  },
  {
    num: '፬',
    title: 'ዲሲፕሊን',
    desc: 'ቡድኑን ዲሲፕሊን ባለው ሁኔታ ማስተዳደር — ጤናማ ድርጅታዊ ሥርዓት',
  },
  {
    num: '፭',
    title: 'ታክቲካዊ ፈጠራ',
    desc: 'ፈጠራ ያለው ታክቲካዊ አስተሳሰብ — ተቀናቃኞችን ለመጋፈጥ ሊለዋወጥ የሚችል ዘዴ',
  },
  {
    num: '፮',
    title: 'አንድነት',
    desc: 'ደጋፊዎችን፣ ሠራተኞችን እና ተጫዋቾችን አንድ ሊያደርግ የሚችል — ቡድን ስሜት መፍጠር',
  },
  {
    num: '፯',
    title: 'ለታሪክ አክብሮት',
    desc: 'ለፋሲል ከነማ 56 ዓመት ታሪክ እና ቅርስ ያለው ጥልቅ ግንዛቤ እና አክብሮት',
  },
]

export default function ReasonsSection() {
  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: '#111111' }}>
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}>
        <span className="text-2xl">📋</span>
        <h2 className="text-white font-bold text-lg">
          ከአዲሱ ስራ አስኪያጅ የምንፈልጋቸው 7 ባህሪያት
        </h2>
      </div>
      <div className="p-4 sm:p-6 space-y-3">
        {qualities.map((q) => (
          <div
            key={q.num}
            className="flex gap-4 p-4 rounded-xl transition-colors"
            style={{ background: '#1a1a1a' }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: '#CC0000' }}
            >
              {q.num}
            </div>
            <div>
              <h3 className="text-white font-bold text-base mb-0.5">{q.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{q.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
