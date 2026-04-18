import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG_BRANDS, LADIES_BRANDS } from "@/lib/catalog";
import { getProductsByBrand, getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "All Brands | Clonica Luxury Watches",
  description:
    "Browse our complete collection of luxury watch brands including Rolex, Audemars Piguet, Patek Philippe, Omega, Hublot and more.",
};

function BrandCard({ name, slug, count }: { name: string; slug: string; count: number }) {
  return (
    <Link
      href={`/brand/${slug}`}
      className="group card p-5 flex items-center justify-between hover:border-gold/40 transition-all"
    >
      <div>
        <h3 className="font-serif text-lg text-ink group-hover:text-gold transition-colors">
          {name}
        </h3>
        <p className="text-xs text-ink-muted mt-1">
          {count} {count === 1 ? "watch" : "watches"}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-ink-muted group-hover:text-gold transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  );
}

export default function BrandsPage() {
  const allProducts = getAllProducts();

  const brandsWithCount = CATALOG_BRANDS.map((b) => ({
    ...b,
    count: getProductsByBrand(b.name as any, allProducts).length,
  }));

  const ladiesWithCount = LADIES_BRANDS.map((b) => ({
    ...b,
    count: getProductsByBrand(
      (b.parentBrand
        ? CATALOG_BRANDS.find((cb) => cb.slug === b.parentBrand)?.name ?? b.name
        : b.name) as any,
      allProducts
    ).length,
  }));

  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gold">All Brands</span>
      </nav>

      <h1 className="h-serif text-4xl mb-10">Our Brands</h1>

      {/* Main Brands */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-gold mb-4">
          Brands
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {brandsWithCount.map((b) => (
            <BrandCard key={b.slug} name={b.name} slug={b.slug} count={b.count} />
          ))}
        </div>
      </section>

      {/* Ladies Brands */}
      <section>
        <h2 className="text-sm font-semibold tracking-wider uppercase text-pink-400 mb-4">
          Ladies Brands
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ladiesWithCount.map((b) => (
            <BrandCard key={b.slug} name={b.name} slug={b.slug} count={b.count} />
          ))}
        </div>
      </section>
    </div>
  );
}
