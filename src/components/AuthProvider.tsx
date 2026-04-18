"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
  error: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signUp: async () => false,
  signIn: async () => false,
  signOut: () => {},
  updateProfile: () => {},
  error: "",
});

export function useAuth() {
  return useContext(AuthContext);
}

const STORAGE_KEY = "clonica_users";
const SESSION_KEY = "clonica_session";

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

  // Restore session
  useEffect(() => {
    try {
      const sessionEmail = sessionStorage.getItem(SESSION_KEY);
      if (sessionEmail) {
        const users = getUsers();
        if (users[sessionEmail]) {
          setUser(users[sessionEmail].user);
        }
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    setError("");
    const normalEmail = email.toLowerCase().trim();

    if (!normalEmail || !password || !name.trim()) {
      setError("Please fill in all fields");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    const users = getUsers();
    if (users[normalEmail]) {
      setError("An account with this email already exists");
      return false;
    }

    const newUser: User = {
      id: `usr_${Date.now().toString(36)}`,
      email: normalEmail,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    users[normalEmail] = {
      user: newUser,
      passwordHash: simpleHash(password),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    sessionStorage.setItem(SESSION_KEY, normalEmail);
    setUser(newUser);
    return true;
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError("");
    const normalEmail = email.toLowerCase().trim();

    const users = getUsers();
    const record = users[normalEmail];

    if (!record) {
      setError("No account found with this email");
      return false;
    }

    if (record.passwordHash !== simpleHash(password)) {
      setError("Incorrect password");
      return false;
    }

    sessionStorage.setItem(SESSION_KEY, normalEmail);
    setUser(record.user);
    return true;
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
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
