import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getOwnerByEmail } from '../lib/dataService';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured() && supabase);

  // Check if user is an approved owner
  const checkOwnerStatus = useCallback(async (email) => {
    const ownerData = await getOwnerByEmail(email);
    if (ownerData && ownerData.status === 'approved') {
      setOwner(ownerData);
      return ownerData;
    }
    return null;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        await checkOwnerStatus(session.user.email);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        await checkOwnerStatus(session.user.email);
      } else {
        setOwner(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkOwnerStatus]);

  // Admin sign in
  const signIn = useCallback(async (email, password) => {
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
  }, []);

  // Owner sign in
  const ownerSignIn = useCallback(async (email, password) => {
    if (!supabase) {
      // Demo mode for development
      const isDevelopment = import.meta.env.DEV;
      if (isDevelopment && email === 'owner@demo.com' && password === 'owner123') {
        const demoOwner = {
          id: 'demo-owner',
          full_name: 'Demo Owner',
          email: 'owner@demo.com',
          status: 'approved'
        };
        setOwner(demoOwner);
        setUser({ email, id: 'demo-owner' });
        return { error: null };
      }
      return { error: { message: isDevelopment ? 'Invalid credentials' : 'Supabase not configured' } };
    }

    // First check if user is an approved owner
    const ownerData = await getOwnerByEmail(email);
    
    if (!ownerData) {
      return { error: { message: 'No account found with this email. Please sign up first.' } };
    }
    
    if (ownerData.status === 'pending') {
      return { error: { message: 'Your account is pending approval. Please wait for admin approval.' } };
    }
    
    if (ownerData.status === 'rejected') {
      return { error: { message: 'Your account application was rejected. Please contact support.' } };
    }

    // Now sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { data, error };
    }

    setOwner(ownerData);
    return { data, error: null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      setUser(null);
      setOwner(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    setOwner(null);
    return { error };
  }, []);

  const ownerSignOut = useCallback(async () => {
    setOwner(null);
    return signOut();
  }, [signOut]);

  const value = useMemo(() => ({
    user,
    owner,
    loading,
    signIn,
    signOut,
    ownerSignIn,
    ownerSignOut,
    isAuthenticated: !!user,
    isOwner: !!owner && owner.status === 'approved',
  }), [user, owner, loading, signIn, signOut, ownerSignIn, ownerSignOut]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
