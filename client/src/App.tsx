import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { HeroOdyssey } from './components/hero-odyssey'
import { InterviewDashboard } from './components/interview-dashboard'
import { AuthFlow } from './components/auth-flow'
import { Features } from './components/features'
import { TestimonialsSection } from './components/testimonials'
import { Bird as Twitter, Link as Linkedin, GitBranch as Github } from 'lucide-react'
import { About } from './components/about'
import { Footer } from './components/footer'
import { CandidateSettings } from './components/candidate-settings'
import { ProtectedRoute } from './components/protected-route'
import { Navbar } from './components/navbar'
import { DashboardHome } from './components/dashboard-home'
import { PracticeHub } from './components/practice-hub'
import { NotesVault } from './components/notes-vault'
import { useAuthStore } from './store/authStore'

// Wrapper component to provide navigation logic to the Landing page components
const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleStartMockInterview = () => {
    if (isAuthenticated) {
      navigate('/app/mock');
    } else {
      navigate('/login');
    }
  };

  const footerNavLinks = [
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'About', onClick: () => navigate('/about') },
    { label: 'Start Interview', onClick: handleStartMockInterview },
  ];

  const footerSocialLinks = [
    { label: 'GitHub', icon: <Github />, href: 'https://github.com/tabishfarhan7' },
    { label: 'Twitter', icon: <Twitter />, href: 'https://twitter.com' },
    { label: 'LinkedIn', icon: <Linkedin />, href: 'https://linkedin.com' },
  ];

  return (
    <div className="flex flex-col w-full">
      <HeroOdyssey 
        onStartInterview={handleStartMockInterview} 
        onEnhanceSkills={() => navigate('/app/practice')}
      />
      <Features />
      <TestimonialsSection />
      <Footer
        creatorName="Suraj"
        creatorUrl="https://github.com/tabishfarhan7"
        navLinks={footerNavLinks}
        socialLinks={footerSocialLinks}
      />
    </div>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();
  return <About onBackToLanding={() => navigate('/')} />;
};

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return (
    <AuthFlow
      onAuthSuccess={(user) => {
        login(user);
        navigate('/app');
      }}
      onBackToLanding={() => navigate('/')}
    />
  );
};

// Wrapper for settings to inject auth store hooks
const SettingsPage = () => {
  const navigate = useNavigate();
  const { candidateProfile, setCandidateProfile } = useAuthStore();

  return (
    <div className="p-8">
      <CandidateSettings
        initialProfile={candidateProfile}
        onSave={setCandidateProfile}
        onBack={() => navigate('/app')}
      />
    </div>
  );
};

// Wrapper for Mock Interview to inject auth store hooks
const MockInterviewPage = () => {
  const { user, candidateProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <InterviewDashboard
      user={user}
      candidateProfile={candidateProfile}
      onLogout={() => {
        logout();
        navigate('/');
      }}
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="practice" element={<PracticeHub />} />
            <Route path="mock" element={<MockInterviewPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="/notes" element={<NotesVault />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
