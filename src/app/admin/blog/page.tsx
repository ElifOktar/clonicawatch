"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingTime: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deletePost = async (slug: string) => {
    if (!confirm("Bu yaziyi silmek istediginize emin misiniz?")) return;
    await fetch("/api/admin/blog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog Yazilari</h1>
          <p className="text-ink-muted text-sm mt-1">{posts.length} yazi</p>
        </div>
        <Link href="/admin/blog/new" className="bg-gold hover:bg-gold-bright text-bg font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          + Yeni Yazi
        </Link>
      </div>

      {loading ? (
        <div className="text-ink-muted py-12 text-center">Yukleniyor...</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.slug} className="bg-bg-elev border border-line rounded-xl p-5 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-ink-muted mt-1">{p.excerpt}</div>
                <div className="flex gap-4 text-xs text-ink-dim mt-2">
                  <span>{p.date}</span>
                  <span>{p.author}</span>
                  <span>{p.readingTime}</span>
                </div>
              </div>
              <div className="flex gap-3 ml-4">
                <Link href={`/blog/${p.slug}`} className="text-xs text-ink-muted hover:text-gold transition-colors">
                  Onizle
                </Link>
                <button onClick={() => deletePost(p.slug)} className="text-xs text-red-400 hover:underline">
                  Sil
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-ink-muted text-center py-12">Henuz blog yazisi yok</div>
          )}
        </div>
      )}
    </div>
  );
}
