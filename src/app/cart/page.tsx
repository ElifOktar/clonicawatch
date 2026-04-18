"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart, resolveCartItems } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import { buildCartWhatsAppMessage, formatPrice, getWhatsAppUrl, getAllProducts } from "@/lib/products";

interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CartPage() {
  const { items, updateQty, removeItem, clear, isHydrated } = useCart();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const resolved = resolveCartItems(items, getAllProducts());
  const [step, setStep] = useState<"cart" | "address">("cart");

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    line1: user?.address?.line1 || "",
    line2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "",
  });

  const total = resolved.reduce(
    (sum, it) => sum + it.product.price.usd * it.qty,
    0
  );

  const addressText = `\n\n📦 Shipping Address:\n${address.fullName}\n${address.phone}\n${address.line1}${address.line2 ? ", " + address.line2 : ""}\n${address.city}, ${address.state} ${address.zip}\n${address.country}`;
  const waMessage = buildCartWhatsAppMessage(resolved) + (step === "address" ? addressText : "");
  const waUrl = getWhatsAppUrl(waMessage);

  const inputCls = "w-full bg-bg border border-line rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-ink-dim";

  const handleProceedToCheckout = () => {
    setStep("address");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckout = () => {
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.country) {
      showToast("Please fill in all required address fields", "error");
      return;
    }

    // Save address to user profile if logged in
    if (user) {
      updateProfile({
        phone: address.phone,
        address: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
        },
      });
    }

    showToast("Order details prepared! Redirecting to WhatsApp...", "success");

    // Open WhatsApp after short delay
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);
  };

  if (!isHydrated) {
    return (
      <div className="container py-20 text-center text-ink-muted">
        Loading cart…
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Steps indicator */}
      {resolved.length > 0 && (
        <div className="flex items-center gap-3 mb-8 text-sm">
          <button
            onClick={() => setStep("cart")}
            className={`flex items-center gap-2 ${step === "cart" ? "text-gold" : "text-ink-muted"}`}
          >
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center border ${step === "cart" ? "bg-gold text-bg border-gold" : "border-line"}`}>1</span>
            Cart
          </button>
          <div className="w-8 h-px bg-line" />
          <button
            onClick={() => items.length > 0 && setStep("address")}
            className={`flex items-center gap-2 ${step === "address" ? "text-gold" : "text-ink-muted"}`}
          >
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center border ${step === "address" ? "bg-gold text-bg border-gold" : "border-line"}`}>2</span>
            Shipping
          </button>
        </div>
      )}

      <h1 className="h-serif text-4xl mb-8">
        {step === "cart" ? "Your Cart" : "Shipping Address"}
      </h1>

      {resolved.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-ink-muted text-lg">Your cart is empty.</p>
          <Link href="/" className="btn-gold mt-6 inline-flex">
            Browse Watches
          </Link>
        </div>
      ) : step === "cart" ? (
        <div className="grid lg:grid-cols-[1fr,360px] gap-8 min-w-0">
          {/* Items */}
          <div className="space-y-4 min-w-0">
            {resolved.map(({ product, qty }) => (
              <div key={product.id} className="card p-4 min-w-0 overflow-hidden">
                <div className="flex gap-3 items-center min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-sm border border-line"
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
                    <Link href={`/product/${product.slug}`} className="block font-medium truncate hover:text-gold text-sm sm:text-base">
                      {product.collection} {product.reference ?? ""}
                    </Link>
                    <p className="text-gold mt-1 text-sm">{formatPrice(product.price.usd)}</p>
                    {/* Qty controls — mobile-friendly inline */}
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(product.id, qty - 1)} className="w-7 h-7 text-sm border border-line rounded hover:border-gold hover:text-gold flex items-center justify-center">−</button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button onClick={() => updateQty(product.id, qty + 1)} className="w-7 h-7 text-sm border border-line rounded hover:border-gold hover:text-gold flex items-center justify-center">+</button>
                      <button onClick={() => removeItem(product.id)} className="ml-auto text-ink-dim hover:text-danger text-xs" aria-label="Remove">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-ink-dim hover:text-danger">Clear cart</button>
          </div>

          {/* Summary */}
          <aside className="card p-6 h-fit lg:sticky lg:top-24 min-w-0 overflow-hidden">
            <h3 className="h-serif text-xl mb-4">Order Summary</h3>
            <div className="divide-y divide-line">
              {resolved.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between py-2 text-sm">
                  <span className="text-ink-muted truncate pr-2">{product.collection} × {qty}</span>
                  <span>{formatPrice(product.price.usd * qty)}</span>
                </div>
              ))}
            </div>
            <div className="divider my-4" />
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <span className="text-gold font-medium">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-ink-muted mt-2">Shipping calculated in next step.</p>

            <button onClick={handleProceedToCheckout} className="btn-gold w-full mt-6 text-base">
              Proceed to Checkout
            </button>
          </aside>
        </div>
      ) : (
        /* ADDRESS STEP */
        <div className="grid lg:grid-cols-[1fr,360px] gap-8">
          <div className="card p-6 space-y-4">
            <h3 className="text-gold text-sm font-semibold tracking-wider uppercase">Delivery Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-ink-muted mb-1.5 font-medium">Full Name *</label>
                <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="John Doe" className={inputCls} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs text-ink-muted mb-1.5 font-medium">Phone *</label>
                <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+1 234 567 8900" className={inputCls} required />
              </div>
            </div>

            <div>
              <label className="block text-xs text-ink-muted mb-1.5 font-medium">Address Line 1 *</label>
              <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="123 Main Street, Apt 4B" className={inputCls} required />
            </div>

            <div>
              <label className="block text-xs text-ink-muted mb-1.5 font-medium">Address Line 2</label>
              <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Building, Floor (optional)" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink-muted mb-1.5 font-medium">City *</label>
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="New York" className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs text-ink-muted mb-1.5 font-medium">State / Province</label>
                <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="NY" className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink-muted mb-1.5 font-medium">Postal Code</label>
                <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder="10001" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-ink-muted mb-1.5 font-medium">Country *</label>
                <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="United States" className={inputCls} required />
              </div>
            </div>
          </div>

          {/* Order summary sidebar */}
          <aside className="card p-6 h-fit lg:sticky lg:top-24">
            <h3 className="h-serif text-xl mb-4">Order Summary</h3>
            <div className="divide-y divide-line">
              {resolved.map(({ product, qty }) => (
                <div key={product.id} className="flex justify-between py-2 text-sm">
                  <span className="text-ink-muted truncate pr-2">{product.collection} × {qty}</span>
                  <span>{formatPrice(product.price.usd * qty)}</span>
                </div>
              ))}
            </div>
            <div className="divider my-4" />
            <div className="flex justify-between text-lg">
              <span>Total</span>
              <span className="text-gold font-medium">{formatPrice(total)}</span>
            </div>

            <button onClick={handleCheckout} className="btn-gold w-full mt-6 text-base">
              Complete Order via WhatsApp
            </button>

            <button onClick={() => setStep("cart")} className="w-full mt-3 text-sm text-ink-muted hover:text-gold transition-colors text-center">
              ← Back to Cart
            </button>

            <div className="mt-4 text-xs text-ink-muted space-y-2">
              <p>✓ Order details + address auto-fill into WhatsApp.</p>
              <p>✓ Our team responds within 2 hours.</p>
              <p>✓ Payment methods discussed in chat.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
