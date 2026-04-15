// Re-exported from /data-model/product.schema.ts
// Kept in sync manually; in future we can share via a workspace package.

export type Brand =
  | "Rolex" | "Audemars Piguet" | "Patek Philippe" | "Omega" | "Hublot"
  | "Breitling" | "Cartier" | "TAG Heuer" | "Panerai" | "IWC"
  | "Richard Mille" | "Vacheron Constantin" | "Jaeger-LeCoultre"
  | "Tudor" | "Bell & Ross" | "Zenith" | "Chopard" | "Longines"
  | "Ulysse Nardin" | "Franck Muller" | "Piaget";

export type QualityTier = "Super Clone" | "1:1" | "AAA+" | "Top Quality";

export type Factory =
  | "Clean" | "ZF" | "Noob" | "VS" | "BP" | "ARF" | "APF"
  | "N Factory" | "BT" | "Other";

export type CaseMaterial =
  | "Stainless Steel 904L" | "Stainless Steel 316L"
  | "Yellow Gold Plated" | "Rose Gold Plated"
  | "Two-Tone (Gold/Steel)" | "Ceramic" | "Titanium"
  | "PVD Black" | "Carbon Fiber";

export type Crystal = "Sapphire" | "Mineral" | "Hardlex";

export type StrapType =
  | "Oyster" | "Jubilee" | "President" | "Leather" | "Rubber"
  | "NATO" | "Mesh/Milanese" | "Integrated Bracelet";

export type MovementType = "Automatic" | "Quartz" | "Manual Wind";

export type StockStatus = "In Stock" | "Limited Stock" | "Sold Out" | "Pre-Order";

export type Gender = "Men" | "Women" | "Unisex";

export type StyleTag =
  | "Diver" | "Chronograph" | "Dress" | "Pilot" | "Sport" | "GMT"
  | "Moonphase" | "Skeleton" | "Tourbillon" | "Perpetual Calendar";

export type Currency = "USD" | "EUR" | "GBP" | "AED" | "TRY";

export interface Price {
  usd: number;
  eur?: number;
  gbp?: number;
  aed?: number;
  try?: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;

  brand: Brand;
  collection: string;
  reference?: string;
  model_name: string;

  quality_tier: QualityTier;
  factory?: Factory;

  case_diameter_mm: number;
  case_material: CaseMaterial;
  case_thickness_mm?: number;
  crystal?: Crystal;
  water_resistance?: string;

  dial_color: string;
  dial_markers?: string;
  bezel_type?: string;
  bezel_color?: string;

  strap_type: StrapType;
  strap_color?: string;

  movement_type: MovementType;
  movement_caliber: string;
  is_swiss_movement?: boolean;
  power_reserve_hours?: number;
  jewels?: number;
  beat_rate_vph?: number;

  price: Price;
  original_price?: Price;
  stock_status: StockStatus;
  stock_count?: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  created_at: string;

  main_image: string;
  gallery_images: string[];
  video_url?: string;
  lifestyle_image?: string;

  gender: Gender;
  style_tags: StyleTag[];
  occasion_tags?: string[];

  meta_title?: string;
  meta_description?: string;
  keywords?: string[];

  short_description: string;
  long_description: string;
  features_bullets: string[];
  package_contents: string[];

  whatsapp_message_template?: string;
}
