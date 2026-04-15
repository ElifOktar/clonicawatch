"use client";
import { useState } from "react";

// NOT: Bu sayfa "kod bilmeyen" operatörler için görsel bir ürün formu üretir.
// Güvenlik: client-side parola — sadece basit giriş. CMS kullanmadan MVP yeterli.
// Parolayı aşağıdan değiştir:
const ADMIN_PIN = "clonica2026";

const initial = {
  slug: "",
  sku: "",
  brand: "Rolex",
  collection: "",
  reference: "",
  model_name: "",
  quality_tier: "Super Clone",
  factory: "Clean",
  case_diameter_mm: 41,
  case_material: "Stainless Steel 904L",
  dial_color: "Black",
  bezel_color: "",
  strap_type: "Oyster",
  movement_type: "Automatic",
  movement_caliber: "Clone 3235",
  is_swiss_movement: false,
  power_reserve_hours: 70,
  price_usd: 1000,
  stock_status: "In Stock",
  stock_count: 1,
  is_featured: true,
  is_new_arrival: true,
  is_on_sale: false,
  water_resistance: "100m",
  gender: "Men",
  style_tags: "Diver, Sport",
  short_description: "",
  long_description: "",
  features: "Clean Factory production, Clone movement, Sapphire crystal",
  package: "Watch, Box, Warranty card, Adjustment tool",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [form, setForm] = useState(initial);
  const [copied, setCopied] = useState(false);

  if (!authed) {
    return (
      <div className="container py-24 max-w-md">
        <h1 className="h-serif text-3xl mb-2">Admin</h1>
        <p className="text-ink-muted mb-8">Yetkili giriş — ürün ekleme formuna erişmek için PIN girin.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (pin === ADMIN_PIN) setAuthed(true); else alert("Yanlış PIN"); }}>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)}
                 placeholder="PIN"
                 className="w-full bg-bg-elev border border-line rounded-sm px-4 py-3 focus:border-gold focus:outline-none" />
          <button className="btn-gold w-full mt-4">Giriş</button>
        </form>
      </div>
    );
  }

  const generated = {
    id: `${form.brand.toLowerCase().replace(/\s+/g, "-")}-${form.reference || form.sku || Date.now()}`,
    slug: form.slug || `${form.brand}-${form.collection}-${form.reference}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    sku: form.sku,
    brand: form.brand,
    collection: form.collection,
    reference: form.reference || undefined,
    model_name: form.model_name,
    quality_tier: form.quality_tier,
    factory: form.factory || undefined,
    case_diameter_mm: Number(form.case_diameter_mm),
    case_material: form.case_material,
    crystal: "Sapphire",
    water_resistance: form.water_resistance || undefined,
    dial_color: form.dial_color,
    bezel_color: form.bezel_color || undefined,
    strap_type: form.strap_type,
    movement_type: form.movement_type,
    movement_caliber: form.movement_caliber,
    is_swiss_movement: form.is_swiss_movement,
    power_reserve_hours: Number(form.power_reserve_hours) || undefined,
    price: { usd: Number(form.price_usd) },
    stock_status: form.stock_status,
    stock_count: Number(form.stock_count),
    is_featured: form.is_featured,
    is_new_arrival: form.is_new_arrival,
    is_on_sale: form.is_on_sale,
    created_at: new Date().toISOString(),
    main_image: "/images/placeholder-watch.svg",
    gallery_images: ["/images/placeholder-watch.svg"],
    gender: form.gender,
    style_tags: form.style_tags.split(",").map(s => s.trim()).filter(Boolean),
    short_description: form.short_description,
    long_description: form.long_description,
    features_bullets: form.features.split(",").map(s => s.trim()).filter(Boolean),
    package_contents: form.package.split(",").map(s => s.trim()).filter(Boolean),
  };

  const json = JSON.stringify(generated, null, 2);
  const copy = async () => { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const label = "block text-xs text-ink-muted mb-1";
  const input = "w-full bg-bg-elev border border-line rounded-sm px-3 py-2 text-sm focus:border-gold focus:outline-none";
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [k]: v });
  };

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="h-serif text-3xl">Ürün Ekle</h1>
          <p className="text-ink-muted text-sm mt-1">Formu doldur → sağdan JSON'u kopyala → <code className="text-gold">content/products/_sample.json</code> dosyasının sonuna yapıştır.</p>
        </div>
        <button onClick={() => setAuthed(false)} className="text-sm text-ink-muted hover:text-danger">Çıkış</button>
      </div>

      <div className="grid lg:grid-cols-[1fr,1fr] gap-8">
        {/* Form */}
        <div className="card p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Marka *</label>
              <select value={form.brand} onChange={set("brand")} className={input}>
                {["Rolex","Audemars Piguet","Patek Philippe","Omega","Hublot","Breitling","Cartier","TAG Heuer","Panerai","IWC","Tudor"].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div><label className={label}>Koleksiyon * (ör. Submariner)</label>
              <input value={form.collection} onChange={set("collection")} className={input}/></div>
            <div><label className={label}>Referans (ör. 126610LN)</label>
              <input value={form.reference} onChange={set("reference")} className={input}/></div>
            <div><label className={label}>SKU (stok kodu)</label>
              <input value={form.sku} onChange={set("sku")} className={input}/></div>
            <div className="col-span-2"><label className={label}>Model Adı * (kartta görünür)</label>
              <input value={form.model_name} onChange={set("model_name")} className={input}/></div>
            <div><label className={label}>Kalite</label>
              <select value={form.quality_tier} onChange={set("quality_tier")} className={input}>
                {["Super Clone","1:1","AAA+","Top Quality"].map(x => <option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Factory</label>
              <select value={form.factory} onChange={set("factory")} className={input}>
                {["","Clean","ZF","Noob","VS","BP","ARF","APF","N Factory","BT","Other"].map(x => <option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Kasa Çapı (mm)</label>
              <input type="number" value={form.case_diameter_mm} onChange={set("case_diameter_mm")} className={input}/></div>
            <div><label className={label}>Kasa Malzemesi</label>
              <select value={form.case_material} onChange={set("case_material")} className={input}>
                {["Stainless Steel 904L","Stainless Steel 316L","Yellow Gold Plated","Rose Gold Plated","Two-Tone (Gold/Steel)","Ceramic","Titanium","PVD Black","Carbon Fiber"].map(x=><option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Kadran Rengi</label>
              <input value={form.dial_color} onChange={set("dial_color")} className={input}/></div>
            <div><label className={label}>Bezel Rengi</label>
              <input value={form.bezel_color} onChange={set("bezel_color")} className={input}/></div>
            <div><label className={label}>Kordon</label>
              <select value={form.strap_type} onChange={set("strap_type")} className={input}>
                {["Oyster","Jubilee","President","Leather","Rubber","NATO","Mesh/Milanese","Integrated Bracelet"].map(x=><option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Mekanizma</label>
              <select value={form.movement_type} onChange={set("movement_type")} className={input}>
                {["Automatic","Quartz","Manual Wind"].map(x=><option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Kalibre (ör. Clone 3235)</label>
              <input value={form.movement_caliber} onChange={set("movement_caliber")} className={input}/></div>
            <div><label className={label}>Güç Rezervi (saat)</label>
              <input type="number" value={form.power_reserve_hours} onChange={set("power_reserve_hours")} className={input}/></div>
            <div><label className={label}>Fiyat (USD)</label>
              <input type="number" value={form.price_usd} onChange={set("price_usd")} className={input}/></div>
            <div><label className={label}>Stok Durumu</label>
              <select value={form.stock_status} onChange={set("stock_status")} className={input}>
                {["In Stock","Limited Stock","Sold Out","Pre-Order"].map(x=><option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Stok Sayısı</label>
              <input type="number" value={form.stock_count} onChange={set("stock_count")} className={input}/></div>
            <div><label className={label}>Cinsiyet</label>
              <select value={form.gender} onChange={set("gender")} className={input}>
                {["Men","Women","Unisex"].map(x=><option key={x}>{x}</option>)}
              </select></div>
            <div><label className={label}>Stil Etiketleri (virgülle)</label>
              <input value={form.style_tags} onChange={set("style_tags")} className={input}/></div>
            <div><label className={label}>Su Geçirmezlik</label>
              <input value={form.water_resistance} onChange={set("water_resistance")} className={input}/></div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex gap-2 items-center"><input type="checkbox" checked={form.is_swiss_movement} onChange={set("is_swiss_movement")} className="accent-gold"/>Swiss Mechanism</label>
            <label className="flex gap-2 items-center"><input type="checkbox" checked={form.is_featured} onChange={set("is_featured")} className="accent-gold"/>Öne Çıkan</label>
            <label className="flex gap-2 items-center"><input type="checkbox" checked={form.is_new_arrival} onChange={set("is_new_arrival")} className="accent-gold"/>Yeni Gelen</label>
            <label className="flex gap-2 items-center"><input type="checkbox" checked={form.is_on_sale} onChange={set("is_on_sale")} className="accent-gold"/>İndirimde</label>
          </div>

          <div><label className={label}>Kısa Açıklama (1-2 cümle, karttta gösterilir)</label>
            <textarea value={form.short_description} onChange={set("short_description")} rows={2} className={input}/></div>
          <div><label className={label}>Uzun Açıklama (detay sayfası, markdown destekli)</label>
            <textarea value={form.long_description} onChange={set("long_description")} rows={5} className={input}/></div>
          <div><label className={label}>Özellikler (virgülle ayrılmış)</label>
            <textarea value={form.features} onChange={set("features")} rows={3} className={input}/></div>
          <div><label className={label}>Paket İçeriği (virgülle)</label>
            <input value={form.package} onChange={set("package")} className={input}/></div>
        </div>

        {/* Output */}
        <div className="lg:sticky lg:top-24 h-fit space-y-3">
          <div className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gold text-sm">Üretilen JSON</h3>
              <button onClick={copy} className="btn-gold text-xs py-1.5 px-3">{copied ? "✓ Kopyalandı" : "📋 Kopyala"}</button>
            </div>
            <pre className="text-xs bg-bg p-3 rounded-sm overflow-auto max-h-[600px] border border-line">{json}</pre>
          </div>
          <div className="card p-4 text-sm text-ink-muted space-y-2">
            <p className="text-gold text-xs tracking-widest uppercase">Nasıl Yayınlanır?</p>
            <p>1. Yukarıdaki <strong>Kopyala</strong> butonuna bas.</p>
            <p>2. Projedeki <code className="text-gold">content/products/_sample.json</code> dosyasını aç, en içteki array'in sonuna yapıştır (virgülü unutma).</p>
            <p>3. Git push yap → Netlify/Vercel otomatik deploy alır. ~2 dk sonra site güncellenir.</p>
            <p className="mt-3 text-xs">👉 Uzun vadede Sanity CMS öneririm (tıklayarak ürün ekleyebileceğin görsel arayüz). MAINTENANCE.md'de detay var.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
