export default function PetitionLetter() {
  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: '#111111' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#CC0000' }}>
        <span className="text-2xl">📜</span>
        <h2 className="text-white font-bold text-lg">ክፍት ደብዳቤ</h2>
      </div>

      <div className="p-6 sm:p-8 space-y-5 text-base sm:text-lg leading-loose">
        {/* Emotional opening */}
        <p className="text-gray-200">
          የ56 ዓመት ታላቅ ታሪክና ክብር ያለው የፋሲል ከነማ እግርኳስ ክለብ፣ በአሁኑ ሰዓት ካለበት የአመራር ብቃት ማነስ
          እና የውጤት ማሽቆልቆል ለመታደግ የደጋፊው አንድነት የሚያስፈልግበት ወሳኝ ሰዓት ላይ እንገኛለን።
        </p>

        <p className="text-gray-200">
          ይህ የደጋፊዎች ድምፅ ማሰባሰቢያ (Petition) ለጎንደር ከተማ ክቡር ከንቲባ እና ለክለቡ የበላይ አመራሮች
          የሚቀርብ ሲሆን፤ የአሁኑ ስራ አስኪያጅ አቶ አቢዮት ብርሃኑ ከሃላፊነታቸው ተነስተው ክለቡን የሚመጥን
          ብቁ አመራር እንዲተካ ይጠይቃል።
        </p>

        {/* Addressee */}
        <p className="text-white font-black text-xl sm:text-2xl">
          ለጎንደር ከተማ ክቡር ከንቲባ❗️
        </p>

        <p className="text-gray-200">
          የ56 ዓመት ታሪክ ያለው ግዙፉ እና አንጋፋው ፋሲል ከነማ እግርኳስ ክለብ ከፍታውን እና ክብሩን በሚመጥን መልኩ ለታሪክ ተወቃሽ
          እንዳንሆን ከዚህ በላይ በክብሩ ልክ እንዲቀመጥ ማድረግ አለብን። ሁሉም የሚያምንበት ስራ አስኪያጅ እንፈልጋለን።
        </p>

        <p className="text-gray-200">
          ፋሲል ከነማ እግርኳስ ክለብ በታሪኩ አሳልፎ የማያውቀውን ዝቅታ እና ውድቀት በአለፉት ዓመታት አሳልፏል። ያም የሆነበት ትልቁ
          ምክንያት የክለባችን ስራ አስኪያጅ ነው። ከዚህ በኋላ ይህ ችግር መቀጠል የለበትም።
        </p>

        <p className="text-gray-200">
          ክለቡ ተቋማዊ ስትራክቸር ኖሮት ዘመኑን የዋጀ አሰራር እንዲከተል በቦታው ብቁ እና ተመራጭ የሆነ ስራ አስኪያጅ
          ሊቀጠር ይገባል! የዋና ስራ አስኪያጁ አቅም ማነስ እና ለቦታው ብቁ አለመሆን በክለቡ ላይ ዘርፈ ብዙ ችግሮችን
          ያስከተለ ሲሆን ከነዚህም በጥቂቱ፦ <strong className="text-white">ተቋማዊ ስትራክቸርን ተግባራዊ
          አለማድረግ</strong>፣ <strong className="text-white">የፋይናንስ አጠቃቀም ጉድለት እና
          ምዝበራ</strong>፣ እንዲሁም <strong className="text-white">ከስራ ባልደረቦቻቸው ጋ አለመግባባት
          እና ግጭት ውስጥ መግባት</strong> — ክለቡ መድረስ የነበረበት ቦታ እንዳይደርስ በማድረግ እንቅፋት ሆነዋል።
        </p>

        {/* Pull quote */}
        <blockquote
          className="rounded-xl p-5 border-l-4 italic"
          style={{
            borderColor: '#CC0000',
            background: 'rgba(204,0,0,0.08)',
          }}
        >
          <p className="text-white font-bold text-lg sm:text-xl">
            "ለመላው ደጋፊ ከክለብም በላይ ማንነቱ ነው!!!"
          </p>
        </blockquote>

        <p className="text-gray-200">
          እናም የክለባችን የበላይ አስተዳዳሪ የከተማችን ክቡር ከንቲባ — ጊዜው አሁን ነውና፣{' '}
          <strong className="text-white">አቶ አቢዮት ብርሃኑን በማንሳት</strong>፣ በታላቁ ክለባችን ልክ
          ሊመራው የሚችል ስራ አስኪያጅ እንዲቀጠርልን በታላቁ ደጋፊ ስም እንጠይቃለን።
        </p>

        <p className="font-black text-xl" style={{ color: '#CC0000' }}>
          የክለባችን ክብር ይመለስ! አሁኑኑ ይፈረሙ፣ ለሌሎችም ያጋሩ!
        </p>

        <p className="font-black text-lg text-white">
          ፋሲል ከነማ እግርኳስ ክለብ ከክለብም በላይ ነው 🇦🇹
        </p>
      </div>
    </div>
  )
}
