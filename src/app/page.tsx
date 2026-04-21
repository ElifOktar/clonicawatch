import Link from "next/link";
import { getFeaturedProducts, getNewArrivals, getOnSale } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { PromoSlider } from "@/components/PromoSlider";
import { BrandCircles } from "@/components/BrandCircles";
import { SITE_CONFIG } from "@/lib/config";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const featured = await getFeaturedProducts(8);
  const newArrivals = await getNewArrivals(4);
  const onSale = await getOnSale(4);

  return (
    <>
      {/* Hero Slider */}
      <PromoSlider />

      {/* Brand Circles */}
      <BrandCircles />

      {/* Tagline Section */}
      <section className="py-10 md:py-14">
        <div className="container text-center">
          <div className="inline-flex flex-col items-center">
            <div className="w-12 h-px bg-gold/40 mb-5" />
            <h2 className="font-serif text-3xl md:text-4xl tracking-[0.15em] text-gold">
              {SITE_CONFIG.tagline}
            </h2>
            <div className="w-12 h-px bg-gold/40 mt-5" />
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-line bg-bg-elev">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xs md:text-sm text-ink-muted">Secure Transactions</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="text-xs md:text-sm text-ink-muted">Worldwide Shipping</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <span className="text-xs md:text-sm text-ink-muted">24/7 Support</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
              </svg>
              <span className="text-xs md:text-sm text-ink-muted">Discreet Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="container py-12 md:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-gold text-xs tracking-[0.2em] uppercase mb-2">Curated Selection</p>
              <h2 className="h-serif text-3xl md:text-4xl">Featured Pieces</h2>
            </div>
            <Link
              href="/brand"
              className="text-sm text-ink-muted hover:text-gold transition-colors hidden md:block"
            >
              View All &rarr;
            </Link>
          </div>
          <ProductGrid products={featured} />
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="bg-bg-elev border-y border-line">
          <div className="container py-12 md:py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="chip-gold inline-block mb-3">JUST IN</p>
                <h2 className="h-serif text-3xl md:text-4xl">New Arrivals</h2>
              </div>
              <Link
                href="/new-arrivals"
                className="text-sm text-ink-muted hover:text-gold transition-colors"
              >
                See All &rarr;
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {/* On Sale */}
      {onSale.length > 0 && (
        <section className="container py-12 md:py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="chip bg-danger/20 border-danger/40 text-danger inline-block mb-3">SALE</p>
              <h2 className="h-serif text-3xl md:text-4xl">Special Offers</h2>
            </div>
            <Link
              href="/on-sale"
              className="text-sm text-ink-muted hover:text-gold transition-colors"
            >
              View All &rarr;
            </Link>
          </div>
          <ProductGrid products={onSale} />
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-line">
        <div className="container py-16 md:py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold/30 bg-gold/5 mb-6">
              <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h2 className="h-serif text-3xl md:text-4xl mb-4">
              Can&apos;t Find Your Watch?
            </h2>
            <p className="text-ink-muted mb-8 max-w-md mx-auto">
              Send us a photo or a link — we&apos;ll source any model for you with the same premium quality and discreet shipping.
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=Hi%2C%20I%20couldn%27t%20find%20a%20watch%20on%20your%20website.%20Can%20you%20help%20me%20source%20it%3F`}
              target="_blank"
              rel="noopener"
              className="btn-gold text-base inline-flex items-center gap-2.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Message Us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
