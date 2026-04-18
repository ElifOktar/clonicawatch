"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { BottomNav } from "@/components/BottomNav";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [searchOpen, setSearchOpen] = useState(false);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] pb-24 md:pb-0 overflow-x-hidden">{children}</main>
      <Footer />
      <FloatingButtons />
      <BottomNav />
    </>
  );
}
