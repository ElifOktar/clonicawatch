"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { Price } from "@/components/Price";
import { WishlistButton } from "@/components/WishlistButton";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";
import { trackAddToCart } from "@/components/Analytics";

const PLACEHOLDER = "/images/placeholder-watch.svg";

export function ProductCard({ product: p }: { product: Product }) {
  const initial = p.main_image || PLACEHOLDER;
  const [src, setSrc] = useState(initial);
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [cartAdded, setCartAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(p.id, 1);
    trackAddToCart({
      id: p.id,
      brand: p.brand,
      model_name: p.model_name,
      collection: p.collection || "",
      price_usd: p.price.usd,
      quantity: 1,
    });
    setCartAdded(true);
    showToast("Added to cart!", "success");
    setTimeout(() => setCartAdded(false), 2000);
  };

  return (
    <div className="group relative">
      <Link href={`/product/${p.slug}`} className="block card overflow-hidden transition-all hover:border-gold-deep">
        <div className="relative aspect-square bg-bg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={p.model_name}
            loading="lazy"
            onError={() => src !== PLACEHOLDER && setSrc(PLACEHOLDER)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {p.is_new_arrival && <span className="chip-gold">NEW</span>}
            {p.is_on_sale && (
              <span className="chip bg-danger/20 border-danger/40 text-danger">SALE</span>
            )}
          </div>
          {p.stock_status === "Sold Out" && (
            <div className="absolute inset-0 bg-bg/70 flex items-center justify-center">
              <span className="chip">SOLD OUT</span>
            </div>
          )}
        </div>
        <div className="p-4 md:p-4 flex flex-col min-h-[120px] md:min-h-auto">
          <p className="text-xs md:text-xs text-ink-dim tracking-widest uppercase">{p.brand}</p>
          <h3 className="mt-1 text-[11px] md:text-xs font-medium leading-snug">
            {p.model_name}
          </h3>
          <div className="mt-3 flex items-baseline gap-2 min-h-[44px] md:min-h-auto flex items-center">
            <Price usd={p.price.usd} className="text-gold font-medium text-base md:text-base" />
            {p.original_price?.usd && (
              <Price usd={p.original_price.usd} className="text-ink-dim text-xs line-through" />
            )}
          </div>
        </div>
      </Link>
      {/* Wishlist — top right */}
      <div className="absolute top-3 right-3">
        <WishlistButton productId={p.id} />
      </div>
      {/* Add to Cart — bottom right */}
      {p.stock_status !== "Sold Out" && (
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 text-ink-muted hover:text-gold transition-colors duration-200"
          title="Add to Cart"
          aria-label="Add to cart"
        >
          {cartAdded ? (
            <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

