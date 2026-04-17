"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";
import { useAuth } from "@/components/AuthProvider";
import { SITE_CONFIG } from "@/lib/config";
import { CurrencySwitcher } from "@/components/CurrencyProvider";
import { SearchModal } from "@/components/SearchModal";
import { AuthModal } from "@/components/AuthModal";
import { getAllProducts } from "@/lib/products";
import { MobileMenu } from "@/components/MobileMenu";

export function Header({ onMobileMenuOpen }: { onMobileMenuOpen?: () => void }) {
  const { itemCount, isHydrated: cartHydrated } = useCart();
  const { items: wishItems, isHydrated: wishHydrated } = useWishlist();
  const { user, signOut } = useAuth();
  const products = getAllProducts();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuth = (tab: "signin" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
    onMobileMenuOpen?.();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-line">
        <div className="container flex items-center justify-between h-16 gap-4">
          {/* Hamburger Menu Button - visible on all screen sizes */}
          <button
            onClick={handleMobileMenuOpen}
            className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-gold hover:bg-bg-elev transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            {/* CC Monogram Logo */}
            <svg width="38" height="38" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              {/* Outer circle */}
              <circle cx="60" cy="60" r="58" stroke="url(#gold-grad)" strokeWidth="2.5" />
              {/* Inner circle */}
              <circle cx="60" cy="60" r="50" stroke="url(#gold-grad)" strokeWidth="1" opacity="0.4" />
              {/* Left C */}
              <path d="M52 40C42.5 42 36 50 36 60C36 70 42.5 78 52 80" stroke="url(#gold-grad)" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Right C (mirrored) */}
              <path d="M68 40C77.5 42 84 50 84 60C84 70 77.5 78 68 80" stroke="url(#gold-grad)" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Diamond accent */}
              <rect x="56" y="28" width="8" height="8" rx="1" transform="rotate(45 60 32)" fill="url(#gold-grad)" />
              {/* Bottom diamond */}
              <rect x="56" y="84" width="8" height="8" rx="1" transform="rotate(45 60 88)" fill="url(#gold-grad)" />
              <defs>
                <linearGradient id="gold-grad" x1="0" y1="0" x2="120" y2="120">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="50%" stopColor="#F5D680" />
                  <stop offset="100%" stopColor="#C9A84C" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-serif text-xl md:text-2xl tracking-[0.2em] text-gold group-hover:text-gold-bright transition-colors">
              {SITE_CONFIG.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm flex-1 justify-center">
            <Link href="/" className="hover:text-gold transition-colors">Shop</Link>
            <Link href="/new-arrivals" className="hover:text-gold transition-colors">New Arrivals</Link>
            <Link href="/ladies" className="hover:text-gold transition-colors">Ladies</Link>
            <Link href="/on-sale" className="text-gold/90 hover:text-gold transition-colors">Sale</Link>
            <Link href="/blog" className="hover:text-gold transition-colors">News</Link>
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

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-sm hover:text-gold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="hidden sm:inline text-xs">{user.name.split(" ")[0]}</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-bg-elev border border-line rounded-lg shadow-xl z-50 py-1">
                      <div className="px-4 py-2 border-b border-line">
                        <p className="text-xs font-medium text-ink">{user.name}</p>
                        <p className="text-[10px] text-ink-muted">{user.email}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-ink-muted hover:text-gold hover:bg-bg-soft transition-colors" onClick={() => setUserMenuOpen(false)}>
                        My Account
                      </Link>
                      <Link href="/account/orders" className="block px-4 py-2 text-sm text-ink-muted hover:text-gold hover:bg-bg-soft transition-colors" onClick={() => setUserMenuOpen(false)}>
                        Orders
                      </Link>
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-ink-muted hover:text-danger hover:bg-bg-soft transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth("signin")}
                className="text-sm hover:text-gold transition-colors"
                aria-label="Sign In"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
            )}

            <Link href="/wishlist" className="relative text-sm hover:text-gold" aria-label="Wishlist">
              ♡
              {wishHydrated && wishItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-[#0a0e17] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {wishItems.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-sm hover:text-gold" aria-label="Cart">
              🛒
              {cartHydrated && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-[#0a0e17] text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
