"use client";

import { trackWhatsAppClick } from "@/components/Analytics";

export function TrackedWhatsAppLink({
  href,
  context,
  productId,
  productName,
  value,
  className,
  children,
}: {
  href: string;
  context: "product" | "cart" | "homepage" | "sticky_cta";
  productId?: string;
  productName?: string;
  value?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const handleClick = () => {
    trackWhatsAppClick({
      page: context,
      product_id: productId,
      product_name: productName,
      value,
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
