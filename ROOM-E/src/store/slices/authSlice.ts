import { StateCreator } from 'zustand';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';

export interface AuthSlice {
  isAuthenticated: boolean;
  user: User | null;
  sessionReady: boolean;
  
  initializeAuth: () => void;
  login: (email: string, pass: string) => Promise<{ error: Error | null }>;
  registerUser: (name: string, email: string, pass: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  completeProfile: (name: string, avatar?: string) => Promise<{ error: Error | null }>;
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (set, get) => ({
  isAuthenticated: false,
  user: null,
  sessionReady: false,

  initializeAuth: () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          isAuthenticated: true,
          user: profile 
            ? { id: profile.id, name: profile.name, email: profile.email, avatar: profile.avatar } 
            : { id: session.user.id, name: session.user.user_metadata?.name || '', email: session.user.email },
          sessionReady: true
        });
      } else {
        set({ isAuthenticated: false, user: null, sessionReady: true });
      }
    });
  },

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  },

  registerUser: async (name, email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { error };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  completeProfile: async (name, avatar) => {
    const state = get();
    if (!state.user?.id) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('users')
      .update({ name, avatar: avatar || null })
      .eq('id', state.user.id);

    if (!error) {
       set((s: AuthSlice) => ({ user: s.user ? { ...s.user, name, avatar } : null }));
    }
    return { error };
  }
});
