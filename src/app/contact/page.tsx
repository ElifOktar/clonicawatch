import { SITE_CONFIG } from "@/lib/config";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container py-12 max-w-2xl text-center">
      <h1 className="h-serif text-4xl mb-3">Get in Touch</h1>
      <p className="text-ink-muted mb-10">
        The fastest way to reach us is WhatsApp — we respond within 2 hours.
      </p>

      <a
        href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
        target="_blank"
        rel="noopener"
        className="btn-gold inline-flex text-base mb-4"
      >
        💬 WhatsApp: {SITE_CONFIG.contact.whatsappDisplay}
      </a>

      <div className="mt-12 grid md:grid-cols-3 gap-4 text-sm">
        <div className="card p-5">
          <p className="text-gold font-medium">Email</p>
          <p className="text-ink-muted mt-1">Coming soon</p>
        </div>
        <div className="card p-5">
          <p className="text-gold font-medium">Telegram</p>
          <p className="text-ink-muted mt-1">Coming soon</p>
        </div>
        <div className="card p-5">
          <p className="text-gold font-medium">Instagram</p>
          <p className="text-ink-muted mt-1">Coming soon</p>
        </div>
      </div>

      <p className="mt-12 text-xs text-ink-dim">
        Business hours: 09:00 – 22:00 GMT+3 · Response time: within 2 hours
      </p>
    </div>
  );
}
