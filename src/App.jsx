import Hero from './components/Hero'
import SignatureCounter from './components/SignatureCounter'
import PetitionLetter from './components/PetitionLetter'
import ReasonsSection from './components/ReasonsSection'
import SignForm from './components/SignForm'
import RecentSigners from './components/RecentSigners'
import FanGallery from './components/FanGallery'
import AdminPanel from './components/AdminPanel'

const isAdmin = window.location.pathname === '/admin'

export default function App() {
  if (isAdmin) return <AdminPanel />

  return (
    <div
      className="min-h-screen bg-[#0d0d0d] text-white"
      style={{ fontFamily: "'Noto Sans Ethiopic', Ethiopic, sans-serif" }}
    >
      <Hero />
      <main className="max-w-2xl mx-auto px-4 pb-20 space-y-8 pt-8">
        <SignatureCounter />
        <SignForm />
        <FanGallery />
        <PetitionLetter />
        <ReasonsSection />
        <RecentSigners />
      </main>
      <footer
        className="text-center py-10 text-gray-500 text-sm"
        style={{ borderTop: '1px solid #1a1a1a' }}
      >
        <p className="text-base font-semibold text-gray-300 mb-1">
          ፋሲል ከነማ ከክለብም በላይ ነው 🇦🇹
        </p>
        <p className="text-xs">ይህ ፔቲሽን ለጎንደር ከተማ ክቡር ከንቲባ ቀርቧል</p>
      </footer>
    </div>
  )
}
