"use client";

import { useState } from "react";

/**
 * Blog cover images — local, verified, on-brand.
 * Original posts use their purpose-made SVG covers; brand buyer-guides use a
 * real customer watch photo where we have a match, else a branded cover.
 * Falls back to an elegant gradient if an image fails to load.
 */

const BLOG_IMAGES: Record<string, string> = {
  "what-is-a-super-clone-watch": "/images/blog/super-clone-guide.svg",
  "clean-vs-vs-factory": "/images/blog/clean-vs-vs.svg",
  "how-to-spot-fake": "/images/blog/spot-fake.svg",
  "history-of-rolex": "/images/blog/history-rolex.svg",
  "audemars-piguet-royal-oak-legend": "/images/blog/royal-oak-legend.svg",
  "swiss-movement-explained": "/images/blog/swiss-movement.svg",
  "sapphire-vs-mineral-crystal": "/images/blog/sapphire-crystal.svg",
  "water-resistance-guide": "/images/blog/water-resistance.svg",
  "most-popular-watches-2026": "/images/blog/popular-2026.svg",
  "which-watch-matches-your-style": "/images/blog/style-guide.svg",
  "caring-for-your-watch": "/images/blog/watch-care.svg",
  "rolex-vs-omega-vs-ap": "/images/blog/rolex-omega-ap.svg",
  "best-panerai-super-clone": "/images/review-10.jpg",
  "best-vacheron-constantin-super-clone": "/images/blog/super-clone-guide.svg",
  "best-richard-mille-super-clone": "/images/blog/popular-2026.svg",
  "super-clone-factories-guide": "/images/blog/clean-vs-vs.svg",
};

// Category label based on slug keywords
function getCategory(slug: string): string {
  if (slug.includes("history") || slug.includes("legend") || slug.includes("royal-oak")) return "BRAND STORY";
  if (slug.includes("vs") || slug.includes("rolex-omega")) return "COMPARISON";
  if (slug.includes("best-") || slug.includes("factories")) return "BUYER GUIDE";
  if (slug.includes("guide") || slug.includes("style") || slug.includes("spot") || slug.includes("caring")) return "GUIDE";
  if (slug.includes("movement") || slug.includes("sapphire") || slug.includes("water") || slug.includes("crystal")) return "TECHNICAL";
  if (slug.includes("popular") || slug.includes("2026") || slug.includes("trend")) return "TRENDING";
  return "EDITORIAL";
}

interface Props {
  slug: string;
  title: string;
  className?: string;
  imageUrl?: string;
  showCategory?: boolean;
}

export function BlogCover({ slug, title, className = "", imageUrl, showCategory = true }: Props) {
  const category = getCategory(slug);
  const [imageError, setImageError] = useState(false);
  const src = imageUrl || BLOG_IMAGES[slug];

  return (
    <div className={`relative w-full h-full overflow-hidden bg-bg-elev ${className}`}>
      {/* Background image */}
      {src && !imageError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          {/* Subtle dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </>
      ) : (
        /* Fallback gradient */
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0e17 0%, #1a1a2e 50%, #16213e 100%)",
          }}
        />
      )}

      {/* Category badge - bottom left */}
      {showCategory && (
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] tracking-[0.2em] font-semibold text-gold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}

