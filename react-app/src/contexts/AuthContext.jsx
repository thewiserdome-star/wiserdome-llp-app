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

  // Clear Supabase tokens from localStorage
  const clearLocalSupabaseTokens = useCallback(() => {
    try { localStorage.removeItem('supabase.auth.token'); } catch { /* ignore */ }
    try { localStorage.removeItem('sb-access-token'); } catch { /* ignore */ }
    try { localStorage.removeItem('sb-refresh-token'); } catch { /* ignore */ }
  }, []);

  // Redirect to the appropriate login page based on current path
  const redirectToLogin = useCallback(() => {
    try {
      if (window.location.pathname?.includes('/admin')) {
        window.location.replace('/admin/login');
      } else if (window.location.pathname?.includes('/owner')) {
        window.location.replace('/owner/login');
      } else {
        window.location.replace('/admin/login');
      }
    } catch {
      // Fallback - try hard navigation
      window.location.href = '/admin/login';
    }
  }, []);

  // Check if an error indicates an invalid refresh token
  const isRefreshTokenError = useCallback((err) => {
    const msg = err?.message || (typeof err === 'string' ? err : '');
    return msg.includes('Refresh Token Not Found') || msg.includes('Invalid Refresh Token');
  }, []);

  // Handle invalid refresh token by signing out and redirecting
  const handleInvalidRefresh = useCallback(async (err) => {
    console.warn('[Auth] Invalid refresh token detected:', err?.message || err);
    try {
      if (supabase && supabase.auth && supabase.auth.signOut) {
        await supabase.auth.signOut();
      }
    } catch (signOutErr) {
      console.warn('[Auth] Error while signing out:', signOutErr);
    }

    clearLocalSupabaseTokens();
    setUser(null);
    setOwner(null);
    redirectToLogin();
  }, [clearLocalSupabaseTokens, redirectToLogin]);

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
    let subscription = null;
    let unhandledRejectionHandler = null;

    async function init() {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }

      try {
        // Get initial session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          if (isRefreshTokenError(error)) {
            await handleInvalidRefresh(error);
            return;
          }
          console.error('[Auth] Error fetching session:', error);
        }

        const session = data?.session;
        setUser(session?.user ?? null);

        if (session?.user?.email) {
          await checkOwnerStatus(session.user.email);
        }
      } catch (err) {
        if (isRefreshTokenError(err)) {
          await handleInvalidRefresh(err);
          return;
        }
        console.error('[Auth] Unexpected error getting session:', err);
      } finally {
        setLoading(false);
      }

      // Listen for auth changes
      try {
        const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.debug('[Auth] onAuthStateChange event:', event);

          // Check for token refresh error events
          if (event === 'TOKEN_REFRESH_FAILED' || event === 'SIGNED_OUT') {
            if (event === 'SIGNED_OUT') {
              setUser(null);
              setOwner(null);
              return;
            }
            await handleInvalidRefresh(new Error(`Auth event indicates token failure: ${event}`));
            return;
          }

          setUser(session?.user ?? null);
          if (session?.user?.email) {
            await checkOwnerStatus(session.user.email);
          } else {
            setOwner(null);
          }
        });

        subscription = sub;
      } catch (subErr) {
        console.error('[Auth] Error setting up auth subscription:', subErr);
      }

      // Safety net: catch unhandled promise rejections related to refresh tokens
      unhandledRejectionHandler = (event) => {
        try {
          const reason = event?.reason;
          const msg = reason?.message || (typeof reason === 'string' ? reason : '');
          if (msg && isRefreshTokenError({ message: msg })) {
            event.preventDefault?.();
            handleInvalidRefresh(reason);
          }
        } catch {
          // Ignore errors in the handler itself
        }
      };
      window.addEventListener('unhandledrejection', unhandledRejectionHandler);
    }

    init();

    return () => {
      try {
        if (subscription && subscription.unsubscribe) {
          subscription.unsubscribe();
        } else if (subscription && typeof subscription === 'object' && subscription?.data?.subscription?.unsubscribe) {
          subscription.data.subscription.unsubscribe();
        }
      } catch {
        // Ignore cleanup errors
      }

      try {
        if (unhandledRejectionHandler) {
          window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [checkOwnerStatus, handleInvalidRefresh, isRefreshTokenError]);

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
      return { error: { message: 'Invalid credentials or account not found. Please sign up or try again.' } };
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

    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setOwner(null);
      clearLocalSupabaseTokens();
      return { error };
    } catch (err) {
      console.warn('[Auth] signOut error:', err);
      clearLocalSupabaseTokens();
      setUser(null);
      setOwner(null);
      return { error: err };
    }
  }, [clearLocalSupabaseTokens]);

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
