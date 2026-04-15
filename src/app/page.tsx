import Link from "next/link";
import { getFeaturedProducts, getNewArrivals } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { SITE_CONFIG } from "@/lib/config";
import { Reviews } from "@/components/Reviews";
import { InstagramFeed } from "@/components/InstagramFeed";
import { getAllPosts } from "@/lib/blog";
import Image from "next/image";

const BRAND_LINKS = [
  { name: "Rolex", slug: "rolex" },
  { name: "Audemars Piguet", slug: "audemars-piguet" },
  { name: "Patek Philippe", slug: "patek-philippe" },
  { name: "Omega", slug: "omega" },
  { name: "Hublot", slug: "hublot" },
  { name: "Cartier", slug: "cartier" },
];
const STYLES = [
  { name: "Diver", slug: "diver", icon: "🌊", desc: "Deep-sea icons" },
  { name: "Chronograph", slug: "chronograph", icon: "⏱", desc: "Racing heritage" },
  { name: "Dress", slug: "dress", icon: "🎩", desc: "Formal elegance" },
  { name: "GMT", slug: "gmt", icon: "🌍", desc: "World traveler" },
];

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const newArrivals = getNewArrivals(8);
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-elev to-bg" aria-hidden />
        <div className="absolute inset-0 opacity-25"
             style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #d4b86e 0%, transparent 55%)" }} aria-hidden />
        <div className="container relative py-24 md:py-32 text-center">
          <p className="chip-gold mx-auto inline-block mb-6">SWISS MECHANISM · SUPER CLONE</p>
          <h1 className="h-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            Timeless Icons,<br />
            <span className="gold-shimmer">Delivered Worldwide.</span>
          </h1>
          <p className="mt-6 text-ink-muted max-w-2xl mx-auto text-lg">
            Premium super clone timepieces from Clean, APF, BP, ZF and more. Discreet packaging, express shipping to your door.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/new-arrivals" className="btn-gold">Shop New Arrivals</Link>
            <a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`} target="_blank" rel="noopener" className="btn-outline">💬 Contact on WhatsApp</a>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-line">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          {SITE_CONFIG.trustSignals.map((t) => (
            <div key={t.label} className="text-ink-muted"><span className="text-gold mr-2">◆</span>{t.label}</div>
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="container py-16">
        <div className="mb-8">
          <h2 className="h-serif text-3xl md:text-4xl">Featured Brands</h2>
          <p className="text-ink-muted mt-2">Shop by maison — curated for the discerning collector.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {BRAND_LINKS.map((b) => (
            <Link key={b.slug} href={`/brand/${b.slug}`} className="card p-6 text-center hover:border-gold-deep transition-colors">
              <span className="font-serif text-lg">{b.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="h-serif text-3xl md:text-4xl">New Arrivals</h2>
            <p className="text-ink-muted mt-2">Fresh from the ateliers this month.</p>
          </div>
          <Link href="/new-arrivals" className="text-gold text-sm hover:text-gold-bright">View All →</Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      {/* SHOP BY STYLE — on cream */}
      <section className="section-cream py-20 mt-8">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="h-serif text-3xl md:text-4xl">Shop by Style</h2>
            <p className="text-cream-muted mt-2">Find your next obsession by character.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STYLES.map((s) => (
              <Link key={s.slug} href={`/category/${s.slug}`}
                    className="bg-cream-elev border border-cream-line p-8 text-center hover:border-gold-deep transition-colors group">
                <div className="text-4xl mb-3 opacity-70 group-hover:opacity-100 transition-opacity">{s.icon}</div>
                <h3 className="font-serif text-xl text-cream-ink group-hover:text-gold-deep transition-colors">{s.name}</h3>
                <p className="text-xs text-cream-muted mt-1">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="h-serif text-3xl md:text-4xl">Featured Collection</h2>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* WHY US — dark elevated */}
      <section className="border-y border-line bg-bg-elev">
        <div className="container py-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-3">🕰️</div>
            <h3 className="font-serif text-xl text-gold">Swiss Mechanism</h3>
            <p className="text-ink-muted text-sm mt-2">Select pieces feature authentic Swiss movements for unmatched precision.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">✈️</div>
            <h3 className="font-serif text-xl text-gold">Worldwide Express</h3>
            <p className="text-ink-muted text-sm mt-2">DHL, FedEx, UPS — tracked shipping to 80+ countries, 3–7 business days.</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-serif text-xl text-gold">Discreet Packaging</h3>
            <p className="text-ink-muted text-sm mt-2">Plain outer packaging — your order arrives discreetly, always.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS (cream section) */}
      <Reviews />

      {/* LATEST FROM JOURNAL */}
      <section className="container py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="chip-gold inline-block mb-2">JOURNAL</p>
            <h2 className="h-serif text-3xl md:text-4xl">Latest Reading</h2>
          </div>
          <Link href="/blog" className="text-gold text-sm hover:text-gold-bright">All Articles →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card overflow-hidden hover:border-gold-deep transition-colors">
              <div className="relative aspect-[16/10]">
                <Image src={p.cover} alt={p.title} fill sizes="(max-width:768px)100vw,33vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs text-ink-dim">{p.date} · {p.readingTime}</p>
                <h3 className="h-serif text-xl mt-2">{p.title}</h3>
                <p className="text-ink-muted text-sm mt-2 line-clamp-2">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <InstagramFeed />

      {/* CTA */}
      <section className="container py-20 text-center">
        <h2 className="h-serif text-3xl md:text-4xl">Questions? Let's Talk.</h2>
        <p className="text-ink-muted mt-3 max-w-xl mx-auto">Our team responds within 2 hours — WhatsApp is fastest.</p>
        <a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`} target="_blank" rel="noopener" className="btn-gold mt-8">💬 Chat on WhatsApp</a>
      </section>
    </>
  );
}
