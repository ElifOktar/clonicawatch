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
    whatsapp: "905355430744",           // +90 535 543 07 44
    whatsappDisplay: "+90 535 543 07 44",
    telegram: "905355430744",           // same number
    telegramDisplay: "+90 535 543 07 44",
    email: "Clonicawatch@gmail.com",
    instagram: "",                      // to be added
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
