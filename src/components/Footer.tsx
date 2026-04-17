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

          {/* Social Icons Row */}
          <div className="flex gap-3 mt-5">
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
              target="_blank" rel="noopener"
              className="w-10 h-10 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors"
              title="WhatsApp"
            >
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
              target="_blank" rel="noopener"
              className="w-10 h-10 rounded-full bg-[#0088cc]/10 hover:bg-[#0088cc]/20 flex items-center justify-center transition-colors"
              title="Telegram"
            >
              <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
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
            <li><Link href="/ladies" className="hover:text-gold transition-colors">Ladies Watches</Link></li>
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
                <svg className="w-5 h-5 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {SITE_CONFIG.contact.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
                target="_blank" rel="noopener"
                className="flex items-center gap-2.5 hover:text-gold transition-colors"
              >
                <svg className="w-5 h-5 text-[#0088cc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
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
