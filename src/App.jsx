import { useEffect } from 'react'
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
import { useCount }   from './hooks/useCount'

function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: '#0a0a0a', fontFamily: "'Noto Sans Ethiopic', sans-serif" }}
    >
      <p className="text-6xl mb-6">🔍</p>
      <h1 className="text-white font-black text-3xl mb-3">ይህ ገጽ አልተገኘም</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-md">
        የፈለጉት ገጽ አለመኖሩ ይሆናል። እባክዎን ለንክ ይፈትሹ ወይም ወደ ዋና ገጽ ይመለሱ።
      </p>
      <a
        href="/"
        className="px-6 py-3 rounded-xl text-white font-bold transition-opacity hover:opacity-90"
        style={{ background: '#CC0000' }}
      >
        ወደ ዋና ገጽ ተመለስ
      </a>
    </div>
  )
}

const path = window.location.pathname
const isAdmin = path === '/admin'
const is404 = !isAdmin && path !== '/'

function PetitionPage() {
  const { count } = useCount()

  useEffect(() => {
    if (count !== null) {
      document.title = `${count.toLocaleString()} ፊርማዎች — ፋሲል ከነማ ፔቲሽን`
    }
  }, [count])

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
        className="text-center py-12 px-4"
        style={{ borderTop: '1px solid #1a1a1a' }}
      >
        <p
          className="font-black text-lg sm:text-xl leading-relaxed mb-3"
          style={{ color: '#CC0000' }}
        >
          መልካም ዕድል — ዘመን የማይሽረዉ ከፍታ ለጎንደሩ ጌጥ፣
          <br />
          ለአማራዉ ምልክት፣ ለአፄዎቹ አርማ — <span className="text-white">ፋሲል ከነማ!!!!</span>
        </p>
        <p className="text-gray-500 text-sm font-bold mb-1">ፋሲል ከነማ እግርኳስ ክለብ ከክለብም በላይ ነው 🇦🇹</p>
        <p className="text-gray-700 text-xs">
          ፔቲሽን ለጎንደር ከተማ ክቡር ከንቲባ · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

export default function App() {
  if (isAdmin) return <AdminPanel />
  if (is404) return <NotFound />
  return <PetitionPage />
}
