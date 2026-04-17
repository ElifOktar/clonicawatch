"use client";

import Image from "next/image";

/**
 * Premium blog cover — real watch photos from Unsplash with elegant text overlay.
 * Each post gets a curated, high-quality image. Falls back to a rich gradient design.
 */

/* ── Curated Unsplash images per slug ─────────────────────────── */
const COVER_IMAGES: Record<string, string> = {
  "what-is-a-super-clone-watch":
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80&auto=format",
  "clean-vs-vs-factory":
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80&auto=format",
  "how-to-spot-fake":
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&q=80&auto=format",
  "history-of-rolex":
    "https://images.unsplash.com/photo-1626567011978-66e70e424d10?w=800&q=80&auto=format",
  "audemars-piguet-royal-oak-legend":
    "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=800&q=80&auto=format",
  "swiss-movement-explained":
    "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80&auto=format",
  "sapphire-vs-mineral-crystal":
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80&auto=format",
  "water-resistance-guide":
    "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80&auto=format",
  "most-popular-watches-2026":
    "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80&auto=format",
  "which-watch-matches-your-style":
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80&auto=format",
  "caring-for-your-watch":
    "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=800&q=80&auto=format",
  "rolex-vs-omega-vs-ap":
    "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80&auto=format",
};

/* ── Gradient fallback palettes ───────────────────────────────── */
const PALETTES = [
  { from: "#0a0e17", via: "#1a1a2e", to: "#16213e", accent: "#c9a84c" },
  { from: "#0a0e17", via: "#1b1425", to: "#251636", accent: "#c9a84c" },
  { from: "#0a0e17", via: "#1a2020", to: "#0f2a1f", accent: "#c9a84c" },
  { from: "#0a0e17", via: "#201a14", to: "#2a1f0f", accent: "#c9a84c" },
  { from: "#0a0e17", via: "#141a25", to: "#0f1a36", accent: "#c9a84c" },
  { from: "#0a0e17", via: "#1a1520", to: "#2a1025", accent: "#c9a84c" },
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/* Category label from slug keywords */
function getCategory(slug: string): string {
  if (slug.includes("history") || slug.includes("legend") || slug.includes("royal-oak")) return "BRAND STORY";
  if (slug.includes("vs") || slug.includes("rolex-omega")) return "COMPARISON";
  if (slug.includes("guide") || slug.includes("style") || slug.includes("spot") || slug.includes("caring")) return "GUIDE";
  if (slug.includes("movement") || slug.includes("sapphire") || slug.includes("water") || slug.includes("crystal")) return "TECHNICAL";
  if (slug.includes("popular") || slug.includes("2026") || slug.includes("trend")) return "TRENDING";
  return "EDITORIAL";
}

interface Props {
  slug: string;
  title: string;
  className?: string;
}

export function BlogCover({ slug, title, className = "" }: Props) {
  const imageUrl = COVER_IMAGES[slug];
  const category = getCategory(slug);
  const idx = hashSlug(slug) % PALETTES.length;
  const p = PALETTES[idx];

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* ── Background: real photo or gradient fallback ── */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${p.from} 0%, ${p.via} 50%, ${p.to} 100%)`,
          }}
        />
      )}

      {/* ── Dark gradient overlay for text readability ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

      {/* ── Subtle gold line at bottom ── */}
      <div
        className="absolute bottom-0 left-0 w-full h-[2px] opacity-60"
        style={{ background: `linear-gradient(to right, transparent, #c9a84c, transparent)` }}
      />

      {/* ── Content overlay ── */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
        {/* Category chip */}
        <span className="inline-block self-start text-[10px] tracking-[0.2em] font-medium px-2 py-0.5 mb-2 rounded-sm bg-gold/20 text-gold border border-gold/30 backdrop-blur-sm">
          {category}
        </span>

        {/* Full title */}
        <h3 className="font-serif text-white text-sm md:text-base lg:text-lg leading-snug line-clamp-2 drop-shadow-lg">
          {title}
        </h3>

        {/* Brand watermark */}
        <span className="text-white/30 text-[8px] tracking-[0.15em] mt-2">
          CLONICAWATCH
        </span>
      </div>
    </div>
  );
}
