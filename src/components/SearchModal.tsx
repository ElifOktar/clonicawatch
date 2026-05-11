"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

// Display label -> actual brand name used in product data / shop filter
const POPULAR_BRANDS: Array<{ label: string; brand: string }> = [
  { label: "Rolex", brand: "Rolex" },
  { label: "Omega", brand: "Omega" },
  { label: "Audemars Piguet", brand: "Audemars Piguet" },
  { label: "Patek Philippe", brand: "Patek Philippe" },
  { label: "Hublot", brand: "Hublot" },
  { label: "Cartier", brand: "Cartier" },
];

export function SearchModal({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();

  // Close search modal on route change
  useEffect(() => {
    setOpen(false);
    setQ("");
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while modal is open (prevents the homepage from
  // scrolling behind the modal on mobile and avoids iOS Safari rendering
  // glitches where fixed positioning + keyboard caused the page to bleed
  // through the modal).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return products.filter((p) =>
      [p.model_name, p.brand, p.collection, p.reference, p.dial_color]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(needle))
    ).slice(0, 20);
  }, [q, products]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-ink-muted hover:text-gold transition-colors inline-flex items-center gap-1"
        aria-label="Search"
      >
        🔍 <span className="hidden lg:inline text-xs text-ink-dim">⌘K</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-bg-elev md:bg-black/70 md:backdrop-blur-sm md:flex md:items-start md:justify-center md:pt-24 md:px-4"
          style={{ minHeight: "100dvh" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full h-full md:h-auto md:max-w-2xl md:bg-bg-elev md:rounded-sm md:border md:border-line md:shadow-2xl md:animate-fade-in flex flex-col bg-bg-elev"
            style={{ minHeight: "100dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: input + close button */}
            <div className="relative flex-shrink-0 border-b border-line">
              <input
                autoFocus
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="on"
                autoCapitalize="none"
                spellCheck={true}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search brands, models, references…"
                className="w-full bg-bg-elev px-5 py-4 pr-12 text-base focus:outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-ink-muted hover:text-gold transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-soft"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-bg-elev">
              {/* Empty state — Popular Brands */}
              {!q && (
                <div className="p-6">
                  <p className="text-xs text-ink-dim uppercase tracking-widest mb-4">Popular Brands</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_BRANDS.map((b) => (
                      <Link
                        key={b.brand}
                        href={`/shop?brand=${encodeURIComponent(b.brand)}`}
                        onClick={() => setOpen(false)}
                        className="chip-toggle hover:border-gold hover:text-gold transition-colors"
                      >
                        {b.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {q && results.length === 0 && (
                <p className="p-6 text-center text-ink-muted">No results for "{q}"</p>
              )}

              {/* Results */}
              {q && results.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 items-center p-3 border-b border-line hover:bg-bg-soft transition-colors"
                >
                  <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-sm border border-line">
                    <Image src={p.main_image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-dim uppercase tracking-widest">{p.brand}</p>
                    <p className="text-sm truncate">{p.model_name}</p>
                  </div>
                  <span className="text-gold text-sm shrink-0">${p.price.usd.toLocaleString()}</span>
                </Link>
              ))}
            </div>

            {/* Footer (desktop only) */}
            <div className="hidden md:flex px-4 py-2 text-xs text-ink-dim border-t border-line justify-between flex-shrink-0">
              <span>Press ESC to close</span>
              <span>⌘K / Ctrl+K to open</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

