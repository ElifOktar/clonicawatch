import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
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
  openGraph: {
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.fullName,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE_CONFIG.fullName, description: SITE_CONFIG.description },
  robots: { index: true, follow: true },
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
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["English", "Turkish"],
  },
  sameAs: [],
};

/* WebSite Schema — Google Sitelinks Search */
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Clonicawatch",
  url: "https://clonica.online",
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
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <LayoutShell>{children}</LayoutShell>
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
