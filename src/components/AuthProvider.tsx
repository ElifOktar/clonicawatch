"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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
  error: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => ({ ok: false }),
  signIn: async () => ({ ok: false }),
  signOut: () => {},
  updateProfile: () => {},
  error: "",
});

export function useAuth() {
  return useContext(AuthContext);
}

const STORAGE_KEY = "clonica_users";
const SESSION_KEY = "clonica_session";
const PERSIST_KEY = "clonica_persist"; // localStorage-based "remember me"

function getUsers(): Record<string, { user: User; passwordHash: string }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore session — check both sessionStorage and localStorage (remember me)
  useEffect(() => {
    try {
      const sessionEmail = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(PERSIST_KEY);
      if (sessionEmail) {
        const users = getUsers();
        if (users[sessionEmail]) {
          setUser(users[sessionEmail].user);
          // Keep session active
          sessionStorage.setItem(SESSION_KEY, sessionEmail);
        }
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> => {
    setError("");
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

    const users = getUsers();
    if (users[normalEmail]) {
      const msg = "An account with this email already exists";
      setError(msg);
      return { ok: false, error: msg };
    }

    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      email: normalEmail,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      addresses: [],
    };

    users[normalEmail] = {
      user: newUser,
      passwordHash: simpleHash(password),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    sessionStorage.setItem(SESSION_KEY, normalEmail);
    localStorage.setItem(PERSIST_KEY, normalEmail); // new users auto-remembered
    setUser(newUser);
    return { ok: true };
  }, []);

  const signIn = useCallback(async (email: string, password: string, rememberMe?: boolean): Promise<{ ok: boolean; error?: string }> => {
    setError("");
    const normalEmail = email.toLowerCase().trim();

    const users = getUsers();
    const record = users[normalEmail];

    if (!record) {
      const msg = "No account found with this email. Please sign up first.";
      setError(msg);
      return { ok: false, error: msg };
    }

    if (record.passwordHash !== simpleHash(password)) {
      const msg = "Incorrect password. Please try again.";
      setError(msg);
      return { ok: false, error: msg };
    }

    sessionStorage.setItem(SESSION_KEY, normalEmail);
    if (rememberMe) {
      localStorage.setItem(PERSIST_KEY, normalEmail);
    } else {
      localStorage.removeItem(PERSIST_KEY);
    }
    setUser(record.user);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      const users = getUsers();
      if (users[prev.email]) {
        users[prev.email].user = updated;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut, updateProfile, error }}>
      {children}
    </AuthContext.Provider>
  );
}
