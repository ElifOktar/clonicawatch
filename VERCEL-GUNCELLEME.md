# Vercel'de Mevcut Deployment'ı Güncelleme Rehberi

**Mevcut Vercel Projen:** https://vercel.com/elifoktars-projects/clonicawatch-uadq
**Durum:** GitHub reposuna bağlı (auto-deploy aktif)

Yeni versiyonu (clonica.online + drag&drop fotoğraf + 323 ürün) canlıya almak için:

---

## Adım 1: GitHub Repo'nu Aç

1. Vercel dashboard → clonicawatch-uadq → **Settings → Git** bölümüne git
2. "Connected Git Repository" altındaki **GitHub repo linkine tıkla** (bu seni GitHub'a götürür)
3. Repo sayfası açılacak (örn. `github.com/elifoktar/clonicawatch`)

---

## Adım 2: Mevcut Dosyaları Sil (Temiz Başlangıç için)

**NOT:** Dosyaları silmeden üzerine yazmak da mümkün ama temiz başlamak daha sağlam.

Her dosya/klasöre tek tek girip silmek yerine, **daha kolayı:**

1. Repo ana sayfasında "Code" butonunun yanında `main` branch'de olduğundan emin ol
2. Mevcut tüm içerik silinecekse:
   - GitHub'da ana klasördeki her dosyayı tek tek açıp çöp kutusu (🗑) ile silebilirsin
   - VEYA daha pratik: terminali açıp `git rm -rf .` çalıştırmak (ama sen GUI istedin)

### Daha Kolay Yol: "Upload" ile üzerine yaz

GitHub yeni dosyaları yüklerken aynı isimli varolan dosyaları **otomatik üzerine yazar**. Yani silmeyip direkt yükleyebilirsin. Yeni sürümde olmayan eski dosyalar kalır ama zararsız.

**Temiz bir repo istiyorsan aşağıdaki Alternatif'e bak.**

---

## Adım 3: Yeni Dosyaları Yükle

1. GitHub repo sayfasında yeşil **"Add file"** butonuna bas
2. **"Upload files"** seç
3. Bilgisayarında **`Watch/clonicawatch/`** klasörünü aç
4. İçindeki TÜM dosya ve klasörleri seç (Ctrl+A / Cmd+A)
   - `node_modules/` YOK zaten (gitignore'da)
   - `.next/` YOK zaten
5. Hepsini GitHub sayfasındaki drag&drop alanına **sürükle bırak**
6. Yükleme tamamlanana kadar bekle (74 dosya, ~1-2 dakika)
7. Aşağıda "Commit changes" kutusunda başlığa yaz:
   - `Update: clonica.online domain + drag&drop photo upload`
8. **"Commit changes"** yeşil butonuna bas

---

## Adım 4: Vercel Auto-Deploy

Commit yapıldıktan sonra:
1. Vercel dashboard'a geri dön
2. clonicawatch-uadq projesine gir
3. **Deployments** sekmesini aç
4. Yeni bir deployment başlayacak (2-3 dakika sürer)
5. Yeşil "Ready" işaretini gördüğünde canlı — test et!

---

## Alternatif: Komple Temiz Repo (Önerilir ama biraz daha iş)

Eski dosyaların takılmasını istemiyorsan:

1. Vercel → Settings → Git → **"Disconnect"**
2. GitHub'da eski repo'yu sil (Settings → Danger Zone → Delete)
3. GitHub'da yeni repo aç (örn. `clonicawatch`)
4. Yukarıdaki Adım 3 ile tüm dosyaları yükle
5. Vercel → Add New Project → Import from GitHub → yeni repo seç
6. Framework: Next.js (otomatik algılar)
7. Deploy!

---

## Domain Bağlama (clonica.online)

Vercel projesine domain'i bağlamak için:

1. Vercel → clonicawatch-uadq → **Settings → Domains**
2. **"Add"** → `clonica.online` yaz → Add
3. Vercel sana DNS kayıtları verecek (A record + CNAME)
4. Domain'i aldığın yerden (Namecheap / Cloudflare / GoDaddy) DNS panelini aç
5. Vercel'in dediği kayıtları ekle
6. 5-30 dakika içinde domain aktif olur, SSL otomatik gelir

---

## Production'da Fotoğraf Yüklemek

⚠️ Önemli: Local admin panelinde yüklediğin fotoğraflar `public/images/` klasörüne iner. Bunların canlıya çıkması için:

**Opsiyon 1 — Local → GitHub → Vercel:**
1. Local'de admin'den fotoğrafları yükle
2. Klasörde `public/images/products/` altında yeni dosyalar oluşur
3. GitHub'a bu değişikliği yükle (yukarıdaki Adım 3 gibi)
4. Vercel otomatik redeploy eder

**Opsiyon 2 — Cloudinary/Vercel Blob (sonra ekleyebiliriz):**
Cloud fotoğraf depolama çözümü, production'da direkt admin'den yükleme mümkün. Sonraki adım olarak entegre ederiz.

---

## Sorun Yaşarsan

Vercel deployment hata verirse:
1. Deployments → failed deployment → "View Build Logs"
2. Kırmızı satırları bana gönder, çözeriz
