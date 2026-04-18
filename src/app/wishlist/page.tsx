"use client";

import Link from "next/link";
import { useWishlist } from "@/components/WishlistProvider";
import { ProductGrid } from "@/components/ProductGrid";
import { useState, useEffect } from "react";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const { items, clear, isHydrated } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API (client-side)
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setAllProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const products = allProducts.filter((p) => items.includes(p.id));

  if (!isHydrated || loading) {
    return <div className="container py-20 text-center text-ink-muted">Loading…</div>;
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="h-serif text-4xl">Your Wishlist</h1>
        {products.length > 0 && (
          <button onClick={clear} className="text-sm text-ink-muted hover:text-danger">Clear all</button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-muted text-lg">Your wishlist is empty.</p>
          <Link href="/" className="btn-gold mt-6 inline-flex">Browse Watches</Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
