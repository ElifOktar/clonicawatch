"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { Product } from "@/types/product";

const STORAGE_KEY = "hanic_cart_v1";

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
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setIsHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, isHydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    return {
      items,
      itemCount,
      isHydrated,
      addItem: (productId, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === productId);
          if (existing) {
            return prev.map((i) =>
              i.productId === productId ? { ...i, qty: i.qty + qty } : i
            );
          }
          return [...prev, { productId, qty }];
        }),
      removeItem: (productId) =>
        setItems((prev) => prev.filter((i) => i.productId !== productId)),
      updateQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) =>
                i.productId === productId ? { ...i, qty } : i
              )
        ),
      clear: () => setItems([]),
    };
  }, [items, isHydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// Helper to resolve items with full Product data
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
