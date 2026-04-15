# Hanic Watch — Next.js E-Commerce Starter

Global English-first, i18n-ready storefront for premium super clone watches.
Built with Next.js 14 App Router + TypeScript + Tailwind CSS.

## Özellikler (neler hazır)

- ✅ Siyah + altın lüks tema (özelleştirilebilir Tailwind paleti)
- ✅ Ana sayfa (Hero, Trust Strip, Featured Brands, New Arrivals, Shop by Style, Featured Collection, Why Us, CTA)
- ✅ Marka sayfaları (`/brand/rolex`, `/brand/audemars-piguet`, vs.)
- ✅ Kategori/stil sayfaları (`/category/diver`, `/category/gmt`, vs.)
- ✅ Ürün detay sayfası (galeri, Quick Specs, WhatsApp CTA, Related Products, JSON-LD)
- ✅ Sepet sayfası (localStorage tabanlı, çoklu ürün → tek WhatsApp mesajı)
- ✅ New Arrivals, On Sale sayfaları
- ✅ FAQ, Shipping, Payment, Contact, About sayfaları
- ✅ 404 sayfası
- ✅ SEO: dinamik meta, Open Graph, JSON-LD Product schema, sitemap.xml, robots.txt
- ✅ Responsive (mobil → 2 kolon grid, desktop → 4 kolon)
- ✅ Placeholder SVG görsel (gerçek fotolarla değiştirilecek)

## Gereksinimler

- Node.js 20+ (Node 22 önerilir)
- npm veya pnpm

## Çalıştırma

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Geliştirme sunucusu başlat
npm run dev
# → http://localhost:3000

# 3. Production build
npm run build
npm run start
```

## Proje Yapısı

```
app/
├── content/
│   └── products/
│       └── _sample.json     ← 6 örnek ürün (gerçek ürünler eklendikçe bu dosya güncellenir)
├── public/
│   └── images/
│       ├── placeholder-watch.svg   ← yer tutucu saat görseli
│       └── products/
│           └── placeholder/        ← ürün placeholder klasörü (gerçek fotolarla doldurulacak)
├── src/
│   ├── app/
│   │   ├── layout.tsx              ← root layout (font, header, footer, cart provider)
│   │   ├── page.tsx                ← Homepage
│   │   ├── globals.css             ← Tailwind + custom utilities
│   │   ├── sitemap.ts              ← Dinamik sitemap (tüm ürünler + markalar)
│   │   ├── robots.ts               ← robots.txt
│   │   ├── not-found.tsx           ← 404
│   │   ├── product/[slug]/page.tsx ← Ürün detay
│   │   ├── brand/[brand]/page.tsx  ← Marka sayfası
│   │   ├── category/[category]/page.tsx ← Stil kategori
│   │   ├── cart/page.tsx           ← Sepet + WhatsApp checkout
│   │   ├── new-arrivals/page.tsx
│   │   ├── on-sale/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── shipping/page.tsx
│   │   ├── payment/page.tsx
│   │   ├── contact/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── Header.tsx              ← Üst navigasyon + cart badge
│   │   ├── Footer.tsx              ← Alt footer
│   │   ├── CartProvider.tsx        ← localStorage cart context
│   │   ├── ProductCard.tsx         ← Ürün kartı
│   │   ├── ProductGrid.tsx         ← Grid wrapper
│   │   └── AddToCartButton.tsx     ← Client-side sepete ekle butonu
│   ├── lib/
│   │   ├── config.ts               ← ★ TÜM marka/contact/payment bilgileri burada
│   │   ├── products.ts             ← Ürün loader + formatters + WhatsApp helpers
│   │   └── cn.ts                   ← Tailwind class merge utility
│   └── types/
│       └── product.ts              ← Product TypeScript tipi
├── tailwind.config.ts              ← Tema renkleri (black & gold)
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs
├── package.json
└── .gitignore
```

## Nasıl Yeni Ürün Eklenir?

`content/products/_sample.json` dosyasını aç, array'e yeni bir obje ekle.
Şu alanlar zorunlu: `id`, `slug`, `sku`, `brand`, `collection`, `model_name`, `quality_tier`, `case_diameter_mm`, `case_material`, `dial_color`, `strap_type`, `movement_type`, `movement_caliber`, `price.usd`, `stock_status`, `is_featured`, `is_new_arrival`, `is_on_sale`, `created_at`, `main_image`, `gallery_images`, `gender`, `style_tags`, `short_description`, `long_description`, `features_bullets`, `package_contents`.

Alan referansı için `/Watch/data-model/urun-veri-modeli.md` dokümanına bak.

## Nasıl Görsel Eklenir?

1. Ürün fotoğraflarını `public/images/products/{slug}/` altına koy (ör. `main.jpg`, `01.jpg`, `02.jpg`)
2. JSON'da `main_image` ve `gallery_images` yollarını güncelle:
   ```json
   "main_image": "/images/products/rolex-submariner-black-dial-126610ln/main.jpg",
   "gallery_images": [
     "/images/products/rolex-submariner-black-dial-126610ln/01.jpg",
     "/images/products/rolex-submariner-black-dial-126610ln/02.jpg"
   ]
   ```

## Marka Bilgilerini Güncelleme

`src/lib/config.ts` dosyasında tek yerden:
- Marka adı (`name`, `fullName`)
- Tagline
- WhatsApp numarası
- Email / Instagram / Telegram
- Ödeme yöntemleri
- Kargo firmaları

## Deploy

### Vercel (önerilen, ücretsiz)

1. GitHub'a push et
2. [vercel.com](https://vercel.com) → New Project → repoyu seç
3. Tek tık deploy → `xxx.vercel.app` URL'inde canlı
4. Custom domain: Vercel Dashboard → Domains → Add

### Domain öneriler

- Ana domain: `hanicwatch.com` (veya nihai marka isminde)
- Namecheap, Cloudflare Registrar (~$10-12/yıl)
- DNS'i Vercel nameserver'larına yönlendir

## Sıradaki Geliştirmeler (isteğe bağlı)

- [ ] Marka/kategori sayfalarında filtre sidebar (case size, dial color, factory, price range)
- [ ] Global arama (modal ile)
- [ ] Currency switcher (USD/EUR/GBP/AED) — canlı kur API
- [ ] Çoklu dil (AR, ES, DE) — `next-intl`
- [ ] Blog (SEO driver)
- [ ] Instagram feed entegrasyonu
- [ ] Wishlist
- [ ] Review/testimonial toplama

## Not

Placeholder isim "HANIC" olarak ayarlı. Marka ismi netleştiğinde `src/lib/config.ts` içinden `name` ve `fullName` değerlerini güncelle — tek bir yerden tüm site metni değişir.

WhatsApp numarası: +90 535 543 07 44 (hali hazırda koda gömülü).
