import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api } from '../lib/api'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setAuthorized(false)
    
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/auth/me')
        if (!mounted) return
        
        if (response.success) {
          setUser(response.user)
          setAuthorized(true)
        } else {
          setUser(null)
          setAuthorized(false)
          window.location.href = '/login'
        }
      } catch (error) {
        if (!mounted) return
        setUser(null)
        setAuthorized(false)
        window.location.href = '/login'
      } finally {
        if (mounted) setLoading(false)
      }
    }
    
    checkAuth()
    return () => { mounted = false }
  }, [location.pathname])

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#63786b' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p style={{ color: '#f8f7e5', opacity: 0.8 }}>Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authorized
  if (!authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Render protected content
  return children
}