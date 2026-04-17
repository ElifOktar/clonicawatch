import { getNewArrivals } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";

export const metadata = { title: "New Arrivals", description: "The latest super clone watches." };

export default function NewArrivalsPage() {
  const products = getNewArrivals(100);
  return (
    <div className="container py-12">
      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">FRESH THIS MONTH</p>
        <h1 className="h-serif text-4xl md:text-5xl">New Arrivals</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">The latest pieces from top ateliers. Limited quantities.</p>
      </header>
      <FilteredProductList products={products} />
    </div>
  );
}
