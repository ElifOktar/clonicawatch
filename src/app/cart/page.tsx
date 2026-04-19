"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useCart, resolveCartItems } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";
import { buildCartWhatsAppMessage, formatPrice, getWhatsAppUrl } from "@/lib/products";
import type { Product } from "@/types/product";

// ── Country data with phone codes ──────────────────
const COUNTRIES = [
  { name: "United States", code: "US", phone: "+1" },
  { name: "United Kingdom", code: "GB", phone: "+44" },
  { name: "United Arab Emirates", code: "AE", phone: "+971" },
  { name: "Turkey", code: "TR", phone: "+90" },
  { name: "Saudi Arabia", code: "SA", phone: "+966" },
  { name: "Qatar", code: "QA", phone: "+974" },
  { name: "Kuwait", code: "KW", phone: "+965" },
  { name: "Bahrain", code: "BH", phone: "+973" },
  { name: "Oman", code: "OM", phone: "+968" },
  { name: "Germany", code: "DE", phone: "+49" },
  { name: "France", code: "FR", phone: "+33" },
  { name: "Italy", code: "IT", phone: "+39" },
  { name: "Spain", code: "ES", phone: "+34" },
  { name: "Netherlands", code: "NL", phone: "+31" },
  { name: "Belgium", code: "BE", phone: "+32" },
  { name: "Switzerland", code: "CH", phone: "+41" },
  { name: "Austria", code: "AT", phone: "+43" },
  { name: "Sweden", code: "SE", phone: "+46" },
  { name: "Norway", code: "NO", phone: "+47" },
  { name: "Denmark", code: "DK", phone: "+45" },
  { name: "Finland", code: "FI", phone: "+358" },
  { name: "Poland", code: "PL", phone: "+48" },
  { name: "Portugal", code: "PT", phone: "+351" },
  { name: "Greece", code: "GR", phone: "+30" },
  { name: "Ireland", code: "IE", phone: "+353" },
  { name: "Canada", code: "CA", phone: "+1" },
  { name: "Australia", code: "AU", phone: "+61" },
  { name: "New Zealand", code: "NZ", phone: "+64" },
  { name: "Japan", code: "JP", phone: "+81" },
  { name: "South Korea", code: "KR", phone: "+82" },
  { name: "China", code: "CN", phone: "+86" },
  { name: "Hong Kong", code: "HK", phone: "+852" },
  { name: "Singapore", code: "SG", phone: "+65" },
  { name: "Malaysia", code: "MY", phone: "+60" },
  { name: "Thailand", code: "TH", phone: "+66" },
  { name: "India", code: "IN", phone: "+91" },
  { name: "Pakistan", code: "PK", phone: "+92" },
  { name: "Egypt", code: "EG", phone: "+20" },
  { name: "Morocco", code: "MA", phone: "+212" },
  { name: "Nigeria", code: "NG", phone: "+234" },
  { name: "South Africa", code: "ZA", phone: "+27" },
  { name: "Brazil", code: "BR", phone: "+55" },
  { name: "Mexico", code: "MX", phone: "+52" },
  { name: "Argentina", code: "AR", phone: "+54" },
  { name: "Colombia", code: "CO", phone: "+57" },
  { name: "Chile", code: "CL", phone: "+56" },
  { name: "Russia", code: "RU", phone: "+7" },
  { name: "Ukraine", code: "UA", phone: "+380" },
  { name: "Romania", code: "RO", phone: "+40" },
  { name: "Czech Republic", code: "CZ", phone: "+420" },
  { name: "Hungary", code: "HU", phone: "+36" },
  { name: "Israel", code: "IL", phone: "+972" },
  { name: "Jordan", code: "JO", phone: "+962" },
  { name: "Lebanon", code: "LB", phone: "+961" },
  { name: "Iraq", code: "IQ", phone: "+964" },
  { name: "Iran", code: "IR", phone: "+98" },
  { name: "Azerbaijan", code: "AZ", phone: "+994" },
  { name: "Georgia", code: "GE", phone: "+995" },
  { name: "Kazakhstan", code: "KZ", phone: "+7" },
  { name: "Uzbekistan", code: "UZ", phone: "+998" },
].sort((a, b) => a.name.localeCompare(b.name));

interface ShippingAddress {
  fullName: string;
  phoneCode: string;
  phoneNumber: string;
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"cart" | "address">("cart");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setAllProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const resolved = resolveCartItems(items, allProducts);

  // Parse existing phone into code + number
  const parsePhone = (phone?: string) => {
    if (!phone) return { code: "+1", number: "" };
    for (const c of COUNTRIES) {
      if (phone.startsWith(c.phone)) {
        return { code: c.phone, number: phone.slice(c.phone.length).trim() };
      }
    }
    return { code: "+1", number: phone };
  };

  const existingPhone = parsePhone(user?.phone);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phoneCode: existingPhone.code,
    phoneNumber: existingPhone.number,
    line1: user?.address?.line1 || "",
    line2: user?.address?.line2 || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "",
  });

  // Auto-set phone code when country changes
  const handleCountryChange = (countryName: string) => {
    setAddress((prev) => {
      const country = COUNTRIES.find((c) => c.name === countryName);
      return {
        ...prev,
        country: countryName,
        phoneCode: country?.phone || prev.phoneCode,
      };
    });
  };

  const fullPhone = `${address.phoneCode} ${address.phoneNumber}`.trim();

  const total = resolved.reduce(
    (sum, it) => sum + it.product.price.usd * it.qty,
    0
  );

  const addressText = `\n\n📦 Shipping Address:\n${address.fullName}\n${fullPhone}\n${address.line1}${address.line2 ? ", " + address.line2 : ""}\n${address.city}${address.state ? ", " + address.state : ""} ${address.zip}\n${address.country}`;
  const waMessage = buildCartWhatsAppMessage(resolved) + (step === "address" ? addressText : "");
  const waUrl = getWhatsAppUrl(waMessage);

  const inputCls = "w-full bg-bg border border-line rounded-lg px-4 py-3 text-base sm:text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-ink-dim";
  const labelCls = "block text-xs text-ink-muted mb-1.5 font-medium";
  const selectCls = "w-full bg-bg border border-line rounded-lg px-4 py-3 text-base sm:text-sm focus:border-gold focus:outline-none transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23888%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center]";

  const handleProceedToCheckout = () => {
    setStep("address");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCheckout = () => {
    if (!address.fullName || !address.phoneNumber || !address.line1 || !address.city || !address.country) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (user) {
      updateProfile({
        phone: fullPhone,
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

    // Save order inquiries
    try {
      const orders = JSON.parse(localStorage.getItem("clonica_orders") || "[]");
      for (const { product } of resolved) {
        const recent = orders.find(
          (o: any) => o.productId === product.id && Date.now() - new Date(o.date).getTime() < 3600000
        );
        if (!recent) {
          orders.unshift({
            id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
            productId: product.id,
            productName: product.model_name,
            productImage: product.main_image,
            productPrice: product.price.usd,
            date: new Date().toISOString(),
            status: "inquired",
          });
        }
      }
      localStorage.setItem("clonica_orders", JSON.stringify(orders.slice(0, 50)));
    } catch {}

    showToast("Order details prepared! Redirecting to WhatsApp...", "success");
    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 1000);
  };

  if (!isHydrated || loading) {
    return (
      <div className="container py-20 text-center text-ink-muted">
        Loading cart…
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-12">
      {/* Steps indicator */}
      {resolved.length > 0 && (
        <div className="flex items-center gap-3 mb-6 sm:mb-8 text-sm">
          <button
            onClick={() => setStep("cart")}
            className={`flex items-center gap-2 ${step === "cart" ? "text-gold" : "text-ink-muted"}`}
          >
            <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center border ${step === "cart" ? "bg-gold text-bg border-gold" : "border-line"}`}>1</span>
            Cart
          </button>
          <div className="w-8 h-px bg-line" />
          <button
            onClick={() => items.length > 0 && setStep("address")}
            className={`flex items-center gap-2 ${step === "address" ? "text-gold" : "text-ink-muted"}`}
          >
            <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center border ${step === "address" ? "bg-gold text-bg border-gold" : "border-line"}`}>2</span>
            Shipping
          </button>
        </div>
      )}

      <h1 className="h-serif text-3xl sm:text-4xl mb-6 sm:mb-8">
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
        <div className="grid lg:grid-cols-[1fr,360px] gap-6 lg:gap-8 min-w-0">
          {/* Items */}
          <div className="space-y-3 sm:space-y-4 min-w-0">
            {resolved.map(({ product, qty }) => (
              <div key={product.id} className="card p-3 sm:p-4 min-w-0 overflow-hidden">
                <div className="flex gap-3 items-center min-w-0">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden rounded-sm border border-line"
                  >
                    <Image src={product.main_image} alt={product.model_name} fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink-dim uppercase tracking-widest">{product.brand}</p>
                    <Link href={`/product/${product.slug}`} className="block font-medium truncate hover:text-gold text-sm sm:text-base">
                      {product.collection} {product.reference ?? ""}
                    </Link>
                    <p className="text-gold mt-1 text-sm">{formatPrice(product.price.usd)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(product.id, qty - 1)} className="w-8 h-8 text-sm border border-line rounded hover:border-gold hover:text-gold flex items-center justify-center">−</button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <button onClick={() => updateQty(product.id, qty + 1)} className="w-8 h-8 text-sm border border-line rounded hover:border-gold hover:text-gold flex items-center justify-center">+</button>
                      <button onClick={() => removeItem(product.id)} className="ml-auto text-ink-dim hover:text-danger text-xs">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clear} className="text-sm text-ink-dim hover:text-danger">Clear cart</button>
          </div>

          {/* Summary */}
          <aside className="card p-5 sm:p-6 h-fit lg:sticky lg:top-24 min-w-0 overflow-hidden">
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
        /* ── ADDRESS STEP ── */
        <div className="grid lg:grid-cols-[1fr,360px] gap-6 lg:gap-8">
          <div className="card p-4 sm:p-6 space-y-5">
            <h3 className="text-gold text-sm font-semibold tracking-wider uppercase">Delivery Information</h3>

            {/* Country — first, because it sets phone code */}
            <div>
              <label className={labelCls}>Country *</label>
              <select
                value={address.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={selectCls}
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="John Doe"
                  className={inputCls}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className={labelCls}>Phone Number *</label>
                <div className="flex gap-2">
                  <select
                    value={address.phoneCode}
                    onChange={(e) => setAddress({ ...address, phoneCode: e.target.value })}
                    className="w-[100px] sm:w-[110px] shrink-0 bg-bg border border-line rounded-lg px-2 py-3 text-base sm:text-sm focus:border-gold focus:outline-none transition-colors"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.phone}>
                        {c.phone} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    value={address.phoneNumber}
                    onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                    placeholder="555 123 4567"
                    className={`${inputCls} flex-1`}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelCls}>Address *</label>
              <input
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                placeholder="Street address, building, apartment"
                className={inputCls}
                autoComplete="address-line1"
              />
            </div>

            <div>
              <label className={labelCls}>Address Line 2 <span className="text-ink-dim">(optional)</span></label>
              <input
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                placeholder="Floor, suite, unit"
                className={inputCls}
                autoComplete="address-line2"
              />
            </div>

            {/* City + State + Zip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>City *</label>
                <input
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Istanbul"
                  className={inputCls}
                  autoComplete="address-level2"
                />
              </div>
              <div>
                <label className={labelCls}>State / Province</label>
                <input
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="Region"
                  className={inputCls}
                  autoComplete="address-level1"
                />
              </div>
              <div>
                <label className={labelCls}>Postal Code</label>
                <input
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  placeholder="34000"
                  className={inputCls}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1 bg-bg-elev px-3 py-1.5 rounded-full border border-line">🔒 Secure</span>
              <span className="inline-flex items-center gap-1 bg-bg-elev px-3 py-1.5 rounded-full border border-line">📦 Express Shipping</span>
              <span className="inline-flex items-center gap-1 bg-bg-elev px-3 py-1.5 rounded-full border border-line">💬 WhatsApp Support</span>
            </div>
          </div>

          {/* Order summary sidebar */}
          <aside className="card p-5 sm:p-6 h-fit lg:sticky lg:top-24">
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

            {/* Shipping address preview */}
            {address.fullName && address.country && (
              <div className="mt-4 p-3 bg-bg-elev rounded-lg border border-line text-xs text-ink-muted">
                <p className="font-medium text-ink text-sm mb-1">Ship to:</p>
                <p>{address.fullName}</p>
                {address.line1 && <p>{address.line1}</p>}
                {address.city && <p>{address.city}{address.state ? `, ${address.state}` : ""} {address.zip}</p>}
                <p>{address.country}</p>
              </div>
            )}

            <button onClick={handleCheckout} className="btn-gold w-full mt-6 text-base">
              Complete Order via WhatsApp
            </button>

            <button onClick={() => setStep("cart")} className="w-full mt-3 text-sm text-ink-muted hover:text-gold transition-colors text-center">
              ← Back to Cart
            </button>

            <div className="mt-4 text-xs text-ink-muted space-y-2">
              <p>✓ Order details + address sent via WhatsApp</p>
              <p>✓ Our team responds within 2 hours</p>
              <p>✓ Payment methods discussed in chat</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
