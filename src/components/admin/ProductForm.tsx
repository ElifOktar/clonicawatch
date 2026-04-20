"use client";
import { useState, FormEvent, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

const BRANDS = ["Rolex","Audemars Piguet","Patek Philippe","Omega","Hublot","Breitling","Cartier","TAG Heuer","Panerai","IWC","Richard Mille","Vacheron Constantin","Jaeger-LeCoultre","Tudor","Bell & Ross","Zenith","Chopard","Longines","Ulysse Nardin","Franck Muller","Piaget"];
const QUALITY = ["Super Clone","1:1","AAA+","Top Quality"];
const FACTORIES = ["","Clean","ZF","Noob","VS","BP","ARF","APF","N Factory","BT","Other"];
const MATERIALS = ["Stainless Steel 904L","Stainless Steel 316L","Yellow Gold Plated","Rose Gold Plated","Two-Tone (Gold/Steel)","Ceramic","Titanium","PVD Black","Carbon Fiber"];
const STRAPS = ["Oyster","Jubilee","President","Leather","Rubber","NATO","Mesh/Milanese","Integrated Bracelet"];
const MOVEMENTS = ["Automatic","Quartz","Manual Wind"];
const STOCK_STATUSES = ["In Stock","Limited Stock","Sold Out","Pre-Order"];
const GENDERS = ["Men","Women","Unisex"];
const STYLE_TAGS = ["Diver","Chronograph","Dress","Pilot","Sport","GMT","Moonphase","Skeleton","Tourbillon","Perpetual Calendar"];

interface Props {
  initialData?: any;
  mode: "create" | "edit";
}

export default function ProductForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.gallery_images || ["/images/placeholder-watch.svg"]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState("");

  const defaults = {
    brand: "Rolex",
    collection: "",
    reference: "",
    model_name: "",
    sku: "",
    quality_tier: "Super Clone",
    factory: "Clean",
    case_diameter_mm: 41,
    case_material: "Stainless Steel 904L",
    case_thickness_mm: "",
    crystal: "Sapphire",
    water_resistance: "100m",
    dial_color: "Black",
    dial_markers: "",
    bezel_type: "",
    bezel_color: "",
    strap_type: "Oyster",
    strap_color: "",
    movement_type: "Automatic",
    movement_caliber: "",
    is_swiss_movement: false,
    power_reserve_hours: 70,
    jewels: "",
    beat_rate_vph: "",
    price_usd: 1000,
    original_price_usd: "",
    stock_status: "In Stock",
    stock_count: 1,
    is_featured: true,
    is_new_arrival: true,
    is_on_sale: false,
    gender: "Men",
    style_tags: ["Diver", "Sport"],
    short_description: "",
    long_description: "",
    features: "",
    package_contents: "Watch, Box, Warranty card, Adjustment tool",
    main_image: "/images/placeholder-watch.svg",
    video_url: "",
    ...initialData,
  };

  // Override computed fields from nested initialData
  if (initialData) {
    defaults.price_usd = initialData.price?.usd || 1000;
    defaults.original_price_usd = initialData.original_price?.usd || "";
    defaults.features = initialData.features_bullets?.join(", ") || "";
    defaults.package_contents = initialData.package_contents?.join(", ") || "Watch, Box, Warranty card, Adjustment tool";
    defaults.style_tags = initialData.style_tags || ["Diver", "Sport"];
  }

  const [form, setForm] = useState(defaults);

  const set = (key: string) => (e: any) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: val });
  };

  const toggleStyleTag = (tag: string) => {
    const tags = [...form.style_tags];
    const idx = tags.indexOf(tag);
    if (idx >= 0) tags.splice(idx, 1);
    else tags.push(tag);
    setForm({ ...form, style_tags: tags });
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const next = [...imageUrls];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setImageUrls(next);
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!fileArray.length) {
      setUploadError("Sadece gorsel dosyalari yuklenebilir");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      for (const f of fileArray) formData.append("files", f);
      // Save to a product-specific folder when possible
      const folder = initialData?.sku
        ? `products/${initialData.sku.toLowerCase()}`
        : form.sku
          ? `products/${form.sku.toLowerCase()}`
          : `products/${(form.brand || "misc").toLowerCase()}-${Date.now()}`;
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yukleme basarisiz");
      // Remove placeholder if it's the only image and we just added real ones
      const cleaned = imageUrls.filter((u) => !u.includes("placeholder"));
      setImageUrls([...cleaned, ...(data.urls || [])]);
    } catch (err: any) {
      setUploadError(err.message || "Yukleme hatasi");
    } finally {
      setUploading(false);
    }
  };

  const uploadVideo = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      setVideoError("Sadece video dosyalari yuklenebilir (MP4, MOV, WEBM)");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setVideoError("Video boyutu 100MB'dan kucuk olmali");
      return;
    }
    setVideoUploading(true);
    setVideoError("");
    try {
      const formData = new FormData();
      formData.append("files", file);
      const folder = initialData?.sku
        ? `products/${initialData.sku.toLowerCase()}`
        : form.sku
          ? `products/${form.sku.toLowerCase()}`
          : `products/${(form.brand || "misc").toLowerCase()}-${Date.now()}`;
      formData.append("folder", folder);
      formData.append("skipWatermark", "true");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video yukleme basarisiz");
      if (data.urls?.[0]) {
        setForm({ ...form, video_url: data.urls[0] });
      }
    } catch (err: any) {
      setVideoError(err.message || "Video yukleme hatasi");
    } finally {
      setVideoUploading(false);
    }
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const product: any = {
      brand: form.brand,
      collection: form.collection,
      reference: form.reference || undefined,
      model_name: form.model_name,
      sku: form.sku || undefined,
      quality_tier: form.quality_tier,
      factory: form.factory || undefined,
      case_diameter_mm: Number(form.case_diameter_mm),
      case_material: form.case_material,
      case_thickness_mm: form.case_thickness_mm ? Number(form.case_thickness_mm) : undefined,
      crystal: form.crystal || "Sapphire",
      water_resistance: form.water_resistance || undefined,
      dial_color: form.dial_color,
      dial_markers: form.dial_markers || undefined,
      bezel_type: form.bezel_type || undefined,
      bezel_color: form.bezel_color || undefined,
      strap_type: form.strap_type,
      strap_color: form.strap_color || undefined,
      movement_type: form.movement_type,
      movement_caliber: form.movement_caliber,
      is_swiss_movement: form.is_swiss_movement,
      power_reserve_hours: form.power_reserve_hours ? Number(form.power_reserve_hours) : undefined,
      jewels: form.jewels ? Number(form.jewels) : undefined,
      beat_rate_vph: form.beat_rate_vph ? Number(form.beat_rate_vph) : undefined,
      price: { usd: Number(form.price_usd) },
      original_price: form.original_price_usd ? { usd: Number(form.original_price_usd) } : undefined,
      stock_status: form.stock_status,
      stock_count: Number(form.stock_count),
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      is_on_sale: form.is_on_sale,
      gender: form.gender,
      style_tags: form.style_tags,
      short_description: form.short_description,
      long_description: form.long_description,
      features_bullets: form.features.split(",").map((s: string) => s.trim()).filter(Boolean),
      package_contents: form.package_contents.split(",").map((s: string) => s.trim()).filter(Boolean),
      main_image: imageUrls[0] || "/images/placeholder-watch.svg",
      gallery_images: imageUrls.length ? imageUrls : ["/images/placeholder-watch.svg"],
      video_url: form.video_url || undefined,
    };

    try {
      const url = mode === "edit"
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Bir hata olustu");
    } finally {
      setSaving(false);
    }
  };

  const labelCls = "block text-xs text-ink-muted mb-1.5 font-medium";
  const inputCls = "w-full bg-bg border border-line rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors";
  const sectionCls = "bg-bg-elev border border-line rounded-xl p-5 space-y-4";

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr,380px] gap-6">
        {/* Left Column — Main Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Temel Bilgiler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Marka *</label>
                <select value={form.brand} onChange={set("brand")} className={inputCls}>
                  {BRANDS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Koleksiyon *</label>
                <input value={form.collection} onChange={set("collection")} placeholder="Submariner" className={inputCls} required />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Model Adi * (site'de gorunur)</label>
                <input value={form.model_name} onChange={set("model_name")} placeholder="Rolex Submariner Date Black Dial 126610LN" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Referans No</label>
                <input value={form.reference} onChange={set("reference")} placeholder="126610LN" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>SKU</label>
                <input value={form.sku} onChange={set("sku")} placeholder="CLN-RLX-0001" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Quality & Factory */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Kalite & Uretim</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Kalite Seviyesi</label>
                <select value={form.quality_tier} onChange={set("quality_tier")} className={inputCls}>
                  {QUALITY.map((q) => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Factory</label>
                <select value={form.factory} onChange={set("factory")} className={inputCls}>
                  {FACTORIES.map((f) => <option key={f} value={f}>{f || "— Secilmedi —"}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Case & Design */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Kasa & Tasarim</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Kasa Capi (mm)</label>
                <input type="number" value={form.case_diameter_mm} onChange={set("case_diameter_mm")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Kasa Kalinligi (mm)</label>
                <input type="number" value={form.case_thickness_mm} onChange={set("case_thickness_mm")} placeholder="12.5" step="0.1" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Kasa Malzemesi</label>
                <select value={form.case_material} onChange={set("case_material")} className={inputCls}>
                  {MATERIALS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Kadran Rengi</label>
                <input value={form.dial_color} onChange={set("dial_color")} placeholder="Black" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Kadran Isaretleri</label>
                <input value={form.dial_markers} onChange={set("dial_markers")} placeholder="Applied indices" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bezel Rengi</label>
                <input value={form.bezel_color} onChange={set("bezel_color")} placeholder="Black Ceramic" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bezel Tipi</label>
                <input value={form.bezel_type} onChange={set("bezel_type")} placeholder="Unidirectional Dive" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Kordon</label>
                <select value={form.strap_type} onChange={set("strap_type")} className={inputCls}>
                  {STRAPS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Su Gecirmezlik</label>
                <input value={form.water_resistance} onChange={set("water_resistance")} placeholder="300m" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Movement */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Mekanizma</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Mekanizma Tipi</label>
                <select value={form.movement_type} onChange={set("movement_type")} className={inputCls}>
                  {MOVEMENTS.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Kalibre</label>
                <input value={form.movement_caliber} onChange={set("movement_caliber")} placeholder="Clone 3235" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Guc Rezervi (saat)</label>
                <input type="number" value={form.power_reserve_hours} onChange={set("power_reserve_hours")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Jewels</label>
                <input type="number" value={form.jewels} onChange={set("jewels")} placeholder="31" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Beat Rate (vph)</label>
                <input type="number" value={form.beat_rate_vph} onChange={set("beat_rate_vph")} placeholder="28800" className={inputCls} />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 pb-2.5">
                  <input type="checkbox" checked={form.is_swiss_movement} onChange={set("is_swiss_movement")} className="accent-gold w-4 h-4" />
                  <span className="text-sm">Swiss Mekanizma</span>
                </label>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Aciklamalar</h2>
            <div>
              <label className={labelCls}>Kisa Aciklama (kart uzerinde gorunur)</label>
              <textarea value={form.short_description} onChange={set("short_description")} rows={2} placeholder="Clean Factory Super Clone — 1:1 replica..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Detayli Aciklama (urun sayfasi, markdown destekli)</label>
              <textarea value={form.long_description} onChange={set("long_description")} rows={6} placeholder="## Clean Factory Super Clone&#10;&#10;Detayli aciklama..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Ozellikler (virgul ile ayirin)</label>
              <textarea value={form.features} onChange={set("features")} rows={3} placeholder="Clean Factory production, Clone 3235 automatic, 904L steel..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Paket Icerigi (virgul ile ayirin)</label>
              <input value={form.package_contents} onChange={set("package_contents")} placeholder="Watch, Box, Warranty card, Tool" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-6">
          {/* Save Button */}
          <div className={sectionCls}>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gold hover:bg-gold-bright text-bg font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : mode === "edit" ? "Guncelle" : "Urun Ekle"}
            </button>
          </div>

          {/* Pricing */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Fiyat & Stok</h2>
            <div>
              <label className={labelCls}>Fiyat (USD) *</label>
              <input type="number" value={form.price_usd} onChange={set("price_usd")} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Orijinal Fiyat (indirim varsa)</label>
              <input type="number" value={form.original_price_usd} onChange={set("original_price_usd")} placeholder="Bos birakin" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Stok Durumu</label>
              <select value={form.stock_status} onChange={set("stock_status")} className={inputCls}>
                {STOCK_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Stok Sayisi</label>
              <input type="number" value={form.stock_count} onChange={set("stock_count")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Cinsiyet</label>
              <select value={form.gender} onChange={set("gender")} className={inputCls}>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Flags */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Etiketler</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={set("is_featured")} className="accent-gold w-4 h-4" />
                <span className="text-sm">One Cikan Urun</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_new_arrival} onChange={set("is_new_arrival")} className="accent-gold w-4 h-4" />
                <span className="text-sm">Yeni Gelen</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_on_sale} onChange={set("is_on_sale")} className="accent-gold w-4 h-4" />
                <span className="text-sm">Indirimde</span>
              </label>
            </div>
            <div className="pt-2">
              <label className={labelCls}>Stil Etiketleri</label>
              <div className="flex flex-wrap gap-2">
                {STYLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleStyleTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      form.style_tags.includes(tag)
                        ? "bg-gold/20 text-gold border-gold/30"
                        : "bg-bg border-line text-ink-muted hover:border-gold/30"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Gorseller</h2>

            {/* Drag & Drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                dragOver
                  ? "border-gold bg-gold/10"
                  : uploading
                  ? "border-gold/50 bg-bg"
                  : "border-line bg-bg hover:border-gold/60 hover:bg-gold/5"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.gif,.avif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) uploadFiles(e.target.files);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <div className="text-sm text-gold font-medium">Yukleniyor...</div>
                  </>
                ) : (
                  <>
                    <svg className="w-10 h-10 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="text-sm font-medium text-ink">
                      {dragOver ? "Birak, yukleyecegim!" : "Suruklayip birak veya tikla"}
                    </div>
                    <div className="text-[11px] text-ink-dim">
                      Birden fazla gorsel secebilirsin (JPG, PNG, WEBP)
                    </div>
                  </>
                )}
              </div>
            </div>

            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
                {uploadError}
              </div>
            )}

            {/* Image list with preview, reorder, delete */}
            {imageUrls.length > 0 && (
              <div className="space-y-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 bg-bg rounded-lg p-2 border border-line">
                    <div className="w-14 h-14 bg-bg-soft rounded overflow-hidden flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-watch.svg"; }}
                      />
                      {i === 0 && (
                        <div className="absolute top-0.5 left-0.5 bg-gold text-bg text-[9px] px-1 rounded font-semibold">
                          ANA
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-ink truncate font-medium">
                        {url.split("/").pop()}
                      </div>
                      <div className="text-[10px] text-ink-dim truncate">{url}</div>
                    </div>
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        className="text-ink-muted hover:text-gold disabled:opacity-20 text-xs leading-none p-0.5"
                        title="Yukari tasi"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === imageUrls.length - 1}
                        className="text-ink-muted hover:text-gold disabled:opacity-20 text-xs leading-none p-0.5"
                        title="Asagi tasi"
                      >
                        ▼
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-red-400 text-xs hover:bg-red-500/10 px-2 py-1 rounded transition-colors flex-shrink-0"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Optional: paste URL */}
            <details className="text-xs">
              <summary className="text-ink-muted cursor-pointer hover:text-gold transition-colors py-1">
                Veya URL ile ekle
              </summary>
              <div className="flex gap-2 mt-2">
                <input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://... veya /images/..."
                  className={`${inputCls} flex-1`}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(); } }}
                />
                <button type="button" onClick={addImageUrl} className="bg-gold/20 text-gold px-3 rounded-lg text-sm hover:bg-gold/30 transition-colors">
                  Ekle
                </button>
              </div>
            </details>

            <p className="text-[11px] text-ink-dim leading-relaxed">
              Ilk gorsel <strong className="text-gold">ana gorsel</strong> olarak kullanilir. Ok tuslariyla sirayi degistirebilirsin.
            </p>
          </div>

          {/* Video */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Video</h2>

            {/* Video file upload */}
            <div
              onClick={() => videoInputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
                videoUploading
                  ? "border-gold/50 bg-bg"
                  : "border-line bg-bg hover:border-gold/60 hover:bg-gold/5"
              }`}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept=".mp4,.mov,.webm,.avi"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files?.[0]) uploadVideo(e.target.files[0]);
                  if (videoInputRef.current) videoInputRef.current.value = "";
                }}
              />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                {videoUploading ? (
                  <>
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <div className="text-sm text-gold font-medium">Video yukleniyor...</div>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <div className="text-sm font-medium text-ink">Video yukle (tikla)</div>
                    <div className="text-[11px] text-ink-dim">MP4, MOV, WEBM — max 100MB</div>
                  </>
                )}
              </div>
            </div>

            {videoError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
                {videoError}
              </div>
            )}

            {/* Show current video */}
            {form.video_url && (
              <div className="flex items-center gap-2 bg-bg rounded-lg p-3 border border-line">
                <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-ink truncate">{form.video_url.split("/").pop()}</div>
                  <div className="text-[10px] text-ink-dim truncate">{form.video_url}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, video_url: "" })}
                  className="text-red-400 text-xs hover:bg-red-500/10 px-2 py-1 rounded transition-colors flex-shrink-0"
                >
                  Kaldir
                </button>
              </div>
            )}

            {/* Optional: paste URL as fallback */}
            <details className="text-xs">
              <summary className="text-ink-muted cursor-pointer hover:text-gold transition-colors py-1">
                Veya URL ile ekle
              </summary>
              <div className="mt-2">
                <input
                  value={form.video_url}
                  onChange={set("video_url")}
                  placeholder="https://... veya /videos/urun-video.mp4"
                  className={inputCls}
                />
              </div>
            </details>

            <p className="text-[11px] text-ink-dim leading-relaxed">
              Video, urun sayfasinda fotograflardan sonra ayri bir sekmede gosterilir.
              Bos birakirsan video sekmesi gorunmez.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
