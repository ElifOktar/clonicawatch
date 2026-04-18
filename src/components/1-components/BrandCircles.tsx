"use client";

import Link from "next/link";
import { useRef } from "react";

const BRANDS = [
  { name: "Rolex", slug: "rolex", logo: "/images/logos/brands/rolex.png" },
  { name: "Patek Philippe", slug: "patek-philippe", logo: "/images/logos/brands/patek-philippe.png" },
  { name: "Audemars Piguet", slug: "audemars-piguet", logo: "/images/logos/brands/audemars-piguet.png" },
  { name: "Cartier", slug: "cartier", logo: "/images/logos/brands/cartier.png" },
  { name: "Richard Mille", slug: "richard-mille", logo: "/images/logos/brands/richard-mille.webp" },
  { name: "Omega", slug: "omega", logo: "/images/logos/brands/omega.png" },
  { name: "Hublot", slug: "hublot", logo: "/images/logos/brands/hublot.png" },
  { name: "Breitling", slug: "breitling", logo: "/images/logos/brands/breitling.png" },
  { name: "TAG Heuer", slug: "tag-heuer", logo: "/images/logos/brands/tag-heuer.png" },
  { name: "Panerai", slug: "panerai", logo: "/images/logos/brands/panerai.png" },
  { name: "IWC", slug: "iwc", logo: "/images/logos/brands/iwc.png" },
  { name: "Tudor", slug: "tudor", logo: "/images/logos/brands/tudor.png" },
  { name: "Vacheron Constantin", slug: "vacheron-constantin", logo: "/images/logos/brands/vacheron-constantin.png" },
  { name: "Jaeger-LeCoultre", slug: "jaeger-lecoultre", logo: "/images/logos/brands/jaeger-lecoultre.png" },
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
        <div className="flex items-center gap-3 md:gap-4">
          {/* Left scroll button */}
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-bg border border-line text-ink-muted hover:text-gold hover:border-gold transition-colors flex items-center justify-center"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Brand circles */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex gap-5 md:gap-6 px-1 py-2">
              {BRANDS.map((brand) => (
                <Link
                  key={brand.slug}
                  href={"/brand/" + brand.slug}
                  className="flex flex-col items-center gap-2.5 flex-shrink-0 group"
                >
                  <div className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-full bg-white border-2 border-gold/20 flex items-center justify-center group-hover:border-gold group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] transition-all duration-300 overflow-hidden p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name + " logo"}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[11px] text-ink-muted text-center w-20 truncate group-hover:text-gold transition-colors">
                    {brand.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right scroll button */}
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-bg border border-line text-ink-muted hover:text-gold hover:border-gold transition-colors flex items-center justify-center"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
