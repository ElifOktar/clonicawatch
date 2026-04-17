/**
 * Centralized product catalog structure.
 *
 * This is the SINGLE SOURCE OF TRUTH for:
 *   - Brand list & slugs
 *   - Collection (sub-category) trees
 *   - Ladies Watches section
 *   - Navigation menus, brand pages, filters, analytics tags
 *
 * When adding or removing a brand / collection, edit ONLY this file.
 * Every component (MobileMenu, BrandCircles, Header, brand pages,
 * filters, future GA4 events) reads from here.
 */

// ─── Types ──────────────────────────────────────
export interface Collection {
  name: string;
  slug: string;
}

export interface CatalogBrand {
  name: string;
  slug: string;
  collections?: Collection[];
  /** If true this brand appears in the "Ladies Watches" section instead of the main list */
  isLadies?: boolean;
  /** Parent brand slug — used for ladies sub-brands that share a parent brand page */
  parentBrand?: string;
}

// ─── Men's / Unisex Brands (main catalog) ───────
export const CATALOG_BRANDS: CatalogBrand[] = [
  {
    name: "Audemars Piguet",
    slug: "audemars-piguet",
    collections: [
      { name: "Royal Oak", slug: "royal-oak" },
      { name: "Royal Oak Offshore", slug: "royal-oak-offshore" },
      { name: "Royal Oak Offshore Diver", slug: "royal-oak-offshore-diver" },
    ],
  },
  { name: "Breitling", slug: "breitling" },
  { name: "Cartier", slug: "cartier" },
  { name: "Franck Muller", slug: "franck-muller" },
  { name: "Hublot", slug: "hublot" },
  { name: "IWC", slug: "iwc" },
  { name: "Panerai", slug: "panerai" },
  {
    name: "Patek Philippe",
    slug: "patek-philippe",
    collections: [
      { name: "Nautilus", slug: "nautilus" },
      { name: "Aquanaut", slug: "aquanaut" },
      { name: "Calatrava", slug: "calatrava" },
      { name: "Cubitus", slug: "cubitus" },
      { name: "Other", slug: "other" },
    ],
  },
  { name: "Richard Mille", slug: "richard-mille" },
  {
    name: "Rolex",
    slug: "rolex",
    collections: [
      { name: "Submariner", slug: "submariner" },
      { name: "GMT-Master II", slug: "gmt-master-ii" },
      { name: "Daytona", slug: "daytona" },
      { name: "Sea-Dweller", slug: "sea-dweller" },
      { name: "Sky-Dweller", slug: "sky-dweller" },
      { name: "Land-Dweller", slug: "land-dweller" },
      { name: "Datejust", slug: "datejust" },
      { name: "Day-Date", slug: "day-date" },
      { name: "Explorer", slug: "explorer" },
      { name: "Yacht-Master", slug: "yacht-master" },
      { name: "Air-King", slug: "air-king" },
      { name: "Cellini", slug: "cellini" },
      { name: "Oyster Perpetual", slug: "oyster-perpetual" },
      { name: "1908", slug: "1908" },
      { name: "Milgauss", slug: "milgauss" },
    ],
  },
  { name: "Tudor", slug: "tudor" },
  { name: "Vacheron Constantin", slug: "vacheron-constantin" },
];

// ─── Ladies Watches ─────────────────────────────
export const LADIES_BRANDS: CatalogBrand[] = [
  {
    name: "Rolex Ladies",
    slug: "rolex-ladies",
    isLadies: true,
    parentBrand: "rolex",
    collections: [
      { name: "Datejust 31mm", slug: "datejust-31mm" },
      { name: "Datejust 36mm", slug: "datejust-36mm" },
      { name: "Oyster Perpetual 31mm", slug: "oyster-perpetual-31mm" },
      { name: "Oyster Perpetual 36mm", slug: "oyster-perpetual-36mm" },
      { name: "Day-Date 36mm", slug: "day-date-36mm" },
    ],
  },
  {
    name: "Bvlgari",
    slug: "bvlgari",
    isLadies: true,
  },
  {
    name: "Cartier Ladies",
    slug: "cartier-ladies",
    isLadies: true,
    parentBrand: "cartier",
  },
  {
    name: "Audemars Piguet Ladies",
    slug: "audemars-piguet-ladies",
    isLadies: true,
    parentBrand: "audemars-piguet",
  },
  {
    name: "Patek Philippe Ladies",
    slug: "patek-philippe-ladies",
    isLadies: true,
    parentBrand: "patek-philippe",
  },
];

// ─── Combined (for brand pages & routing) ───────
export const ALL_CATALOG_BRANDS: CatalogBrand[] = [
  ...CATALOG_BRANDS,
  ...LADIES_BRANDS,
];

// ─── Helpers ────────────────────────────────────

/** Slug → display name map for all brands (used in brand pages, SEO, analytics) */
export function getBrandFromSlug(slug: string): string | undefined {
  const entry = ALL_CATALOG_BRANDS.find((b) => b.slug === slug);
  return entry?.name;
}

/** Get all unique brand slugs for static page generation */
export function getAllBrandSlugs(): string[] {
  return ALL_CATALOG_BRANDS.map((b) => b.slug);
}

/** Get collections for a brand slug */
export function getCollections(brandSlug: string): Collection[] {
  const entry = ALL_CATALOG_BRANDS.find((b) => b.slug === brandSlug);
  return entry?.collections ?? [];
}

/** Check if a slug is a ladies brand */
export function isLadiesBrand(slug: string): boolean {
  return LADIES_BRANDS.some((b) => b.slug === slug);
}
