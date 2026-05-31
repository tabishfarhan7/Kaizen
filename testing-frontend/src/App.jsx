import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthTester from './components/AuthTester.jsx';
import HomePage from './pages/HomePage.jsx';
import InterviewPage from './pages/InterviewPage.jsx';
import PracticePage from './pages/PracticePage.jsx';

function getToken() {
  return localStorage.getItem('token') || '';
}

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AppShell({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kaizenUser');
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Kaizen Functional Prototype</p>
            <h1 className="text-2xl font-bold text-slate-950">Backend Integration Workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/practice"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                }`
              }
            >
              Practice
            </NavLink>
            <NavLink
              to="/interview"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'
                }`
              }
            >
              Interview
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={getToken() ? <Navigate to="/home" replace /> : <AuthTester />} />
      <Route path="/" element={<Navigate to={getToken() ? '/home' : '/login'} replace />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppShell>
              <HomePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <AppShell>
              <PracticePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview"
        element={
          <ProtectedRoute>
            <AppShell>
              <InterviewPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
