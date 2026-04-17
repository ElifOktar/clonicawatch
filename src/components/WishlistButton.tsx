"use client";
import { useWishlist } from "@/components/WishlistProvider";
import { cn } from "@/lib/cn";

export function WishlistButton({ productId, className }: { productId: string; className?: string }) {
  const { has, toggle, isHydrated } = useWishlist();
  const active = isHydrated && has(productId);
  return (
    <button
      onClick={(e) => { e.preventDefault(); toggle(productId); }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors",
        active ? "bg-gold/20 border-gold text-gold" : "border-line text-ink-muted hover:border-gold hover:text-gold",
        className
      )}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
