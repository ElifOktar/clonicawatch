import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  const q = (searchParams?.q || "").trim();
  if (!q) {
    return {
      title: "Search — Clonica Luxury Watches",
      description: "Search our full catalog of super clone replica watches.",
    };
  }
  return {
    title: `Search: ${q} — Clonica`,
    description: `Search results for "${q}" in Clonica's replica watch catalog.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams?.q || "").trim();
  const all = await getAllProducts();

  const needle = q.toLowerCase();
  const products = needle
    ? all.filter((p) =>
        [p.model_name, p.brand, p.collection, p.reference, p.dial_color]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(needle))
      )
    : [];

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-ink">Search</span>
      </nav>

      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">SEARCH RESULTS</p>
        {q ? (
          <>
            <h1 className="h-serif text-4xl md:text-5xl">Results for "{q}"</h1>
            <p className="text-ink-muted mt-3 max-w-2xl">
              {products.length} {products.length === 1 ? "watch" : "watches"} found.
            </p>
          </>
        ) : (
          <>
            <h1 className="h-serif text-4xl md:text-5xl">Search</h1>
            <p className="text-ink-muted mt-3 max-w-2xl">
              Use the search icon in the header to find watches by brand, model, or reference.
            </p>
          </>
        )}
      </header>

      {q && products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink-muted mb-4">No watches matched your search.</p>
          <Link
            href="/shop"
            className="inline-block chip-toggle hover:border-gold hover:text-gold transition-colors"
          >
            Browse all watches
          </Link>
        </div>
      ) : (
        <Suspense fallback={<div className="text-ink-muted text-sm">Loading...</div>}>
          <FilteredProductList products={products} />
        </Suspense>
      )}
    </div>
  );
}

