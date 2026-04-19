"use client";
import { useAuth } from "@/components/AuthProvider";
import type { Address } from "@/components/AuthProvider";
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

function getInitialTab(): "profile" | "orders" | "addresses" {
  if (typeof window === "undefined") return "profile";
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  if (tab === "orders" || tab === "addresses") return tab;
  return "profile";
}

export default function AccountPage() {
  const { user, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">(getInitialTab);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<OrderInquiry[]>([]);

  // Profile fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  // Address management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState("");
  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrZip, setAddrZip] = useState("");
  const [addrCountry, setAddrCountry] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      // Migrate old single address to addresses array
      const existingAddresses = user.addresses || [];
      if (existingAddresses.length === 0 && user.address?.line1) {
        const migrated: Address = {
          id: `addr_${Date.now().toString(36)}`,
          label: "Primary",
          line1: user.address.line1,
          line2: user.address.line2 || "",
          city: user.address.city,
          state: user.address.state || "",
          zip: user.address.zip,
          country: user.address.country,
          isDefault: true,
        };
        setAddresses([migrated]);
      } else {
        setAddresses(existingAddresses);
      }
    }
    setOrders(getOrders());
  }, [user]);

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="h-serif text-3xl mb-3">My Account</h1>
          <p className="text-ink-muted mb-6">Sign in to view your profile, orders, and addresses.</p>
          <p className="text-ink-muted text-sm">Click the profile icon in the header to sign in or create an account.</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateProfile({ name, phone: phone || undefined });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetAddressForm = () => {
    setAddrLabel("");
    setAddrLine1("");
    setAddrLine2("");
    setAddrCity("");
    setAddrState("");
    setAddrZip("");
    setAddrCountry("");
    setAddrDefault(false);
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const openAddressForm = (addr?: Address) => {
    if (addr) {
      setEditingAddress(addr);
      setAddrLabel(addr.label);
      setAddrLine1(addr.line1);
      setAddrLine2(addr.line2 || "");
      setAddrCity(addr.city);
      setAddrState(addr.state || "");
      setAddrZip(addr.zip);
      setAddrCountry(addr.country);
      setAddrDefault(addr.isDefault || false);
    } else {
      resetAddressForm();
      setAddrDefault(addresses.length === 0);
    }
    setShowAddressForm(true);
  };

  const handleSaveAddress = () => {
    if (!addrLine1 || !addrCity || !addrCountry) return;

    const newAddr: Address = {
      id: editingAddress?.id || `addr_${Date.now().toString(36)}`,
      label: addrLabel || (addresses.length === 0 ? "Primary" : `Address ${addresses.length + 1}`),
      line1: addrLine1,
      line2: addrLine2,
      city: addrCity,
      state: addrState,
      zip: addrZip,
      country: addrCountry,
      isDefault: addrDefault || addresses.length === 0,
    };

    let updated: Address[];
    if (editingAddress) {
      updated = addresses.map((a) => a.id === editingAddress.id ? newAddr : a);
    } else {
      updated = [...addresses, newAddr];
    }

    // If this is default, remove default from others
    if (newAddr.isDefault) {
      updated = updated.map((a) => a.id === newAddr.id ? a : { ...a, isDefault: false });
    }

    // Also update the legacy single address field with the default
    const defaultAddr = updated.find((a) => a.isDefault) || updated[0];

    setAddresses(updated);
    updateProfile({
      addresses: updated,
      address: defaultAddr ? {
        line1: defaultAddr.line1,
        line2: defaultAddr.line2,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip,
        country: defaultAddr.country,
      } : undefined,
    });

    resetAddressForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAddress = (id: string) => {
    let updated = addresses.filter((a) => a.id !== id);
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0] = { ...updated[0], isDefault: true };
    }
    const defaultAddr = updated.find((a) => a.isDefault);
    setAddresses(updated);
    updateProfile({
      addresses: updated,
      address: defaultAddr ? {
        line1: defaultAddr.line1,
        line2: defaultAddr.line2,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip,
        country: defaultAddr.country,
      } : undefined,
    });
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    const defaultAddr = updated.find((a) => a.isDefault);
    setAddresses(updated);
    updateProfile({
      addresses: updated,
      address: defaultAddr ? {
        line1: defaultAddr.line1,
        line2: defaultAddr.line2,
        city: defaultAddr.city,
        state: defaultAddr.state,
        zip: defaultAddr.zip,
        country: defaultAddr.country,
      } : undefined,
    });
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: "👤" },
    { id: "orders" as const, label: "Orders", icon: "📦", count: orders.length },
    { id: "addresses" as const, label: "Addresses", icon: "📍", count: addresses.length },
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

      {saved && (
        <div className="bg-green-400/10 border border-green-400/20 text-green-400 text-sm px-4 py-2.5 rounded-lg mb-4">
          Saved successfully!
        </div>
      )}

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
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} autoComplete="name" />
                </div>
                <div>
                  <label className={labelCls}>Phone (WhatsApp)</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5xx xxx xx xx" className={inputCls} type="tel" autoComplete="tel" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveProfile} className="bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
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
              <strong className="text-ink">How ordering works:</strong> Browse our collection, find a watch you love, and contact us via WhatsApp. We&apos;ll confirm availability, discuss payment options, and arrange express shipping to your door.
            </p>
          </div>
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          {/* Existing addresses */}
          {addresses.map((addr) => (
            <div key={addr.id} className="card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-medium">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-muted">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                  <p className="text-sm text-ink-muted">{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zip}</p>
                  <p className="text-sm text-ink-muted">{addr.country}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => openAddressForm(addr)}
                    className="text-xs text-gold hover:text-gold-bright transition-colors px-3 py-1.5 rounded-lg border border-gold/20"
                  >
                    Edit
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-ink-muted hover:text-gold transition-colors px-3 py-1.5 rounded-lg border border-line"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-ink-dim hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-line hover:border-red-400/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add address button */}
          {!showAddressForm && (
            <button
              onClick={() => openAddressForm()}
              className="card p-4 sm:p-5 w-full text-center border-dashed hover:border-gold/40 transition-colors group"
            >
              <span className="text-2xl block mb-1">+</span>
              <span className="text-sm font-medium text-ink-muted group-hover:text-gold transition-colors">
                Add New Address
              </span>
            </button>
          )}

          {/* Address form */}
          {showAddressForm && (
            <div className="card p-4 sm:p-6 space-y-4">
              <h3 className="font-semibold text-sm">
                {editingAddress ? "Edit Address" : "New Address"}
              </h3>

              <div>
                <label className={labelCls}>Label</label>
                <input
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="e.g. Home, Office, Dubai Villa"
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Address Line 1 *</label>
                <input
                  value={addrLine1}
                  onChange={(e) => setAddrLine1(e.target.value)}
                  placeholder="Street address"
                  className={inputCls}
                  autoComplete="address-line1"
                />
              </div>

              <div>
                <label className={labelCls}>Address Line 2</label>
                <input
                  value={addrLine2}
                  onChange={(e) => setAddrLine2(e.target.value)}
                  placeholder="Apartment, suite, etc."
                  className={inputCls}
                  autoComplete="address-line2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>City *</label>
                  <input value={addrCity} onChange={(e) => setAddrCity(e.target.value)} className={inputCls} autoComplete="address-level2" />
                </div>
                <div>
                  <label className={labelCls}>State / Province</label>
                  <input value={addrState} onChange={(e) => setAddrState(e.target.value)} className={inputCls} autoComplete="address-level1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>ZIP / Postal Code</label>
                  <input value={addrZip} onChange={(e) => setAddrZip(e.target.value)} className={inputCls} autoComplete="postal-code" inputMode="numeric" />
                </div>
                <div>
                  <label className={labelCls}>Country *</label>
                  <input value={addrCountry} onChange={(e) => setAddrCountry(e.target.value)} placeholder="e.g. Turkey" className={inputCls} autoComplete="country-name" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={addrDefault}
                  onChange={(e) => setAddrDefault(e.target.checked)}
                  className="w-5 h-5 rounded border-line accent-gold"
                />
                <span className="text-sm text-ink-muted">Set as default shipping address</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSaveAddress}
                  disabled={!addrLine1 || !addrCity || !addrCountry}
                  className="bg-gold hover:bg-gold-bright text-bg font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingAddress ? "Update Address" : "Save Address"}
                </button>
                <button
                  onClick={resetAddressForm}
                  className="text-ink-muted hover:text-ink px-4 py-2.5 rounded-lg transition-colors text-sm border border-line"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {addresses.length === 0 && !showAddressForm && (
            <div className="card p-8 sm:p-12 text-center">
              <div className="text-5xl mb-4">📍</div>
              <h2 className="font-semibold text-lg mb-2">No Addresses Yet</h2>
              <p className="text-ink-muted text-sm max-w-sm mx-auto">
                Add your shipping addresses to make checkout faster.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
