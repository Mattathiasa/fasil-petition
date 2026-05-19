const problems = [
  {
    icon: '🏗️',
    title: 'ተቋማዊ ስትራክቸርን ተግባራዊ አለማድረግ',
    desc: 'ክለቡ ዘመናዊ እና ተቋማዊ አሰራር እንዳይኖረው አድርጓል — እያንዳንዱ ክፍል ሃላፊነቱን ተረድቶ የሚሰራበት ስርዓት አልተዘረጋም።',
  },
  {
    icon: '💸',
    title: 'የፋይናንስ አጠቃቀም ጉድለት እና ምዝበራ',
    desc: 'የክለቡ ሀብት በአግባቡ አልተጠቀሙበትም። ፋይናንሱ ወዴት እንደሄደ ሂሳብ አልተሰጠም — ደጋፊዎቹ ግልፅነት ይፈልጋሉ።',
  },
  {
    icon: '⚡',
    title: 'ከስራ ባልደረቦቻቸው ጋ ግጭት',
    desc: 'ከሠራተኞች፣ ከአሰልጣኞች እና ከተጫዋቾች ጋ ያለማቋረጥ አለመግባባት እና ግጭት ውስጥ ሲገቡ ክለቡ ሰላም አጥቷል።',
  },
]

export default function ProblemsSection() {
  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: '#111111' }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a' }}
      >
        <span className="text-2xl">⚠️</span>
        <div>
          <h2 className="text-white font-bold text-lg">የአቅም ማነስ ውጤቶች</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            ብቁ ያልሆነ አስተዳደር ያስከተላቸው ዋና ዋና ችግሮች
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-3">
        {/* Intro line */}
        <p className="text-gray-300 text-sm leading-relaxed px-1">
          ክለቡ ተቋማዊ ስትራክቸር ኖሮት ዘመኑን የዋጀ አሰራር እንዲከተል በቦታው ብቁ እና ተመራጭ የሆነ ስራ አስኪያጅ
          ሊቀጠር ይገባል። ከዚህ ጋር ተያያዥ የሆኑ ዋና ዋና ችግሮች፦
        </p>

        {problems.map((p, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 rounded-xl"
            style={{ background: 'rgba(204,0,0,0.06)', border: '1px solid rgba(204,0,0,0.2)' }}
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'rgba(204,0,0,0.15)' }}
            >
              {p.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}

        {/* Closing statement */}
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(204,0,0,0.1)', border: '1px solid rgba(204,0,0,0.3)' }}
        >
          <p className="text-white font-bold text-sm">
            ክለቡ መድረስ የነበረበት ቦታ እንዳይደርስ በማድረግ እንቅፋት ሆነዋል — ይህ ከአሁን በኋላ መቀጠል የለበትም።
          </p>
        </div>
      </div>
    </div>
  )
}
