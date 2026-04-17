"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

export function SearchModal({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return products.filter((p) =>
      [p.model_name, p.brand, p.collection, p.reference, p.dial_color]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(needle))
    ).slice(0, 8);
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-bg-elev border border-line rounded-sm shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search brands, models, references, factories…"
              className="w-full bg-transparent border-b border-line px-5 py-4 text-lg focus:outline-none focus:border-gold"
            />
            <div className="max-h-96 overflow-y-auto">
              {q && results.length === 0 && (
                <p className="p-6 text-center text-ink-muted">No results for "{q}"</p>
              )}
              {results.map((p) => (
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
                  <span className="text-gold text-sm">${p.price.usd.toLocaleString()}</span>
                </Link>
              ))}
            </div>
            <div className="px-4 py-2 text-xs text-ink-dim border-t border-line flex justify-between">
              <span>Press ESC to close</span>
              <span>⌘K / Ctrl+K to open</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
