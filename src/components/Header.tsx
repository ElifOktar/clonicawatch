"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { SITE_CONFIG } from "@/lib/config";
import { CurrencySwitcher } from "@/components/CurrencyProvider";
import { SearchModal } from "@/components/SearchModal";
import { getAllProducts } from "@/lib/products";

export function Header() {
  const { itemCount, isHydrated: cartHydrated } = useCart();
  const { items: wishItems, isHydrated: wishHydrated } = useWishlist();
  const products = getAllProducts();

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-line">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl tracking-[0.2em] text-gold">
          {SITE_CONFIG.name}
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/" className="hover:text-gold transition-colors">Shop</Link>
          <Link href="/new-arrivals" className="hover:text-gold transition-colors">New Arrivals</Link>
          <Link href="/on-sale" className="text-gold/90 hover:text-gold transition-colors">Sale</Link>
          <Link href="/blog" className="hover:text-gold transition-colors">Journal</Link>
          <Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-3">
          <SearchModal products={products} />
          <CurrencySwitcher />

          <a
            href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
            target="_blank" rel="noopener"
            className="hidden sm:inline text-sm hover:text-gold"
            aria-label="WhatsApp"
          >💬</a>

          <Link href="/wishlist" className="relative text-sm hover:text-gold" aria-label="Wishlist">
            ♡
            {wishHydrated && wishItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-[#1a1510] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {wishItems.length}
              </span>
            )}
          </Link>

          <Link href="/cart" className="relative text-sm hover:text-gold" aria-label="Cart">
            🛒
            {cartHydrated && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-[#1a1510] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
