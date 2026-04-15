"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";

type Filters = {
  caseSizes: Set<number>;
  dialColors: Set<string>;
  factories: Set<string>;
  priceRange: [number, number] | null;
  swissOnly: boolean;
};

const PRICE_RANGES: Array<[string, number, number]> = [
  ["Under $500", 0, 500],
  ["$500–$1,000", 500, 1000],
  ["$1,000–$1,500", 1000, 1500],
  ["$1,500+", 1500, Infinity],
];

export function FilteredProductList({ products }: { products: Product[] }) {
  const [filters, setFilters] = useState<Filters>({
    caseSizes: new Set(),
    dialColors: new Set(),
    factories: new Set(),
    priceRange: null,
    swissOnly: false,
  });

  // Build available options from products
  const opts = useMemo(() => {
    const s = new Set<number>(), d = new Set<string>(), f = new Set<string>();
    products.forEach((p) => {
      s.add(p.case_diameter_mm);
      d.add(p.dial_color.split("(")[0].trim());
      if (p.factory) f.add(p.factory);
    });
    return {
      caseSizes: Array.from(s).sort((a, b) => a - b),
      dialColors: Array.from(d).sort(),
      factories: Array.from(f).sort(),
    };
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.caseSizes.size && !filters.caseSizes.has(p.case_diameter_mm)) return false;
      if (filters.dialColors.size) {
        const simple = p.dial_color.split("(")[0].trim();
        if (!filters.dialColors.has(simple)) return false;
      }
      if (filters.factories.size && (!p.factory || !filters.factories.has(p.factory))) return false;
      if (filters.priceRange) {
        const [lo, hi] = filters.priceRange;
        if (p.price.usd < lo || p.price.usd > hi) return false;
      }
      if (filters.swissOnly && !p.is_swiss_movement) return false;
      return true;
    });
  }, [products, filters]);

  const toggle = <T extends number | string>(setName: keyof Filters, v: T) => {
    setFilters((prev) => {
      const next = { ...prev };
      const set = new Set(prev[setName] as Set<T>);
      if (set.has(v)) set.delete(v); else set.add(v);
      (next[setName] as unknown as Set<T>) = set;
      return next;
    });
  };
  const setRange = (r: [number, number] | null) => setFilters((p) => ({ ...p, priceRange: r }));
  const clearAll = () => setFilters({ caseSizes: new Set(), dialColors: new Set(), factories: new Set(), priceRange: null, swissOnly: false });

  const activeCount =
    filters.caseSizes.size + filters.dialColors.size + filters.factories.size +
    (filters.priceRange ? 1 : 0) + (filters.swissOnly ? 1 : 0);

  return (
    <div className="grid lg:grid-cols-[260px,1fr] gap-8">
      <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
        <div className="flex items-center justify-between">
          <h3 className="text-gold text-xs tracking-widest uppercase">Filters</h3>
          {activeCount > 0 && (
            <button onClick={clearAll} className="text-xs text-ink-muted hover:text-danger">Clear ({activeCount})</button>
          )}
        </div>

        <div>
          <h4 className="text-sm mb-3">Case Size</h4>
          <div className="flex flex-wrap gap-2">
            {opts.caseSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggle("caseSizes", s)}
                className={`chip-toggle ${filters.caseSizes.has(s) ? "chip-toggle-active" : ""}`}
              >{s}mm</button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm mb-3">Dial Color</h4>
          <div className="flex flex-wrap gap-2">
            {opts.dialColors.map((c) => (
              <button
                key={c}
                onClick={() => toggle("dialColors", c)}
                className={`chip-toggle ${filters.dialColors.has(c) ? "chip-toggle-active" : ""}`}
              >{c}</button>
            ))}
          </div>
        </div>

        {opts.factories.length > 0 && (
          <div>
            <h4 className="text-sm mb-3">Factory</h4>
            <div className="flex flex-wrap gap-2">
              {opts.factories.map((f) => (
                <button
                  key={f}
                  onClick={() => toggle("factories", f)}
                  className={`chip-toggle ${filters.factories.has(f) ? "chip-toggle-active" : ""}`}
                >{f}</button>
              ))}
            </div>
          </div>
        )}

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

        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.swissOnly}
              onChange={(e) => setFilters((p) => ({ ...p, swissOnly: e.target.checked }))}
              className="accent-gold"
            />
            <span className="text-sm">Swiss Mechanism Only</span>
          </label>
        </div>
      </aside>

      <div>
        <p className="text-sm text-ink-muted mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
