import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, User, AlertCircle, ArrowLeft, GitBranch as Github } from 'lucide-react'
import { Button } from './ui/button'
import { apiRequest } from '../api'

interface AuthResponse {
  user?: {
    id: string
    name: string
  }
}

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

    try {
      const endpoint = activeTab === 'signin' ? '/auth/login' : '/auth/register'
      const payload =
        activeTab === 'signin'
          ? { email, password }
          : { name, email, password }

      const response = await apiRequest<AuthResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const authenticatedUser = response.user

      onAuthSuccess({
        name: authenticatedUser?.name ?? (activeTab === 'signin' ? email.split('@')[0] : name),
        email,
        isGuest: false,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.')
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
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-white">
      {/* Return Home Button - Absolute on mobile, inside header on desktop */}
      <button
        onClick={onBackToLanding}
        className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors z-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </button>

      {/* Left Panel - Dark Branding */}
      <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white lg:flex overflow-hidden">
        {/* Decorative Grid/Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />

        <div className="relative z-20 flex items-center text-lg font-bold tracking-tight gap-2">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <Cpu className="h-5 w-5 text-zinc-950" />
          </div>
          KAIZEN
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-light leading-relaxed text-zinc-300">
              "Kaizen's real-time telemetry fundamentally changed how I approached system design interviews. The feedback is relentless, objective, and incredibly accurate."
            </p>
            <footer className="text-sm font-semibold text-zinc-400">Sofia Davis, Sr. Backend Engineer</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="p-8 h-full flex items-center justify-center w-full relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {activeTab === 'signin' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-zinc-500">
              {activeTab === 'signin' ? 'Enter your email below to login to your account' : 'Enter your email below to create your account'}
            </p>
          </div>

          <div className="grid grid-cols-2 bg-zinc-100 p-1 rounded-lg">
            <button
              onClick={() => { setActiveTab('signin'); setError(''); }}
              className={`py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'signin' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'signup' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              Sign Up
            </button>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">

                <AnimatePresence mode="wait">
                  {activeTab === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid gap-2"
                    >
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-950">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-950">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-950">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2 p-2 rounded-md bg-red-50 text-red-600 text-xs font-medium"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button disabled={loading} className="w-full mt-2">
                  {loading ? (
                    <div className="h-4 w-4 rounded-full border-2 border-zinc-400 border-t-white animate-spin" />
                  ) : (
                    activeTab === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleGuestBypass} className="w-full">
                <User className="mr-2 h-4 w-4" />
                Guest
              </Button>
              <Button variant="outline" onClick={handleGuestBypass} className="w-full">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </div>

          <p className="px-8 text-center text-sm text-zinc-500">
            By clicking continue, you agree to our{' '}
            <a href="#" className="underline underline-offset-4 hover:text-zinc-950">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline underline-offset-4 hover:text-zinc-950">
              Privacy Policy
            </a>
            .
          </p>

        </div>
      </div>
    </div>
  )
}
