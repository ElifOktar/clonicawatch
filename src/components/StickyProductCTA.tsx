"use client";

import { AddToCartButton } from "@/components/AddToCartButton";

interface Props {
  waUrl: string;
  productId: string;
}

export function StickyProductCTA({ waUrl, productId }: Props) {
  return (
    <div className="fixed bottom-16 left-0 right-0 md:hidden bg-bg-elev border-t border-line z-30">
      <div className="container h-16 flex gap-2 items-center px-4">
        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-10 bg-gold hover:bg-gold/90 text-bg font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.183 0-5.778 2.594-5.778 5.777 0 1.144.329 2.205.948 3.123l-1.007 3.679 3.767-.988c.92.533 1.965.81 3.07.81h.004c3.183 0 5.778-2.594 5.778-5.778 0-1.544-.635-2.945-1.684-3.978-1.05-1.032-2.448-1.6-3.93-1.6" />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Add to Cart Button */}
        <div className="flex-1">
          <AddToCartButton productId={productId} className="h-10 text-sm" />
        </div>
      </div>
    </div>
  );
}
