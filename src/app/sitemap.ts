// src/app/sitemap.ts
// Mevcut sitemap.ts'in genisletilmis versiyonu.
// Eklemeler: /ladies, /ladies/[brand], /blog, /blog/[slug], /shop, /category, /wishlist (no), /admin (no, robots blocks)
// Hreflang sitemap-extensions schema yok cunku Next.js MetadataRoute.Sitemap onu bizatihi destekliyor (alternates field).

import type { MetadataRoute } from "next";
import {
  getAllProducts,
  getAllBrands,
  getAllBlogPosts,        // YENI: blog post listesi
} from "@/lib/products";
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
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/authenticity-guarantee", priority: 0.7, changeFrequency: "monthly" as const },
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

  // ─── Brand pages (men's catalog + ladies) ───
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

  // ─── Blog posts ───
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllBlogPosts();
    blogPages = posts.map((post: { slug: string; updated_at?: string; published_at?: string }) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : (post.published_at ? new Date(post.published_at) : now),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // getAllBlogPosts henuz yoksa hata yutulur (geriye uyumluluk)
  }

  return [
    ...staticPages,
    ...brandPages,
    ...ladiesBrandPages,
    ...productPages,
    ...blogPages,
  ];
}

