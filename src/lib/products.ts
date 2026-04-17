import type { Product, Brand } from "@/types/product";
import { SITE_CONFIG } from "@/lib/config";

// ──────────────────────────────────────────────
// Product data loader
// Reads JSON files from /content/products/*.json at build time.
// For MVP we import a static array; when we move to CMS, swap this
// single module without touching the rest of the app.
// ──────────────────────────────────────────────

import sampleProducts from "../../content/products/_sample.json";

const allProducts = sampleProducts as unknown as Product[];

export function getAllProducts(): Product[] {
  return [...allProducts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getProductsByBrand(brand: Brand): Product[] {
  return getAllProducts().filter((p) => p.brand === brand);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return getAllProducts()
    .filter((p) => p.is_featured)
    .slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return getAllProducts()
    .filter((p) => p.is_new_arrival)
    .slice(0, limit);
}

export function getOnSale(limit = 8): Product[] {
  return getAllProducts()
    .filter((p) => p.is_on_sale)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getAllProducts()
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.brand === product.brand ||
          p.style_tags.some((t) => product.style_tags.includes(t)))
    )
    .slice(0, limit);
}

export function getAllBrands(): Brand[] {
  const set = new Set<Brand>();
  for (const p of allProducts) set.add(p.brand);
  return Array.from(set).sort();
}

// ──────────────────────────────────────────────
// Formatters
// ──────────────────────────────────────────────

export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ──────────────────────────────────────────────
// WhatsApp helpers
// ──────────────────────────────────────────────

export function getWhatsAppMessage(p: Product): string {
  if (p.whatsapp_message_template) return p.whatsapp_message_template;
  const price = formatPrice(p.price.usd);
  return `Hi, I'd like more information about the ${p.model_name}${
    p.reference ? ` (${p.reference})` : ""
  }. Listed price: ${price}.`;
}

export function getWhatsAppUrl(message: string): string {
  const text = encodeURIComponent(message);
  return `https://wa.me/${SITE_CONFIG.contact.whatsapp}?text=${text}`;
}

export function getProductWhatsAppUrl(p: Product): string {
  return getWhatsAppUrl(getWhatsAppMessage(p));
}

// Cart → WhatsApp message (all items in one go)
export function buildCartWhatsAppMessage(
  items: { product: Product; qty: number }[]
): string {
  if (!items.length) return "";
  const lines = items.map(
    (it, i) =>
      `${i + 1}. ${it.product.model_name}${
        it.product.reference ? ` (${it.product.reference})` : ""
      } × ${it.qty} — ${formatPrice(it.product.price.usd)}`
  );
  const total = items.reduce(
    (sum, it) => sum + it.product.price.usd * it.qty,
    0
  );
  return [
    "Hi, I'd like to order the following items:",
    "",
    ...lines,
    "",
    `Total: ${formatPrice(total)} USD`,
    "",
    "Please advise on payment and shipping. Thank you.",
  ].join("\n");
}

// ──────────────────────────────────────────────
// SEO helpers
// ──────────────────────────────────────────────

export function getProductMetaTitle(p: Product): string {
  return (
    p.meta_title ??
    `${p.model_name} — ${p.quality_tier} Replica | ${SITE_CONFIG.name}`
  );
}

export function getProductMetaDescription(p: Product): string {
  if (p.meta_description) return p.meta_description;
  const specs = `${p.case_diameter_mm}mm ${p.case_material}, ${p.movement_caliber}`;
  return `${p.model_name} — ${specs}. ${p.short_description} ${formatPrice(
    p.price.usd
  )}. Worldwide express shipping.`.slice(0, 160);
}
