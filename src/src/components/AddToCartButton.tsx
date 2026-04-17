"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useToast } from "@/components/Toast";
import { cn } from "@/lib/cn";

export function AddToCartButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        addItem(productId, 1);
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
