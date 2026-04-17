import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogCover } from "@/components/BlogCover";

export const metadata = {
  title: "Journal",
  description: "Guides, comparisons, and the craft behind premium timepieces.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <div className="container py-12">
      <header className="mb-12">
        <p className="chip-gold inline-block mb-4">JOURNAL</p>
        <h1 className="h-serif text-4xl md:text-5xl">Watches, Makers, and Markets</h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          Everything you need to know about premium timepieces — buying guides,
          detailed reviews, and reference comparisons.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card overflow-hidden hover:border-gold-deep transition-colors group">
            <div className="relative aspect-[16/10]">
              <BlogCover slug={p.slug} title={p.title} />
            </div>
            <div className="p-5">
              <p className="text-xs text-ink-dim">{p.date} · {p.readingTime}</p>
              <h2 className="h-serif text-xl mt-2 group-hover:text-gold transition-colors">{p.title}</h2>
              <p className="text-ink-muted text-sm mt-2 line-clamp-2">{p.excerpt}</p>
              <p className="text-gold text-sm mt-4">Read →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
