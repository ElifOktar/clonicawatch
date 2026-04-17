export const metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="h-serif text-4xl mb-6">Worldwide Express Shipping</h1>
      <div className="text-ink-muted leading-relaxed space-y-5">
        <p>
          We ship to over 80 countries via <span className="text-gold">DHL Express</span>,
          <span className="text-gold"> FedEx</span>, and
          <span className="text-gold"> UPS</span>. Every order includes a
          tracking number, provided as soon as your package leaves our
          warehouse.
        </p>

        <h2 className="h-serif text-2xl text-ink mt-8">Delivery Times</h2>
        <ul className="space-y-2">
          <li>🇺🇸 United States — 4–7 business days</li>
          <li>🇬🇧 United Kingdom — 3–5 business days</li>
          <li>🇪🇺 Europe — 3–5 business days</li>
          <li>🇦🇪 Middle East / Gulf — 4–6 business days</li>
          <li>🌍 Rest of the world — 5–10 business days</li>
        </ul>

        <h2 className="h-serif text-2xl text-ink mt-8">Discreet Packaging</h2>
        <p>
          All orders ship in plain, unbranded packaging with a neutral declared
          item description. No retail branding, no luxury labels on the outside.
          Your privacy is prioritized.
        </p>

        <h2 className="h-serif text-2xl text-ink mt-8">Customs & Duties</h2>
        <p>
          Buyers are responsible for any local customs duties or taxes that may
          apply in their country. We declare items discretely to minimize
          processing friction, but cannot guarantee outcomes of local customs
          procedures. Message us on WhatsApp if you have questions specific to
          your country.
        </p>

        <h2 className="h-serif text-2xl text-ink mt-8">Tracking</h2>
        <p>
          Your tracking number is sent via WhatsApp the moment your package is
          picked up. You can monitor your shipment in real-time on the
          carrier's website.
        </p>
      </div>
    </div>
  );
}
