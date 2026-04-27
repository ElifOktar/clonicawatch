"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid";
import { CATALOG_BRANDS, LADIES_BRANDS } from "@/lib/catalog";

type Filters = {
  brands: Set<string>;
  collections: Set<string>;
  priceRange: [number, number] | null;
};

const PRICE_RANGES: Array<[string, number, number]> = [
  ["Under $1,000", 0, 1000],
  ["$1,000–$1,500", 1000, 1500],
  ["$1,500+", 1500, Infinity],
];

const ITEMS_PER_PAGE = 12;

export function FilteredProductList({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    brands: new Set(),
    collections: new Set(),
    priceRange: null,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Read brand and collection from URL query parameters
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const collectionSlug = searchParams.get("collection");
    const all = [...CATALOG_BRANDS, ...LADIES_BRANDS];

    if (brandParam) {
      // Find brand by name (case-insensitive match)
      const brandEntry = all.find(
        (b) => b.name.toLowerCase() === brandParam.toLowerCase()
      );

      if (brandEntry) {
        const newBrands = new Set([brandEntry.name]);
        const newCollections = new Set<string>();

        // If collection param is also present, find and select it
        if (collectionSlug && brandEntry.collections) {
          const match = brandEntry.collections.find((c) => c.slug === collectionSlug);
          if (match) {
            newCollections.add(match.name);
          }
        }

        setFilters((prev) => ({
          ...prev,
          brands: newBrands,
          collections: newCollections,
        }));

        // Expand brand if it has collections
        if (brandEntry.collections?.length) {
          setExpandedBrand(brandEntry.slug);
        }
      }
    } else if (collectionSlug) {
      // Legacy: collection-only URL param (backward compatible)
      for (const brand of all) {
        const match = brand.collections?.find((c) => c.slug === collectionSlug);
        if (match) {
          setFilters((prev) => ({
            ...prev,
            brands: new Set([brand.name]),
            collections: new Set([match.name]),
          }));
          setExpandedBrand(brand.slug);
          break;
        }
      }
    }
  }, [searchParams]);

  // Build available brands from products and match to catalog
  const availableBrands = useMemo(() => {
    const productBrands = new Set<string>(products.map((p) => p.brand));
    const all = [...CATALOG_BRANDS, ...LADIES_BRANDS];
    return all.filter((b) => {
      if (productBrands.has(b.name)) return true;
      if (b.parentBrand) {
        const parentEntry = all.find((x) => x.slug === b.parentBrand);
        if (parentEntry && productBrands.has(parentEntry.name)) return true;
      }
      return false;
    });
  }, [products]);

  // Get collections for selected brands
  const availableCollections = useMemo(() => {
    if (filters.brands.size === 0) return [];
    const collections: Array<{ brand: string; name: string; slug: string }> = [];
    const productCollections = new Set(products.map((p) => p.collection));
    availableBrands.forEach((b) => {
      if (!filters.brands.has(b.name)) return;
      b.collections?.forEach((c) => {
        if (productCollections.has(c.name)) {
          collections.push({ brand: b.name, name: c.name, slug: c.slug });
        }
      });
    });
    return collections;
  }, [filters.brands, availableBrands, products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.brands.size && !filters.brands.has(p.brand)) return false;
      if (filters.collections.size && !filters.collections.has(p.collection)) return false;
      if (filters.priceRange) {
        const [lo, hi] = filters.priceRange;
        if (p.price.usd < lo || p.price.usd > hi) return false;
      }
      return true;
    });
  }, [products, filters]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const toggleBrand = (brandName: string) => {
    setFilters((prev) => {
      const set = new Set(prev.brands);
      if (set.has(brandName)) {
        set.delete(brandName);
        const newCollections = new Set(prev.collections);
        const brand = availableBrands.find((b) => b.name === brandName);
        brand?.collections?.forEach((c) => newCollections.delete(c.name));
        return { ...prev, brands: set, collections: newCollections };
      } else {
        set.add(brandName);
        return { ...prev, brands: set };
      }
    });
  };

  const toggleCollection = (collectionName: string) => {
    setFilters((prev) => {
      const set = new Set(prev.collections);
      if (set.has(collectionName)) set.delete(collectionName);
      else set.add(collectionName);
      return { ...prev, collections: set };
    });
  };

  const setRange = (r: [number, number] | null) => setFilters((p) => ({ ...p, priceRange: r }));

  const clearAll = () => setFilters({ brands: new Set(), collections: new Set(), priceRange: null });

  const activeCount = filters.brands.size + filters.collections.size + (filters.priceRange ? 1 : 0);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
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

      <div className="grid lg:grid-cols-[220px,1fr] gap-8 min-w-0">
        <aside className={`space-y-6 lg:sticky lg:top-24 h-fit min-w-0 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-gold text-xs tracking-widest uppercase">Filters</h3>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs text-ink-muted hover:text-danger transition-colors">
                Clear ({activeCount})
              </button>
            )}
          </div>

          {/* Brands with Collections */}
          <div>
            <h4 className="text-sm mb-3 font-medium">Brand</h4>
            <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto pr-1">
              {availableBrands.map((b) => (
                <div key={b.slug}>
                  <button
                    onClick={() => {
                      toggleBrand(b.name);
                      if (b.collections?.length) {
                        setExpandedBrand(expandedBrand === b.slug ? null : b.slug);
                      }
                    }}
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      filters.brands.has(b.name)
                        ? "bg-gold/15 text-gold"
                        : "text-ink-muted hover:text-gold hover:bg-bg-soft"
                    }`}
                  >
                    <span>{b.name}</span>
                    {b.collections && b.collections.length > 0 && (
                      <svg
                        className={`w-3 h-3 transform transition-transform ${
                          expandedBrand === b.slug ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Sub-collections */}
                  {b.collections && expandedBrand === b.slug && filters.brands.has(b.name) && (
                    <div className="ml-3 pl-2 border-l border-gold/20 mt-0.5 mb-1">
                      {b.collections.map((c) => (
                        <button
                          key={c.slug}
                          onClick={() => toggleCollection(c.name)}
                          className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${
                            filters.collections.has(c.name)
                              ? "text-gold font-medium"
                              : "text-ink-dim hover:text-gold"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h4 className="text-sm mb-3 font-medium">Price</h4>
            <div className="flex flex-col gap-1.5">
              {PRICE_RANGES.map(([label, lo, hi]) => (
                <button
                  key={label}
                  onClick={() => setRange(
                    filters.priceRange && filters.priceRange[0] === lo ? null : [lo, hi]
                  )}
                  className={`chip-toggle justify-start ${filters.priceRange?.[0] === lo ? "chip-toggle-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <p className="text-sm text-ink-muted mb-4 hidden lg:block">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          <ProductGrid products={paginatedProducts} />

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-10 max-w-full">
              {/* Previous */}
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border border-line text-ink-muted hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={`dot-${idx}`} className="px-1 sm:px-2 text-ink-dim text-xs sm:text-sm">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-9 h-9 sm:w-10 sm:h-10 text-xs sm:text-sm rounded-lg border transition-colors ${
                      currentPage === page
                        ? "bg-gold text-[#0a0e17] border-gold font-semibold"
                        : "border-line text-ink-muted hover:text-gold hover:border-gold/30"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2.5 sm:px-3 py-2 text-xs sm:text-sm rounded-lg border border-line text-ink-muted hover:text-gold hover:border-gold/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

