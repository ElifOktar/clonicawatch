"use client";
import { useCurrency } from "@/components/CurrencyProvider";

export function Price({ usd, className, strike }: { usd: number; className?: string; strike?: boolean }) {
  const { format } = useCurrency();
  return (
    <span className={className}>
      {strike ? <s>{format(usd)}</s> : format(usd)}
    </span>
  );
}
