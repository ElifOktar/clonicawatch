"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/components/Analytics";

/**
 * Product detail sayfasına eklenen client-side bileşen.
 * Sayfa yüklendiğinde GA4'e view_item event'i gönderir.
 *
 * Kullanım (server component içinde):
 *   <ProductViewTracker
 *     id={p.id}
 *     brand={p.brand}
 *     modelName={p.model_name}
 *     collection={p.collection}
 *     priceUsd={p.price.usd}
 *   />
 */
export function ProductViewTracker({
  id,
  brand,
  modelName,
  collection,
  priceUsd,
}: {
  id: string;
  brand: string;
  modelName: string;
  collection?: string;
  priceUsd: number;
}) {
  useEffect(() => {
    trackViewItem({
      id,
      brand,
      model_name: modelName,
      collection,
      price_usd: priceUsd,
    });
  }, [id, brand, modelName, collection, priceUsd]);

  return null; // Görsel çıktı yok, sadece event tetikler
}
