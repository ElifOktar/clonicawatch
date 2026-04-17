import Link from "next/link";
import { getFeaturedProducts, getNewArrivals, getAllBrands } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SITE_CONFIG } from "@/lib/config";
import { Reviews } from "@/components/Reviews";
import { InstagramFeed } from "@/components/InstagramFeed";
import { getAllPosts } from "@/lib/blog";
import { PromoSlider } from "@/components/PromoSlider";
import Image from "next/image";

const BRAND_LINKS = [
  { name: "Rolex", slug: "rolex" },
  { name: "Audemars Piguet", slug: "audemars-piguet" },
  { name: "Patek Philippe", slug: "patek-philippe" },
  { name: "Omega", slug: "omega" },
  { name: "Hublot", slug: "hublot" },
  { name: "Cartier", slug: "cartier" },
  { name: "Breitling", slug: "breitling" },
  { name: "TAG Heuer", slug: "tag-heuer" },
  { name: "Panerai", slug: "panerai" },
  { name: "IWC", slug: "iwc" },
  { name: "Richard Mille", slug: "richard-mille" },
  { name: "Tudor", slug: "tudor" },
  { name: "Vacheron Constantin", slug: "vacheron-constantin" },
  { name: "Jaeger-LeCoultre", slug: "jaeger-lecoultre" },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const newArrivals = getNewArrivals(8);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* PROMO SLIDER — Scrollable banner at top */}
      <PromoSlider />

      {/* TRUST STRIP */}
      <section className="border-b border-line bg-bg-elev/50">
        <div className="container py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {SITE_CONFIG.trustSignals.map((t) => (
            <div key={t.label} className="text-ink-muted">
              <span className="text-gold mr-2">◆</span>{t.label}
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT — Sidebar + Products */}
      <div className="container py-10">
        <div className="grid lg:grid-cols-[220px,1fr] gap-8">

          {/* LEFT SIDEBAR — Brand Filter */}
          <aside className="lg:sticky lg:top-20 h-fit space-y-6">
            <div>
              <h3 className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-4">
                Brands
              </h3>
              <div className="space-y-0.5">
                {BRAND_LINKS.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brand/${b.slug}`}
                    className="block px-3 py-2 text-sm text-ink-muted hover:text-gold hover:bg-bg-elev rounded-lg transition-colors"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/brand"
                className="block mt-2 px-3 py-2 text-xs text-gold hover:text-gold-bright transition-colors"
              >
                View All Brands →
              </Link>
            </div>

            {/* Quick Links */}
            <div className="border-t border-line pt-5">
              <h3 className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-4">
                Categories
              </h3>
              <div className="space-y-0.5">
                {[
                  { name: "Diver", slug: "diver" },
                  { name: "Chronograph", slug: "chronograph" },
                  { name: "Dress", slug: "dress" },
                  { name: "GMT", slug: "gmt" },
                  { name: "Pilot", slug: "pilot" },
                  { name: "Sport", slug: "sport" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    href={`/category/${s.slug}`}
                    className="block px-3 py-2 text-sm text-ink-muted hover:text-gold hover:bg-bg-elev rounded-lg transition-colors"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-t border-line pt-5">
              <h3 className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-4">
                Price Range
              </h3>
              <div className="space-y-1">
                {["Under $500", "$500–$1,000", "$1,000–$1,500", "$1,500+"].map((range) => (
                  <div key={range} className="px-3 py-1.5 text-sm text-ink-muted">
                    {range}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="space-y-16">
            {/* NEW ARRIVALS */}
            <section>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl tracking-tight">New Arrivals</h2>
                  <p className="text-ink-muted mt-2 text-sm">Fresh additions to our collection.</p>
                </div>
                <Link href="/new-arrivals" className="text-gold text-sm hover:text-gold-bright transition-colors">
                  View All →
                </Link>
              </div>
              <ProductGrid products={newArrivals} />
            </section>

            {/* FEATURED COLLECTION */}
            <section>
              <div className="flex items-end justify-between mb-6">
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Featured Collection</h2>
              </div>
              <ProductGrid products={featured} />
            </section>
          </div>
        </div>
      </div>

      {/* WHY US — dark elevated */}
      <section className="border-y border-line bg-bg-elev">
        <div className="container py-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-gold">Premium Quality</h3>
            <p className="text-ink-muted text-sm mt-2">Select pieces crafted with the highest attention to detail and precision.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-gold">Worldwide Express</h3>
            <p className="text-ink-muted text-sm mt-2">DHL, FedEx, UPS — tracked shipping to 80+ countries.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-gold">Discreet Packaging</h3>
            <p className="text-ink-muted text-sm mt-2">Plain outer packaging — your order arrives discreetly.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <Reviews />

      {/* CTA */}
      <section className="container py-20 text-center">
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Questions? Let's Talk.</h2>
        <p className="text-ink-muted mt-3 max-w-xl mx-auto">Our team responds within 2 hours — WhatsApp is fastest.</p>
        <a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`} target="_blank" rel="noopener" className="btn-gold mt-8 inline-flex">
          Contact on WhatsApp
        </a>
      </section>
    </>
  );
}
