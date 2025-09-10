import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isProtectedRoute = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register'

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="mx-auto max-w-6xl px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
      <Link to={isProtectedRoute ? "/dashboard" : "/"} className="flex items-center gap-2">
        <img 
          src="https://i.ibb.co.com/LhSwNPNx/Zenith-Personal-Tracker-App-Logo-Emblem-Style.png" 
          alt="Zenith Logo" 
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg transition-transform duration-300 hover:scale-110"
        />
        <span className="font-semibold text-[#F5EFE6] text-sm sm:text-base">Zenith</span>
      </Link>
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Desktop Navigation */}
      {isProtectedRoute ? (
        <div className="hidden lg:flex items-center gap-1 xl:gap-4">
          <Link to="/dashboard" className="btn text-sm xl:text-base px-2 xl:px-3">Dashboard</Link>
          <Link to="/schedule" className="btn text-sm xl:text-base px-2 xl:px-3">Schedule</Link>
          <Link to="/budget" className="btn text-sm xl:text-base px-2 xl:px-3">Budget</Link>
          <Link to="/planner" className="btn text-sm xl:text-base px-2 xl:px-3">Planner</Link>
          <Link to="/qa" className="btn text-sm xl:text-base px-2 xl:px-3">Q&A</Link>
          <Link to="/focus" className="btn text-sm xl:text-base px-2 xl:px-3">Focus</Link>
          <Link to="/ai" className="btn text-sm xl:text-base px-2 xl:px-3">AI</Link>
          <Link to="/mindmap" className="btn text-sm xl:text-base px-2 xl:px-3">Mind Map</Link>
          <button onClick={handleLogout} className="btn btn-danger text-sm xl:text-base px-2 xl:px-3">Logout</button>
        </div>
      ) : (
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login" className="btn text-sm xl:text-base px-2 xl:px-3">Login</Link>
          <Link to="/register" className="btn btn-primary text-sm xl:text-base px-2 xl:px-3">Sign Up</Link>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-14 sm:top-16 left-0 right-0 bg-[#19183B]/95 backdrop-blur-lg border-b border-[#6D94C5]/10 shadow-lg lg:hidden z-50">
          <nav className="max-w-6xl mx-auto py-3 sm:py-4 px-3 sm:px-4">
            {isProtectedRoute ? (
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link to="/dashboard" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Dashboard</Link>
                <Link to="/schedule" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Schedule</Link>
                <Link to="/budget" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Budget</Link>
                <Link to="/planner" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Planner</Link>
                <Link to="/qa" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Q&A</Link>
                <Link to="/focus" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Focus</Link>
                <Link to="/ai" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">AI</Link>
                <Link to="/mindmap" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Mind Map</Link>
                <button onClick={handleLogout} className="btn btn-danger w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <Link to="/login" className="btn w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Login</Link>
                <Link to="/register" className="btn btn-primary w-full text-left text-sm sm:text-base py-2 sm:py-2.5">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </nav>
  )
}