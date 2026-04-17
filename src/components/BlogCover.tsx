"use client";

/**
 * Elegant gradient blog cover — no image files needed.
 * Generates a unique color scheme per post based on the slug.
 */

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
}

export function BlogCover({ slug, title, className = "" }: Props) {
  const idx = hashSlug(slug) % PALETTES.length;
  const p = PALETTES[idx];
  const category = getCategory(slug);

  // Get a short display title (first 3-4 words max)
  const shortTitle = title.split(/[:\—\-–]/).at(-1)?.trim().split(" ").slice(0, 4).join(" ") || title.split(" ").slice(0, 3).join(" ");

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${p.from} 0%, ${p.via} 50%, ${p.to} 100%)`,
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, ${p.accent}, transparent 70%)` }}
      />

      {/* Decorative crosshair lines */}
      <div
        className="absolute top-1/2 left-0 w-full h-px opacity-20"
        style={{ background: `linear-gradient(to right, transparent, ${p.accent}40, transparent)` }}
      />
      <div
        className="absolute top-0 left-1/2 w-px h-full opacity-10"
        style={{ background: `linear-gradient(to bottom, transparent, ${p.accent}30, transparent)` }}
      />

      {/* Corner accents */}
      <svg className="absolute top-3 left-3 w-8 h-8 opacity-30" viewBox="0 0 32 32" fill="none" stroke={p.accent} strokeWidth="1.5">
        <path d="M0 12 L0 0 L12 0" />
      </svg>
      <svg className="absolute bottom-3 right-3 w-8 h-8 opacity-30" viewBox="0 0 32 32" fill="none" stroke={p.accent} strokeWidth="1.5">
        <path d="M32 20 L32 32 L20 32" />
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        {/* Diamond */}
        <div className="w-3 h-3 rotate-45 border border-gold/50 mb-3" />
        {/* Category chip */}
        <span className="text-gold text-[10px] tracking-[0.25em] font-medium mb-2">
          {category}
        </span>
        {/* Title */}
        <h3 className="font-serif text-ink text-base md:text-lg leading-snug max-w-[80%]">
          {shortTitle}
        </h3>
        {/* Bottom line */}
        <div className="w-10 h-px bg-gold/40 mt-3" />
        <span className="text-ink-dim text-[9px] tracking-[0.2em] mt-2">CLONICAWATCH</span>
      </div>
    </div>
  );
}
