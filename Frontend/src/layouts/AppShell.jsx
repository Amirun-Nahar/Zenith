import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function AppShell() {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: '#EBE9E1',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative grid grid-rows-[56px_1fr_auto] sm:grid-rows-[64px_1fr_auto] min-h-screen z-10" style={{ color: '#E43D12' }}>
        <header className="sticky top-0 border-b backdrop-blur-md z-50" style={{ borderColor: '#EFB11D', backgroundColor: 'rgba(235, 233, 225, 0.2)' }}>
          <Navbar />
        </header>

        <main className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="container-fluid mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
