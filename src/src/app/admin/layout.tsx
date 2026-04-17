"use client";
import { AdminAuthProvider, AdminLoginGate } from "@/components/admin/AdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLoginGate>
        <div className="flex min-h-screen bg-bg text-ink">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
          </main>
        </div>
      </AdminLoginGate>
    </AdminAuthProvider>
  );
}
