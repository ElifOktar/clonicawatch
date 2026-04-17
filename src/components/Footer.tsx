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
            <li><Link href="/tracking" className="hover:text-gold">Track Order</Link></li>
            <li><Link href="/payment" className="hover:text-gold">Payment</Link></li>
            <li><Link href="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.996 1.304c-1.464.817-2.763 1.978-3.62 3.368C3.304 10.75 2.913 12.357 2.936 14c.02 1.644.356 3.254 1 4.77 1.234 2.98 3.674 5.34 6.672 6.312 1.449.434 2.979.638 4.537.626 1.557-.012 3.076-.254 4.546-.94 2.988-1.372 5.402-4.1 6.17-7.254.768-3.154.44-6.613-1.016-9.594-.842-1.73-1.921-3.22-3.262-4.354-1.34-1.134-2.927-1.955-4.65-2.368-1.722-.414-3.549-.401-5.37.041z" />
              </svg>
              <a
                href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                target="_blank" rel="noopener"
                className="hover:text-gold"
              >
                {SITE_CONFIG.contact.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a11.955 11.955 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.487-1.302.512-.428.014-.847-.16-1.254-.484-.407-.324-.649-.758-.896-1.21-.295-.529-.505-1.137-.514-1.748-.01-.568.14-1.14.436-1.667.328-.577 1.529-1.041 2.197-1.117.673-.075 1.334.196 1.928.512 1.512.822 2.999 1.647 4.456 2.444.275.148.518.243.749.243z" />
              </svg>
              <a
                href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
                target="_blank" rel="noopener"
                className="hover:text-gold"
              >
                {SITE_CONFIG.contact.telegramDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="hover:text-gold"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              <span>Coming soon</span>
            </li>
          </ul>

          {/* Social Icons Row */}
          <div className="flex gap-3 mt-4">
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
              target="_blank" rel="noopener"
              className="hover:text-gold transition-colors"
              title="WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.996 1.304c-1.464.817-2.763 1.978-3.62 3.368C3.304 10.75 2.913 12.357 2.936 14c.02 1.644.356 3.254 1 4.77 1.234 2.98 3.674 5.34 6.672 6.312 1.449.434 2.979.638 4.537.626 1.557-.012 3.076-.254 4.546-.94 2.988-1.372 5.402-4.1 6.17-7.254.768-3.154.44-6.613-1.016-9.594-.842-1.73-1.921-3.22-3.262-4.354-1.34-1.134-2.927-1.955-4.65-2.368-1.722-.414-3.549-.401-5.37.041z" />
              </svg>
            </a>
            <a
              href={`https://t.me/+${SITE_CONFIG.contact.telegram}`}
              target="_blank" rel="noopener"
              className="hover:text-gold transition-colors"
              title="Telegram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a11.955 11.955 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.487-1.302.512-.428.014-.847-.16-1.254-.484-.407-.324-.649-.758-.896-1.21-.295-.529-.505-1.137-.514-1.748-.01-.568.14-1.14.436-1.667.328-.577 1.529-1.041 2.197-1.117.673-.075 1.334.196 1.928.512 1.512.822 2.999 1.647 4.456 2.444.275.148.518.243.749.243z" />
              </svg>
            </a>
            <a
              href={`mailto:${SITE_CONFIG.contact.email}`}
              className="hover:text-gold transition-colors"
              title="Email"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
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
