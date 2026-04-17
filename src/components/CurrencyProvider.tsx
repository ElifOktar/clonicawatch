"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Code = "USD" | "EUR" | "GBP" | "AED" | "TRY";
const KEY = "clonica_currency_v1";
const DEFAULT_RATES: Record<Code, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, AED: 3.67, TRY: 33,
};

type Ctx = {
  code: Code;
  setCode: (c: Code) => void;
  rates: Record<Code, number>;
  convert: (usd: number) => number;
  format: (usd: number) => string;
};
const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<Code>("USD");
  const [rates, setRates] = useState<Record<Code, number>>(DEFAULT_RATES);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Code | null;
      if (saved && saved in DEFAULT_RATES) setCodeState(saved);
    } catch {}

    // Fetch live rates (ücretsiz, API key gerekmez)
    fetch("https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP,AED,TRY")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.rates) {
          setRates({
            USD: 1,
            EUR: d.rates.EUR ?? DEFAULT_RATES.EUR,
            GBP: d.rates.GBP ?? DEFAULT_RATES.GBP,
            AED: d.rates.AED ?? DEFAULT_RATES.AED,
            TRY: d.rates.TRY ?? DEFAULT_RATES.TRY,
          });
        }
      })
      .catch(() => { /* stick with defaults */ });
  }, []);

  const setCode = (c: Code) => {
    setCodeState(c);
    try { localStorage.setItem(KEY, c); } catch {}
  };
  const convert = (usd: number) => usd * (rates[code] ?? 1);
  const format = (usd: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(convert(usd));

  return (
    <CurrencyContext.Provider value={{ code, setCode, rates, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const c = useContext(CurrencyContext);
  if (!c) throw new Error("useCurrency must be used within CurrencyProvider");
  return c;
}

export function CurrencySwitcher() {
  const { code, setCode } = useCurrency();
  const options: Code[] = ["USD", "EUR", "GBP", "AED", "TRY"];
  return (
    <select
      value={code}
      onChange={(e) => setCode(e.target.value as Code)}
      className="bg-transparent border border-line rounded-sm px-2 py-1 text-xs hover:border-gold focus:border-gold focus:outline-none"
      aria-label="Currency"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-bg-elev text-ink">{o}</option>
      ))}
    </select>
  );
}
