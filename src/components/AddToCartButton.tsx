"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";
import { trackAddToCart } from "@/components/Analytics";
import { cn } from "@/lib/cn";

export function AddToCartButton({
  productId,
  className,
  productName,
  brand,
  collection,
  priceUsd,
}: {
  productId: string;
  className?: string;
  productName?: string;
  brand?: string;
  collection?: string;
  priceUsd?: number;
}) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        addItem(productId, 1);

        /* GA4: add_to_cart event */
        if (productName && brand && priceUsd !== undefined) {
          trackAddToCart({
            id: productId,
            brand,
            model_name: productName,
            collection: collection || "",
            price_usd: priceUsd,
            quantity: 1,
          });
        }

        setAdded(true);
        showToast("Added to cart successfully!", "success");
        setTimeout(() => setAdded(false), 2000);
      }}
      className={cn("btn-outline w-full", className)}
    >
      {added ? "✓ Added to Cart" : "+ Add to Cart"}
    </button>
  );
}
