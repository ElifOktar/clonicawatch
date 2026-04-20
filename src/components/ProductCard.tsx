"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";
import { Price } from "@/components/Price";
import { WishlistButton } from "@/components/WishlistButton";

const PLACEHOLDER = "/images/placeholder-watch.svg";

export function ProductCard({ product: p }: { product: Product }) {
  const initial = p.main_image || PLACEHOLDER;
  const [src, setSrc] = useState(initial);
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
          <h3 className="mt-1 text-sm md:text-sm font-medium line-clamp-2 min-h-[2.5rem] md:min-h-[2.5rem]">
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
      <div className="absolute top-3 right-3">
        <WishlistButton productId={p.id} />
      </div>
    </div>
  );
}
