"use client";

import { useEffect } from "react";
import { trackViewItem } from "@/components/Analytics";

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

  return null;
}
