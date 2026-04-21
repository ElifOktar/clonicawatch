import { Suspense } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";

export const revalidate = 60;

export const metadata = {
  title: "Shop All Watches — Super Clone & 1:1 Quality | Clonica",
  description: "Browse our full collection of super clone watches. Rolex, Audemars Piguet, Patek Philippe, Omega and more. Swiss mechanisms, worldwide shipping.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-ink">Shop</span>
      </nav>

      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">FULL COLLECTION</p>
        <h1 className="h-serif text-4xl md:text-5xl">All Watches</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          Explore our complete catalog — from classic Rolex to bold Richard Mille. Filter by brand, collection, or style.
        </p>
      </header>

      <Suspense fallback={<div className="text-ink-muted text-sm">Loading...</div>}>
        <FilteredProductList products={products} />
      </Suspense>
    </div>
  );
}
