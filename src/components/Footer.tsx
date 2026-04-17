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

          {/* Social Icons Row with real logos */}
          <div className="flex gap-3 mt-5">
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
              target="_blank" rel="noopener"
              className="w-10 h-10 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors overflow-hidden"
              title="WhatsApp"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logos/social/whatsapp.jpg" alt="WhatsApp" className="w-6 h-6 rounded-full object-cover" />
            </a>
            <a
              href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
              target="_blank" rel="noopener"
              className="w-10 h-10 rounded-full bg-[#0088cc]/10 hover:bg-[#0088cc]/20 flex items-center justify-center transition-colors overflow-hidden"
              title="Telegram"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logos/social/telegram.jpg" alt="Telegram" className="w-6 h-6 rounded-full object-cover" />
            </a>
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="w-10 h-10 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-colors"
              title="Email"
            >
              <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/brand/rolex" className="hover:text-gold transition-colors">Rolex</Link></li>
            <li><Link href="/brand/audemars-piguet" className="hover:text-gold transition-colors">Audemars Piguet</Link></li>
            <li><Link href="/brand/patek-philippe" className="hover:text-gold transition-colors">Patek Philippe</Link></li>
            <li><Link href="/brand/omega" className="hover:text-gold transition-colors">Omega</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-gold transition-colors">New Arrivals</Link></li>
            <li><Link href="/on-sale" className="hover:text-gold transition-colors">Sale</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Information</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
            <li><Link href="/shipping" className="hover:text-gold transition-colors">Shipping</Link></li>
            <li><Link href="/tracking" className="hover:text-gold transition-colors">Track Order</Link></li>
            <li><Link href="/payment" className="hover:text-gold transition-colors">Payment</Link></li>
            <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-ink-muted">
            <li>
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                target="_blank" rel="noopener"
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logos/social/whatsapp.jpg" alt="" className="w-5 h-5 rounded-full object-cover" />
                {SITE_CONFIG.contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
                target="_blank" rel="noopener"
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logos/social/telegram.jpg" alt="" className="w-5 h-5 rounded-full object-cover" />
                {SITE_CONFIG.contact.telegramDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5 text-gold/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                {SITE_CONFIG.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment + Shipping strip with real logos */}
      <div className="border-t border-line">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-ink-dim">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-ink-muted mr-1">Payment:</span>
            {SITE_CONFIG.paymentMethods.map((m) => (
              <span key={m.key} className="chip">{m.label}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-ink-muted mr-1">Shipping:</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/delivery/dhl.png" alt="DHL" className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/delivery/fedex.png" alt="FedEx" className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/delivery/ups.png" alt="UPS" className="h-6 object-contain opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-dim">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <Link href="/returns" className="hover:text-gold transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
