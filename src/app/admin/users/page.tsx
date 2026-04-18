"use client";
import { useState, useEffect } from "react";

interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  address?: {
    line1: string;
    city: string;
    country: string;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("clonica_users");
      if (raw) {
        const parsed = JSON.parse(raw);
        const list = Object.values(parsed).map((entry: any) => entry.user) as UserRecord[];
        setUsers(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    } catch {}
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Kayitli Kullanicilar</h1>
        <p className="text-ink-muted text-sm mt-1">
          Toplam {users.length} kayitli kullanici
        </p>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          Henuz kayitli kullanici yok.
        </div>
      ) : (
        <div className="bg-bg-elev border border-line rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="px-4 py-3 text-ink-muted font-medium">Ad</th>
                <th className="px-4 py-3 text-ink-muted font-medium">Email</th>
                <th className="px-4 py-3 text-ink-muted font-medium">Telefon</th>
                <th className="px-4 py-3 text-ink-muted font-medium">Ulke</th>
                <th className="px-4 py-3 text-ink-muted font-medium">Kayit</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line hover:bg-bg-soft transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{u.address?.country || "—"}</td>
                  <td className="px-4 py-3 text-ink-dim text-xs">
                    {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
