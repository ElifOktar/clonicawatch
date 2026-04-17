"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const { signIn, signUp, error } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    let success = false;
    if (tab === "signin") {
      success = await signIn(email, password);
    } else {
      success = await signUp(email, password, name);
    }

    setLoading(false);
    if (success) {
      setEmail("");
      setPassword("");
      setName("");
      onClose();
    } else {
      setLocalError(error);
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-bg-elev border border-line rounded-xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className="font-serif text-2xl text-ink mb-1">
            {tab === "signin" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-ink-muted text-sm">
            {tab === "signin"
              ? "Sign in to track your orders and wishlist"
              : "Join Clonica for a personalized experience"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line mx-6 mt-4">
          <button
            onClick={() => { setTab("signin"); setLocalError(""); }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              tab === "signin"
                ? "border-gold text-gold"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab("signup"); setLocalError(""); }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
              tab === "signup"
                ? "border-gold text-gold"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {displayError && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm px-4 py-2.5 rounded-lg">
              {displayError}
            </div>
          )}

          {tab === "signup" && (
            <div>
              <label className="block text-xs text-ink-muted mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-ink-muted mb-1.5 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-ink-muted mb-1.5 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-3.5 text-sm font-semibold"
          >
            {loading
              ? "Please wait..."
              : tab === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
