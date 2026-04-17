"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

const KEY = "clonica_wishlist_v1";

type Ctx = {
  items: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isHydrated: boolean;
};
const WishlistContext = createContext<Ctx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (!isHydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, isHydrated]);

  const value = useMemo<Ctx>(() => ({
    items,
    isHydrated,
    has: (id) => items.includes(id),
    toggle: (id) => setItems((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]),
    remove: (id) => setItems((prev) => prev.filter(x => x !== id)),
    clear: () => setItems([]),
  }), [items, isHydrated]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const c = useContext(WishlistContext);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
