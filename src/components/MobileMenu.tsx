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
          <Link href="/" onClick={handleClose} className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="58" stroke="#C9A84C" strokeWidth="2.5" />
              <circle cx="60" cy="60" r="50" stroke="#C9A84C" strokeWidth="1" opacity="0.4" />
              <path d="M52 40C42.5 42 36 50 36 60C36 70 42.5 78 52 80" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M68 40C77.5 42 84 50 84 60C84 70 77.5 78 68 80" stroke="#D4AF37" strokeWidth="5" strokeLinecap="round" fill="none" />
              <rect x="56" y="28" width="8" height="8" rx="1" transform="rotate(45 60 32)" fill="#F5D680" />
              <rect x="56" y="84" width="8" height="8" rx="1" transform="rotate(45 60 88)" fill="#F5D680" />
            </svg>
            <span className="font-serif text-xl tracking-[0.15em] text-gold">CLONICA</span>
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
              target="_blank"
              rel="noopener"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0088cc]/10 text-[#0088cc] text-sm font-medium hover:bg-[#0088cc]/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
