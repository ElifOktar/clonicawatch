"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_CONFIG } from "@/lib/config";
import { CATALOG_BRANDS, LADIES_BRANDS } from "@/lib/catalog";
import type { CatalogBrand } from "@/lib/catalog";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
  { label: "Shop All", href: "/", icon: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" },
  { label: "New Arrivals", href: "/new-arrivals", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" },
  { label: "Ladies Watches", href: "/ladies", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { label: "Sale", href: "/on-sale", icon: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" },
  { label: "News & Blog", href: "/blog", icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" },
];

const INFO_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Shipping", href: "/shipping" },
  { label: "Track Order", href: "/tracking" },
  { label: "Payment Methods", href: "/payment" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

function BrandList({
  brands,
  expandedBrand,
  toggleBrand,
  onClose,
}: {
  brands: CatalogBrand[];
  expandedBrand: string | null;
  toggleBrand: (slug: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-0.5">
      {brands.map((brand) => (
        <div key={brand.slug}>
          <div className="flex items-center">
            {brand.collections && brand.collections.length > 0 ? (
              <button
                onClick={() => toggleBrand(brand.slug)}
                className="flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-gold hover:bg-gold/5 transition-all"
              >
                <span>{brand.name}</span>
                <svg
                  className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                    expandedBrand === brand.slug ? "rotate-180" : ""
                  }`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <Link
                href={`/brand/${brand.slug}`}
                onClick={onClose}
                className="flex-1 px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-gold hover:bg-gold/5 transition-all"
              >
                {brand.name}
              </Link>
            )}
          </div>

          {/* Collections */}
          {brand.collections && brand.collections.length > 0 && expandedBrand === brand.slug && (
            <div className="ml-3 pl-3 border-l border-line/40 space-y-0.5 pb-1">
              <Link
                href={`/brand/${brand.slug}`}
                onClick={onClose}
                className="block px-3 py-2 text-xs text-gold hover:bg-gold/5 rounded-lg transition-all font-medium"
              >
                View All {brand.name}
              </Link>
              {brand.collections.map((collection) => (
                <Link
                  key={collection.slug}
                  href={`/brand/${brand.slug}?collection=${collection.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-xs text-ink-muted hover:text-gold hover:bg-gold/5 rounded-lg transition-all"
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [showBrands, setShowBrands] = useState(false);
  const [showLadies, setShowLadies] = useState(false);

  const toggleBrand = (slug: string) => {
    setExpandedBrand(expandedBrand === slug ? null : slug);
  };

  const handleClose = () => {
    setShowBrands(false);
    setShowLadies(false);
    setExpandedBrand(null);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-[85vw] max-w-[320px] bg-bg z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-line flex items-center justify-between h-16 px-5">
          <Link href="/" onClick={handleClose} className="font-serif text-xl tracking-[0.15em] text-gold">
            CLONICAWATCH
          </Link>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-bg-elev flex items-center justify-center text-ink-muted hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Main Navigation */}
          <nav className="py-3 px-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                onClick={handleClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ink hover:text-gold hover:bg-gold/5 transition-all"
              >
                <svg className="w-5 h-5 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                <span className="font-medium">{link.label}</span>
                {link.label === "Sale" && (
                  <span className="ml-auto text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold tracking-wide">HOT</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Browse Brands Section */}
          <div className="px-2 pb-2">
            <button
              onClick={() => setShowBrands(!showBrands)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-ink hover:text-gold hover:bg-gold/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span className="font-medium">Browse Brands</span>
              </div>
              <svg
                className={`w-4 h-4 text-ink-muted transform transition-transform duration-200 ${showBrands ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showBrands && (
              <div className="ml-2 mr-1 mt-1 border-l-2 border-gold/20 pl-3">
                <BrandList
                  brands={CATALOG_BRANDS}
                  expandedBrand={expandedBrand}
                  toggleBrand={toggleBrand}
                  onClose={handleClose}
                />
              </div>
            )}
          </div>

          {/* Ladies Watches Section */}
          <div className="px-2 pb-2">
            <button
              onClick={() => setShowLadies(!showLadies)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-ink hover:text-gold hover:bg-gold/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-pink-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="font-medium">Ladies Watches</span>
              </div>
              <svg
                className={`w-4 h-4 text-ink-muted transform transition-transform duration-200 ${showLadies ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLadies && (
              <div className="ml-2 mr-1 mt-1 border-l-2 border-pink-400/20 pl-3">
                <BrandList
                  brands={LADIES_BRANDS}
                  expandedBrand={expandedBrand}
                  toggleBrand={toggleBrand}
                  onClose={handleClose}
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-line/50" />

          {/* Info Links */}
          <nav className="py-3 px-2">
            <p className="px-4 py-2 text-[10px] text-ink-dim tracking-[0.2em] uppercase font-medium">Information</p>
            {INFO_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className="block px-4 py-2.5 rounded-xl text-sm text-ink-muted hover:text-gold hover:bg-gold/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer - Contact */}
        <div className="flex-shrink-0 border-t border-line p-4">
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
              target="_blank"
              rel="noopener"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logos/social/whatsapp.jpg" alt="" className="w-5 h-5 rounded-full" />
              WhatsApp
            </a>
            <a
              href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
              target="_blank"
              rel="noopener"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0088cc]/10 text-[#0088cc] text-sm font-medium hover:bg-[#0088cc]/20 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logos/social/telegram.jpg" alt="" className="w-5 h-5 rounded-full" />
              Telegram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
