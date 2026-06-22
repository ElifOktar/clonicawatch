// src/app/sitemap.ts
// Mevcut sitemap.ts'in genisletilmis versiyonu.
// Eklemeler: /reviews, bireysel blog yazilari, hreflang alternates
// 2026-06-22: /best-super-clone-watch-sites (AI pillar sayfasi) eklendi.
import type { MetadataRoute } from "next";
import { getAllProducts, getAllBrands } from "@/lib/products";
import { LADIES_BRANDS } from "@/lib/catalog";
import { getAllPosts } from "@/lib/blog";
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
    { path: "/best-super-clone-watch-sites", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/reviews", priority: 0.8, changeFrequency: "weekly" as const },
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
  // ─── Blog posts ───
  const blogPosts = getAllPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
    ...blogPosts,
    ...brandPages,
    ...ladiesBrandPages,
    ...productPages,
  ];
}

