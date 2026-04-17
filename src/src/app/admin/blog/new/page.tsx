"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPost() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    cover: "/images/placeholder-watch.svg",
    readingTime: "5 min",
    author: "Clonicawatch Editorial",
  });

  const set = (key: string) => (e: any) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Kaydetme hatasi");
      router.push("/admin/blog");
    } catch (err) {
      alert("Hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-bg border border-line rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors";
  const labelCls = "block text-xs text-ink-muted mb-1.5 font-medium";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Yeni Blog Yazisi</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="bg-bg-elev border border-line rounded-xl p-5 space-y-4">
          <div>
            <label className={labelCls}>Baslik *</label>
            <input value={form.title} onChange={set("title")} placeholder="What is a Super Clone Watch?" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Ozet (1 cumle)</label>
            <input value={form.excerpt} onChange={set("excerpt")} placeholder="Kisa ozet..." className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Yazar</label>
              <input value={form.author} onChange={set("author")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Okuma Suresi</label>
              <input value={form.readingTime} onChange={set("readingTime")} placeholder="5 min" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Kapak Gorseli URL</label>
              <input value={form.cover} onChange={set("cover")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Icerik (Markdown destekli)</label>
            <textarea value={form.content} onChange={set("content")} rows={15} placeholder="## Baslik&#10;&#10;Paragraf..." className={inputCls} />
            <p className="text-[11px] text-ink-dim mt-1">Markdown: ## Baslik, ### Alt baslik, **kalin**, - madde</p>
          </div>
        </div>
        <button type="submit" disabled={saving} className="bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50">
          {saving ? "Kaydediliyor..." : "Yayinla"}
        </button>
      </form>
    </div>
  );
}
