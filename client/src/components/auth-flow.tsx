import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, ArrowRight, ShieldCheck, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from './ui/button'

interface AuthFlowProps {
  onAuthSuccess: (user: { name: string; email: string; isGuest?: boolean }) => void
  onBackToLanding: () => void
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onAuthSuccess, onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (activeTab === 'signup' && !name) {
      setError('Please enter your name.')
      return
    }

    setLoading(true)

    // Simulate API request delay
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // If we want to support a real API call later:
      // const endpoint = activeTab === 'signin' ? '/api/auth/login' : '/api/auth/register'
      // const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify({ email, password, name }) })
      // if (!response.ok) throw new Error('Auth failed')

      // Mock user return payload
      onAuthSuccess({
        name: activeTab === 'signin' ? email.split('@')[0] : name,
        email,
        isGuest: false,
      })
    } catch (err) {
      setError('Authentication failed. Please check your credentials or try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestBypass = () => {
    onAuthSuccess({
      name: 'Guest Engineer',
      email: 'guest@kaizen.mock',
      isGuest: true,
    })
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-50 bg-grid-pattern px-4 py-12">
      {/* Top Header */}
      <header className="absolute top-0 w-full max-w-7xl px-6 py-6 flex items-center justify-between z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer border border-zinc-200 rounded-lg px-3 py-1.5 bg-white/50 backdrop-blur-sm shadow-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 shadow-md mb-4">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950">
            Account Portal
          </h2>
          <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase mt-1">
            KAIZEN AUTH PROTOCOL
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-panel rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl flex flex-col gap-6">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 bg-zinc-100/60 p-1 rounded-2xl border border-zinc-200/50">
            <button
              onClick={() => {
                setActiveTab('signin')
                setError('')
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/40'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup')
                setError('')
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/40'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {activeTab === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-850 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all font-mono"
                      placeholder="Jane Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-850 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all font-mono"
                  placeholder="jane.doe@gmail.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-wider uppercase">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-850 focus:outline-none focus:border-zinc-950 focus:bg-white transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl border border-red-200 bg-red-50/50 text-red-700 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full justify-center mt-2">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-zinc-250 border-t-white animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200/60" />
            </div>
            <span className="relative px-3 bg-white text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Guest Bypass Button */}
          <button
            onClick={handleGuestBypass}
            className="w-full text-center text-xs font-semibold text-zinc-650 hover:text-zinc-950 transition-colors py-2.5 border border-dashed border-zinc-250 hover:border-zinc-400 rounded-xl bg-zinc-50/30 hover:bg-zinc-50 cursor-pointer shadow-xs"
          >
            Continue as Guest (Demo)
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="absolute bottom-6 text-center text-[10px] text-zinc-500 font-mono z-10 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-zinc-400" />
        Data validation runs dynamically on submission
      </footer>
    </div>
  )
}
