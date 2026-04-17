"use client";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <h1 className="h-serif text-3xl mb-4">My Account</h1>
        <p className="text-ink-muted">Please sign in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="h-serif text-3xl mb-8">My Account</h1>

      <div className="card p-6 space-y-4">
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
        {user.address && (
          <div>
            <label className="text-xs text-ink-muted font-medium">Shipping Address</label>
            <p className="text-sm mt-1">
              {user.address.line1}
              {user.address.line2 ? `, ${user.address.line2}` : ""}
              <br />
              {user.address.city}, {user.address.state} {user.address.zip}
              <br />
              {user.address.country}
            </p>
          </div>
        )}
        <div>
          <label className="text-xs text-ink-muted font-medium">Member Since</label>
          <p className="text-sm mt-1">{new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link href="/wishlist" className="card p-5 text-center hover:border-gold transition-colors">
          <div className="text-2xl mb-2">♡</div>
          <div className="text-sm font-medium">My Wishlist</div>
        </Link>
        <Link href="/cart" className="card p-5 text-center hover:border-gold transition-colors">
          <div className="text-2xl mb-2">🛒</div>
          <div className="text-sm font-medium">My Cart</div>
        </Link>
      </div>
    </div>
  );
}
