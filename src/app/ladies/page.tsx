import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { LADIES_BRANDS } from "@/lib/catalog";
import { FilteredProductList } from "@/components/FilterSidebar";

export const metadata: Metadata = {
  title: "Ladies Watches — Elegant Timepieces for Women",
  description:
    "Shop our ladies watch collection — Rolex, Cartier, Bvlgari, Audemars Piguet, and Patek Philippe. Premium quality, worldwide shipping.",
};

export default function LadiesPage() {
  // Gather all women/unisex products
  const allProducts = getAllProducts().filter(
    (p) => p.gender === "Women" || p.gender === "Unisex"
  );

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-ink">Ladies Watches</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <p className="inline-block text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 mb-4">
          LADIES COLLECTION
        </p>
        <h1 className="h-serif text-4xl md:text-5xl">Ladies Watches</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          Discover our curated selection of elegant timepieces for women —
          from classic Rolex to sophisticated Cartier, each piece crafted with precision and beauty.
        </p>
      </header>

      {/* Ladies Brand Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12">
        {LADIES_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            className="card p-5 text-center hover:border-gold/30 transition-all group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="text-sm font-serif text-ink group-hover:text-gold transition-colors">
              {brand.name}
            </h3>
            {brand.collections && (
              <p className="text-[10px] text-ink-dim mt-1">
                {brand.collections.length} collections
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* All Ladies Products */}
      <FilteredProductList products={allProducts} />
    </div>
  );
}
