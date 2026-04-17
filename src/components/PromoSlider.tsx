"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export interface PromoSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

const DEFAULT_SLIDES: PromoSlide[] = [
  {
    id: "promo-1",
    image: "/images/products/rolex-datejust-126334/closeup.jpeg",
    title: "Rolex Datejust Collection",
    subtitle: "Timeless elegance, now available",
  },
  {
    id: "promo-2",
    image: "/images/products/rolex-submariner-126610lv/main.jpeg",
    title: "Submariner Kermit",
    subtitle: "The iconic green bezel",
  },
  {
    id: "promo-3",
    image: "/images/products/omega-seamaster-deep-black/main.jpeg",
    title: "Omega Planet Ocean",
    subtitle: "Deep Black — All ceramic, all power",
  },
];

export function PromoSlider() {
  const [slides, setSlides] = useState<PromoSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Load custom promo slides from localStorage if admin uploaded them
  useEffect(() => {
    try {
      const saved = localStorage.getItem("clonica_promo_slides");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
      }
    } catch {}
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advance
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-bg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[320px] md:h-[420px] lg:h-[480px]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title || "Promotion"}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />

            {/* Text content */}
            {(slide.title || slide.subtitle) && (
              <div className="absolute bottom-12 left-0 right-0 container">
                <div className="max-w-lg">
                  {slide.subtitle && (
                    <p className="text-gold text-xs tracking-[0.25em] uppercase mb-2">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.title && (
                    <h2 className="font-serif text-3xl md:text-5xl text-ink tracking-tight leading-tight">
                      {slide.title}
                    </h2>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-bg/60 backdrop-blur-sm border border-line text-ink hover:bg-bg/80 hover:border-gold transition-all"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-bg/60 backdrop-blur-sm border border-line text-ink hover:bg-bg/80 hover:border-gold transition-all"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? "bg-gold w-6"
                  : "bg-ink/30 hover:bg-ink/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
