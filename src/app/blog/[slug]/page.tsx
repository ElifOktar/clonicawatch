import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPostBySlug(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, openGraph: { title: p.title, description: p.excerpt, images: [p.cover] } };
}

function renderMarkdown(md: string) {
  // Minimal MD renderer — h2, h3, bold, bullets, paragraphs.
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

  return (
    <article className="container py-12 max-w-3xl">
      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-gold">Journal</Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs text-ink-dim">{p.date} · {p.readingTime} · {p.author}</p>
        <h1 className="h-serif text-4xl md:text-5xl mt-3">{p.title}</h1>
        <p className="text-ink-muted mt-4 text-lg">{p.excerpt}</p>
      </header>

      <div className="relative aspect-[16/9] card overflow-hidden mb-10">
        <Image src={p.cover} alt={p.title} fill sizes="100vw" className="object-cover" />
      </div>

      <div
        className="prose-blog text-ink-muted leading-relaxed space-y-4
                   [&_h2]:text-ink [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3
                   [&_h3]:text-ink [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-2
                   [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2
                   [&_li]:flex [&_li]:gap-2 [&_li]:before:content-['◆'] [&_li]:before:text-gold
                   [&_strong]:text-ink"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(p.content) }}
      />

      <div className="mt-16 card p-6 text-center">
        <p className="text-ink-muted">Looking for a specific reference?</p>
        <a
          href="https://wa.me/905355430744"
          target="_blank" rel="noopener"
          className="btn-gold inline-flex mt-3"
        >💬 Ask on WhatsApp</a>
      </div>
    </article>
  );
}
