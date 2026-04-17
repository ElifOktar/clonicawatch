"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full bg-bg border border-line rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors";
  const labelCls = "block text-xs text-ink-muted mb-1.5 font-medium";
  const sectionCls = "bg-bg-elev border border-line rounded-xl p-5 space-y-4";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Ayarlar</h1>
      <p className="text-ink-muted text-sm mb-6">Site yapilandirmasi — degisiklikler src/lib/config.ts dosyasini gunceller</p>

      <div className="max-w-3xl space-y-6">
        {/* Brand Info */}
        <div className={sectionCls}>
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Marka Bilgileri</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Marka Adi</label>
              <input defaultValue="CLONICA" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tam Ad</label>
              <input defaultValue="Clonicawatch" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Tagline</label>
              <input defaultValue="Swiss Mechanism. Worldwide Shipping." className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Site URL</label>
              <input defaultValue="https://clonica.online" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={sectionCls}>
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Iletisim</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>WhatsApp Numara (kodlu)</label>
              <input defaultValue="905355430744" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Gosterim</label>
              <input defaultValue="+90 535 543 07 44" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>E-posta</label>
              <input defaultValue="" placeholder="info@clonica.online" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Telegram</label>
              <input defaultValue="" placeholder="@clonicawatch" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram</label>
              <input defaultValue="" placeholder="@clonicawatch" className={inputCls} />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={sectionCls}>
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Odeme Yontemleri</h2>
          <div className="space-y-3 text-sm">
            {[
              { key: "bank", label: "Bank Transfer", note: "Wise / SWIFT" },
              { key: "crypto", label: "Crypto", note: "BTC, USDT" },
              { key: "wu", label: "Western Union", note: "" },
              { key: "ria", label: "RIA Money Transfer", note: "" },
            ].map((pm) => (
              <div key={pm.key} className="flex items-center gap-3 bg-bg rounded-lg p-3">
                <input type="checkbox" defaultChecked className="accent-gold w-4 h-4" />
                <div className="flex-1">
                  <span className="font-medium">{pm.label}</span>
                  {pm.note && <span className="text-ink-muted ml-2">({pm.note})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin PIN */}
        <div className={sectionCls}>
          <h2 className="text-gold text-sm font-semibold tracking-wider uppercase">Guvenlik</h2>
          <div>
            <label className={labelCls}>Admin PIN</label>
            <input type="password" defaultValue="clonica2026" className={inputCls} />
            <p className="text-[11px] text-ink-dim mt-1">
              PIN'i degistirmek icin src/components/admin/AdminAuth.tsx dosyasindaki ADMIN_PIN degerini guncelleyin.
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-bg-elev border border-gold/20 rounded-xl p-5">
          <h2 className="text-gold text-sm font-semibold mb-2">Bilgi</h2>
          <div className="text-xs text-ink-muted space-y-1">
            <p>Bu ayarlar sayfasi simdilik bilgilendirme amaclidir. Tum yapilandirma <code className="text-gold">src/lib/config.ts</code> dosyasinda tek merkezden yonetilir.</p>
            <p>Degisiklik yapmak icin config.ts dosyasini duzenleyin ve git push yapin.</p>
            <p>Gelecek guncelleme: Bu sayfadan direkt config.ts'yi guncelleyebileceksiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
