import type { MetadataRoute } from "next";
import { getAllProducts, getAllBrands } from "@/lib/products";
import { SITE_CONFIG } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const now = new Date();

  const staticPages = [
    "", "/new-arrivals", "/on-sale", "/faq", "/shipping",
    "/payment", "/contact", "/about", "/cart",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const brandPages = getAllBrands().map((b) => ({
    url: `${base}/brand/${b.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const productPages = getAllProducts().map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...brandPages, ...productPages];
}
