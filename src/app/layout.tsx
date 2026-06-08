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
      "en-US": SITE_
