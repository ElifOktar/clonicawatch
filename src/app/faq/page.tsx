import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Clonicawatch",
  description:
    "Common questions about super clone watches, shipping, payments, quality tiers, and how to order from Clonicawatch.",
  openGraph: {
    title: "FAQ — Clonicawatch",
    description:
      "Everything you need to know about super clone watches, shipping, payments, and ordering.",
    url: "https://clonica.online/faq",
  },
  alternates: {
    canonical: "https://clonica.online/faq",
  },
};

const FAQS = [
  {
    q: "What is a 'Super Clone' watch?",
    a: "Super clone watches are the highest tier of replica watches — built to 1:1 specifications of the original using premium materials (904L stainless steel, ceramic bezels, sapphire crystals) and movements that replicate the original caliber with exceptional accuracy.",
  },
  {
    q: "Are these Swiss-made?",
    a: "Most pieces feature high-grade Asian clone movements that replicate Swiss calibers. Select pieces (marked with a 'Swiss' badge) contain genuine Swiss movements — these carry a price premium. If Swiss movement is important to you, filter by that tag or ask us on WhatsApp.",
  },
  {
    q: "How long does shipping take?",
    a: "Worldwide express shipping via DHL, FedEx, or UPS typically takes 3–7 business days. US, UK, EU, and Middle East destinations are shipped priority. Tracking numbers are provided as soon as your order leaves the warehouse.",
  },
  {
    q: "Do you ship discreetly?",
    a: "Yes. All orders ship in plain, unbranded packaging with a neutral declared description. The invoice inside is minimal — no brand logos or retail pricing. Your privacy is protected.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Bank Transfer (Wise or SWIFT), Crypto (BTC / USDT), Western Union, and RIA Money Transfer. All payments are finalized via WhatsApp after you confirm your order. We do not collect payment on the website.",
  },
  {
    q: "What if there's a problem with my order?",
    a: "We stand behind every piece. If your watch arrives damaged, defective, or not as described, reach out on WhatsApp within 7 days and we'll work with you to find the best solution.",
  },
  {
    q: "What's the difference between AAA+, 1:1, and Super Clone?",
    a: "AAA+ is good entry-level quality. 1:1 means the watch matches the original dimensions exactly. Super Clone is the top tier — same materials, same movement behavior, same details. Our inventory is focused on Super Clone and 1:1 tiers.",
  },
  {
    q: "Can I request a specific reference you don't have listed?",
    a: "Absolutely. Message us on WhatsApp with the reference number or model name. We can source most popular brands within 3–10 days.",
  },
  {
    q: "Is it legal to buy replica watches?",
    a: "Laws vary by country. Buyers are responsible for understanding local regulations and customs requirements. We ship with discreet packaging worldwide, but customs outcomes are beyond our control.",
  },
  {
    q: "How do I contact you?",
    a: `The fastest way is WhatsApp: ${SITE_CONFIG.contact.whatsappDisplay}. We typically respond within 2 hours during business hours.`,
  },
];

export default function FAQPage() {
  /* FAQ Schema (FAQPage structured data for Google rich results) */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="container py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 className="h-serif text-4xl mb-3">Frequently Asked Questions</h1>
      <p className="text-ink-muted mb-10">Can't find what you're looking for? Message us on WhatsApp.</p>

      <div className="space-y-4">
        {FAQS.map((f, i) => (
          <details key={i} className="card p-5 group">
            <summary className="cursor-pointer flex justify-between items-center font-medium text-ink list-none">
              <span>{f.q}</span>
              <span className="text-gold text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-ink-muted mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
