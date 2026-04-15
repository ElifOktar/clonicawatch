"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { cn } from "@/lib/cn";

export function AddToCartButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        addItem(productId, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
      className={cn("btn-outline w-full", className)}
    >
      {added ? "✓ Added to Cart" : "+ Add to Cart"}
    </button>
  );
}
