"use client";

import { AddToCartButton } from "@/components/AddToCartButton";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface Props {
  waUrl: string;
  productId: string;
  product: { id: string; model_name: string; main_image: string; price: { usd: number } };
}

export function StickyProductCTA({ waUrl, productId, product }: Props) {
  return (
    <div className="fixed bottom-16 left-0 right-0 md:hidden bg-bg-elev border-t border-line z-30">
      <div className="container h-16 flex gap-2 items-center px-4">
        <WhatsAppButton waUrl={waUrl} product={product} variant="sticky" />
        <div className="flex-1">
          <AddToCartButton productId={productId} className="h-10 text-sm" />
        </div>
      </div>
    </div>
  );
}
