import { getOnSale } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";

export const metadata = { title: "On Sale", description: "Limited-time discounts on premium super clone watches." };

export default function OnSalePage() {
  const products = getOnSale(100);
  return (
    <div className="container py-12">
      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">LIMITED TIME</p>
        <h1 className="h-serif text-4xl md:text-5xl">On Sale</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">Curated markdowns. When they're gone, they're gone.</p>
      </header>
      <FilteredProductList products={products} />
    </div>
  );
}
