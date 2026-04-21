"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.model_name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q) ||
      (p.reference || "").toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  const deleteSelected = async () => {
    if (!selected.size) return;
    if (!confirm(`${selected.size} urunu silmek istediginize emin misiniz?`)) return;
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected] }),
    });
    setSelected(new Set());
    load();
  };

  const deleteSingle = async (id: string) => {
    if (!confirm("Bu urunu silmek istediginize emin misiniz?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "In Stock": return "text-green-400 bg-green-400/10";
      case "Limited Stock": return "text-yellow-400 bg-yellow-400/10";
      case "Sold Out": return "text-red-400 bg-red-400/10";
      case "Pre-Order": return "text-blue-400 bg-blue-400/10";
      default: return "text-ink-muted bg-bg";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Urunler</h1>
          <p className="text-ink-muted text-sm mt-1">{products.length} urun kayitli</p>
        </div>
        <Link href="/admin/products/new" className="bg-gold hover:bg-gold-bright text-bg font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          + Yeni Urun
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ara... (marka, model, referans)"
          className="flex-1 bg-bg-elev border border-line rounded-lg px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
        />
        {selected.size > 0 && (
          <button
            onClick={deleteSelected}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            {selected.size} urunu sil
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-ink-muted py-12 text-center">Yukleniyor...</div>
      ) : (
        <div className="bg-bg-elev border border-line rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted text-xs">
                <th className="p-3 w-10">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-gold" />
                </th>
                <th className="p-3">Urun</th>
                <th className="p-3 hidden md:table-cell">Marka</th>
                <th className="p-3 hidden lg:table-cell">Factory</th>
                <th className="p-3 hidden sm:table-cell">Fiyat</th>
                <th className="p-3 hidden md:table-cell">Stok</th>
                <th className="p-3 w-20">Islem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line/50 hover:bg-bg-soft transition-colors">
                  <td className="p-3">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} className="accent-gold" />
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-gold transition-colors">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-bg flex-shrink-0 border border-line">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.main_image || "/images/placeholder-watch.svg"}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-watch.svg"; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium break-words">{p.model_name}</div>
                        <div className="text-xs text-ink-muted">{p.reference || p.sku}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="p-3 hidden md:table-cell text-ink-muted">{p.brand}</td>
                  <td className="p-3 hidden lg:table-cell text-ink-muted">{p.factory || "-"}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className="text-gold font-medium">${p.price.usd}</span>
                    {p.is_on_sale && p.original_price && (
                      <span className="text-ink-dim line-through text-xs ml-1">${p.original_price.usd}</span>
                    )}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(p.stock_status)}`}>
                      {p.stock_status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-xs text-gold hover:underline"
                      >
                        Duzenle
                      </Link>
                      <button
                        onClick={() => deleteSingle(p.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-ink-muted">
                    {search ? "Arama sonucu bulunamadi" : "Henuz urun yok"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
