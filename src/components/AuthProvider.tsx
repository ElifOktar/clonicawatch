"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
  };
  addresses?: Address[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  error: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => ({ ok: false }),
  signIn: async () => ({ ok: false }),
  signOut: () => {},
  updateProfile: () => {},
  resetPassword: async () => ({ ok: false }),
  error: "",
});

export function useAuth() {
  return useContext(AuthContext);
}

/* ── Supabase browser client (singleton) ── */
let _authClient: SupabaseClient | null = null;
function getAuthClient(): SupabaseClient | null {
  if (_authClient) return _authClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _authClient = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _authClient;
}

/* ── Map Supabase user to our User type ── */
function mapUser(sbUser: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string }): User {
  const meta = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    email: sbUser.email || "",
    name: (meta.name as string) || (meta.full_name as string) || "",
    phone: (meta.phone as string) || undefined,
    createdAt: sbUser.created_at || new Date().toISOString(),
    addresses: [],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /* ── Listen to auth state changes ── */
  useEffect(() => {
    const supabase = getAuthClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      }
      setIsLoading(false);
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Sign Up ── */
  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> => {
    setError("");
    const supabase = getAuthClient();
    if (!supabase) return { ok: false, error: "Service unavailable" };

    const normalEmail = email.toLowerCase().trim();
    if (!normalEmail || !password || !name.trim()) {
      const msg = "Please fill in all fields";
      setError(msg);
      return { ok: false, error: msg };
    }
    if (password.length < 6) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      return { ok: false, error: msg };
    }

    const { data, error: sbError } = await supabase.auth.signUp({
      email: normalEmail,
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (sbError) {
      const msg = sbError.message;
      setError(msg);
      return { ok: false, error: msg };
    }

    if (data.user) {
      setUser(mapUser(data.user));
    }
    return { ok: true };
  }, []);

  /* ── Sign In ── */
  const signIn = useCallback(async (email: string, password: string, _rememberMe?: boolean): Promise<{ ok: boolean; error?: string }> => {
    setError("");
    const supabase = getAuthClient();
    if (!supabase) return { ok: false, error: "Service unavailable" };

    const normalEmail = email.toLowerCase().trim();

    const { data, error: sbError } = await supabase.auth.signInWithPassword({
      email: normalEmail,
      password,
    });

    if (sbError) {
      let msg = sbError.message;
      if (msg.includes("Invalid login")) msg = "Incorrect email or password. Please try again.";
      setError(msg);
      return { ok: false, error: msg };
    }

    if (data.user) {
      setUser(mapUser(data.user));
    }
    return { ok: true };
  }, []);

  /* ── Sign Out ── */
  const signOut = useCallback(async () => {
    const supabase = getAuthClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  /* ── Update Profile ── */
  const updateProfile = useCallback(async (updates: Partial<User>) => {
    const supabase = getAuthClient();
    if (!supabase) return;

    const meta: Record<string, unknown> = {};
    if (updates.name) meta.name = updates.name;
    if (updates.phone !== undefined) meta.phone = updates.phone;

    const { data } = await supabase.auth.updateUser({
      data: meta,
    });

    if (data.user) {
      setUser(mapUser(data.user));
    }
  }, []);

  /* ── Reset Password ── */
  const resetPassword = useCallback(async (email: string): Promise<{ ok: boolean; error?: string }> => {
    const supabase = getAuthClient();
    if (!supabase) return { ok: false, error: "Service unavailable" };

    const { error: sbError } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: `${window.location.origin}/account?tab=profile`,
    });

    if (sbError) {
      setError(sbError.message);
      return { ok: false, error: sbError.message };
    }
    return { ok: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut, updateProfile, resetPassword, error }}>
      {children}
    </AuthContext.Provider>
  );
}
