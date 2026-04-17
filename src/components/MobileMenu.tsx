"use client";

import Link from "next/link";
import { useState } from "react";

interface BrandWithCollections {
  name: string;
  slug: string;
  collections?: Array<{
    name: string;
    slug: string;
  }>;
}

const BRANDS: BrandWithCollections[] = [
  {
    name: "Rolex",
    slug: "rolex",
    collections: [
      { name: "Submariner", slug: "submariner" },
      { name: "Daytona", slug: "daytona" },
      { name: "Datejust", slug: "datejust" },
      { name: "GMT-Master II", slug: "gmt-master-ii" },
      { name: "Day-Date", slug: "day-date" },
      { name: "Explorer", slug: "explorer" },
      { name: "Sky-Dweller", slug: "sky-dweller" },
      { name: "Yacht-Master", slug: "yacht-master" },
    ],
  },
  {
    name: "Audemars Piguet",
    slug: "audemars-piguet",
    collections: [
      { name: "Royal Oak", slug: "royal-oak" },
      { name: "Royal Oak Offshore", slug: "royal-oak-offshore" },
      { name: "Code 11.59", slug: "code-11-59" },
    ],
  },
  {
    name: "Patek Philippe",
    slug: "patek-philippe",
    collections: [
      { name: "Nautilus", slug: "nautilus" },
      { name: "Aquanaut", slug: "aquanaut" },
      { name: "Calatrava", slug: "calatrava" },
      { name: "Complications", slug: "complications" },
    ],
  },
  {
    name: "Omega",
    slug: "omega",
    collections: [
      { name: "Seamaster", slug: "seamaster" },
      { name: "Speedmaster", slug: "speedmaster" },
      { name: "Constellation", slug: "constellation" },
      { name: "De Ville", slug: "de-ville" },
      { name: "Aqua Terra", slug: "aqua-terra" },
      { name: "Globemaster", slug: "globemaster" },
    ],
  },
  { name: "Hublot", slug: "hublot" },
  { name: "Breitling", slug: "breitling" },
  { name: "Cartier", slug: "cartier" },
  { name: "TAG Heuer", slug: "tag-heuer" },
  { name: "Panerai", slug: "panerai" },
  { name: "IWC", slug: "iwc" },
  { name: "Richard Mille", slug: "richard-mille" },
  { name: "Tudor", slug: "tudor" },
  { name: "Vacheron Constantin", slug: "vacheron-constantin" },
  { name: "Jaeger-LeCoultre", slug: "jaeger-lecoultre" },
];

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const toggleBrand = (slug: string) => {
    setExpandedBrand(expandedBrand === slug ? null : slug);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 bg-bg border-r border-line z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-bg border-b border-line flex items-center justify-between h-16 px-6">
          <h2 className="text-gold font-serif text-lg tracking-[0.15em]">BRANDS</h2>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Brands List */}
        <nav className="py-4">
          {BRANDS.map((brand) => (
            <div key={brand.slug}>
              <div className="flex items-center justify-between px-6 py-3 hover:bg-bg-elev transition-colors">
                {brand.collections && brand.collections.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleBrand(brand.slug)}
                      className="flex-1 text-left text-sm text-gold hover:text-gold transition-colors font-medium"
                    >
                      {brand.name}
                    </button>
                    <button
                      onClick={() => toggleBrand(brand.slug)}
                      className="ml-2 text-ink-muted hover:text-gold transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform ${
                          expandedBrand === brand.slug ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/brand/${brand.slug}`}
                    onClick={onClose}
                    className="flex-1 text-sm text-gold hover:text-gold/80 transition-colors font-medium"
                  >
                    {brand.name}
                  </Link>
                )}
              </div>

              {/* Collections Accordion */}
              {brand.collections && brand.collections.length > 0 && expandedBrand === brand.slug && (
                <div className="bg-bg-soft/30 border-t border-line/30">
                  {brand.collections.map((collection) => (
                    <Link
                      key={collection.slug}
                      href={`/brand/${brand.slug}?collection=${collection.slug}`}
                      onClick={onClose}
                      className="block px-12 py-2.5 text-xs text-ink-muted hover:text-gold hover:bg-bg-elev transition-colors border-b border-line/20 last:border-b-0"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
