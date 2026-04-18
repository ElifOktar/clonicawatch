import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { BlogCover } from "@/components/BlogCover";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPostBySlug(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, images: [p.cover] } };
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2>${escape(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h3>${escape(line.slice(4))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (/^\d+\.\s/.test(line)) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p>${inline(line)}</p>`);
    } else if (line.trim() === "") {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push("");
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p>${inline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}
function inline(s: string) { return escape(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
function escape(s: string) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!)); }

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const p = getPostBySlug(params.slug);
  if (!p) notFound();

  const allPosts = getAllPosts();
  const currentIdx = allPosts.findIndex((post) => post.slug === p.slug);
  const relatedPosts = allPosts.filter((_, i) => i !== currentIdx).slice(0, 3);

  return (
    <article className="container py-10 md:py-16 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2 text-ink-dim">›</span>
        <Link href="/blog" className="hover:text-gold transition-colors">Journal</Link>
        <span className="mx-2 text-ink-dim">›</span>
        <span className="text-ink-dim">Article</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-ink-dim">{p.date} · {p.readingTime} · {p.author}</p>
        <h1 className="h-serif text-3xl md:text-5xl mt-3 leading-tight">{p.title}</h1>
        <p className="text-ink-muted mt-4 text-base md:text-lg leading-relaxed">{p.excerpt}</p>
      </header>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-10">
        <BlogCover slug={p.slug} title={p.title} showCategory={false} />
      </div>

      {/* Content */}
      <div
        className="prose-blog text-ink-muted leading-relaxed space-y-4
                   [&_h2]:text-ink [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3
                   [&_h3]:text-ink [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-2
                   [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2
                   [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['◆'] [&_li]:before:text-gold
                   [&_strong]:text-ink"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }}
      />

      {/* CTA */}
      <div className="mt-16 card p-8 text-center bg-gradient-to-br from-bg-elev to-bg">
        <p className="text-ink text-lg font-serif">Looking for a specific reference?</p>
        <p className="text-ink-muted text-sm mt-2">Our team is ready to help you find the perfect piece.</p>
        <a
          href="https://wa.me/905355430744"
          target="_blank" rel="noopener"
          className="btn-gold inline-flex mt-4"
        >Message Us on WhatsApp</a>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h3 className="h-serif text-2xl mb-6">More from the Journal</h3>
          <div className="grid sm:grid-cols-3 gap-5">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="card overflow-hidden hover:border-gold/30 transition-all group"
              >
                <div className="relative aspect-[16/10]">
                  <BlogCover slug={rp.slug} title={rp.title} showCategory={false} />
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-ink-dim">{rp.date}</p>
                  <h4 className="text-sm font-serif mt-1 group-hover:text-gold transition-colors line-clamp-2">{rp.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
