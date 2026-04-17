import Link from "next/link";
import { SITE_CONFIG } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-elev">
      <div className="container py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="font-serif text-2xl tracking-[0.2em] text-gold">
            {SITE_CONFIG.name}
          </div>
          <p className="text-ink-muted text-sm mt-3 leading-relaxed">
            {SITE_CONFIG.tagline}
            <br />
            Worldwide discreet delivery, every order.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/brand/rolex" className="hover:text-gold">Rolex</Link></li>
            <li><Link href="/brand/audemars-piguet" className="hover:text-gold">Audemars Piguet</Link></li>
            <li><Link href="/brand/patek-philippe" className="hover:text-gold">Patek Philippe</Link></li>
            <li><Link href="/brand/omega" className="hover:text-gold">Omega</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-gold">New Arrivals</Link></li>
            <li><Link href="/on-sale" className="hover:text-gold">Sale</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Information</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/shipping" className="hover:text-gold">Shipping</Link></li>
            <li><Link href="/payment" className="hover:text-gold">Payment</Link></li>
            <li><Link href="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                target="_blank" rel="noopener"
                className="hover:text-gold"
              >
                WhatsApp: {SITE_CONFIG.contact.whatsappDisplay}
              </a>
            </li>
            <li>Telegram: (coming soon)</li>
            <li>Email: (coming soon)</li>
            <li>Instagram: (coming soon)</li>
          </ul>
        </div>
      </div>

      {/* Payment + Shipping strip */}
      <div className="border-t border-line">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-dim">
          <div className="flex flex-wrap gap-2">
            <span className="text-ink-muted mr-1">Payment:</span>
            {SITE_CONFIG.paymentMethods.map((m) => (
              <span key={m.key} className="chip">{m.label}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-ink-muted mr-1">Shipping:</span>
            {SITE_CONFIG.shippingCarriers.map((c) => (
              <span key={c} className="chip">{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-dim">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold">Privacy</Link>
            <Link href="/terms" className="hover:text-gold">Terms</Link>
            <Link href="/returns" className="hover:text-gold">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
