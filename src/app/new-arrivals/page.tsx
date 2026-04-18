import Link from "next/link";
import { getNewArrivals } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";

export const revalidate = 60;

export const metadata = {
  title: "New Arrivals — Latest Super Clone Watches",
  description: "The latest super clone watches. Rolex, Audemars Piguet, Patek Philippe and more. Swiss mechanisms, worldwide shipping.",
};

export default async function NewArrivalsPage() {
  const products = await getNewArrivals(100);
  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">&rsaquo;</span>
        <span className="text-ink">New Arrivals</span>
      </nav>

      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">FRESH THIS MONTH</p>
        <h1 className="h-serif text-4xl md:text-5xl">New Arrivals</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          The latest pieces from top ateliers — Rolex, Audemars Piguet, Patek Philippe and more. Limited quantities.
        </p>
      </header>

      <FilteredProductList products={products} />
    </div>
  );
}
