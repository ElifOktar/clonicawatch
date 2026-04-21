"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const router = useRouter();
  const [jsonText, setJsonText] = useState("");
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [result, setResult] = useState<{ success?: boolean; total?: number; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setLoading(true);
    setResult(null);

    try {
      let products: any[];
      try {
        const parsed = JSON.parse(jsonText);
        products = Array.isArray(parsed) ? parsed : parsed.products || [parsed];
      } catch {
        setResult({ error: "Gecersiz JSON formati" });
        setLoading(false);
        return;
      }

      // Validate minimum fields
      const valid = products.filter((p) => p.model_name && p.brand && p.price?.usd);
      if (!valid.length) {
        setResult({ error: "Gecerli urun bulunamadi (model_name, brand, price.usd zorunlu)" });
        setLoading(false);
        return;
      }

      // Auto-generate missing fields
      const enriched = valid.map((p, i) => ({
        id: p.id || `import-${Date.now()}-${i}`,
        slug: p.slug || `${p.brand}-${p.collection || p.model_name}-${Date.now()}-${i}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        sku: p.sku || `CLN-IMP-${String(i + 1).padStart(4, "0")}`,
        created_at: p.created_at || new Date().toISOString(),
        main_image: p.main_image || "/images/placeholder-watch.svg",
        gallery_images: p.gallery_images || ["/images/placeholder-watch.svg"],
        quality_tier: p.quality_tier || "Super Clone",
        stock_status: p.stock_status || "In Stock",
        stock_count: p.stock_count ?? 1,
        is_featured: p.is_featured ?? false,
        is_new_arrival: p.is_new_arrival ?? true,
        is_on_sale: p.is_on_sale ?? false,
        gender: p.gender || "Men",
        style_tags: p.style_tags || [],
        short_description: p.short_description || "",
        long_description: p.long_description || "",
        features_bullets: p.features_bullets || [],
        case_diameter_mm: p.case_diameter_mm || 41,
        case_material: p.case_material || "Stainless Steel 904L",
        movement_type: p.movement_type || "Automatic",
        movement_caliber: p.movement_caliber || "",
        strap_type: p.strap_type || "Oyster",
        dial_color: p.dial_color || "Black",
        ...p,
      }));

      if (mode === "replace" && !confirm(`Bu islem mevcut ${enriched.length === 0 ? "tum" : ""} urunleri silecek ve ${enriched.length} yeni urunle degistirecek. Emin misiniz?`)) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: enriched, mode }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ success: true, total: data.total });
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-bg border border-line rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Toplu Urun Import</h1>
      <p className="text-ink-muted text-sm mb-6">JSON formatinda urunleri toplu olarak yukleyin</p>

      <div className="max-w-4xl space-y-6">
        {/* Mode Selection */}
        <div className="bg-bg-elev border border-line rounded-xl p-5">
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase mb-3">Import Modu</h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === "merge"} onChange={() => setMode("merge")} className="accent-gold" />
              <div>
                <div className="text-sm font-medium">Birlestir (Merge)</div>
                <div className="text-xs text-ink-muted">Mevcut urunlere ekle, ayni ID varsa guncelle</div>
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={mode === "replace"} onChange={() => setMode("replace")} className="accent-gold" />
              <div>
                <div className="text-sm font-medium">Degistir (Replace)</div>
                <div className="text-xs text-red-400">Tum mevcut urunleri sil, sadece yenileri yaz</div>
              </div>
            </label>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-bg-elev border border-line rounded-xl p-5">
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase mb-3">JSON Dosyasi Yukle</h2>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-ink-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold/20 file:text-gold file:font-medium file:cursor-pointer hover:file:bg-gold/30"
          />
          <p className="text-xs text-ink-dim mt-2">veya asagidaki alana JSON yapistiriniz</p>
        </div>

        {/* JSON Editor */}
        <div className="bg-bg-elev border border-line rounded-xl p-5">
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase mb-3">JSON Verisi</h2>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={20}
            placeholder={`[
  {
    "brand": "Rolex",
    "collection": "Submariner",
    "model_name": "Rolex Submariner 126610LN",
    "reference": "126610LN",
    "price": { "usd": 1050 },
    "dial_color": "Black",
    "factory": "Clean"
  }
]`}
            className={`${inputCls} font-mono text-xs`}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleImport}
            disabled={loading || !jsonText.trim()}
            className="bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Import ediliyor..." : `Import Et (${mode === "merge" ? "Birlestir" : "Degistir"})`}
          </button>
          {result && (
            <div className={`text-sm ${result.success ? "text-green-400" : "text-red-400"}`}>
              {result.success
                ? `Basarili! Toplam ${result.total} urun.`
                : `Hata: ${result.error}`}
            </div>
          )}
        </div>

        {/* Format Help */}
        <div className="bg-bg-elev border border-line rounded-xl p-5">
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase mb-3">JSON Format Rehberi</h2>
          <div className="text-xs text-ink-muted space-y-2">
            <p><strong className="text-ink">Zorunlu alanlar:</strong> model_name, brand, price.usd</p>
            <p><strong className="text-ink">Onerilen alanlar:</strong> collection, reference, factory, dial_color, case_diameter_mm, movement_caliber</p>
            <p><strong className="text-ink">Otomatik:</strong> id, slug, sku, created_at, main_image otomatik olusturulur (bos birakilabilir)</p>
            <p><strong className="text-ink">Format:</strong> Tek obje veya array olabilir. &quot;products&quot; anahtari altinda da olabilir.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
