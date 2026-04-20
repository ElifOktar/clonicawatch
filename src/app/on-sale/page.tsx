import { Suspense } from "react";
import Link from "next/link";
import { getOnSale } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";

export const revalidate = 60;

export const metadata = {
  title: "On Sale — Super Clone Watch Deals",
  description: "Limited-time discounts on premium super clone watches. Rolex, AP, Patek and more at special prices.",
};

export default async function OnSalePage() {
  const products = await getOnSale(100);
  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-ink">Sale</span>
      </nav>

      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">LIMITED TIME</p>
        <h1 className="h-serif text-4xl md:text-5xl">On Sale</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          Curated markdowns on premium pieces. When they&apos;re gone, they&apos;re gone.
        </p>
      </header>

      <Suspense fallback={<div className="text-ink-muted text-sm">Loading...</div>}>
        <FilteredProductList products={products} />
      </Suspense>
    </div>
  );
}
