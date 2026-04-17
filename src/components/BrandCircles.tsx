"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const BRANDS = [
  { name: "Rolex", slug: "rolex", logo: "/images/brands/rolex.svg" },
  { name: "Patek Philippe", slug: "patek-philippe", logo: "/images/brands/patek-philippe.svg" },
  { name: "Audemars Piguet", slug: "audemars-piguet", logo: "/images/brands/audemars-piguet.svg" },
  { name: "Cartier", slug: "cartier", logo: "/images/brands/cartier.svg" },
  { name: "Richard Mille", slug: "richard-mille", logo: "/images/brands/richard-mille.svg" },
  { name: "Omega", slug: "omega", logo: "/images/brands/omega.svg" },
  { name: "Hublot", slug: "hublot", logo: "/images/brands/hublot.svg" },
  { name: "Breitling", slug: "breitling", logo: "/images/brands/breitling.svg" },
  { name: "TAG Heuer", slug: "tag-heuer", logo: "/images/brands/tag-heuer.svg" },
  { name: "Panerai", slug: "panerai", logo: "/images/brands/panerai.svg" },
  { name: "IWC", slug: "iwc", logo: "/images/brands/iwc.svg" },
  { name: "Tudor", slug: "tudor", logo: "/images/brands/tudor.svg" },
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
                  href={"/brand/" + brand.slug}
                  className="flex flex-col items-center gap-3 flex-shrink-0 group"
                >
                  <div className="w-20 h-20 rounded-full bg-[#1a1a2e] border-2 border-gold/30 flex items-center justify-center group-hover:border-gold group-hover:bg-[#1f1f35] transition-all duration-200 overflow-hidden p-2">
                    <Image
                      src={brand.logo}
                      alt={brand.name + " logo"}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
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
      <style jsx>{"\n        .scrollbar-hide {\n          -ms-overflow-style: none;\n          scrollbar-width: none;\n        }\n        .scrollbar-hide::-webkit-scrollbar {\n          display: none;\n        }\n      "}</style>
    </section>
  );
}
