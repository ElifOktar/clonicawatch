import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProductsByBrand } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";
import type { Brand } from "@/types/product";
import { ALL_CATALOG_BRANDS, getCollections, isLadiesBrand } from "@/lib/catalog";
import Link from "next/link";

/**
 * Build a slug → Brand display-name map from the catalog.
 * Ladies brands that have a parentBrand resolve to the parent's Brand type
 * (e.g. "rolex-ladies" → products filtered by brand "Rolex" + gender "Women").
 */
const BRAND_FROM_SLUG: Record<string, Brand> = {
  "rolex": "Rolex",
  "audemars-piguet": "Audemars Piguet",
  "patek-philippe": "Patek Philippe",
  "omega": "Omega",
  "hublot": "Hublot",
  "breitling": "Breitling",
  "cartier": "Cartier",
  "tag-heuer": "TAG Heuer",
  "panerai": "Panerai",
  "iwc": "IWC",
  "richard-mille": "Richard Mille",
  "tudor": "Tudor",
  "vacheron-constantin": "Vacheron Constantin",
  "jaeger-lecoultre": "Jaeger-LeCoultre",
  "franck-muller": "Franck Muller",
  // Ladies brands
  "rolex-ladies": "Rolex",
  "bvlgari": "Bvlgari",
  "cartier-ladies": "Cartier",
  "audemars-piguet-ladies": "Audemars Piguet",
  "patek-philippe-ladies": "Patek Philippe",
};

export function generateStaticParams() {
  return ALL_CATALOG_BRANDS.map((b) => ({ brand: b.slug }));
}

export function generateMetadata({ params }: { params: { brand: string } }): Metadata {
  const entry = ALL_CATALOG_BRANDS.find((b) => b.slug === params.brand);
  if (!entry) return {};
  const isLadies = isLadiesBrand(params.brand);
  const title = isLadies
    ? `${entry.name} — Elegant Timepieces for Women`
    : `${entry.name} Replica Watches — Super Clone & 1:1 Quality`;
  const description = isLadies
    ? `Shop ${entry.name} replica watches. Premium quality, worldwide express shipping, discreet packaging.`
    : `Shop ${entry.name} super clone replica watches. Swiss mechanisms available. Worldwide express shipping, discreet packaging.`;
  return { title, description };
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brandKey = BRAND_FROM_SLUG[params.brand];
  if (!brandKey) notFound();

  const entry = ALL_CATALOG_BRANDS.find((b) => b.slug === params.brand);
  if (!entry) notFound();

  const isLadies = isLadiesBrand(params.brand);
  const collections = getCollections(params.brand);

  // Get products — for ladies brands, filter by gender too
  let products = getProductsByBrand(brandKey);
  if (isLadies) {
    products = products.filter(
      (p) => p.gender === "Women" || p.gender === "Unisex"
    );
  }

  return (
    <div className="container py-12">
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">›</span>
        {isLadies && (
          <>
            <Link href="/ladies" className="hover:text-gold transition-colors">Ladies Watches</Link>
            <span className="mx-2">›</span>
          </>
        )}
        {!isLadies && <><span>Brands</span><span className="mx-2">›</span></>}
        <span className="text-ink">{entry.name}</span>
      </nav>

      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">
          {isLadies ? "LADIES COLLECTION" : "SUPER CLONE COLLECTION"}
        </p>
        <h1 className="h-serif text-4xl md:text-5xl">{entry.name}</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          {isLadies
            ? `Discover our curated selection of ${entry.name} — elegant timepieces crafted with precision and beauty.`
            : `Explore our curated selection of ${entry.name} super clone watches — faithfully built by the industry's most respected ateliers.`}
        </p>
      </header>

      {/* Collection quick-filters */}
      {collections.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/brand/${params.brand}`}
            className="px-4 py-2 text-xs rounded-full border border-gold text-gold hover:bg-gold hover:text-[#0a0e17] transition-all font-medium"
          >
            All
          </Link>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/brand/${params.brand}?collection=${c.slug}`}
              className="px-4 py-2 text-xs rounded-full border border-line text-ink-muted hover:border-gold hover:text-gold transition-all"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <FilteredProductList products={products} />

      <div className="mt-20 max-w-3xl text-ink-muted text-sm leading-relaxed space-y-4">
        <h2 className="h-serif text-2xl text-ink">About {entry.name}</h2>
        <p>
          {isLadies
            ? `Every ${entry.name} piece in our collection is handpicked for elegance and quality, ensuring timepieces that closely match the originals in every detail.`
            : `Every ${entry.name} replica in our collection is handpicked for quality and accuracy. We source from the leading ateliers, ensuring pieces that closely match the originals in every detail.`}
        </p>
      </div>
    </div>
  );
}
