# Clonicawatch — Kurulum ve Kullanım Rehberi

**Domain:** https://clonica.online
**Stack:** Next.js 14 + TypeScript + Tailwind
**Ürün Sayısı:** 323 ürün (14 marka)

---

## Ne Değişti? (16 Nisan 2026)

1. **Domain güncellendi** → clonica.online (layout, sitemap, robots, admin settings)
2. **Drag & Drop fotoğraf yükleme** (iki yerde):
   - Ürün düzenleme sayfasında (her ürün için ayrı)
   - Toplu fotoğraf yükleme sayfasında (SKU eşleştirmeli)
3. **Görsel sıralama** ok tuşlarıyla (ilk görsel ana görsel olur)
4. **Ürün bilgileri tamamen düzenlenebilir** durumda (marka, fiyat, stok, açıklama, tüm teknik bilgiler)

---

## İlk Kurulum

Terminal'i bu klasörde aç ve şunu çalıştır:

```bash
npm install
```

Kurulum 2-3 dakika sürer (ilk seferde). Paketler `node_modules/` klasörüne inecek.

---

## Geliştirme Modunda Çalıştırma (localde test için)

```bash
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

- Ana site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

### Admin Şifresi
`src/components/admin/AdminAuth.tsx` içinde tanımlı. İlk girişte istenecek.

---

## Admin Panel Nasıl Kullanılır?

### Ürün Fotoğrafı Yükleme (Tek Tek)

1. Admin → Ürünler → İlgili ürüne tıkla
2. Sağ tarafta "Görseller" bölümüne git
3. **Bilgisayarından fotoğrafı sürükle → drop zone'a bırak**, ya da drop zone'a tıkla ve seç
4. Birden fazla fotoğraf seçebilirsin
5. Ok tuşlarıyla sırayı değiştir (ilk fotoğraf ana fotoğraf olur)
6. Aşağıda "Güncelle" butonuna tıkla

### Toplu Fotoğraf Yükleme (SKU Eşleştirmeli)

1. Admin → Fotoğraflar
2. **"SKU CSV İndir"** — tüm ürünlerin SKU listesi CSV olarak iner (Excel'de aç)
3. Bilgisayarında fotoğrafları SKU'lara göre adlandır:
   - `CLN-RLX-0001.jpg` (Rolex 1)
   - `CLN-AP-0003.jpg` (AP 3)
4. Fotoğrafları sayfanın üstündeki büyük **drop zone'a sürükle**
5. Sistem SKU'ya göre otomatik eşleştirir

### Ürün Bilgilerini Revize Etme

Her ürün kartında 7 grup alan düzenlenebilir:
- Temel Bilgiler (marka, model, referans, SKU)
- Kalite & Üretim (factory, quality tier)
- Kasa & Tasarım (çap, malzeme, kadran, bezel, kordon)
- Mekanizma (tip, kalibre, güç rezervi, jewels)
- Açıklamalar (kısa, uzun, özellikler, paket içeriği)
- Fiyat & Stok
- Etiketler (featured, new, sale, style tags)

---

## Canlıya Alma (Production)

### Vercel'e Deploy

```bash
# 1. Vercel CLI yükle (bir kere)
npm install -g vercel

# 2. Bu klasörde deploy
vercel --prod
```

Alternatif: GitHub'a push → Vercel dashboard'dan import

### Domain Bağlama

1. Vercel dashboard → Project → Settings → Domains
2. `clonica.online` ekle
3. DNS panelinden (domain'i aldığın yerden) A/CNAME kayıtlarını Vercel'in dediği şekilde gir

### Production Fotoğraflar Hakkında (Önemli)

Local'de yüklediğin fotoğraflar `public/images/products/` klasörüne gider. **Vercel'de deploy sonrası yüklemek için:**
- Yöntem 1: Local'de admin'den yükle → git commit + push → Vercel otomatik redeploy
- Yöntem 2 (Sonra ekleyebiliriz): Cloudinary veya Vercel Blob entegrasyonu

---

## Klasör Yapısı

```
clonicawatch/
├── src/
│   ├── app/              # sayfalar + API route'lar
│   │   ├── admin/        # admin panel
│   │   ├── api/          # backend endpoint'ler
│   │   └── ...           # site sayfaları
│   ├── components/       # React component'ler
│   ├── lib/              # config, product fonksiyonları
│   └── types/            # TypeScript tipleri
├── content/
│   ├── products/         # 323 ürün (_sample.json)
│   └── blog/             # blog yazıları
├── public/
│   └── images/           # fotoğraflar (admin'den yüklenenler buraya iner)
└── KURULUM.md            # bu dosya
```

---

## İletişim / Yardım

Takıldığın yerde Claude'a "Cowork'de Clonicawatch konuşmasında..." diyerek devam et. Memory'de tüm teknik detaylar kayıtlı.
