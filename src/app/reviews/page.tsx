import type { Metadata } from "next";
import { Testimonials } from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Customer Reviews — Verified WhatsApp Testimonials",
  description:
    "Real, verified WhatsApp reviews from Clonica super clone watch buyers worldwide — Rolex, Patek Philippe, Audemars Piguet, Cartier, Panerai and more. 1:1 quality, fast discreet delivery.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Customer Reviews — Clonica Super Clone Watches",
    description:
      "See real WhatsApp messages from happy buyers worldwide. 1:1 super clone quality, fast discreet worldwide delivery.",
    url: "https://clonica.online/reviews",
    type: "website",
  },
};

export default function ReviewsPage() {
  return (
    <>
      <section className="container py-12 md:py-16 text-center">
        <p className="chip-gold inline-block mb-4">TRUSTED WORLDWIDE</p>
        <h1 className="h-serif text-4xl md:text-5xl">Customer Reviews</h1>
        <p className="text-ink-muted mt-4 max-w-2xl mx-auto leading-relaxed">
          Hundreds of collectors around the world trust Clonica for premium super clone watches.
          Here are real, unedited WhatsApp messages from buyers after their watches arrived — Rolex,
          Patek Philippe, Audemars Piguet, Cartier, Panerai and more, delivered discreetly every time.
        </p>
      </section>

      <Testimonials />
    </>
  );
}

