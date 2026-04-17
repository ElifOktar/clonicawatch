"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const ADMIN_PIN = "clonica2026";
const AUTH_KEY = "clonicawatch_admin_auth";

interface AuthCtx {
  authed: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({ authed: false, login: () => false, logout: () => {} });

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY);
    if (stored === "1") setAuthed(true);
    setHydrated(true);
  }, []);

  const login = (pin: string) => {
    if (pin === ADMIN_PIN) {
      setAuthed(true);
      sessionStorage.setItem(AUTH_KEY, "1");
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthed(false);
    sessionStorage.removeItem(AUTH_KEY);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-ink-muted">Loading...</div>
      </div>
    );
  }

  return <Ctx.Provider value={{ authed, login, logout }}>{children}</Ctx.Provider>;
}

export function useAdminAuth() {
  return useContext(Ctx);
}

export function AdminLoginGate({ children }: { children: ReactNode }) {
  const { authed, login } = useAdminAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="text-gold text-3xl font-bold tracking-widest mb-2">CLONICA</div>
          <div className="text-ink-muted text-sm">Admin Panel</div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!login(pin)) {
              setError(true);
              setTimeout(() => setError(false), 2000);
            }
          }}
        >
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN giriniz"
            className={`w-full bg-bg-elev border rounded-lg px-4 py-3 text-center text-lg tracking-[0.5em] focus:outline-none transition-colors ${
              error ? "border-red-500 text-red-400" : "border-line focus:border-gold"
            }`}
            autoFocus
          />
          {error && (
            <p className="text-red-400 text-sm text-center mt-2">Yanlis PIN</p>
          )}
          <button className="w-full mt-4 bg-gold hover:bg-gold-bright text-bg font-semibold py-3 rounded-lg transition-colors">
            Giris
          </button>
        </form>
      </div>
    </div>
  );
}
