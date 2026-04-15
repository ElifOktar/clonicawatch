"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, resolveCartItems } from "@/components/CartProvider";
import { buildCartWhatsAppMessage, formatPrice, getWhatsAppUrl, getAllProducts } from "@/lib/products";

export default function CartPage() {
  const { items, updateQty, removeItem, clear, isHydrated } = useCart();
  const resolved = resolveCartItems(items, getAllProducts());

  const total = resolved.reduce(
    (sum, it) => sum + it.product.price.usd * it.qty,
    0
  );

  const waMessage = buildCartWhatsAppMessage(resolved);
  const waUrl = getWhatsAppUrl(waMessage);

  if (!isHydrated) {
    return (
      <div className="container py-20 text-center text-ink-muted">
        Loading cart…
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="h-serif text-4xl mb-8">Your Cart</h1>

      {resolved.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-muted text-lg">Your cart is empty.</p>
          <Link href="/" className="btn-gold mt-6 inline-flex">
            Browse Watches
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr,360px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {resolved.map(({ product, qty }) => (
              <div
                key={product.id}
                className="card p-4 flex gap-4 items-center"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-24 h-24 shrink-0 overflow-hidden rounded-sm border border-line"
                >
                  <Image
                    src={product.main_image}
                    alt={product.model_name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-dim uppercase tracking-widest">{product.brand}</p>
                  <Link
                    href={`/product/${product.slug}`}
                    className="block font-medium truncate hover:text-gold"
                  >
                    {product.collection} {product.reference ?? ""}
                  </Link>
                  <p className="text-gold mt-1">{formatPrice(product.price.usd)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQty(product.id, qty - 1)}
                    className="w-8 h-8 border border-line hover:border-gold hover:text-gold"
                  >−</button>
                  <span className="w-8 text-center">{qty}</span>
                  <button
                    onClick={() => updateQty(product.id, qty + 1)}
                    className="w-8 h-8 border border-line hover:border-gold hover:text-gold"
                  >+</button>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-ink-dim hover:text-danger text-xl px-2"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={clear}
              className="text-sm text-ink-dim hover:text-danger"
            >
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <aside className="card p-6 h-fit lg:sticky lg:top-24">
            <h3 className="h-serif text-xl mb-4">Order Summary</h3>
            <div className="divide-y divide-line">
              {resolved.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between py-2 text-sm">
                  <span className="text-ink-muted truncate pr-2">
                    {product.collection} × {qty}
                  </span>
                  <span>{formatPrice(product.price.usd * qty)}</span>
                </div>
              ))}
            </div>
            <div className="divider my-4" />
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <span className="text-gold font-medium">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-ink-muted mt-2">
              Shipping & fees calculated in chat.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener"
              className="btn-gold w-full mt-6 text-base"
            >
              💬 Checkout via WhatsApp
            </a>

            <div className="mt-4 text-xs text-ink-muted space-y-2">
              <p>✓ Your order details auto-fill into the WhatsApp chat.</p>
              <p>✓ Our team responds within 2 hours.</p>
              <p>✓ Payment methods discussed in chat (Bank / Crypto / WU / RIA).</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
