"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_CONFIG } from "@/lib/config";
import { CATALOG_BRANDS, LADIES_BRANDS } from "@/lib/catalog";
import type { CatalogBrand } from "@/lib/catalog";

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
  const [showBrands, setShowBrands] = useState(true);
  const [showLadies, setShowLadies] = useState(false);

  const toggleBrand = (slug: string) => {
    setExpandedBrand(expandedBrand === slug ? null : slug);
  };

  const handleClose = () => {
    setShowBrands(true);
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
          {/* Browse Brands Section */}
          <div className="px-2 pt-3 pb-2">
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

          {/* Divider */}
          <div className="mx-5 border-t border-line/50" />

          {/* Ladies Watches Section */}
          <div className="px-2 pt-2 pb-2">
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
