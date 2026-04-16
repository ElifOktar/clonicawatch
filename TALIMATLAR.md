# GitHub'a Yüklenecek 5 Dosya — Talimatlar

Bu klasörde 5 dosya var. Her birinin GitHub'da nereye gideceği aşağıda yazılı.

## Yöntem: GitHub Web Arayüzünden Tek Tek Yükle

GitHub'da `clonicawatch` repo sayfasını aç, sonra her dosyayı sırayla yükle:

---

### 1️⃣ Dosya: `1_page.tsx`

**GitHub'daki yeri:** `app/src/app/admin/photos/page.tsx` (YENİ dosya, yeni klasör gerekli)

**Nasıl yaparsın:**
1. Repo ana sayfasında → **"Add file"** → **"Create new file"**
2. Dosya adı kutusuna şunu yapıştır: `app/src/app/admin/photos/page.tsx`
   (GitHub `/` gördükçe otomatik klasör oluşturur)
3. `1_page.tsx` dosyasını bilgisayarda bir metin editöründe aç → **tamamını seç + kopyala**
4. GitHub'ın büyük kod alanına yapıştır
5. Alta in → Commit message: `Admin fotograf yoneticisi sayfasi` → **Commit new file**

---

### 2️⃣ Dosya: `2_route.ts`

**GitHub'daki yeri:** `app/src/app/api/admin/photos/route.ts` (YENİ dosya, yeni klasör gerekli)

**Nasıl yaparsın:**
1. Repo ana sayfası → **"Add file"** → **"Create new file"**
2. Dosya adı: `app/src/app/api/admin/photos/route.ts`
3. `2_route.ts` içeriğini kopyala-yapıştır
4. Commit message: `Fotograf toplu yukleme API` → **Commit new file**

---

### 3️⃣ Dosya: `3_AdminSidebar.tsx` (ÜSTÜNE YAZ)

**GitHub'daki yeri:** `app/src/components/admin/AdminSidebar.tsx` (MEVCUT dosya, güncellenecek)

**Nasıl yaparsın:**
1. Repo'da `app` → `src` → `components` → `admin` klasörüne git
2. `AdminSidebar.tsx` dosyasına tıkla
3. Sağ üstte **kalem ikonu (✏️)** Edit
4. Açılan kod alanındaki tüm içeriği seç (Cmd+A) → Sil
5. `3_AdminSidebar.tsx` içeriğini kopyala-yapıştır
6. Commit message: `Sidebara fotograflar sekmesi` → **Commit changes**

---

### 4️⃣ Dosya: `4_ProductCard.tsx` (ÜSTÜNE YAZ)

**GitHub'daki yeri:** `app/src/components/ProductCard.tsx`

**Nasıl yaparsın:**
1. Repo'da `app` → `src` → `components` klasörüne git
2. `ProductCard.tsx` dosyasına tıkla
3. Kalem ikonu → içeriği tümüyle sil
4. `4_ProductCard.tsx` içeriğini yapıştır
5. Commit message: `Kirik gorsel fallback` → **Commit changes**

---

### 5️⃣ Dosya: `5__sample.json` (ÜSTÜNE YAZ)

**GitHub'daki yeri:** `app/content/products/_sample.json`

**Nasıl yaparsın:**
1. Repo'da `app` → `content` → `products` klasörüne git
2. `_sample.json` dosyasına tıkla
3. Kalem ikonu → içeriği tümüyle sil
4. `5__sample.json` içeriğini yapıştır
5. Commit message: `86 urunluk katalog guncelleme` → **Commit changes**

---

## Bittiğinde

Her commit'ten sonra Vercel otomatik build başlatır. 5 dosyayı yükledikten sonra ~3 dakika bekle:

1. `vercel.com/dashboard` aç → `clonicawatch` projesi
2. "Deployments" → en üstteki "Ready" olmalı (yeşil)
3. Site URL'sine git → `/admin` → PIN: `clonica2026`
4. Sol menüde **"Fotoğraflar"** sekmesini göreceksin

Takılırsan hangisinde takıldığını söyle.
