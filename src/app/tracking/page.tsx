"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/lib/config";

const CARRIERS = [
  { id: "dhl", name: "DHL Express", days: "3-5 business days" },
  { id: "fedex", name: "FedEx", days: "4-7 business days" },
  { id: "ups", name: "UPS", days: "4-7 business days" },
];

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("dhl");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    const urls: Record<string, string> = {
      dhl: "https://www.dhl.com/en/express/tracking.html?AWB=" + trackingNumber,
      fedex: "https://www.fedex.com/fedextrack/?trknbr=" + trackingNumber,
      ups: "https://www.ups.com/track?tracknum=" + trackingNumber,
    };

    const url = urls[carrier];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const waUrl = "https://wa.me/" + SITE_CONFIG.contact.whatsapp + "?text=Hi, I have a question about my order tracking.";
  const mailUrl = "mailto:" + SITE_CONFIG.contact.email;

  return (
    <div className="container py-12 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="h-serif text-4xl mb-3">Track Your Order</h1>
        <p className="text-ink-muted">
          Enter your tracking number to check delivery status.
        </p>
      </div>

      <div className="card p-8 mb-12">
        <form onSubmit={handleTrack} className="space-y-6">
          <div>
            <label htmlFor="tracking" className="block text-sm font-medium text-ink mb-2">
              Tracking Number
            </label>
            <input
              id="tracking"
              type="text"
              placeholder="e.g., 1234567890"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-line rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-ink placeholder:text-ink-muted"
            />
          </div>

          <div>
            <label htmlFor="carrier" className="block text-sm font-medium text-ink mb-2">
              Shipping Carrier
            </label>
            <select
              id="carrier"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-4 py-3 bg-bg border border-line rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-ink"
            >
              {CARRIERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full btn-gold py-3 font-medium transition-all"
          >
            Track Shipment
          </button>
        </form>
      </div>

      <div className="mb-12">
        <h2 className="h-serif text-2xl mb-6">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARRIERS.map((c) => (
            <div key={c.id} className="card p-6 text-center">
              <h3 className="text-gold font-medium mb-2">{c.name}</h3>
              <p className="text-ink-muted text-sm">{c.days}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-elev rounded-lg p-6 mb-8">
        <p className="text-ink-muted text-sm leading-relaxed mb-4">
          <span className="text-gold font-medium">Track via WhatsApp:</span>{" "}
          Tracking numbers are sent via WhatsApp immediately after your order ships.
        </p>
        
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block btn-gold px-6 py-2 text-sm font-medium transition-all"
        >
          Message us on WhatsApp
        </a>
      </div>

      <div className="text-center">
        <p className="text-ink-muted text-sm mb-3">
          Cannot find your tracking number?
        </p>
        
          href={mailUrl}
          className="inline-block text-gold hover:text-gold/80 transition-colors font-medium"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
