import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
export default function Home() {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/noise.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#63786b',
        backgroundBlendMode: 'soft-light'
      }}
    >
      <div className="relative flex flex-col min-h-screen z-10" style={{ color: '#f8f7e5' }}>
        <header className="border-b backdrop-blur-md" style={{ borderColor: 'rgba(248, 247, 229, 0.2)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
          <Navbar />
        </header>

        <main className="flex-1 mobile-container py-8 sm:py-12 md:py-20 safe-top">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="mobile-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Personal<br className="hidden sm:block" /> Academic Hub
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 mobile-text" style={{ color: '#f8f7e5', opacity: 0.8 }}>
                Focus smarter. Track classes, manage budgets, plan studies, and practice with AI-powered Q&A — all in one place.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link to="/register" className="btn btn-primary mobile-btn">Get Started</Link>
                <Link to="/login" className="btn mobile-btn">Sign In</Link>
              </div>
            </div>
            <div className="rounded-2xl border backdrop-blur-md p-4 sm:p-6 md:p-8 mt-8 lg:mt-0" style={{ borderColor: 'rgba(248, 247, 229, 0.2)', backgroundColor: 'rgba(248, 247, 229, 0.1)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                {[
                  { title: 'Schedule Tracker', desc: 'Color-coded weekly view.' },
                  { title: 'Budget Insights', desc: 'Spend smart with goals.' },
                  { title: 'AI Q&A', desc: 'From your own notes.' },
                  { title: 'Focus Mode', desc: 'Grow your productivity.' }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="rounded-xl p-4 transition-transform duration-200 hover:scale-105 hover:bg-white/20"
                    style={{ backgroundColor: 'rgba(248, 247, 229, 0.1)' }}
                  >
                    <p className="font-medium text-base" style={{ color: '#f8f7e5' }}>{feature.title}</p>
                    <p className="mt-1 text-sm" style={{ color: '#f8f7e5', opacity: 0.8 }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
