import AdminPanel    from './components/AdminPanel'
import Hero          from './components/Hero'
import SignatureCounter from './components/SignatureCounter'
import SignForm       from './components/SignForm'
import FanGallery     from './components/FanGallery'
import PetitionLetter from './components/PetitionLetter'
import ProblemsSection from './components/ProblemsSection'
import ReasonsSection from './components/ReasonsSection'
import RecentSigners  from './components/RecentSigners'
import MobileCTA      from './components/MobileCTA'

const isAdmin = window.location.pathname === '/admin'

export default function App() {
  if (isAdmin) return <AdminPanel />

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0a0a0a', fontFamily: "'Noto Sans Ethiopic', Ethiopic, sans-serif" }}
    >
      <Hero />

      {/*
        Two-column layout:
          Mobile  → single column, form on top
          Desktop → left: petition content | right: sticky sign panel (380px)
      */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── RIGHT panel (sign + counter) — appears first on mobile ── */}
          <aside className="w-full lg:w-[380px] lg:flex-shrink-0 lg:order-2">
            <div className="lg:sticky lg:top-5 space-y-4">
              <SignatureCounter />
              <SignForm />
            </div>
          </aside>

          {/* ── LEFT column (petition content) ── */}
          <main className="flex-1 min-w-0 lg:order-1 space-y-6">
            <FanGallery />
            <PetitionLetter />
            <ProblemsSection />
            <ReasonsSection />
            <RecentSigners />
          </main>

        </div>
      </div>

      {/* Sticky "Sign" bar — mobile only, hides when form is visible */}
      <MobileCTA />

      <footer
        className="text-center py-10"
        style={{ borderTop: '1px solid #1a1a1a' }}
      >
        <p className="text-white font-bold">ፋሲል ከነማ ከክለብም በላይ ነው 🇦🇹</p>
        <p className="text-gray-600 text-xs mt-1">
          ፔቲሽን ለጎንደር ከተማ ክቡር ከንቲባ · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
