"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";

type Filters = {
  brands: Set<string>;
  priceRange: [number, number] | null;
};

const PRICE_RANGES: Array<[string, number, number]> = [
  ["Under $500", 0, 500],
  ["$500–$1,000", 500, 1000],
  ["$1,000–$1,500", 1000, 1500],
  ["$1,500+", 1500, Infinity],
];

export function FilteredProductList({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>({
    brands: new Set(),
    priceRange: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Build available options from products
  const opts = useMemo(() => {
    const b = new Set<string>();
    products.forEach((p) => {
      b.add(p.brand);
    });
    return {
      brands: Array.from(b).sort(),
    };
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.brands.size && !filters.brands.has(p.brand)) return false;
      if (filters.priceRange) {
        const [lo, hi] = filters.priceRange;
        if (p.price.usd < lo || p.price.usd > hi) return false;
      }
      return true;
    });
  }, [products, filters]);

  const toggle = (v: string) => {
    setFilters((prev) => {
      const set = new Set(prev.brands);
      if (set.has(v)) set.delete(v); else set.add(v);
      return { ...prev, brands: set };
    });
  };
  const setRange = (r: [number, number] | null) => setFilters((p) => ({ ...p, priceRange: r }));
  const clearAll = () => setFilters({ brands: new Set(), priceRange: null });

  const activeCount = filters.brands.size + (filters.priceRange ? 1 : 0);

  return (
    <div>
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <p className="text-sm text-ink-muted">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gold border border-gold/30 rounded-lg px-4 py-2 hover:bg-gold/5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="grid lg:grid-cols-[220px,1fr] gap-8">
        <aside className={`space-y-6 lg:sticky lg:top-24 h-fit ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-gold text-xs tracking-widest uppercase">Filters</h3>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs text-ink-muted hover:text-danger">Clear ({activeCount})</button>
            )}
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-sm mb-3">Brand</h4>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              {opts.brands.map((b) => (
                <button
                  key={b}
                  onClick={() => toggle(b)}
                  className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    filters.brands.has(b)
                      ? "bg-gold/15 text-gold"
                      : "text-ink-muted hover:text-gold hover:bg-bg-soft"
                  }`}
                >{b}</button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h4 className="text-sm mb-3">Price</h4>
            <div className="flex flex-col gap-1.5">
              {PRICE_RANGES.map(([label, lo, hi]) => (
                <button
                  key={label}
                  onClick={() => setRange(
                    filters.priceRange && filters.priceRange[0] === lo ? null : [lo, hi]
                  )}
                  className={`chip-toggle justify-start ${filters.priceRange?.[0] === lo ? "chip-toggle-active" : ""}`}
                >{label}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <p className="text-sm text-ink-muted mb-4 hidden lg:block">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
