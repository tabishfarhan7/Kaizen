import { useState, useEffect } from 'react'
import { HeroOdyssey } from './components/hero-odyssey'
import { InterviewDashboard } from './components/interview-dashboard'
import { AuthFlow } from './components/auth-flow'
import { Features } from './components/features'
import { TestimonialsSection } from './components/testimonials'
import { AnimatedDock } from './components/animated-dock'
import { Home, LayoutDashboard, PlayCircle, Settings, GitBranch, Info, Bird as Twitter, Link as Linkedin, GitBranch as Github } from 'lucide-react'
import { About } from './components/about'
import { Footer } from './components/footer'
import { CandidateSettings } from './components/candidate-settings'
import type { CandidateProfile } from './components/candidate-settings'

type PageState = 'landing' | 'login' | 'dashboard' | 'about' | 'settings'

interface UserSession {
  name: string;
  email: string;
  isGuest?: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('landing')
  const [user, setUser] = useState<UserSession | null>(null)
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null)

  // Load existing session and profile on mount
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

    const savedProfile = localStorage.getItem('kaizen_candidate_profile')
    if (savedProfile) {
      try {
        setCandidateProfile(JSON.parse(savedProfile))
      } catch (e) {
        console.error('Failed to parse saved profile', e)
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

  const dockItems = [
    { title: 'Home', Icon: <Home className="w-5 h-5" />, onClick: handleBackToLanding },
    { title: 'About', Icon: <Info className="w-5 h-5" />, onClick: () => setCurrentPage('about') },
    { title: 'Dashboard', Icon: <LayoutDashboard className="w-5 h-5" />, onClick: () => { if (user) setCurrentPage('dashboard'); else setCurrentPage('login'); } },
    { title: 'Start Mock Interview', Icon: <PlayCircle className="w-5 h-5" />, onClick: handleStartMockInterview },
    { title: 'GitHub', Icon: <GitBranch className="w-5 h-5" />, link: 'https://github.com/tabishfarhan7', target: '_blank' },
    { title: 'Settings', Icon: <Settings className="w-5 h-5" />, onClick: () => { if (user) setCurrentPage('settings'); else setCurrentPage('login'); } },
  ];

  const footerNavLinks = [
    { label: 'Home', onClick: handleBackToLanding },
    { label: 'About', onClick: () => setCurrentPage('about') },
    { label: 'Start Interview', onClick: handleStartMockInterview },
  ];

  const footerSocialLinks = [
    { label: 'GitHub', icon: <Github />, href: 'https://github.com/tabishfarhan7' },
    { label: 'Twitter', icon: <Twitter />, href: 'https://twitter.com' },
    { label: 'LinkedIn', icon: <Linkedin />, href: 'https://linkedin.com' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {currentPage === 'landing' && (
        <div className="flex flex-col w-full">
          <HeroOdyssey onStart={handleStartMockInterview} />
          <Features />
          <TestimonialsSection />
          <Footer
            creatorName="Suraj"
            creatorUrl="https://github.com/tabishfarhan7"
            navLinks={footerNavLinks}
            socialLinks={footerSocialLinks}
          />
        </div>
      )}
      {currentPage === 'about' && (
        <About onBackToLanding={handleBackToLanding} />
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
          candidateProfile={candidateProfile}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'settings' && (
        <CandidateSettings
          initialProfile={candidateProfile}
          onSave={(profile) => {
            setCandidateProfile(profile)
            localStorage.setItem('kaizen_candidate_profile', JSON.stringify(profile))
          }}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}

      {/* Global Mac-style Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <AnimatedDock items={dockItems} />
      </div>
    </div>
  )
}

export default App
