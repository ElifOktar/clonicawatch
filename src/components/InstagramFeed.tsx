import { SITE_CONFIG } from "@/lib/config";

// Placeholder grid — replace with real Instagram Basic Display API integration later.
// For non-technical maintenance: simply swap `INSTAGRAM_TILES` array below with
// image URLs from the brand's Instagram (copy image URL via right-click → Save).
const INSTAGRAM_TILES = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i),
  image: "/images/placeholder-watch.svg",
  caption: "Timeless icons, delivered.",
}));

export function InstagramFeed() {
  const igUrl = SITE_CONFIG.contact.instagram
    ? `https://instagram.com/${SITE_CONFIG.contact.instagram}`
    : "#";

  return (
    <section className="container py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="chip-gold inline-block mb-3">@CLONICAWATCH</p>
          <h2 className="h-serif text-3xl md:text-4xl">Follow on Instagram</h2>
        </div>
        <a href={igUrl} target="_blank" rel="noopener" className="text-gold text-sm hover:text-gold-bright">
          View Profile →
        </a>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {INSTAGRAM_TILES.map((t) => (
          <a
            key={t.id}
            href={igUrl}
            target="_blank" rel="noopener"
            className="relative aspect-square card overflow-hidden group"
            title={t.caption}
          >
            <img
              src={t.image}
              alt={t.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/40 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-gold text-2xl transition-opacity">📷</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
