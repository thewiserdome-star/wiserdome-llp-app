import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured() && supabase);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!supabase) {
      // Demo mode for development only - check for development environment
      const isDevelopment = import.meta.env.DEV;
      const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'admin@wiserdome.com';
      const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'admin123';
      
      if (isDevelopment && email === demoEmail && password === demoPassword) {
        setUser({ email, id: 'demo-user' });
        return { error: null };
      }
      return { error: { message: isDevelopment ? 'Invalid credentials' : 'Supabase not configured' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
