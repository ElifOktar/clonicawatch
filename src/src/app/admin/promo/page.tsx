"use client";
import { useState, useEffect, useRef, DragEvent } from "react";

interface PromoSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

export default function AdminPromoPage() {
  const [slides, setSlides] = useState<PromoSlide[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("clonica_promo_slides");
      if (saved) setSlides(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (newSlides: PromoSlide[]) => {
    setSlides(newSlides);
    localStorage.setItem("clonica_promo_slides", JSON.stringify(newSlides));
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "promo");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const url = data.urls?.[0];
      if (url) {
        const newSlide: PromoSlide = {
          id: `promo-${Date.now()}`,
          image: url,
          title: "",
          subtitle: "",
          link: "",
        };
        save([...slides, newSlide]);
      }
    } catch (err: any) {
      alert("Yukleme hatasi: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) uploadFile(file);
  };

  const updateSlide = (id: string, field: keyof PromoSlide, value: string) => {
    save(slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSlide = (id: string) => {
    save(slides.filter((s) => s.id !== id));
  };

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[idx], next[target]] = [next[target], next[idx]];
    save(next);
  };

  const inputCls = "w-full bg-bg border border-line rounded-lg px-3 py-2 text-sm focus:border-gold focus:outline-none transition-colors";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Promosyon Banner Yonetimi</h1>
        <p className="text-ink-muted text-sm mt-1">
          Ana sayfadaki slider&apos;da gorunecek promosyon gorselleri yukleyin ve duzenleyin.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all mb-8 ${
          dragOver ? "border-gold bg-gold/10" : "border-line bg-bg hover:border-gold/60"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) uploadFile(e.target.files[0]);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />
        {uploading ? (
          <div className="text-gold">Yukleniyor...</div>
        ) : (
          <>
            <div className="text-ink font-medium">Promosyon Gorseli Yukle</div>
            <div className="text-xs text-ink-dim mt-1">
              Onerilen boyut: 1920x480px (yatay banner). Suruklayip birak veya tikla.
            </div>
          </>
        )}
      </div>

      {/* Slides list */}
      {slides.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">
          Henuz promosyon gorseli eklenmedi. Varsayilan urun gorselleri kullanilacak.
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={slide.id} className="bg-bg-elev border border-line rounded-xl p-4 flex gap-4">
              {/* Preview */}
              <div className="w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-bg border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Fields */}
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-ink-dim">Baslik</label>
                    <input
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, "title", e.target.value)}
                      placeholder="Banner basligi"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-ink-dim">Alt Baslik</label>
                    <input
                      value={slide.subtitle}
                      onChange={(e) => updateSlide(slide.id, "subtitle", e.target.value)}
                      placeholder="Kisa aciklama"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-ink-dim">Link (opsiyonel)</label>
                  <input
                    value={slide.link}
                    onChange={(e) => updateSlide(slide.id, "link", e.target.value)}
                    placeholder="/new-arrivals"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} className="text-ink-muted hover:text-gold disabled:opacity-20 text-xs p-1" title="Yukari">▲</button>
                <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} className="text-ink-muted hover:text-gold disabled:opacity-20 text-xs p-1" title="Asagi">▼</button>
                <button onClick={() => removeSlide(slide.id)} className="text-red-400 hover:bg-red-500/10 text-xs p-1 rounded" title="Sil">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-bg-elev border border-line rounded-lg text-xs text-ink-muted">
        <strong className="text-gold">Not:</strong> Eger hic promosyon gorseli eklenmezse, otomatik olarak vitrin urunlerinin gorselleri slider&apos;da gosterilir.
        Ekledikten sonra ana sayfayi yenileyerek kontrol edebilirsiniz.
      </div>
    </div>
  );
}
