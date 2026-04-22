"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getPublicClient } from "@/lib/supabase";

type Tab = "profile" | "orders" | "addresses";

interface OrderRow {
  id: string;
  products: { name: string; qty: number; price: number }[];
  total: number;
  date: string;
  status: string;
}

interface AddressRow {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  is_default?: boolean;
}

/* ── localStorage key'leri (migrasyon icin) ── */
const OLD_ADDR_KEY = "clonica_addresses";
const OLD_ORDERS_KEY = "clonica_orders";

export default function AccountPage() {
  const { user, signOut, updateProfile } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab") as Tab;
    if (urlTab && ["profile", "orders", "addresses"].includes(urlTab)) {
      setTab(urlTab);
    }
  }, []);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [editingAddr, setEditingAddr] = useState<AddressRow | null>(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  /* ── localStorage → Supabase migrasyon (adresler) ── */
  const migrateAddresses = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    try {
      const raw = localStorage.getItem(OLD_ADDR_KEY);
      if (!raw) return;
      const localAddrs = JSON.parse(raw);
      if (!Array.isArray(localAddrs) || localAddrs.length === 0) return;

      const toInsert = localAddrs.map((a: any) => ({
        user_id: userId,
        label: a.label || "",
        full_name: a.fullName || a.full_name || "",
        phone: a.phone || "",
        line1: a.line1 || "",
        line2: a.line2 || "",
        city: a.city || "",
        state: a.state || "",
        zip: a.zip || "",
        country: a.country || "",
        is_default: a.isDefault || a.is_default || false,
      }));

      await sb.from("addresses").insert(toInsert);
      localStorage.removeItem(OLD_ADDR_KEY);
    } catch { /* ignore */ }
  }, []);

  /* ── localStorage → Supabase migrasyon (siparisler) ── */
  const migrateOrders = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    try {
      const raw = localStorage.getItem(OLD_ORDERS_KEY);
      if (!raw) return;
      const localOrders = JSON.parse(raw);
      if (!Array.isArray(localOrders) || localOrders.length === 0) return;

      const toInsert = localOrders.map((o: any) => ({
        user_id: userId,
        products: o.products || [],
        total: o.total || 0,
        status: o.status || "pending",
        date: o.date || new Date().toISOString(),
      }));

      await sb.from("orders").insert(toInsert);
      localStorage.removeItem(OLD_ORDERS_KEY);
    } catch { /* ignore */ }
  }, []);

  /* ── Supabase'den verileri yükle ── */
  const loadData = useCallback(async (userId: string) => {
    const sb = getPublicClient();
    if (!sb) return;

    // Adresleri yükle
    const { data: addrData } = await sb
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (addrData) setAddresses(addrData);

    // Siparisleri yükle
    const { data: orderData } = await sb
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    if (orderData) setOrders(orderData);
  }, []);

  /* ── Init: migrasyon + yükle ── */
  useEffect(() => {
    if (!user) return;
    (async () => {
      await Promise.all([
        migrateAddresses(user.id),
        migrateOrders(user.id),
      ]);
      await loadData(user.id);
    })();
  }, [user, migrateAddresses, migrateOrders, loadData]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="h-serif text-3xl mb-4">My Account</h1>
        <p className="text-ink-muted">Please sign in to view your account.</p>
      </div>
    );
  }

  /* ── Profile kaydet ── */
  const handleSaveProfile = () => {
    updateProfile({ name: editName.trim(), phone: editPhone.trim() || undefined });
    setEditingProfile(false);
  };

  /* ── Adres kaydet (Supabase) ── */
  const handleSaveAddress = async (addr: AddressRow) => {
    const sb = getPublicClient();
    if (!sb) return;

    // Default ayarla: onceki default'ları kaldir
    if (addr.is_default) {
      await sb
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id)
        .eq("is_default", true);
    }

    const existing = addresses.find((a) => a.id === addr.id);
    if (existing) {
      // Güncelle
      await sb
        .from("addresses")
        .update({
          label: addr.label,
          full_name: addr.full_name,
          phone: addr.phone,
          line1: addr.line1,
          line2: addr.line2,
          city: addr.city,
          state: addr.state,
          zip: addr.zip,
          country: addr.country,
          is_default: addr.is_default,
        })
        .eq("id", addr.id)
        .eq("user_id", user.id);
    } else {
      // Yeni ekle
      await sb.from("addresses").insert({
        user_id: user.id,
        label: addr.label,
        full_name: addr.full_name,
        phone: addr.phone,
        line1: addr.line1,
        line2: addr.line2,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
        country: addr.country,
        is_default: addr.is_default,
      });
    }

    await loadData(user.id);
    setShowAddrForm(false);
    setEditingAddr(null);
  };

  /* ── Adres sil ── */
  const handleDeleteAddress = async (id: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    await sb.from("addresses").delete().eq("id", id).eq("user_id", user.id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  /* ── Default ayarla ── */
  const handleSetDefault = async (id: string) => {
    const sb = getPublicClient();
    if (!sb) return;
    // Hepsini false yap
    await sb
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);
    // Seçileni true yap
    await sb
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id)
      .eq("user_id", user.id);
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  };

  const tabs: { key: Tab; label: string; icon: string; badge?: number }[] = [
    { key: "profile", label: "Profile", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
    { key: "orders", label: "Orders", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", badge: orders.length },
    { key: "addresses", label: "Addresses", icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" },
  ];

  const inputCls = "w-full bg-bg border border-line rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-ink-dim";

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="h-serif text-2xl md:text-3xl">My Account</h1>
          <p className="text-sm text-ink-muted mt-1">{user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-ink-muted hover:text-red-400 transition-colors border border-line rounded-lg px-4 py-2 hover:border-red-400/30"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border border-line rounded-xl overflow-hidden mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-gold/10 text-gold border-b-2 border-gold"
                : "text-ink-muted hover:text-ink hover:bg-bg-soft"
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
            </svg>
            <span>{t.label}</span>
            {t.badge !== undefined && t.badge > 0 && (
              <span className="bg-gold text-bg text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB: Profile */}
      {tab === "profile" && (
        <div className="card p-6 space-y-5">
          {editingProfile ? (
            <>
              <div>
                <label className="text-xs text-ink-muted font-medium mb-1.5 block">Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-ink-muted font-medium mb-1.5 block">Phone</label>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+1 234 567 8900" className={inputCls} />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveProfile} className="btn-gold text-sm px-6">Save</button>
                <button onClick={() => setEditingProfile(false)} className="text-sm text-ink-muted hover:text-ink">Cancel</button>
              </div>
            </>
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs text-ink-muted font-medium">Name</label>
                  <p className="text-sm mt-1">{user.name}</p>
                </div>
                <div>
                  <label className="text-xs text-ink-muted font-medium">Email</label>
                  <p className="text-sm mt-1">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <label className="text-xs text-ink-muted font-medium">Phone</label>
                    <p className="text-sm mt-1">{user.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-ink-muted font-medium">Member Since</label>
                  <p className="text-sm mt-1">{new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
              </div>
              <button onClick={() => setEditingProfile(true)} className="text-xs text-gold hover:text-gold-bright transition-colors border border-gold/30 rounded-lg px-3 py-1.5">
                Edit
              </button>
            </div>
          )}
          <div className="border-t border-line pt-5 grid grid-cols-2 gap-3">
            <Link href="/wishlist" className="card p-4 text-center hover:border-gold transition-colors">
              <div className="text-xl mb-1">♡</div>
              <div className="text-xs font-medium">My Wishlist</div>
            </Link>
            <Link href="/cart" className="card p-4 text-center hover:border-gold transition-colors">
              <div className="text-xl mb-1">🛒</div>
              <div className="text-xs font-medium">My Cart</div>
            </Link>
          </div>
        </div>
      )}

      {/* TAB: Orders */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
              <p className="text-sm text-ink-muted mb-6">When you contact us via WhatsApp about a product, your inquiry will appear here.</p>
              <Link href="/" className="btn-gold inline-flex">Browse Watches</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-ink-muted">Order #{order.id.slice(-6).toUpperCase()}</span>
                    <span className="mx-2 text-line">|</span>
                    <span className="text-xs text-ink-muted">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    order.status === "completed" ? "bg-green-500/10 text-green-400" :
                    order.status === "pending" ? "bg-gold/10 text-gold" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    {order.status === "pending" ? "Inquiry Sent" : order.status === "confirmed" ? "Confirmed" : "Completed"}
                  </span>
                </div>
                <div className="divide-y divide-line">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex justify-between py-2 text-sm">
                      <span className="text-ink-muted">{p.name} x {p.qty}</span>
                      <span>${p.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-line text-sm font-medium">
                  <span>Total</span>
                  <span className="text-gold">${order.total.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
          <div className="card p-5 bg-bg-elev">
            <p className="text-sm">
              <strong className="text-gold">How ordering works:</strong>{" "}
              Browse our collection, find a watch you love, and contact us via WhatsApp. We&apos;ll confirm availability, discuss payment options, and arrange express shipping to your door.
            </p>
          </div>
        </div>
      )}

      {/* TAB: Addresses */}
      {tab === "addresses" && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className={`card p-5 ${addr.is_default ? "border-gold/40" : ""}`}>
              <div className="flex items-start justify-between">
                <div>
                  {addr.is_default && (
                    <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider mb-2 inline-block">Default</span>
                  )}
                  {addr.label && <p className="text-sm font-medium mb-1">{addr.label}</p>}
                  <p className="text-sm">{addr.full_name}</p>
                  <p className="text-sm text-ink-muted">{addr.phone}</p>
                  <p className="text-sm text-ink-muted mt-1">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                    {addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zip}<br />
                    {addr.country}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!addr.is_default && (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-[11px] text-ink-muted hover:text-gold transition-colors">Set Default</button>
                  )}
                  <button onClick={() => { setEditingAddr(addr); setShowAddrForm(true); }} className="text-[11px] text-gold hover:text-gold-bright transition-colors">Edit</button>
                  <button onClick={() => handleDeleteAddress(addr.id)} className="text-[11px] text-ink-muted hover:text-red-400 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}

          {!showAddrForm && (
            <button
              onClick={() => { setEditingAddr(null); setShowAddrForm(true); }}
              className="card p-5 w-full text-center border-dashed hover:border-gold transition-colors group"
            >
              <span className="text-2xl text-ink-muted group-hover:text-gold transition-colors">+</span>
              <p className="text-sm text-ink-muted group-hover:text-gold mt-1">Add New Address</p>
            </button>
          )}

          {showAddrForm && (
            <AddressForm
              initial={editingAddr}
              onSave={handleSaveAddress}
              onCancel={() => { setShowAddrForm(false); setEditingAddr(null); }}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ── AddressForm (Supabase field adlariyla) ── */
function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AddressRow | null;
  onSave: (a: AddressRow) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AddressRow>(
    initial || {
      id: `new_${Date.now().toString(36)}`,
      label: "",
      full_name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      is_default: false,
    }
  );

  const inputCls =
    "w-full bg-bg border border-line rounded-lg px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors placeholder:text-ink-dim";

  return (
    <div className="card p-5 space-y-4">
      <h3 className="text-gold text-sm font-semibold tracking-wider uppercase">
        {initial ? "Edit Address" : "New Address"}
      </h3>
      <div>
        <label className="block text-xs text-ink-muted mb-1.5 font-medium">Label (e.g. Home, Office)</label>
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-ink-muted mb-1.5 font-medium">Full Name *</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputCls} required />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-ink-muted mb-1.5 font-medium">Phone *</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" className={inputCls} required />
        </div>
      </div>
      <div>
        <label className="block text-xs text-ink-muted mb-1.5 font-medium">Address *</label>
        <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="123 Main Street" className={inputCls} required />
      </div>
      <div>
        <label className="block text-xs text-ink-muted mb-1.5 font-medium">Address Line 2</label>
        <input value={form.line2 || ""} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Apt, Floor (optional)" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 font-medium">City *</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} required />
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 font-medium">State / Province</label>
          <input value={form.state || ""} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 font-medium">Postal Code</label>
          <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-ink-muted mb-1.5 font-medium">Country *</label>
          <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="United States" className={inputCls} required />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_default || false}
          onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
          className="accent-gold w-4 h-4"
        />
        <span className="text-sm">Set as default address</span>
      </label>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (!form.full_name || !form.line1 || !form.city || !form.country) return;
            onSave(form);
          }}
          className="btn-gold text-sm px-6"
        >
          {initial ? "Update" : "Save Address"}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-ink-muted hover:text-ink">
          Cancel
        </button>
      </div>
    </div>
  );
}
