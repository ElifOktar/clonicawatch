"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/* --- Generic event helper --- */
export function trackEvent(
  eventName: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

/* --- Typed funnel helpers --- */

export function trackViewItem(product: {
  id: string;
  brand: string;
  model_name: string;
  collection?: string;
  price_usd: number;
}) {
  trackEvent("view_item", {
    currency: "USD",
    value: product.price_usd,
    items: [
      {
        item_id: product.id,
        item_name: product.model_name,
        item_brand: product.brand,
        item_category: product.collection || "",
        price: product.price_usd,
      },
    ],
  });
}

export function trackAddToCart(product: {
  id: string;
  brand: string;
  model_name: string;
  collection?: string;
  price_usd: number;
  quantity?: number;
}) {
  trackEvent("add_to_cart", {
    currency: "USD",
    value: product.price_usd * (product.quantity || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.model_name,
        item_brand: product.brand,
        item_category: product.collection || "",
        price: product.price_usd,
        quantity: product.quantity || 1,
      },
    ],
  });
}

export function trackViewCart(
  items: { id: string; name: string; brand: string; price: number; qty: number }[],
  total: number
) {
  trackEvent("view_cart", {
    currency: "USD",
    value: total,
    items: items.map((it) => ({
      item_id: it.id,
      item_name: it.name,
      item_brand: it.brand,
      price: it.price,
      quantity: it.qty,
    })),
  });
}

export function trackBeginCheckout(
  items: { id: string; name: string; brand: string; price: number; qty: number }[],
  total: number
) {
  trackEvent("begin_checkout", {
    currency: "USD",
    value: total,
    items: items.map((it) => ({
      item_id: it.id,
      item_name: it.name,
      item_brand: it.brand,
      price: it.price,
      quantity: it.qty,
    })),
  });
}

export function trackWhatsAppClick(context: {
  page: "product" | "cart" | "homepage" | "sticky_cta";
  product_id?: string;
  product_name?: string;
  value?: number;
}) {
  trackEvent("whatsapp_click", {
    click_context: context.page,
    product_id: context.product_id || "",
    product_name: context.product_name || "",
    value: context.value || 0,
    currency: "USD",
  });
}

export function trackPurchase(
  items: { id: string; name: string; brand: string; price: number; qty: number }[],
  total: number
) {
  trackEvent("purchase", {
    currency: "USD",
    value: total,
    transaction_id: `wa_${Date.now()}`,
    items: items.map((it) => ({
      item_id: it.id,
      item_name: it.name,
      item_brand: it.brand,
      price: it.price,
      quantity: it.qty,
    })),
  });
}

/* --- Pageview tracker --- */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("config", GA_ID, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

/* --- Ana Analytics bileseni --- */
export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  );
}
