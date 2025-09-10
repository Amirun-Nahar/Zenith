import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { api } from '../lib/api'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const navigate = useNavigate()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('')
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setSubmitError('')
    
    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      })
      
      if (response.success) {
        // Token is automatically stored in HTTP-only cookie by the server
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true })
      } else {
        setSubmitError(response.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setSubmitError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
      <div className="relative flex flex-col min-h-screen z-10" style={{ color: '#E43D12' }}>
        <header className="border-b backdrop-blur-md" style={{ borderColor: '#EFB11D', backgroundColor: 'rgba(235, 233, 225, 0.2)' }}>
          <Navbar />
        </header>

        <main className="flex-1 flex items-center justify-center p-3 sm:p-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="w-full max-w-md backdrop-blur-md border rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl" style={{ backgroundColor: '#EBE9E1', borderColor: '#EFB11D' }}>
            <div className="text-center mb-5 sm:mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2" style={{ color: '#E43D12' }}>
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base" style={{ color: '#E43D12', opacity: 0.8 }}>
                Sign in to continue your journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="email" className="text-sm font-medium block" style={{ color: '#E43D12' }}>
                  Email Address
                </label>
                <input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full backdrop-blur-sm border rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-opacity-30'
                  }`}
                  style={{ 
                    backgroundColor: '#EBE9E1', 
                    borderColor: errors.email ? '#ef4444' : '#EFB11D', 
                    color: '#E43D12',
                    '--tw-placeholder-opacity': '0.7'
                  }}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label htmlFor="password" className="text-sm font-medium block" style={{ color: '#E43D12' }}>
                  Password
                </label>
                <input 
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full backdrop-blur-sm border rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-opacity-30'
                  }`}
                  style={{ 
                    backgroundColor: '#EBE9E1', 
                    borderColor: errors.password ? '#ef4444' : '#EFB11D', 
                    color: '#E43D12',
                    '--tw-placeholder-opacity': '0.7'
                  }}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-400 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-3 rounded-lg mt-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <p className="text-sm text-red-400">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="btn btn-primary w-full py-2.5 sm:py-2 text-base sm:text-sm mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="text-base sm:text-sm">Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: '#E43D12', opacity: 0.8 }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium hover:underline transition-colors inline-block" 
                  style={{ color: '#E43D12' }}
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}