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

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = getProductBySlug(params.slug);
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

export default function ProductPage({ params }: { params: { slug: string } }) {
  const p = getProductBySlug(params.slug);
  if (!p) notFound();

  const related = getRelatedProducts(p, 4);
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

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-muted mb-6">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span className="mx-2">›</span>
          <Link href={`/brand/${p.brand.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-gold">
            {p.brand}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-ink">{p.collection}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square card overflow-hidden">
              <Image
                src={gallery[0]}
                alt={p.model_name}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {gallery.slice(0, 5).map((g, i) => (
                  <div key={i} className="relative aspect-square card overflow-hidden">
                    <Image src={g} alt={`${p.model_name} — view ${i + 1}`} fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <div className="flex gap-2 mb-3">
              <span className="chip-gold">{p.quality_tier.toUpperCase()}</span>
              {p.factory && <span className="chip-gold">{p.factory} FACTORY</span>}
              {p.is_new_arrival && <span className="chip">NEW</span>}
              {p.is_swiss_movement && <span className="chip-gold">SWISS</span>}
            </div>

            <p className="text-xs text-ink-dim tracking-widest uppercase">
              {p.brand} · {p.collection}
            </p>
            <h1 className="h-serif text-3xl md:text-4xl mt-2">{p.model_name}</h1>
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
                ● {p.stock_status}
              </span>
              {p.stock_count !== undefined && p.stock_count > 0 && (
                <span className="text-ink-muted ml-2">
                  ({p.stock_count} left)
                </span>
              )}
            </div>

            <p className="mt-4 text-ink-muted leading-relaxed">
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
                💬 Contact Seller on WhatsApp
              </a>
              <AddToCartButton productId={p.id} />
            </div>

            {/* Quick Specs */}
            <div className="mt-8 card p-5">
              <h3 className="text-xs tracking-widest uppercase text-gold mb-4">Quick Specs</h3>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-ink-muted">Case</dt>
                <dd>{p.case_diameter_mm}mm {p.case_material}</dd>
                <dt className="text-ink-muted">Movement</dt>
                <dd>{p.movement_caliber}</dd>
                <dt className="text-ink-muted">Type</dt>
                <dd>{p.movement_type}</dd>
                {p.crystal && <><dt className="text-ink-muted">Crystal</dt><dd>{p.crystal}</dd></>}
                <dt className="text-ink-muted">Dial</dt>
                <dd>{p.dial_color}</dd>
                {p.bezel_color && <><dt className="text-ink-muted">Bezel</dt><dd>{p.bezel_color}</dd></>}
                <dt className="text-ink-muted">Strap</dt>
                <dd>{p.strap_type}</dd>
                {p.water_resistance && <><dt className="text-ink-muted">Water</dt><dd>{p.water_resistance}</dd></>}
                {p.power_reserve_hours && <><dt className="text-ink-muted">Power Reserve</dt><dd>{p.power_reserve_hours}h</dd></>}
              </dl>
            </div>

            {/* Trust */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-muted">
              <span className="chip">🔒 Discreet Packaging</span>
              <span className="chip">✈️ Worldwide Express Shipping</span>
              <span className="chip">💳 Bank / Crypto / WU / RIA</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="h-serif text-2xl mb-4">Description</h2>
            <div className="text-ink-muted leading-relaxed whitespace-pre-wrap">
              {p.long_description}
            </div>
            <h3 className="h-serif text-xl mt-8 mb-3">Features</h3>
            <ul className="space-y-2 text-ink-muted">
              {p.features_bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-serif text-2xl mb-4">In the Box</h2>
            <ul className="space-y-2 text-ink-muted">
              {p.package_contents.map((c, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-gold">●</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <h3 className="h-serif text-xl mt-8 mb-3">Shipping & Payment</h3>
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
    </>
  );
}
