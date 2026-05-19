/**
 * Site-wide configuration.
 * Keep all brand/contact/copy constants here so they can be swapped
 * from one place when branding is finalized.
 */
export const SITE_CONFIG = {
  // Branding
  name: "CLONICA",                // short wordmark
  fullName: "Clonicawatch",       // full brand name
  tagline: "Swiss Mechanism. Worldwide Shipping.",
  description:
    "Premium super clone watches — Rolex, Audemars Piguet, Patek Philippe, and more. Swiss-grade mechanisms, discreet worldwide delivery.",
  url: "https://clonica.online", // primary domain
  defaultLocale: "en",
  supportedLocales: ["en"] as const,
  defaultCurrency: "USD" as const,
  supportedCurrencies: ["USD", "EUR", "GBP", "AED", "TRY"] as const,
  // Contact
  contact: {
    whatsapp: "905535566422",                  // +90 553 556 64 22 (no leading + for wa.me)
    whatsappDisplay: "+90 553 556 64 22",
    telegram: "CLONICAWATCHES",                // Telegram username — used as https://t.me/CLONICAWATCHES
    telegramDisplay: "@CLONICAWATCHES",
    email: "Clonicawatch@gmail.com",
    instagram: "clonicaonline",                // Instagram handle — used as https://www.instagram.com/clonicaonline
    instagramDisplay: "@clonicaonline",
    addressLine: "Istanbul, Türkiye — Showroom visits by appointment",
    addressLocality: "Istanbul",
    addressCountry: "TR",
  },
  // Payment methods displayed across the site
  paymentMethods: [
    { key: "bank", label: "Bank Transfer", note: "Wise / SWIFT" },
    { key: "crypto", label: "Crypto", note: "BTC, USDT" },
    { key: "wu", label: "Western Union" },
    { key: "ria", label: "RIA Money Transfer" },
  ],
  // Shipping carriers
  shippingCarriers: ["DHL Express", "FedEx", "UPS"],
  // Trust signals (homepage strip)
  trustSignals: [
    { icon: "shield", label: "Secure Transactions" },
    { icon: "globe", label: "Worldwide Shipping" },
    { icon: "chat", label: "24/7 Support" },
    { icon: "package", label: "Discreet Packaging" },
  ],
};
export type SiteConfig = typeof SITE_CONFIG;

