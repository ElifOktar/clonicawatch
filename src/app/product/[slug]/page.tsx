import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllProducts,
  getProductBySlug,
  getRelatedProducts,
  formatPrice,
  getProductMetaTitle,
  getProductMetaDescription,
  getProductWhatsAppUrl,
} from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductGallery } from "@/components/ProductGallery";
import { StickyProductCTA } from "@/components/StickyProductCTA";

export const revalidate = 60;

// Build-safe: returns [] during build when Supabase is not configured
// Pages will be generated on first request instead (ISR)
export async function generateStaticParams() {
  try {
    const products = await getAllProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  if (!p) return {};
  return {
    title: getProductMetaTitle(p),
    description: getProductMetaDescription(p),
    openGraph: {
      title: getProductMetaTitle(p),
      description: getProductMetaDescription(p),
      images: [p.main_image],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) notFound();

  const related = await getRelatedProducts(p, 4);
  const waUrl = getProductWhatsAppUrl(p);
  const gallery = p.gallery_images?.length ? p.gallery_images : [p.main_image];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.model_name,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.sku,
    image: gallery,
    description: p.short_description,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: p.price.usd,
      availability:
        p.stock_status === "In Stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container py-8 pb-20 md:pb-0 overflow-hidden">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-muted mb-6">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span className="mx-2">&rsaquo;</span>
          <Link href={`/brand/${p.brand.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-gold">
            {p.brand}
          </Link>
          <span className="mx-2">&rsaquo;</span>
          <span className="text-ink">{p.collection}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
          {/* GALLERY — supports 7-8 images + video */}
          <div className="min-w-0 w-full overflow-hidden">
            <ProductGallery
              images={gallery}
              videoUrl={p.video_url}
              modelName={p.model_name}
            />
          </div>

          {/* INFO */}
          <div className="min-w-0">
            <div className="flex gap-2 mb-3">
              {p.is_new_arrival && <span className="chip-gold">NEW</span>}
              {p.is_on_sale && <span className="chip bg-danger/20 border-danger/40 text-danger">SALE</span>}
            </div>

            <p className="text-xs text-ink-dim tracking-widest uppercase">
              {p.brand} &middot; {p.collection}
            </p>
            <h1 className="h-serif text-3xl md:text-4xl mt-2 break-words">{p.model_name}</h1>
            {p.reference && (
              <p className="text-ink-muted mt-1 text-sm">Ref. {p.reference}</p>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-serif text-gold">
                {formatPrice(p.price.usd)}
              </span>
              {p.original_price?.usd && (
                <span className="text-ink-dim line-through">
                  {formatPrice(p.original_price.usd)}
                </span>
              )}
            </div>

            <div className="mt-2 text-sm">
              <span
                className={
                  p.stock_status === "In Stock"
                    ? "text-success"
                    : p.stock_status === "Limited Stock"
                      ? "text-gold"
                      : "text-danger"
                }
              >
                &#9679; {p.stock_status}
              </span>
              {p.stock_count !== undefined && p.stock_count > 0 && (
                <span className="text-ink-muted ml-2">
                  ({p.stock_count} left)
                </span>
              )}
            </div>

            <p className="mt-4 text-ink-muted leading-relaxed break-words overflow-wrap-anywhere">
              {p.short_description}
            </p>

            {/* CTAs */}
            <div className="mt-8 space-y-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener"
                className="btn-gold w-full text-base"
              >
                Contact Seller on WhatsApp
              </a>
              <AddToCartButton productId={p.id} />
            </div>

            {/* Specs — cleaned up, no factory/technical info */}
            <div className="mt-8 card p-5">
              <h3 className="text-xs tracking-widest uppercase text-gold mb-4">Details</h3>
              <dl className="grid grid-cols-2 gap-y-3 text-sm break-words">
                <dt className="text-ink-muted">Case</dt>
                <dd>{p.case_diameter_mm}mm</dd>
                <dt className="text-ink-muted">Material</dt>
                <dd>{p.case_material}</dd>
                <dt className="text-ink-muted">Dial</dt>
                <dd>{p.dial_color}</dd>
                {p.bezel_color && <><dt className="text-ink-muted">Bezel</dt><dd>{p.bezel_color}</dd></>}
                <dt className="text-ink-muted">Strap</dt>
                <dd>{p.strap_type}</dd>
                {p.water_resistance && <><dt className="text-ink-muted">Water Resistance</dt><dd>{p.water_resistance}</dd></>}
              </dl>
            </div>

            {/* Trust */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-muted">
              <span className="chip">Discreet Packaging</span>
              <span className="chip">Worldwide Express</span>
              <span className="chip">Bank / Crypto / WU / RIA</span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="min-w-0">
            <h2 className="h-serif text-2xl mb-4">Description</h2>
            <div className="text-ink-muted leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
              {p.long_description}
            </div>
          </div>
          <div>
            <h2 className="h-serif text-2xl mb-4">In the Box</h2>
            <ul className="space-y-2 text-ink-muted">
              {p.package_contents.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold">&#9679;</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <h3 className="h-serif text-xl mt-8 mb-3">Shipping &amp; Payment</h3>
            <p className="text-ink-muted text-sm">
              Worldwide express shipping via DHL / FedEx / UPS — 3–7 business
              days to most destinations with full tracking.
              <br /><br />
              Payment methods finalized via WhatsApp: Bank Transfer (Wise/SWIFT),
              Crypto (BTC / USDT), Western Union, or RIA.
            </p>
          </div>
        </div>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="h-serif text-2xl mb-8">You May Also Like</h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <StickyProductCTA waUrl={waUrl} productId={p.id} product={{ id: p.id, model_name: p.model_name, main_image: p.main_image, price: p.price }} />
    </>
  );
}
