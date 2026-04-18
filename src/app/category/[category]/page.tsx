import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import type { StyleTag } from "@/types/product";

export const revalidate = 60;

const STYLE_FROM_SLUG: Record<string, StyleTag> = {
  "diver": "Diver",
  "chronograph": "Chronograph",
  "dress": "Dress",
  "pilot": "Pilot",
  "sport": "Sport",
  "gmt": "GMT",
  "moonphase": "Moonphase",
  "skeleton": "Skeleton",
  "tourbillon": "Tourbillon",
};

export function generateStaticParams() {
  return Object.keys(STYLE_FROM_SLUG).map((category) => ({ category }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const style = STYLE_FROM_SLUG[params.category];
  if (!style) return {};
  return {
    title: `${style} Replica Watches`,
    description: `Shop ${style.toLowerCase()} style super clone watches. Swiss movements, worldwide express shipping.`,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const style = STYLE_FROM_SLUG[params.category];
  if (!style) notFound();

  const all = await getAllProducts();
  const products = all.filter((p) => p.style_tags.includes(style));

  return (
    <div className="container py-12">
      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">STYLE COLLECTION</p>
        <h1 className="h-serif text-4xl md:text-5xl">{style} Watches</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          {style} style super clone timepieces — curated from the top ateliers.
        </p>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
