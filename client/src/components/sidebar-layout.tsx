import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  Mic, 
  BookOpen, 
  LogOut, 
  Settings,
  BrainCircuit
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const SidebarLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Practice Hub', path: '/app/practice', icon: <Target className="w-5 h-5" /> },
    { name: 'Mock Interviews', path: '/app/mock', icon: <Mic className="w-5 h-5" /> },
    { name: 'DSA Notes', path: '/app/notes', icon: <BookOpen className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-zinc-100">
            <NavLink to="/app" className="flex items-center gap-2 text-zinc-950 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-zinc-950 rounded-lg flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">Kaizen</span>
            </NavLink>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-zinc-950 text-white shadow-md' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }
                `}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <div className="mb-4 px-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold text-xs uppercase border border-zinc-200 shadow-sm">
              {user?.name?.slice(0, 2) || 'EN'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900 truncate max-w-[120px]">{user?.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider">ENGINEER</span>
            </div>
          </div>
          
          <div className="space-y-1">
             <NavLink
                to="/app/settings"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-zinc-100 text-zinc-900' 
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                  }
                `}
              >
                <Settings className="w-5 h-5" />
                Settings
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                Sign out
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
