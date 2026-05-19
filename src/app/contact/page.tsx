import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";
export const metadata: Metadata = {
  title: "Contact Us — Clonicawatch",
  description:
    "Get in touch with Clonicawatch via WhatsApp, Telegram, Instagram, or email. We respond within 2 hours. Worldwide support for super clone watch orders.",
  openGraph: {
    title: "Contact Clonicawatch",
    description:
      "Reach us via WhatsApp, Telegram, Instagram, or email. We respond within 2 hours.",
    url: "https://clonica.online/contact",
  },
  alternates: {
    canonical: "https://clonica.online/contact",
  },
};
export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsapp}`;
  const telegramUrl = `https://t.me/${SITE_CONFIG.contact.telegram}`;
  const instagramUrl = `https://www.instagram.com/${SITE_CONFIG.contact.instagram}`;
  const whatsappQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappUrl)}`;
  const telegramQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(telegramUrl)}`;
  const instagramQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(instagramUrl)}`;
  return (
    <div className="container py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="h-serif text-4xl mb-3">Get in Touch</h1>
        <p className="text-ink-muted mb-10">
          The fastest way to reach us is WhatsApp — we respond within 2 hours.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener"
          className="btn-gold inline-flex text-base mb-4"
        >
          💬 WhatsApp: {SITE_CONFIG.contact.whatsappDisplay}
        </a>
      </div>
      {/* Contact Methods Grid */}
      <div className="mt-12 grid md:grid-cols-3 gap-4 text-sm">
        {/* WhatsApp Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <p className="text-gold font-medium">WhatsApp</p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener"
            className="text-ink-muted hover:text-gold transition-colors break-all"
          >
            {SITE_CONFIG.contact.whatsappDisplay}
          </a>
          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={whatsappQrUrl} alt="WhatsApp QR Code" className="w-48 h-48" />
          </div>
        </div>
        {/* Telegram Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <p className="text-gold font-medium">Telegram</p>
          </div>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener"
            className="text-ink-muted hover:text-gold transition-colors break-all"
          >
            {SITE_CONFIG.contact.telegramDisplay}
          </a>
          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={telegramQrUrl} alt="Telegram QR Code" className="w-48 h-48" />
          </div>
        </div>
        {/* Instagram Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
            </svg>
            <p className="text-gold font-medium">Instagram</p>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener"
            className="text-ink-muted hover:text-gold transition-colors break-all"
          >
            {SITE_CONFIG.contact.instagramDisplay}
          </a>
          <div className="mt-4 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={instagramQrUrl} alt="Instagram QR Code" className="w-48 h-48" />
          </div>
        </div>
      </div>
      {/* Email + Location Row */}
      <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
        {/* Email Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <p className="text-gold font-medium">Email</p>
          </div>
          <a
            href={`mailto:${SITE_CONFIG.contact.email}`}
            className="text-ink-muted hover:text-gold transition-colors break-all"
          >
            {SITE_CONFIG.contact.email}
          </a>
          <p className="text-ink-dim text-xs mt-4">Response time: within 24 hours</p>
        </div>
        {/* Location Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <p className="text-gold font-medium">Location</p>
          </div>
          <p className="text-ink-muted">Based in {SITE_CONFIG.contact.addressLocality}, Türkiye</p>
          <p className="text-ink-dim text-xs mt-2">
            Showroom visits by appointment — please reach out via WhatsApp or Telegram to arrange a viewing.
          </p>
        </div>
      </div>
      {/* Business Hours */}
      <p className="mt-12 text-xs text-ink-dim text-center">
        Business hours: 09:00 – 22:00 GMT+3 · Response time: within 2 hours (WhatsApp)
      </p>
    </div>
  );
}

