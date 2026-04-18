"use client";

import { useState } from "react";

/**
 * Blog cover with real supporting images from Unsplash.
 * Each article gets a relevant watch/luxury image.
 * Falls back to elegant gradient if image fails to load.
 */

const BLOG_IMAGES: Record<string, string> = {
  "what-is-a-super-clone-watch": "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=500&fit=crop&q=80",
  "clean-vs-vs-factory": "https://images.unsplash.com/photo-1548171916-c8d1c2d1bb30?w=800&h=500&fit=crop&q=80",
  "how-to-spot-fake": "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=500&fit=crop&q=80",
  "history-of-rolex": "https://images.unsplash.com/photo-1627037558426-c2d07beda3af?w=800&h=500&fit=crop&q=80",
  "audemars-piguet-royal-oak-legend": "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=500&fit=crop&q=80",
  "swiss-movement-explained": "https://images.unsplash.com/photo-1495857000853-fe46c8aefc30?w=800&h=500&fit=crop&q=80",
  "sapphire-vs-mineral-crystal": "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=500&fit=crop&q=80",
  "water-resistance-guide": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&h=500&fit=crop&q=80",
  "most-popular-watches-2026": "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&h=500&fit=crop&q=80",
  "which-watch-matches-your-style": "https://images.unsplash.com/photo-1434056886845-dbe89f0b9571?w=800&h=500&fit=crop&q=80",
  "caring-for-your-watch": "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&h=500&fit=crop&q=80",
  "rolex-vs-omega-vs-ap": "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=500&fit=crop&q=80",
};

// Category label based on slug keywords
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
