import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogCover } from "@/components/BlogCover";

export const metadata = {
  title: "News & Blog — Clonicawatch",
  description: "Guides, comparisons, and the craft behind premium timepieces.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="container py-10 md:py-16">
      {/* Header */}
      <header className="mb-10 md:mb-14">
        <p className="chip-gold inline-block mb-4">NEWS & BLOG</p>
        <h1 className="h-serif text-3xl md:text-5xl">The Journal</h1>
        <p className="text-ink-muted mt-3 max-w-xl text-sm md:text-base">
          Buying guides, brand stories, and technical deep dives into the world of premium timepieces.
        </p>
      </header>

      {/* Featured Post - Large Hero Card */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block mb-10 md:mb-14"
        >
          <div className="card overflow-hidden border-transparent hover:border-gold/30 transition-all duration-300">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
                <BlogCover slug={featured.slug} title={featured.title} showCategory={true} />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <p className="text-xs text-ink-dim mb-3">{featured.date} · {featured.readingTime}</p>
                <h2 className="h-serif text-2xl md:text-3xl group-hover:text-gold transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-ink-muted text-sm mt-4 leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="mt-6">
                  <span className="text-gold text-sm font-medium group-hover:tracking-wider transition-all duration-300">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid of remaining posts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card overflow-hidden hover:border-gold/30 transition-all duration-300 group flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <BlogCover slug={p.slug} title={p.title} showCategory={true} />
              {/* Hover zoom effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-[11px] text-ink-dim">{p.date} · {p.readingTime}</p>
              <h2 className="h-serif text-lg mt-2 group-hover:text-gold transition-colors leading-snug line-clamp-2">
                {p.title}
              </h2>
              <p className="text-ink-muted text-sm mt-2 line-clamp-2 flex-1">
                {p.excerpt}
              </p>
              <p className="text-gold text-sm mt-4 font-medium group-hover:tracking-wider transition-all duration-300">
                Read →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
