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
    }, 500);
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
          {/* Items — Step 1 */}
          {step === "cart" && (
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
                    <Link href={`/product/${product.slug}`} className="block text-sm font-medium hover:text-gold mb-1">
                      {product.model_name}
                    </Link>
                    <p className="text-xs text-ink-muted mb-2">{product.brand}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(product.id, qty - 1)}
                        className="px-2 py-1 text-xs border border-line rounded hover:border-gold"
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center">{qty}</span>
                      <button
                        onClick={() => updateQty(product.id, qty + 1)}
                        className="px-2 py-1 text-xs border border-line rounded hover:border-gold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gold">
                      ${(product.price.usd * qty).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-xs text-ink-dim hover:text-danger mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Shipping Address — Step 2 */}
          {step === "address" && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block">Phone *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block">Address Line 1 *</label>
                    <input
                      type="text"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-ink-muted mb-1 block">Address Line 2</label>
                    <input
                      type="text"
                      value={address.line2}
                      onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-ink-muted mb-1 block">City *</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted mb-1 block">State/Province</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-ink-muted mb-1 block">ZIP/Postal Code</label>
                      <input
                        type="text"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink-muted mb-1 block">Country *</label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIDEBAR */}
          <div className="space-y-4">
            <div className="bg-bg-elev border border-line rounded-xl p-5 space-y-4 h-fit sticky top-20">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-ink-muted">Subtotal</span>
                  <span className="text-sm">${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-ink-muted">Shipping</span>
                  <span className="text-sm">Contact us</span>
                </div>
                <div className="border-t border-line pt-2 mt-2 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium text-gold text-lg">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {step === "cart" ? (
                <>
                  <button
                    onClick={handleProceedToCheckout}
                    className="btn-gold w-full"
                  >
                    Proceed to Checkout
                  </button>
                  <Link href="/" className="btn-outline w-full block text-center">
                    Continue Shopping
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCheckout}
                    className="btn-gold w-full"
                  >
                    Send Order via WhatsApp
                  </button>
                  <button
                    onClick={() => setStep("cart")}
                    className="btn-outline w-full"
                  >
                    Back to Cart
                  </button>
                </>
              )}

              <button
                onClick={clear}
                className="text-xs text-danger hover:underline w-full"
              >
                Clear Cart
              </button>

              <div className="border-t border-line pt-4 text-xs text-ink-dim">
                <p className="mb-2 font-medium">Shipping worldwide</p>
                <p>We ship to 80+ countries with DHL, FedEx, or UPS.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
