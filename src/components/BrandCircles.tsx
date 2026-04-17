"use client";

import Link from "next/link";
import { useRef } from "react";

const BRANDS = [
  { name: "Rolex", slug: "rolex" },
  { name: "Patek Philippe", slug: "patek-philippe" },
  { name: "Audemars Piguet", slug: "audemars-piguet" },
  { name: "Cartier", slug: "cartier" },
  { name: "Richard Mille", slug: "richard-mille" },
  { name: "Omega", slug: "omega" },
  { name: "Hublot", slug: "hublot" },
  { name: "Breitling", slug: "breitling" },
  { name: "TAG Heuer", slug: "tag-heuer" },
  { name: "Panerai", slug: "panerai" },
  { name: "IWC", slug: "iwc" },
  { name: "Tudor", slug: "tudor" },
];

export function BrandCircles() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-bg-elev border-y border-line py-8">
      <div className="container">
        <div className="flex items-center gap-4">
          {/* Left scroll button */}
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-bg border border-line text-ink-muted hover:text-gold hover:border-gold transition-colors flex items-center justify-center"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Brand circles */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-6 px-2 py-2">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brand/${brand.slug}`}
                  className="flex flex-col items-center gap-3 flex-shrink-0 group"
                >
                  <div className="w-20 h-20 rounded-full bg-bg border-2 border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:bg-bg-elev transition-all duration-200">
                    <span className="text-center text-[10px] font-medium text-gold text-opacity-70 group-hover:text-opacity-100 transition-all px-2 leading-tight">
                      {brand.name}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted text-center w-20 truncate group-hover:text-gold transition-colors">
                    {brand.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-bg border border-line text-ink-muted hover:text-gold hover:border-gold transition-colors flex items-center justify-center"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
