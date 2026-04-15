# Clonicawatch — Bakım Rehberi (Türkçe)

Bu rehber, **kod bilmeyen biri** sitenin bakımını devralsa bile tek başına yönetebilmesi için yazıldı.

---

## 🎛️ Günlük İşlemler

### 1. Yeni Ürün Eklemek

**Kolay yol (tıklayarak):**
1. `yoursite.com/admin` adresine git.
2. PIN gir: `clonica2026` (güvenlik için bu PIN'i değiştirmen önerilir — `src/app/admin/page.tsx` dosyasındaki `ADMIN_PIN` satırı).
3. Formu doldur (marka, referans, fiyat, açıklama vs.).
4. Sağ taraftaki **"📋 Kopyala"** butonuna bas.
5. Kopyalanan JSON'u projedeki `content/products/_sample.json` dosyasının sonuna yapıştır.
6. Git push → site 2 dakikada güncellenir.

**Gerçekten kolay yol (önerilen — ileride):** Sanity CMS entegrasyonu. Aşağıda "Uzun Vadeli İyileştirmeler" bölümünde detaylı.

### 2. Fiyat Güncelleme

1. `content/products/_sample.json` dosyasını aç.
2. İlgili ürünü bul, `"price": { "usd": 1050 }` satırını değiştir.
3. Kaydet → git push → canlı.

### 3. Ürün Fotoğrafı Değiştirme

1. Gerçek fotoğrafları `public/images/products/{ürün-slug}/` klasörüne koy (ör. `main.jpg`, `01.jpg`).
2. İlgili ürünün JSON'unda şu alanları güncelle:
   ```json
   "main_image": "/images/products/rolex-submariner-black-dial-126610ln/main.jpg",
   "gallery_images": [
     "/images/products/rolex-submariner-black-dial-126610ln/01.jpg",
     "/images/products/rolex-submariner-black-dial-126610ln/02.jpg"
   ]
   ```
3. Kaydet → git push.

### 4. Ürünü Stoktan Kaldırmak / Geri Eklemek

JSON'daki `"stock_status"` alanını:
- `"In Stock"` — satışta
- `"Limited Stock"` — az kaldı (kırmızı rozet)
- `"Sold Out"` — tükendi (karta overlay düşer)
- `"Pre-Order"` — ön sipariş

### 5. İndirim Başlatmak/Bitirmek

İlgili üründe:
```json
"is_on_sale": true,
"original_price": { "usd": 1520 },
"price": { "usd": 1380 }
```

İndirim bitince `is_on_sale: false` yap, `original_price`'ı sil.

---

## 🎨 Marka Bilgilerini Güncellemek

Hepsi tek dosyada: **`src/lib/config.ts`**

Güncellenebilecek alanlar:
- `name`, `fullName` (marka adı)
- `tagline`
- `contact.whatsapp` (şu an: 905355430744)
- `contact.email`, `contact.telegram`, `contact.instagram` (yeni hesaplar gelince)
- `paymentMethods` (ödeme yöntem listesi)

Bir satırı değiştir → git push → tüm site güncellenir.

---

## 📝 Blog Yazısı Eklemek

1. `content/blog/posts.json` dosyasını aç.
2. Array'in sonuna yeni obje ekle:
   ```json
   {
     "slug": "baslik-url-dostu",
     "title": "Başlık",
     "excerpt": "1 cümle özet",
     "cover": "/images/placeholder-watch.svg",
     "date": "2026-05-01",
     "author": "Clonicawatch Editorial",
     "readingTime": "5 min",
     "content": "## Alt başlık\n\nParagraf metni...\n\n- Madde 1\n- Madde 2"
   }
   ```
3. Git push → `/blog` sayfasında otomatik görünür.

**Markdown desteği:** `## Başlık`, `### Alt başlık`, `**kalın**`, `- madde` çalışır.

---

## 💬 Instagram Feed Güncellemek

`src/components/InstagramFeed.tsx` dosyasında `INSTAGRAM_TILES` dizisi var.
Her obje bir kutucuk — `image` alanına Instagram'dan kaydettiğin fotoğrafın URL'si veya dosya yolu yaz.

İleride **Instagram Basic Display API** ile otomatikleştirilebilir (teknik destek gerekir, MAINTENANCE.md "Uzun Vadeli" bölümünde).

---

## ⭐ Müşteri Yorumları Eklemek

`src/components/Reviews.tsx` dosyasında `REVIEWS` dizisi var. Yeni obje ekle:
```ts
{ name: "Ad", location: "Şehir, Ülke", rating: 5,
  text: "Yorum metni...",
  product: "Ürün adı" }
```

---

## 🌍 Dil Seçeneği (İleride)

Site İngilizce. İleride Arapça/İspanyolca/Almanca eklemek istersen:
1. `npm install next-intl` çalıştır.
2. `src/middleware.ts` dosyası kur.
3. `messages/en.json`, `messages/ar.json` dosyaları oluştur.
4. Sayfa metinlerini bu JSON'lardan çek.

Detaylar teknik — bir geliştiriciye danış. Altyapı hazır, sadece aktifleştirme gerekiyor.

---

## 🚀 Canlı Siteyi Güncellemek

Her değişiklik sonrası:
1. Terminalde proje klasöründe `git add .` yaz.
2. `git commit -m "güncelleme: yeni ürün eklendi"` yaz.
3. `git push` yaz.
4. Netlify/Vercel otomatik deploy başlar.
5. ~2 dk sonra site güncellenir.

**Git bilmiyor musun?** Aşağıdaki "Uzun Vadeli" bölümünde CMS önerisi var — hiç terminal kullanmayacağın bir akış öneriyorum.

---

## 🔮 Uzun Vadeli İyileştirmeler (Önerilen)

### A) Sanity.io CMS Entegrasyonu (EN ÖNEMLİSİ)

**Neden?** Sanity, kod yazmadan / git kullanmadan ürün eklemeni sağlayan görsel bir panel.

**Nasıl görünüyor?**
- `yoursite.com/studio` gibi bir adrese gidersin
- Tıklayarak ürün eklersin, fotoğraf sürükleyip bırakırsın
- "Yayınla" butonuna basarsın
- Site 30 saniyede güncellenir

**Ücret:** Sanity ücretsiz (başlangıç için).

**Kurulum:** Bir defaya mahsus geliştirici desteği gerekir (yaklaşık 1-2 saat iş). Sonrası tamamen görsel.

### B) Instagram Otomatik Feed

Instagram Basic Display API ile marka sayfanın son 9 gönderisi otomatik gelsin. Bir defa kurulur, sonra sıfır bakım.

### C) Analytics + Customer Insights

Google Analytics 4 + Meta Pixel + Hotjar kurulumu. Hangi ürünler ilgi çekiyor, nereden gelen müşteri daha çok alıyor — görsel dashboard.

### D) E-posta Listesi

Newsletter formu Mailchimp/Brevo (ücretsiz) ile bağlanır. Yeni ürün çıkınca otomatik mail gider.

---

## 🆘 Teknik Destek Gerektirirse

Bu dosyayı takip ederken takılırsan:
- Vercel Dashboard'dan "Deployments" → son deploy'da kırmızı hata varsa tıkla, log'u gör
- Netlify Dashboard → "Deploy log" sekmesi aynı şey
- GitHub repo → Actions sekmesi (eğer varsa) — hata varsa kırmızı görürsün

**En önemli kural:** Her değişiklikten önce `content/products/_sample.json`'ın **yedek kopyasını al** (başka yere kaydet). JSON bozulursa site çalışmaz ama yedekten geri alırsın, 30 saniye iş.
