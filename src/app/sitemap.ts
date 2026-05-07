// src/app/sitemap.ts
// Mevcut sitemap.ts'in genisletilmis versiyonu.
// FIX: getAllBlogPosts import'u kaldirildi (henuz @/lib/products'ta tanimli degil).
//      Blog sistemi eklendiginde tekrar acilabilir.
// Eklemeler: /ladies, /shop, /category, hreflang alternates

import type { MetadataRoute } from "next";
import { getAllProducts, getAllBrands } from "@/lib/products";
import { LADIES_BRANDS } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url;
  const now = new Date();

  // ─── Static & semi-static pages ───
  const staticPages: MetadataRoute.Sitemap = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/shop", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/new-arrivals", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/on-sale", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/ladies", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/shipping", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/payment", priority: 0.5, changeFrequency: "monthly" as const },
  ].map((p) => ({
    url: `${base}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    alternates: {
      languages: {
        "en-US": `${base}${p.path}`,
        "en-GB": `${base}/en-gb${p.path}`,
        "de-DE": `${base}/de${p.path}`,
        "fr-FR": `${base}/fr${p.path}`,
        "ar-AE": `${base}/ar${p.path}`,
      },
    },
  }));

  // ─── Brand pages ───
  const brands = await getAllBrands();
  const brandPages = brands.map((b) => ({
    url: `${base}/brand/${b.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // ─── Ladies brand sub-pages ───
  const ladiesBrandPages = LADIES_BRANDS.map((b) => ({
    url: `${base}/ladies/${b.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // ─── Product pages ───
  const products = await getAllProducts();
  const productPages = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    ...staticPages,
    ...brandPages,
    ...ladiesBrandPages,
    ...productPages,
  ];
}

