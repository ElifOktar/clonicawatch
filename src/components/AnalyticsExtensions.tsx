// src/components/AnalyticsExtensions.tsx
// YENI dosya. Mevcut Analytics.tsx'e dokunmadan eksik GA4 events ve Consent Mode v2 ekler.
// Mevcut helper'lar: trackEvent, trackViewItem, trackAddToCart, trackViewCart,
//                    trackBeginCheckout, trackPurchase, trackWhatsAppClick (Analytics.tsx)
// Bu dosyadakiler: view_item_list, select_item, search, add_to_wishlist,
//                  remove_from_cart, add_payment_info, add_shipping_info, sign_up,
//                  share, view_promotion, select_promotion + Consent Mode v2

import { trackEvent } from "./Analytics";

type Item = {
  id: string;
  name: string;
  brand: string;
  collection?: string;
  price: number;
  qty?: number;
};

/* ─── List/category browsing ─── */

/** Kategori, marka, koleksiyon, ladies sayfasinda urun listesi yuklenince. */
export function trackViewItemList(
  listName: string, // "Rolex Submariner Collection", "Ladies Watches", "New Arrivals"
  listId: string,   // "rolex_submariner", "ladies", "new_arrivals"
  items: Item[]
) {
  trackEvent("view_item_list", {
    item_list_name: listName,
    item_list_id: listId,
    items: items.slice(0, 20).map((it, idx) => ({
      item_id: it.id,
      item_name: it.name,
      item_brand: it.brand,
      item_category: it.collection || "",
      price: it.price,
      index: idx,
    })),
  });
}

/** Bir urun karti tiklaninca (urun sayfasi yuklenmeden once). */
export function trackSelectItem(
  listName: string,
  listId: string,
  product: Item,
  position: number
) {
  trackEvent("select_item", {
    item_list_name: listName,
    item_list_id: listId,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.collection || "",
        price: product.price,
        index: position,
      },
    ],
  });
}

/* ─── Search ─── */

export function trackSearch(searchTerm: string, resultsCount?: number) {
  trackEvent("search", {
    search_term: searchTerm,
    results_count: resultsCount ?? 0,
  });
}

/* ─── Wishlist ─── */

export function trackAddToWishlist(product: Item) {
  trackEvent("add_to_wishlist", {
    currency: "USD",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        item_category: product.collection || "",
        price: product.price,
      },
    ],
  });
}

/* ─── Cart actions ─── */

export function trackRemoveFromCart(product: Item) {
  trackEvent("remove_from_cart", {
    currency: "USD",
    value: product.price * (product.qty || 1),
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        price: product.price,
        quantity: product.qty || 1,
      },
    ],
  });
}

/* ─── Checkout funnel ─── */

export function trackAddShippingInfo(
  items: Item[],
  total: number,
  shippingTier: string // "Standard", "Express", "Insured Premium"
) {
  trackEvent("add_shipping_info", {
    currency: "USD",
    value: total,
    shipping_tier: shippingTier,
    items: items.map((it) => ({
      item_id: it.id,
      item_name: it.name,
      item_brand: it.brand,
      price: it.price,
      quantity: it.qty || 1,
    })),
  });
}

export function trackAddPaymentInfo(
  items: Item[],
  total: number,
  paymentType: string // "card", "paypal", "wire", "crypto"
) {
  trackEvent("add_payment_info", {
    currency: "USD",
    value: total,
    payment_type: paymentType,
    items: items.map((it) => ({
      item_id: it.id,
      item_name: it.name,
      item_brand: it.brand,
      price: it.price,
      quantity: it.qty || 1,
    })),
  });
}

/* ─── Engagement ─── */

export function trackShare(method: string, contentId: string, contentType: string) {
  trackEvent("share", {
    method, // "whatsapp", "twitter", "facebook", "copy_link"
    content_type: contentType, // "product", "article"
    item_id: contentId,
  });
}

export function trackSignUp(method: string = "email") {
  trackEvent("sign_up", { method });
}

export function trackLogin(method: string = "email") {
  trackEvent("login", { method });
}

/* ─── Promo tracking ─── */

export function trackViewPromotion(promotionId: string, promotionName: string) {
  trackEvent("view_promotion", {
    promotion_id: promotionId,
    promotion_name: promotionName,
  });
}

export function trackSelectPromotion(promotionId: string, promotionName: string) {
  trackEvent("select_promotion", {
    promotion_id: promotionId,
    promotion_name: promotionName,
  });
}

/* ─── Custom luxury watch events ─── */

export function trackAuthenticityCheckView(productId: string) {
  trackEvent("authenticity_check_view", { product_id: productId });
}

export function trackCertificateDownload(productId: string) {
  trackEvent("certificate_download", { product_id: productId });
}

export function trackVideoPlay(productId: string, videoUrl: string) {
  trackEvent("video_play", { product_id: productId, video_url: videoUrl });
}

export function trackComparisonAdd(productId: string) {
  trackEvent("comparison_add", { product_id: productId });
}

export function trackContactClick(method: string) {
  trackEvent("contact_click", { method }); // "phone", "email", "whatsapp", "telegram"
}

