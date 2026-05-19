import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import { WishlistProvider } from "@/components/WishlistProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import LayoutShell from "@/components/LayoutShell";
import Analytics from "@/components/Analytics";
import { SITE_CONFIG } from "@/lib/config";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.fullName} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.fullName,
    locale: "en_US",
    alternateLocale: ["en_GB", "de_DE", "fr_FR", "ar_AE"],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_CONFIG.fullName, description: SITE_CONFIG.description },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_CONFIG.url,
    languages: {
      "en-US": SITE_CONFIG.url,
      "en-GB": `${SITE_CONFIG.url}/en-gb`,
      "de-DE": `${SITE_CONFIG.url}/de`,
      "fr-FR": `${SITE_CONFIG.url}/fr`,
      "ar-AE": `${SITE_CONFIG.url}/ar`,
      "x-default": SITE_CONFIG.url,
    },
  },
  verification: {
    google: "_SMYZ1Yx5wetOCoA6qrD_KE76mOQzyXDaxj6oADHjvw",
  },
};
/* Organization Schema — Google Knowledge Panel */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clonicawatch",
  url: "https://clonica.online",
  logo: "https://clonica.online/images/logos/clonica-logo.png",
  description: SITE_CONFIG.description,
  telephone: `+${SITE_CONFIG.contact.whatsapp}`,
  email: SITE_CONFIG.contact.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CONFIG.contact.addressLocality,
    addressCountry: SITE_CONFIG.contact.addressCountry,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: `+${SITE_CONFIG.contact.whatsapp}`,
    email: SITE_CONFIG.contact.email,
    availableLanguage: ["English", "Turkish"],
    areaServed: "Worldwide",
  },
  sameAs: [
    `https://t.me/${SITE_CONFIG.contact.telegram}`,
    `https://www.instagram.com/${SITE_CONFIG.contact.instagram}`,
    `https://wa.me/${SITE_CONFIG.contact.whatsapp}`,
  ],
};
/* WebSite Schema — Google Sitelinks Search */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Clonicawatch",
  url: "https://clonica.online",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://clonica.online/shop?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <CartProvider>
                <LayoutShell>{children}</LayoutShell>
              </CartProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}

