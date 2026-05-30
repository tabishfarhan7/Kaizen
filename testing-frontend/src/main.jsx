import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AuthTester from './components/AuthTester.jsx';
import DashboardTester from './components/DashboardTester.jsx';
import InterviewRoomTester from './components/InterviewRoomTester.jsx';
import './index.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem('token') || '');
    window.addEventListener('storage', syncToken);
    return () => window.removeEventListener('storage', syncToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Kaizen Test Harness</p>
            <h1 className="text-2xl font-bold text-slate-950">Backend Integration Workspace</h1>
          </div>
          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Clear Token
            </button>
          ) : null}
        </header>

        {!token ? (
          <AuthTester onAuthenticated={setToken} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <DashboardTester />
            <InterviewRoomTester />
          </div>
        )}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
