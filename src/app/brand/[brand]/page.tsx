import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductsByBrand } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";
import type { Brand } from "@/types/product";

const BRAND_FROM_SLUG: Record<string, Brand> = {
  "rolex": "Rolex", "audemars-piguet": "Audemars Piguet", "patek-philippe": "Patek Philippe",
  "omega": "Omega", "hublot": "Hublot", "breitling": "Breitling", "cartier": "Cartier",
  "tag-heuer": "TAG Heuer", "panerai": "Panerai", "iwc": "IWC",
  "richard-mille": "Richard Mille", "tudor": "Tudor",
};

export function generateStaticParams() {
  const set = new Set(getAllProducts().map((p) => p.brand.toLowerCase().replace(/\s+/g, "-")));
  return Array.from(set).map((brand) => ({ brand }));
}

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const brand = BRAND_FROM_SLUG[params.brand];
  if (!brand) return {};
  return {
    title: `${brand} Replica Watches — Super Clone & 1:1 Quality`,
    description: `Shop ${brand} super clone replica watches. Swiss mechanisms available. Worldwide express shipping, discreet packaging.`,
  };
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = BRAND_FROM_SLUG[params.brand];
  if (!brand) notFound();

  const products = getProductsByBrand(brand);

  return (
    <div className="container py-12">
      <nav className="text-xs text-ink-muted mb-6">
        <a href="/" className="hover:text-gold">Home</a>
        <span className="mx-2">›</span>
        <span>Brands</span>
        <span className="mx-2">›</span>
        <span className="text-ink">{brand}</span>
      </nav>

      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">SUPER CLONE COLLECTION</p>
        <h1 className="h-serif text-4xl md:text-5xl">{brand} Replicas</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          Explore our curated selection of {brand} super clone watches — faithfully
          built by the industry's most respected ateliers.
        </p>
      </header>

      <FilteredProductList products={products} />

      <div className="mt-20 max-w-3xl text-ink-muted text-sm leading-relaxed space-y-4">
        <h2 className="h-serif text-2xl text-ink">About {brand} Replicas</h2>
        <p>
          Every {brand} replica in our collection is handpicked for quality and accuracy.
          We source from the leading ateliers, ensuring pieces that closely match
          the originals in every detail.
        </p>
      </div>
    </div>
  );
}
