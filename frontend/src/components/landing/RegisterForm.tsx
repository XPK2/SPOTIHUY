import { useState } from 'react'
import { X, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { authApi, AuthRequest } from '@/lib/api'

interface RegisterFormProps {
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterForm({ onClose, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { score: 0, label: '', color: '' }
    if (password.length < 6) return { score: 1, label: 'Weak', color: 'text-red-400' }
    if (password.length < 8) return { score: 2, label: 'Fair', color: 'text-yellow-400' }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { score: 3, label: 'Strong', color: 'text-green-400' }
    }
    return { score: 2, label: 'Good', color: 'text-blue-400' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordStrength(formData.password).score < 2) {
      setError('Password is too weak')
      return
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service')
      return
    }

    setIsLoading(true)

    try {
      const registerData: AuthRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name
      }

      const response = await authApi.register(registerData)

      // Store auth token
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      // Redirect to main app
      window.location.href = '/app'
    } catch (err) {
      console.error('Registration error:', err)
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  const strength = passwordStrength(formData.password)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background-tertiary border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-background-tertiary border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 bg-background-tertiary border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 bg-white/10 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    strength.score === 1 ? 'bg-red-400 w-1/3' :
                    strength.score === 2 ? 'bg-yellow-400 w-2/3' :
                    strength.score === 3 ? 'bg-green-400 w-full' : 'bg-gray-400 w-0'
                  }`}
                ></div>
              </div>
              <span className={`text-xs font-medium ${strength.color}`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 bg-background-tertiary border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
            <div className="flex items-center mt-1 text-green-400 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Passwords match
            </div>
          )}
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 bg-background-tertiary border border-white/10 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="terms" className="text-sm text-white/60 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !agreedToTerms}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/60 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}