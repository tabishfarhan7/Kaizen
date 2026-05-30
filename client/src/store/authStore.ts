import { create } from 'zustand';
import type { CandidateProfile } from '../components/candidate-settings';

export interface UserSession {
  id?: string;
  name: string;
  email: string;
  isGuest?: boolean;
}

interface AuthState {
  user: UserSession | null;
  candidateProfile: CandidateProfile | null;
  isAuthenticated: boolean;
  login: (user: UserSession) => void;
  logout: () => void;
  setCandidateProfile: (profile: CandidateProfile) => void;
}

// Load initial state from local storage safely
const loadSavedUser = (): UserSession | null => {
  try {
    const saved = localStorage.getItem('kaizen_user_session');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const loadSavedProfile = (): CandidateProfile | null => {
  try {
    const saved = localStorage.getItem('kaizen_candidate_profile');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialUser = loadSavedUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  candidateProfile: loadSavedProfile(),
  isAuthenticated: !!initialUser,
  
  login: (user) => {
    localStorage.setItem('kaizen_user_session', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('kaizen_user_session');
    set({ user: null, isAuthenticated: false });
  },
  
  setCandidateProfile: (profile) => {
    localStorage.setItem('kaizen_candidate_profile', JSON.stringify(profile));
    set({ candidateProfile: profile });
  }
}));
