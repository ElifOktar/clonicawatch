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
import type { Product } from "@/types/product";

const LOCAL_KEY = "hanic_cart_v1";

export type CartItem = {
  productId: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  isHydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* ── Supabase'den cart yükle ── */
  const loadFromSupabase = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    const { data } = await sb
      .from("cart")
      .select("product_id, qty")
      .eq("user_id", userId);
    if (data) {
      setItems(
        data.map((r: { product_id: string; qty: number }) => ({
          productId: r.product_id,
          qty: r.qty,
        }))
      );
    }
  }, []);

  /* ── localStorage → Supabase migrasyon ── */
  const migrateLocalToSupabase = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return;
      const localItems: CartItem[] = JSON.parse(raw);
      if (localItems.length === 0) return;

      // Mevcut Supabase verisini al
      const { data: existing } = await sb
        .from("cart")
        .select("product_id")
        .eq("user_id", userId);
      const existingIds = new Set(
        (existing || []).map((r: { product_id: string }) => r.product_id)
      );

      // Sadece yeni olanları ekle
      const toInsert = localItems
        .filter((item) => !existingIds.has(item.productId))
        .map((item) => ({
          user_id: userId,
          product_id: item.productId,
          qty: item.qty,
        }));

      if (toInsert.length > 0) {
        await sb.from("cart").insert(toInsert);
      }

      // localStorage temizle
      localStorage.removeItem(LOCAL_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  /* ── Hydration ── */
  useEffect(() => {
    if (user) {
      migrateLocalToSupabase(user.id).then(() => {
        loadFromSupabase(user.id).then(() => setIsHydrated(true));
      });
    } else {
      try {
        const raw = localStorage.getItem(LOCAL_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
      setIsHydrated(true);
    }
  }, [user, loadFromSupabase, migrateLocalToSupabase]);

  /* ── Anonymous: localStorage persist ── */
  useEffect(() => {
    if (!isHydrated || user) return;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
    } catch {}
  }, [items, isHydrated, user]);

  /* ── addItem ── */
  const addItem = useCallback(
    async (productId: string, qty = 1) => {
      if (user) {
        const sb = getPublicClient();
        if (!sb) return;
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          const newQty = existing.qty + qty;
          await sb
            .from("cart")
            .update({ qty: newQty, updated_at: new Date().toISOString() })
            .eq("user_id", user.id)
            .eq("product_id", productId);
          setItems((prev) =>
            prev.map((i) =>
              i.productId === productId ? { ...i, qty: newQty } : i
            )
          );
        } else {
          await sb
            .from("cart")
            .insert({ user_id: user.id, product_id: productId, qty });
          setItems((prev) => [...prev, { productId, qty }]);
        }
      } else {
        setItems((prev) => {
          const ex = prev.find((i) => i.productId === productId);
          if (ex) {
            return prev.map((i) =>
              i.productId === productId ? { ...i, qty: i.qty + qty } : i
            );
          }
          return [...prev, { productId, qty }];
        });
      }
    },
    [user, items]
  );

  /* ── removeItem ── */
  const removeItem = useCallback(
    async (productId: string) => {
      if (user) {
        const sb = getPublicClient();
        if (!sb) return;
        await sb
          .from("cart")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
      }
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    },
    [user]
  );

  /* ── updateQty ── */
  const updateQty = useCallback(
    async (productId: string, qty: number) => {
      if (qty <= 0) {
        return removeItem(productId);
      }
      if (user) {
        const sb = getPublicClient();
        if (!sb) return;
        await sb
          .from("cart")
          .update({ qty, updated_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("product_id", productId);
        setItems((prev) =>
          prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
        );
      } else {
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) =>
                i.productId === productId ? { ...i, qty } : i
              )
        );
      }
    },
    [user, removeItem]
  );

  /* ── clear ── */
  const clearAll = useCallback(async () => {
    if (user) {
      const sb = getPublicClient();
      if (!sb) return;
      await sb.from("cart").delete().eq("user_id", user.id);
    }
    setItems([]);
  }, [user]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    return {
      items,
      itemCount,
      isHydrated,
      addItem,
      removeItem,
      updateQty,
      clear: clearAll,
    };
  }, [items, isHydrated, addItem, removeItem, updateQty, clearAll]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// Helper to resolve items with full Product data (degismedi)
export function resolveCartItems(
  items: CartItem[],
  allProducts: Product[]
): { product: Product; qty: number }[] {
  return items
    .map((i) => {
      const product = allProducts.find((p) => p.id === i.productId);
      return product ? { product, qty: i.qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);
}
