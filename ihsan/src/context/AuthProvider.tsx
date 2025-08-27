import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: any }>
  signUpWithPassword: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
  sendEmailOtp: (email: string) => Promise<{ error?: any }>
  verifyEmailOtp: (email: string, token: string) => Promise<{ error?: any }>
  signInWithGoogle: () => Promise<{ error?: any }>
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session);
      setLoading(false);
    })();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user: session?.user ?? null,
    loading,
    async signInWithPassword(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    },
    async signUpWithPassword(email, password) {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async sendEmailOtp(email) {
      const { error } = await supabase.auth.signInWithOtp({ email });
      return { error };
    },
    async verifyEmailOtp(email, token) {
      const { error } = await supabase.auth.verifyOtp({ type: 'email', email, token });
      return { error };
    },
    async signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      return { error };
    },
  }), [session, loading]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

