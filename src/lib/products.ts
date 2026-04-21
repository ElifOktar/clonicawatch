import type { Product, Brand } from "@/types/product";
import { SITE_CONFIG } from "@/lib/config";
import { supabase } from "@/lib/supabase";

// ──────────────────────────────────────────────
// Product data loader — Supabase PostgreSQL
// All functions are async. Server components can await them directly.
// ──────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProducts error:", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return undefined;

  return data as Product;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;

  return data as Product;
}

export async function getProductsByBrand(brand: Brand): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand", brand)
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data ?? []) as Product[];
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_new_arrival", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data ?? []) as Product[];
}

export async function getOnSale(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_on_sale", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data ?? []) as Product[];
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand", product.brand)
    .neq("id", product.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  const results = (data ?? []) as Product[];

  if (results.length < limit) {
    const { data: more } = await supabase
      .from("products")
      .select("*")
      .neq("id", product.id)
      .neq("brand", product.brand)
      .order("created_at", { ascending: false })
      .limit(limit - results.length);

    if (more) results.push(...(more as Product[]));
  }

  return results.slice(0, limit);
}

export async function getAllBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .order("brand");

  if (error) return [];

  const set = new Set<Brand>();

  for (const row of data ?? []) set.add(row.brand as Brand);

  return Array.from(set);
}

// ──────────────────────────────────────────────
// Formatters (sync — no DB needed)
// ──────────────────────────────────────────────

export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ──────────────────────────────────────────────
// WhatsApp helpers (sync — no DB needed)
// ──────────────────────────────────────────────

export function getWhatsAppMessage(p: Product): string {
  if (p.whatsapp_message_template) return p.whatsapp_message_template;

  const price = formatPrice(p.price.usd);
  const productUrl = `${SITE_CONFIG.url}/product/${p.slug}`;

  return `Hi, I'd like more information about the ${p.model_name}${
    p.reference ? ` (${p.reference})` : ""
  }. Listed price: ${price}.\n\n${productUrl}`;
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
      } × ${it.qty} — ${formatPrice(it.product.price.usd)}\n   ${SITE_CONFIG.url}/product/${it.product.slug}`
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
// SEO helpers (sync — no DB needed)
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
