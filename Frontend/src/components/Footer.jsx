import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          <div className="text-xs sm:text-sm" style={{ color: '#F5EFE6', opacity: 0.8 }}>
            © {new Date().getFullYear()} Zenith. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
