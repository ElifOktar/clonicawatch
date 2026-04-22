"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/components/AuthProvider";
import { getPublicClient } from "@/lib/supabase";

const LOCAL_KEY = "clonica_wishlist_v1";

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
  const { user } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* ── Supabase'den wishlist yukle ── */
  const loadFromSupabase = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    const { data } = await sb
      .from("wishlist")
      .select("product_id")
      .eq("user_id", userId);
    if (data) {
      setItems(data.map((r: { product_id: string }) => r.product_id));
    }
  }, []);

  /* ── localStorage → Supabase migrasyon ── */
  const migrateLocalToSupabase = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return;
      const localItems: string[] = JSON.parse(raw);
      if (localItems.length === 0) return;

      // Mevcut Supabase verisini al
      const { data: existing } = await sb
        .from("wishlist")
        .select("product_id")
        .eq("user_id", userId);
      const existingIds = new Set(
        (existing || []).map((r: { product_id: string }) => r.product_id)
      );

      // Sadece yeni olanlari ekle
      const toInsert = localItems
        .filter((id) => !existingIds.has(id))
        .map((product_id) => ({ user_id: userId, product_id }));

      if (toInsert.length > 0) {
        await sb.from("wishlist").insert(toInsert);
      }

      // localStorage temizle
      localStorage.removeItem(LOCAL_KEY);
    } catch {
      /* ignore migration errors */
    }
  }, []);

  /* ── Hydration: user varsa Supabase, yoksa localStorage ── */
  useEffect(() => {
    if (user) {
      // Once localStorage verisini tasi, sonra Supabase'den yukle
      migrateLocalToSupabase(user.id).then(() => {
        loadFromSupabase(user.id).then(() => setIsHydrated(true));
      });
    } else {
      // Anonymous: localStorage'dan oku
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
      setIsHydrated(true);
    }
  }, [user, loadFromSupabase, migrateLocalToSupabase]);

  /* ── Anonymous icin localStorage persist ── */
  useEffect(() => {
    if (!isHydrated || user) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch {}
  }, [items, isHydrated, user]);

  /* ── Toggle: Supabase veya localStorage ── */
  const toggle = useCallback(
    async (id: string) => {
      if (user) {
        const sb = getPublicClient();
        if (!sb) return;
        const isIn = items.includes(id);
        if (isIn) {
          await sb
            .from("wishlist")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", id);
          setItems((prev) => prev.filter((x) => x !== id));
        } else {
          await sb
            .from("wishlist")
            .insert({ user_id: user.id, product_id: id });
          setItems((prev) => [...prev, id]);
        }
      } else {
        // Anonymous: localStorage
        setItems((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
      }
    },
    [user, items]
  );

  const remove = useCallback(
    async (id: string) => {
      if (user) {
        const sb = getPublicClient();
        if (!sb) return;
        await sb
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);
      }
      setItems((prev) => prev.filter((x) => x !== id));
    },
    [user]
  );

  const clearAll = useCallback(async () => {
    if (user) {
      const sb = getPublicClient();
      if (!sb) return;
      await sb.from("wishlist").delete().eq("user_id", user.id);
    }
    setItems([]);
  }, [user]);

  const value = useMemo<Ctx>(
    () => ({
      items,
      isHydrated,
      has: (id) => items.includes(id),
      toggle,
      remove,
      clear: clearAll,
    }),
    [items, isHydrated, toggle, remove, clearAll]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const c = useContext(WishlistContext);
  if (!c) throw new Error("useWishlist must be used within WishlistProvider");
  return c;
}
