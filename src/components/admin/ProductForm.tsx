"use client";
import { useState, FormEvent, useRef, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const BRANDS = ["Rolex","Audemars Piguet","Patek Philippe","Omega","Hublot","Breitling","Cartier","TAG Heuer","Panerai","IWC","Richard Mille","Vacheron Constantin","Jaeger-LeCoultre","Tudor","Bell & Ross","Zenith","Chopard","Longines","Ulysse Nardin","Franck Muller","Piaget"];
const QUALITY = ["Super Clone","1:1","AAA+","Top Quality"];
const MATERIALS = ["Stainless Steel 904L","Stainless Steel 316L","Yellow Gold Plated","Rose Gold Plated","Two-Tone (Gold/Steel)","Ceramic","Titanium","PVD Black","Carbon Fiber"];
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

  const getFolder = () => {
    if (initialData?.sku) return `products/${initialData.sku.toLowerCase()}`;
    if (form.sku) return `products/${form.sku.toLowerCase()}`;
    return `products/${(form.brand || "misc").toLowerCase()}-${Date.now()}`;
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const imgExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
    const imageFiles = Array.from(files).filter((f) => {
      const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));
      return f.type.startsWith("image/") || imgExts.includes(ext);
    });
    if (!imageFiles.length) {
      setUploadError("Sadece gorsel dosyalari yuklenebilir");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const folder = getFolder();
      const uploadedUrls: string[] = [];

      for (const file of imageFiles) {
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
        const filePath = `${folder}/${Date.now()}-${safeName}`;

        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, { cacheControl: "3600", upsert: true });

        if (error) throw new Error(error.message);

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
      }

      const cleaned = imageUrls.filter((u) => !u.includes("placeholder"));
      setImageUrls([...cleaned, ...uploadedUrls]);
    } catch (err: any) {
      setUploadError(err.message || "Yukleme hatasi");
    } finally {
      setUploading(false);
    }
  };

  const uploadVideo = async (file: File) => {
    const videoExts = [".mp4", ".mov", ".webm", ".avi"];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const isVideo = file.type.startsWith("video/") || videoExts.includes(ext);
    if (!isVideo) {
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
      const folder = getFolder();
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
      const filePath = `${folder}/${Date.now()}-${safeName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (error) throw new Error(error.message);

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      setForm({ ...form, video_url: urlData.publicUrl });
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
      sku: form.sku || `CLN-${form.brand.substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
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
  const sectionCls = "bg-bg-elev border border-line rounded-xl p-5 space-y-4 min-w-0 overflow-hidden";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full overflow-hidden">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 min-w-0 overflow-hidden">
        {/* Left Column — Main Form */}
        <div className="space-y-6 min-w-0">
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
              {/* Referans No ve SKU otomatik olusturulur */}
            </div>
          </div>

          {/* Quality */}
          <div className={sectionCls}>
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Kalite</h2>
            <div>
              <label className={labelCls}>Kalite Seviyesi</label>
              <select value={form.quality_tier} onChange={set("quality_tier")} className={inputCls}>
                {QUALITY.map((q) => <option key={q}>{q}</option>)}
              </select>
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
                <input value={form.strap_type} onChange={set("strap_type")} placeholder="Oyster, Jubilee, Leather..." className={inputCls} />
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
        <div className="space-y-6 min-w-0">
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
            <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Medya (Foto & Video)</h2>

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
                  try { if (fileInputRef.current) fileInputRef.current.value = ""; } catch (_) {}
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
                      {dragOver ? "Birak, yukleyecegim!" : "Fotograf yukle"}
                    </div>
                    <div className="text-[11px] text-ink-dim break-words">
                      Birden fazla gorsel secebilirsin
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Video — URL only (iOS Safari file input video bug workaround) */}

            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
                {uploadError}
              </div>
            )}

            {/* Image list with preview, reorder, delete */}
            {imageUrls.length > 0 && (
              <div className="space-y-2">
                {imageUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 bg-bg rounded-lg p-2 border border-line min-w-0 overflow-hidden">
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

            {/* Video section */}
            {videoError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">
                {videoError}
              </div>
            )}

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) uploadVideo(e.target.files[0]);
                try { if (videoInputRef.current) videoInputRef.current.value = ""; } catch (_) {}
              }}
            />

            {form.video_url ? (
              <div className="bg-bg rounded-lg border border-gold/30 overflow-hidden">
                {/* Video thumbnail with play overlay */}
                <div className="relative aspect-video bg-black">
                  <video
                    src={form.video_url}
                    className="w-full h-full object-contain"
                    preload="metadata"
                    muted
                    playsInline
                    onLoadedMetadata={(e) => {
                      const vid = e.target as HTMLVideoElement;
                      vid.currentTime = 1;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-gold/80 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-bg ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3">
                  <svg className="w-4 h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gold font-medium">Video yuklendi</div>
                    <div className="text-[10px] text-ink-dim truncate">{form.video_url.split("/").pop()}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, video_url: "" })}
                    className="text-red-400 text-xs hover:bg-red-500/10 px-2 py-1 rounded transition-colors flex-shrink-0"
                  >
                    Kaldir
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-bg rounded-lg p-3 border border-line space-y-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold/70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                  <div className="text-sm font-medium text-ink">Video Ekle</div>
                </div>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={videoUploading}
                  className="w-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold font-medium py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  {videoUploading ? "Video yukleniyor..." : "Bilgisayardan Video Sec"}
                </button>
                {videoUploading && (
                  <div className="w-full bg-bg-soft rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gold h-full rounded-full animate-pulse" style={{ width: "60%" }} />
                  </div>
                )}
                <details className="text-xs">
                  <summary className="text-ink-muted cursor-pointer hover:text-gold transition-colors py-1">
                    Veya URL ile ekle
                  </summary>
                  <div className="mt-2 space-y-1">
                    <input
                      value={form.video_url}
                      onChange={set("video_url")}
                      placeholder="Video URL yapistir"
                      className={inputCls}
                    />
                  </div>
                </details>
                <p className="text-[10px] text-ink-dim leading-relaxed">
                  MP4, MOV, WEBM desteklenir (maks 100MB). Desktoptan yukle — iOS Safari&apos;de video secimi calismaz.
                </p>
              </div>
            )}

            <p className="text-[11px] text-ink-dim leading-relaxed">
              Ilk gorsel <strong className="text-gold">ana gorsel</strong> olarak kullanilir. Ok tuslariyla sirayi degistirebilirsin.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button — always at the bottom */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gold hover:bg-gold-bright text-bg font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 text-lg"
        >
          {saving ? "Kaydediliyor..." : mode === "edit" ? "Guncelle" : "Urun Ekle"}
        </button>
      </div>
    </form>
  );
}
