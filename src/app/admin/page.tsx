"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalBlog: number;
  brands: string[];
  inStock: number;
  onSale: number;
  featured: number;
  recentProducts: { id: string; model_name: string; brand: string; price: { usd: number }; stock_status: string; created_at: string }[];
}

function StatCard({ label, value, color, href }: { label: string; value: string | number; color: string; href?: string }) {
  const inner = (
    <div className={`bg-bg-elev border border-line rounded-xl p-5 hover:border-${color} transition-colors`}>
      <div className={`text-3xl font-bold text-${color}`}>{value}</div>
      <div className="text-ink-muted text-sm mt-1">{label}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        const products = data.products || [];
        const brands = [...new Set(products.map((p: any) => p.brand))] as string[];
        setStats({
          totalProducts: products.length,
          totalBlog: 0,
          brands,
          inStock: products.filter((p: any) => p.stock_status === "In Stock").length,
          onSale: products.filter((p: any) => p.is_on_sale).length,
          featured: products.filter((p: any) => p.is_featured).length,
          recentProducts: products.slice(0, 5),
        });
      });
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((data) => setBlogCount(data.total || 0));
  }, []);

  if (!stats) {
    return <div className="text-ink-muted py-12">Yukleniyor...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-ink-muted text-sm mt-1">Clonicawatch yonetim paneli</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Toplam Urun" value={stats.totalProducts} color="gold" href="/admin/products" />
        <StatCard label="Marka" value={stats.brands.length} color="gold-bright" />
        <StatCard label="Stokta" value={stats.inStock} color="green-400" />
        <StatCard label="Indirimde" value={stats.onSale} color="red-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-bg-elev border border-line rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Son Eklenen Urunler</h2>
            <Link href="/admin/products" className="text-gold text-sm hover:underline">
              Tumunu Gor
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentProducts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-bg hover:bg-bg-soft transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{p.model_name}</div>
                  <div className="text-xs text-ink-muted">{p.brand}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gold font-medium">${p.price.usd}</div>
                  <div className={`text-xs ${p.stock_status === "In Stock" ? "text-green-400" : p.stock_status === "Sold Out" ? "text-red-400" : "text-yellow-400"}`}>
                    {p.stock_status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-elev border border-line rounded-xl p-5">
          <h2 className="font-semibold mb-4">Hizli Islemler</h2>
          <div className="space-y-3">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-gold/10 border border-gold/20 hover:bg-gold/20 transition-colors"
            >
              <span className="text-gold text-xl">+</span>
              <div>
                <div className="text-sm font-medium text-gold">Yeni Urun Ekle</div>
                <div className="text-xs text-ink-muted">Manuel olarak urun bilgisi gir</div>
              </div>
            </Link>
            <Link
              href="/admin/import"
              className="flex items-center gap-3 p-4 rounded-lg bg-bg hover:bg-bg-soft border border-line transition-colors"
            >
              <span className="text-ink-muted text-xl">&#8593;</span>
              <div>
                <div className="text-sm font-medium">Toplu Import</div>
                <div className="text-xs text-ink-muted">JSON dosyasindan toplu urun yukle</div>
              </div>
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-bg hover:bg-bg-soft border border-line transition-colors"
            >
              <span className="text-ink-muted text-xl">&#9998;</span>
              <div>
                <div className="text-sm font-medium">Blog Yazisi Ekle</div>
                <div className="text-xs text-ink-muted">SEO icerigi olustur</div>
              </div>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center gap-3 p-4 rounded-lg bg-bg hover:bg-bg-soft border border-line transition-colors"
            >
              <span className="text-ink-muted text-xl">&#9881;</span>
              <div>
                <div className="text-sm font-medium">Site Ayarlari</div>
                <div className="text-xs text-ink-muted">WhatsApp, sosyal medya, odeme yontemleri</div>
              </div>
            </Link>
          </div>

          <div className="mt-6 p-4 bg-bg rounded-lg border border-line">
            <div className="text-xs text-ink-dim mb-2">Ozet</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-ink-muted">Urunler:</span> <span className="text-gold">{stats.totalProducts}</span></div>
              <div><span className="text-ink-muted">Blog:</span> <span className="text-gold">{blogCount}</span></div>
              <div><span className="text-ink-muted">Markalar:</span> <span className="text-gold">{stats.brands.length}</span></div>
              <div><span className="text-ink-muted">One Cikan:</span> <span className="text-gold">{stats.featured}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
