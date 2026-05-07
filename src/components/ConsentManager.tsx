// src/components/ConsentManager.tsx
// YENI dosya. GDPR/KVKK uyumlu cookie consent banner + Google Consent Mode v2.
// AB trafiginde GA4 verisinin kayboldugu sorunu cozer.
// Layout.tsx'e <Analytics />'den ONCE eklenir.

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type ConsentChoice = "granted" | "denied";
interface Consent {
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  analytics_storage: ConsentChoice;
  functionality_storage: ConsentChoice;
  personalization_storage: ConsentChoice;
  security_storage: ConsentChoice;
}

const STORAGE_KEY = "clonica_consent_v2";

function getStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveConsent(c: Consent) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {}
}

function applyConsent(c: Consent) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", c as unknown as Record<string, string>);
}

const GRANTED_ALL: Consent = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  functionality_storage: "granted",
  personalization_storage: "granted",
  security_storage: "granted",
};

const DENIED_ALL: Consent = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  functionality_storage: "granted", // gerekli, hiç default
  personalization_storage: "denied",
  security_storage: "granted",
};

export default function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [custom, setCustom] = useState<Consent>(DENIED_ALL);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setShowBanner(true);
    } else {
      applyConsent(stored);
    }
  }, []);

  const acceptAll = () => {
    saveConsent(GRANTED_ALL);
    applyConsent(GRANTED_ALL);
    setShowBanner(false);
  };

  const rejectAll = () => {
    saveConsent(DENIED_ALL);
    applyConsent(DENIED_ALL);
    setShowBanner(false);
  };

  const saveCustom = () => {
    saveConsent(custom);
    applyConsent(custom);
    setShowBanner(false);
    setShowSettings(false);
  };

  return (
    <>
      {/* Default consent: tum kategoriler "denied", sadece security/functionality "granted".
          Gtag yuklenmeden once arrival eder. */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            functionality_storage: 'granted',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
          });
        `}
      </Script>

      {showBanner && (
        <div
          role="dialog"
          aria-label="Cookie Consent"
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-elev border-t border-line shadow-2xl"
        >
          <div className="max-w-6xl mx-auto p-4 md:p-6">
            {!showSettings ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-gold font-semibold text-sm mb-1">Cookie Preferences</h3>
                  <p className="text-ink-muted text-xs leading-relaxed">
                    We use cookies to enhance your experience, analyze traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies. You can manage your
                    preferences anytime.{" "}
                    <a href="/privacy" className="text-gold underline">Privacy Policy</a>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-xs px-4 py-2 border border-line rounded-lg hover:border-gold/50 transition-colors"
                  >
                    Customize
                  </button>
                  <button
                    onClick={rejectAll}
                    className="text-xs px-4 py-2 border border-line rounded-lg hover:border-gold/50 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={acceptAll}
                    className="text-xs px-4 py-2 bg-gold text-bg font-semibold rounded-lg hover:bg-gold-bright transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-gold font-semibold text-sm">Cookie Categories</h3>
                {[
                  { key: "analytics_storage" as const, label: "Analytics", desc: "Helps us understand how visitors interact with the site." },
                  { key: "ad_storage" as const, label: "Advertising", desc: "Used to deliver personalized ads." },
                  { key: "ad_user_data" as const, label: "Ad User Data", desc: "Sharing user data with Google for ad personalization." },
                  { key: "ad_personalization" as const, label: "Ad Personalization", desc: "Personalize ads based on your behavior." },
                  { key: "personalization_storage" as const, label: "Personalization", desc: "Site personalization (recommendations, recently viewed)." },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-bg-soft">
                    <input
                      type="checkbox"
                      checked={custom[key] === "granted"}
                      onChange={(e) =>
                        setCustom({ ...custom, [key]: e.target.checked ? "granted" : "denied" })
                      }
                      className="accent-gold w-4 h-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-ink text-xs font-medium">{label}</div>
                      <div className="text-ink-muted text-[11px]">{desc}</div>
                    </div>
                  </label>
                ))}
                <div className="flex gap-2 pt-2 border-t border-line">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-xs px-4 py-2 border border-line rounded-lg flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={saveCustom}
                    className="text-xs px-4 py-2 bg-gold text-bg font-semibold rounded-lg flex-1"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

