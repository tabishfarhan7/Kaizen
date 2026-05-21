import { useState, useEffect } from 'react'
import { HeroOdyssey } from './components/hero-odyssey'
import { InterviewDashboard } from './components/interview-dashboard'
import { AuthFlow } from './components/auth-flow'

type PageState = 'landing' | 'login' | 'dashboard'

interface UserSession {
  name: string;
  email: string;
  isGuest?: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('landing')
  const [user, setUser] = useState<UserSession | null>(null)

  // Load existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kaizen_user_session')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
      } catch (e) {
        console.error('Failed to parse saved session', e)
      }
    }
  }, [])

  const handleStartMockInterview = () => {
    if (user) {
      setCurrentPage('dashboard')
    } else {
      setCurrentPage('login')
    }
  }

  const handleAuthSuccess = (authenticatedUser: UserSession) => {
    setUser(authenticatedUser)
    localStorage.setItem('kaizen_user_session', JSON.stringify(authenticatedUser))
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('kaizen_user_session')
    setCurrentPage('landing')
  }

  const handleBackToLanding = () => {
    setCurrentPage('landing')
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {currentPage === 'landing' && (
        <HeroOdyssey onStart={handleStartMockInterview} />
      )}
      {currentPage === 'login' && (
        <AuthFlow 
          onAuthSuccess={handleAuthSuccess} 
          onBackToLanding={handleBackToLanding} 
        />
      )}
      {currentPage === 'dashboard' && (
        <InterviewDashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}

export default App
