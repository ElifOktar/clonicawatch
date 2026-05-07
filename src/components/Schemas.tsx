// src/components/Schemas.tsx
// Yeni dosya. Reusable JSON-LD schema componentleri.
// Kullanim: ilgili sayfada <ProductSchema product={...} /> seklinde import et.

import { SITE_CONFIG } from "@/lib/config";

interface ProductSchemaProps {
  product: {
    id: string;
    slug: string;
    brand: string;
    model_name: string;
    collection?: string;
    reference?: string;
    sku?: string;
    short_description?: string;
    long_description?: string;
    main_image: string;
    gallery_images?: string[];
    case_diameter_mm?: number;
    case_material?: string;
    movement_type?: string;
    movement_caliber?: string;
    price: { usd: number };
    stock_status: string;
    gender?: string;
  };
}

/** Product + Offer schema. Her urun sayfasinda kullan. */
export function ProductSchema({ product }: ProductSchemaProps) {
  const availability =
    product.stock_status === "In Stock"
      ? "https://schema.org/InStock"
      : product.stock_status === "Limited Stock"
      ? "https://schema.org/LimitedAvailability"
      : product.stock_status === "Pre-Order"
      ? "https://schema.org/PreOrder"
      : "https://schema.org/OutOfStock";

  const baseUrl = SITE_CONFIG.url;
  const productUrl = `${baseUrl}/product/${product.slug}`;
  const images = (product.gallery_images || [product.main_image]).map((img) =>
    img.startsWith("http") ? img : `${baseUrl}${img}`
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.model_name,
    description: product.short_description || product.long_description?.substring(0, 250) || product.model_name,
    image: images,
    sku: product.sku || product.id,
    mpn: product.reference || product.sku || product.id,
    brand: { "@type": "Brand", name: product.brand },
    category: product.collection ? `${product.brand} > ${product.collection}` : product.brand,
    audience: product.gender
      ? { "@type": "PeopleAudience", suggestedGender: product.gender.toLowerCase() }
      : undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.price.usd,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: SITE_CONFIG.fullName },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    additionalProperty: [
      product.case_diameter_mm && {
        "@type": "PropertyValue",
        name: "Case Diameter",
        value: `${product.case_diameter_mm}mm`,
      },
      product.case_material && {
        "@type": "PropertyValue",
        name: "Case Material",
        value: product.case_material,
      },
      product.movement_type && {
        "@type": "PropertyValue",
        name: "Movement Type",
        value: product.movement_type,
      },
      product.movement_caliber && {
        "@type": "PropertyValue",
        name: "Movement Caliber",
        value: product.movement_caliber,
      },
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** BreadcrumbList schema. Her ana sayfada (urun, marka, kategori, ladies) kullan. */
interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = SITE_CONFIG.url;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** FAQ schema. /faq sayfasi ve buying guide makaleleri icin. */
interface FAQSchemaProps {
  questions: { question: string; answer: string }[];
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** CollectionPage schema. Marka ve koleksiyon sayfalarinda kullan. */
interface CollectionPageSchemaProps {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
  brand?: string;
}

export function CollectionPageSchema({
  name,
  description,
  url,
  numberOfItems,
  brand,
}: CollectionPageSchemaProps) {
  const baseUrl = SITE_CONFIG.url;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: fullUrl,
    isPartOf: { "@type": "WebSite", url: baseUrl, name: SITE_CONFIG.fullName },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    },
    ...(brand && { about: { "@type": "Brand", name: brand } }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Article schema. Blog/buying guide makaleleri icin. */
interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = "Clonica Editorial",
  url,
}: ArticleSchemaProps) {
  const baseUrl = SITE_CONFIG.url;
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image: image.startsWith("http") ? image : `${baseUrl}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: author },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logos/clonica-logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": fullUrl },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

