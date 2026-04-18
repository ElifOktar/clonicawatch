"use client";

import Link from "next/link";
import { useState } from "react";

const BRANDS = [
  { name: "Rolex", slug: "rolex", logo: "/images/logos/brands/rolex.png", abbr: "RX" },
  { name: "Audemars Piguet", slug: "audemars-piguet", logo: "/images/logos/brands/audemars-piguet.png", abbr: "AP" },
  { name: "Patek Philippe", slug: "patek-philippe", logo: "/images/logos/brands/patek-philippe.png", abbr: "PP" },
  { name: "Cartier", slug: "cartier", logo: "/images/logos/brands/cartier.png", abbr: "CR" },
  { name: "Richard Mille", slug: "richard-mille", logo: "/images/logos/brands/richard-mille.webp", abbr: "RM" },
  { name: "Hublot", slug: "hublot", logo: "/images/logos/brands/hublot.png", abbr: "HB" },
  { name: "Breitling", slug: "breitling", logo: "/images/logos/brands/breitling.png", abbr: "BL" },
  { name: "Franck Muller", slug: "franck-muller", logo: "/images/logos/brands/franck-muller.png", abbr: "FM" },
  { name: "IWC", slug: "iwc", logo: "/images/logos/brands/iwc.png", abbr: "IWC" },
  { name: "Panerai", slug: "panerai", logo: "/images/logos/brands/panerai.png", abbr: "PN" },
  { name: "Tudor", slug: "tudor", logo: "/images/logos/brands/tudor.png", abbr: "TD" },
  { name: "Vacheron Constantin", slug: "vacheron-constantin", logo: "/images/logos/brands/vacheron-constantin.png", abbr: "VC" },
  { name: "Ladies", slug: "ladies", logo: "", abbr: "" },
];

function BrandLogo({ brand }: { brand: typeof BRANDS[number] }) {
  const [failed, setFailed] = useState(false);

  if (!brand.logo) {
    return (
      <svg className="w-6 h-6 md:w-8 md:h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    );
  }

  if (failed) {
    return (
      <span className="text-xs md:text-sm font-serif font-bold text-gray-700 tracking-wider">
        {brand.abbr}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logo}
      alt={brand.name + " logo"}
      className="w-full h-full object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function BrandCircles() {
  return (
    <section className="bg-bg-elev border-y border-line py-4 md:py-8">
      <div className="container">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Left scroll button — desktop only */}
          <button
            onClick={() => {
              const el = document.getElementById("brand-scroll");
              el?.scrollBy({ left: -200, behavior: "smooth" });
            }}
            className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-bg border border-line text-ink-muted hover:text-gold hover:border-gold transition-colors items-center justify-center"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Brand circles — touch-scrollable */}
          <div
            id="brand-scroll"
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-3 md:gap-6 px-1 py-2">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={brand.slug === "ladies" ? "/ladies" : "/brand/" + brand.slug}
                  className="flex flex-col items-center gap-1.5 md:gap-2 flex-shrink-0 group"
                >
                  <div className={`w-[52px] h-[52px] md:w-20 md:h-20 rounded-full ${brand.logo ? "bg-white" : "bg-pink-500/10"} border-2 ${brand.slug === "ladies" ? "border-pink-400/30 group-hover:border-pink-400" : "border-gold/20 group-hover:border-gold"} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300 overflow-hidden p-2 md:p-3`}>
                    <BrandLogo brand={brand} />
                  </div>
                  <p className="text-[9px] md:text-[11px] text-ink-muted text-center w-14 md:w-20 truncate group-hover:text-gold transition-colors">
                    {brand.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right scroll button — desktop only */}
          <button
            onClick={() => {
              const el = document.getElementById("brand-scroll");
              el?.scrollBy({ left: 200, behavior: "smooth" });
            }}
            className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-bg border border-line text-ink-muted hover:text-gold hover:border-gold transition-colors items-center justify-center"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style jsx>{"\n        .scrollbar-hide {\n          -ms-overflow-style: none;\n          scrollbar-width: none;\n        }\n        .scrollbar-hide::-webkit-scrollbar {\n          display: none;\n        }\n      "}</style>
    </section>
  );
}
