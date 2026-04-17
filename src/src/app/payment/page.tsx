import { SITE_CONFIG } from "@/lib/config";

export const metadata = { title: "Payment" };

export default function PaymentPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="h-serif text-4xl mb-6">Payment Methods</h1>
      <p className="text-ink-muted leading-relaxed">
        All payments are finalized via WhatsApp after you confirm your order.
        We do not process payment on the website for your privacy and security.
      </p>

      <div className="mt-10 space-y-6">
        <div className="card p-6">
          <h2 className="h-serif text-2xl text-gold mb-3">🏦 Bank Transfer</h2>
          <p className="text-ink-muted">
            Wise (TransferWise) or SWIFT wire. Bank details are shared directly via WhatsApp. Typical clearance: 1–3 business days.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="h-serif text-2xl text-gold mb-3">₿ Crypto</h2>
          <p className="text-ink-muted">
            Bitcoin (BTC) or Tether (USDT) on TRC-20/ERC-20. Wallet addresses provided via WhatsApp. Typical confirmation: 15–60 minutes.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="h-serif text-2xl text-gold mb-3">🔁 Western Union</h2>
          <p className="text-ink-muted">
            Send via Western Union agent locations worldwide. We provide recipient details after order confirmation.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="h-serif text-2xl text-gold mb-3">💸 RIA Money Transfer</h2>
          <p className="text-ink-muted">
            Alternative to Western Union, often with lower fees. Widely available in US, EU, and Middle East.
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-ink-muted">
        Once payment is confirmed, your watch ships the next business day.
        Questions? <a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`} className="text-gold hover:text-gold-bright">Chat on WhatsApp</a>.
      </p>
    </div>
  );
}
