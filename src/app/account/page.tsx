"use client";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface OrderInquiry {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  date: string;
  status: "inquired" | "confirmed" | "shipped" | "delivered";
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  inquired: { label: "Inquiry Sent", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  confirmed: { label: "Confirmed", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  shipped: { label: "Shipped", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  delivered: { label: "Delivered", color: "text-green-400 bg-green-400/10 border-green-400/20" },
};

function getOrders(): OrderInquiry[] {
  try {
    return JSON.parse(localStorage.getItem("clonica_orders") || "[]");
  } catch { return []; }
}

export default function AccountPage() {
  const { user, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("profile");
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);

  // Editable fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLine1(user.address?.line1 || "");
      setLine2(user.address?.line2 || "");
      setCity(user.address?.city || "");
      setState(user.address?.state || "");
      setZip(user.address?.zip || "");
      setCountry(user.address?.country || "");
    }
    setOrders(getOrders());
  }, [user]);

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="h-serif text-3xl mb-3">My Account</h1>
          <p className="text-ink-muted mb-6">Sign in to view your profile, orders, and wishlist.</p>
          <p className="text-ink-muted text-sm">Click the profile icon in the header to sign in or create an account.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile({
      name,
      phone: phone || undefined,
      address: line1 ? { line1, line2, city, state, zip, country } : undefined,
    });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "👤" },
    { id: "orders" as const, label: "Orders", icon: "📦", count: orders.length },
    { id: "addresses" as const, label: "Address", icon: "📍" },
  ];

  const inputCls = "w-full bg-bg border border-line rounded-lg px-4 py-3 text-base sm:text-sm focus:border-gold focus:outline-none transition-colors";
  const labelCls = "block text-xs text-ink-muted font-medium mb-1.5";

  return (
    <div className="container py-8 sm:py-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="h-serif text-2xl sm:text-3xl">My Account</h1>
          <p className="text-ink-muted text-sm mt-1">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="text-xs text-ink-muted hover:text-red-400 transition-colors px-3 py-2 rounded-lg border border-line hover:border-red-400/30"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-bg-elev rounded-xl p-1 border border-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-gold/10 text-gold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-gold text-bg text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <div className="card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Personal Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-gold hover:text-gold-bright transition-colors px-3 py-1.5 rounded-lg border border-gold/20 hover:border-gold/40"
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone (WhatsApp)</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" className={inputCls} type="tel" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} className="bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
                    Save
                  </button>
                  <button onClick={() => setEditing(false)} className="text-ink-muted hover:text-ink px-4 py-2.5 rounded-lg transition-colors text-sm border border-line">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-line/50">
                  <span className="text-xs text-ink-muted">Name</span>
                  <span className="text-sm">{user.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-line/50">
                  <span className="text-xs text-ink-muted">Email</span>
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-line/50">
                  <span className="text-xs text-ink-muted">Phone</span>
                  <span className="text-sm">{user.phone || "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-ink-muted">Member Since</span>
                  <span className="text-sm">{new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
              </div>
            )}

            {saved && (
              <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm px-4 py-2.5 rounded-lg">
                Profile updated successfully!
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/wishlist" className="card p-4 sm:p-5 text-center hover:border-gold/40 transition-colors group">
              <div className="text-2xl mb-2">♡</div>
              <div className="text-sm font-medium group-hover:text-gold transition-colors">Wishlist</div>
            </Link>
            <Link href="/cart" className="card p-4 sm:p-5 text-center hover:border-gold/40 transition-colors group">
              <div className="text-2xl mb-2">🛒</div>
              <div className="text-sm font-medium group-hover:text-gold transition-colors">Cart</div>
            </Link>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="card p-8 sm:p-12 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h2 className="font-semibold text-lg mb-2">No Orders Yet</h2>
              <p className="text-ink-muted text-sm mb-6 max-w-sm mx-auto">
                When you contact us via WhatsApp about a product, your inquiry will appear here.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                Browse Watches
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card p-4 sm:p-5">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-lg border border-line">
                    <Image src={order.productImage} alt="" fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium truncate">{order.productName}</p>
                        <p className="text-xs text-ink-muted mt-0.5">
                          {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <span className="text-gold text-sm font-medium shrink-0">${order.productPrice.toLocaleString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center text-[11px] px-2.5 py-1 rounded-full border font-medium ${STATUS_LABELS[order.status]?.color || ""}`}>
                        {STATUS_LABELS[order.status]?.label || order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="card p-4 sm:p-5 bg-bg-elev/50">
            <p className="text-xs text-ink-muted leading-relaxed">
              <strong className="text-ink">How ordering works:</strong> Browse our collection, find a watch you love, and contact us via WhatsApp. We'll confirm availability, discuss payment options, and arrange express shipping to your door.
            </p>
          </div>
        </div>
      )}

      {/* Address Tab */}
      {activeTab === "addresses" && (
        <div className="card p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold">Shipping Address</h2>

          {user.address?.line1 && !editing ? (
            <div className="space-y-3">
              <div className="bg-bg-elev rounded-xl p-4 border border-line">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-sm text-ink-muted mt-1">
                      {user.address.line1}
                      {user.address.line2 ? `, ${user.address.line2}` : ""}
                    </p>
                    <p className="text-sm text-ink-muted">
                      {user.address.city}{user.address.state ? `, ${user.address.state}` : ""} {user.address.zip}
                    </p>
                    <p className="text-sm text-ink-muted">{user.address.country}</p>
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-gold hover:text-gold-bright transition-colors px-3 py-1.5 rounded-lg border border-gold/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Address Line 1 *</label>
                <input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Street address" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Address Line 2</label>
                <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Apartment, suite, etc." className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>City *</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>State / Province</label>
                  <input value={state} onChange={(e) => setState(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>ZIP / Postal Code</label>
                  <input value={zip} onChange={(e) => setZip(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Country *</label>
                  <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Turkey" className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
                  Save Address
                </button>
                {user.address?.line1 && (
                  <button onClick={() => setEditing(false)} className="text-ink-muted hover:text-ink px-4 py-2.5 rounded-lg transition-colors text-sm border border-line">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
