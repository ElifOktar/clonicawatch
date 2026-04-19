"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface PromoSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
  /** If true, renders as a gradient CTA slide instead of image-based */
  isCta?: boolean;
  ctaButton?: string;
  ctaIcon?: "email" | "whatsapp";
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
    id: "promo-cta",
    image: "",
    title: "Can't Find the Watch You Want?",
    subtitle: "Send us a photo or a link — we'll source it for you",
    link: "https://wa.me/905355430744?text=Hi%2C%20I%20couldn%27t%20find%20a%20watch%20on%20your%20website.%20Can%20you%20help%20me%20source%20it%3F",
    isCta: true,
    ctaButton: "Message Us on WhatsApp",
    ctaIcon: "whatsapp",
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
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

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

  // Touch swipe handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum swipe distance
    if (diff > threshold) {
      next(); // swipe left → next slide
    } else if (diff < -threshold) {
      prev(); // swipe right → previous slide
    }
  }, [next, prev]);

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-bg touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-[380px] md:h-[420px] lg:h-[480px]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {slide.isCta ? (
              /* ─── CTA Slide — gradient background, centered text ─── */
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e17] via-[#1a1a2e] to-[#16213e]" />
                {/* Decorative gold accent lines */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
                  {/* Subtle radial glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
                </div>

                <div className="absolute inset-0 flex items-start md:items-center justify-center pt-6 md:pt-0">
                  <div className="text-center max-w-2xl px-6">
                    {/* Diamond icon */}
                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full border border-gold/30 bg-gold/5 mb-2 md:mb-6">
                      <svg className="w-4 h-4 md:w-7 md:h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1.5 md:mb-4 font-medium">
                      Special Request
                    </p>
                    <h2 className="font-serif text-xl md:text-5xl text-ink tracking-tight leading-tight mb-1.5 md:mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-ink-muted text-xs md:text-lg mb-4 md:mb-8 max-w-md mx-auto leading-relaxed">
                      {slide.subtitle}
                    </p>
                    {slide.link && slide.ctaButton && (
                      <a
                        href={slide.link}
                        className="inline-flex items-center gap-2 md:gap-2.5 bg-gold hover:bg-gold-bright text-bg font-semibold px-5 py-2.5 md:px-8 md:py-3.5 text-sm md:text-base rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {slide.ctaIcon === "whatsapp" && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        )}
                        {slide.ctaIcon === "email" && (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                        )}
                        {slide.ctaButton}
                      </a>
                    )}
                    {/* Spacer for dots */}
                    <div className="h-6 md:h-0" />
                  </div>
                </div>
              </>
            ) : (
              /* ─── Standard Image Slide ─── */
              <>
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
              </>
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
