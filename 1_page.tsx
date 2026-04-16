"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type PhotoRow = {
  id: string;
  sku: string;
  model_name: string;
  brand: string;
  main_image: string;
  has_photo: boolean;
  expected_filename: string;
};

export default function PhotoManagerPage() {
  const [rows, setRows] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "missing" | "done">("all");
  const [brandFilter, setBrandFilter] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/photos");
    const data = await res.json();
    setRows(data.products || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setResult(null);

    const formData = new FormData();
    for (const f of Array.from(files)) {
      formData.append("files", f);
    }

    try {
      const res = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      if (data.success) {
        await loadPhotos();
      }
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadCSV = () => {
    const header = "SKU,Marka,Model,Dosya Adi Olmasi Gereken,Durum";
    const lines = rows.map((r) =>
      [r.sku, r.brand, `"${r.model_name}"`, r.expected_filename, r.has_photo ? "VAR" : "EKSIK"].join(",")
    );
    const csv = header + "\n" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clonicawatch-foto-listesi.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const brands = Array.from(new Set(rows.map((r) => r.brand))).sort();

  const filtered = rows.filter((r) => {
    if (filter === "missing" && r.has_photo) return false;
    if (filter === "done" && !r.has_photo) return false;
    if (brandFilter && r.brand !== brandFilter) return false;
    return true;
  });

  const withPhoto = rows.filter((r) => r.has_photo).length;
  const total = rows.length;
  const pct = total ? Math.round((withPhoto / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">Fotograf Yoneticisi</h1>
          <p className="text-ink-muted text-sm mt-1">
            Dosya adlari SKU ile baslamali (orn. CLN-RLX-0001.jpg). Sistem otomatik eslestirir.
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gold">{pct}%</div>
          <div className="text-xs text-ink-muted">{withPhoto} / {total} urun</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-bg-elev rounded-full overflow-hidden mb-6">
        <div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} />
      </div>

      {/* Instructions */}
      <div className="bg-bg-elev border border-gold/30 rounded-xl p-5 mb-6">
        <h2 className="text-gold text-sm font-semibold tracking-wider uppercase mb-3">Nasil Kullanilir?</h2>
        <ol className="text-sm text-ink-muted space-y-2 list-decimal pl-5">
          <li><strong className="text-ink">SKU listesini indir:</strong> Asagidaki "SKU CSV Indir" butonuna bas. Excel'de acilir, her urunun SKU'su ve olmasi gereken dosya adi listelenir.</li>
          <li><strong className="text-ink">Fotograflari adlandir:</strong> Her fotografi ilgili urunun SKU'su ile yeniden adlandir. Ornek: <code className="text-gold bg-bg px-1 rounded">CLN-RLX-0001.jpg</code>, <code className="text-gold bg-bg px-1 rounded">CLN-AP-0003.jpg</code>.</li>
          <li><strong className="text-ink">Topluca yukle:</strong> Asagiya bir veya birden fazla fotografi surukle-birak. Sistem SKU'lari otomatik eslestirir ve urunlere atar.</li>
        </ol>
        <p className="text-xs text-ink-dim mt-3">
          Not: Bu aktarim yerel gelistirme ortaminda kalicidir. Vercel production'da fotograflari GitHub'a <code className="text-gold">public/images/products/</code> klasorune yuklemen gerekir.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={downloadCSV}
          className="bg-bg-elev border border-gold/40 hover:border-gold text-gold font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          SKU CSV Indir
        </button>

        <label className="bg-gold hover:bg-gold-bright text-bg font-semibold px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors">
          {uploading ? "Yukleniyor..." : "Toplu Fotograf Yukle"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
            className="hidden"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-bg-elev border border-line rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Tum Markalar</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <div className="flex gap-1 bg-bg-elev border border-line rounded-lg p-1">
            {(["all", "missing", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                  filter === f ? "bg-gold text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {f === "all" ? "Hepsi" : f === "missing" ? "Eksik" : "Tamam"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result banner */}
      {result && (
        <div className={`mb-6 rounded-xl p-4 border text-sm ${result.success ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
          {result.success ? (
            <div>
              <div className="font-semibold">Basarili! {result.updated} / {result.total} fotograf islendi.</div>
              {result.unmatched?.length > 0 && (
                <div className="mt-2 text-xs">
                  <div className="font-medium">Eslestirilemeyen {result.unmatched.length} dosya:</div>
                  <ul className="mt-1 space-y-0.5 pl-4 list-disc">
                    {result.unmatched.slice(0, 5).map((u: any, i: number) => (
                      <li key={i}>{u.filename} — {u.reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>Hata: {result.error}</div>
          )}
        </div>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="text-center text-ink-muted py-12">Yukleniyor...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-bg-elev border border-line rounded-xl overflow-hidden">
              <div className="aspect-square bg-bg relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.main_image}
                  alt={r.model_name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder-watch.svg"; }}
                />
                {!r.has_photo && (
                  <div className="absolute top-2 right-2 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    EKSIK
                  </div>
                )}
                {r.has_photo && (
                  <div className="absolute top-2 right-2 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    OK
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-[10px] text-ink-dim tracking-wider uppercase">{r.brand}</p>
                <p className="text-xs font-medium mt-0.5 line-clamp-2 min-h-[2rem]">{r.model_name}</p>
                <p className="text-[11px] text-gold mt-2 font-mono">{r.expected_filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center text-ink-muted py-12">
          Bu filtreyle urun yok
        </div>
      )}
    </div>
  );
}
