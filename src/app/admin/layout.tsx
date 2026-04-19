"use client";
import { useState } from "react";
import { AdminAuthProvider, AdminLoginGate } from "@/components/admin/AdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminAuthProvider>
      <AdminLoginGate>
        <div className="flex min-h-screen bg-bg text-ink">
          <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 min-w-0 overflow-auto">
            {/* Mobile top bar */}
            <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-b border-line px-4 py-3 flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-ink-muted hover:text-gold transition-colors rounded-lg hover:bg-bg-soft"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-gold font-bold tracking-widest text-sm">CLONICA ADMIN</span>
            </div>

            <div className="p-4 lg:p-8 max-w-7xl">{children}</div>
          </main>
        </div>
      </AdminLoginGate>
    </AdminAuthProvider>
  );
}
