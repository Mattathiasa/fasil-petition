export default function PetitionLetter() {
  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden" style={{ background: '#111111' }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: '#CC0000' }}>
        <span className="text-2xl">📜</span>
        <h2 className="text-white font-bold text-lg">ክፍት ደብዳቤ</h2>
      </div>

      <div className="p-6 sm:p-8 space-y-5 text-base sm:text-lg leading-loose">
        {/* Addressee */}
        <p className="text-white font-black text-xl sm:text-2xl">
          ለጎንደር ከተማ ክቡር ከንቲባ❗️
        </p>

        <p className="text-gray-200">
          የ56 ዓመት ታሪክ ያለው ግዙፉ እና አንጋፋው ፋሲል ከነማ ከፍታውን እና ክብሩን በሚመጥን መልኩ ለታሪክ ተወቃሽ
          እንዳንሆን ከዚህ በላይ በክብሩ ልክ እንዲቀመጥ ማድረግ አለብን። ሁሉም የሚያምንበት ስራ አስኪያጅ እንፈልጋለን።
        </p>

        <p className="text-gray-200">
          ፋሲል ከነማ በታሪኩ አሳልፎ የማያውቀውን ዝቅታ እና ውድቀት በአለፉት ዓመታት አሳልፏል። ያም የሆነበት ትልቁ
          ምክንያት የክለባችን ስራ አስኪያጅ ነው። ከዚህ በኋላ ይህ ችግር መቀጠል የለበትም።
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
          ፋሲል ከነማ ከክለብም በላይ ነው 🇦🇹
        </p>
      </div>
    </div>
  )
}
