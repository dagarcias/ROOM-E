import { StateCreator } from 'zustand';
import { User } from '../../types';

export interface AuthSlice {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  completeProfile: (name: string, avatar?: string) => void;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,

  login: (user) => set({ isAuthenticated: true, user }),
  
  logout: () => set({ isAuthenticated: false, user: null }),
  
  completeProfile: (name, avatar) => set((state) => ({
    user: state.user ? { ...state.user, name, avatar } : null,
  })),
});
