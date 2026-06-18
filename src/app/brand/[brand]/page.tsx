import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByBrand } from "@/lib/products";
import { FilteredProductList } from "@/components/FilterSidebar";
import type { Brand } from "@/types/product";
import { ALL_CATALOG_BRANDS, getCollections, isLadiesBrand } from "@/lib/catalog";
import Link from "next/link";

export const revalidate = 60; // ISR: revalidate every 60 seconds

/**
 * Build a slug → Brand display-name map from the catalog.
 * Ladies brands that have a parentBrand resolve to the parent's Brand type
 * (e.g. "rolex-ladies" → products filtered by brand "Rolex" + gender "Women").
 */
const BRAND_FROM_SLUG: Record<string, Brand> = {
  "rolex": "Rolex",
  "audemars-piguet": "Audemars Piguet",
  "patek-philippe": "Patek Philippe",
  "omega": "Omega",
  "hublot": "Hublot",
  "breitling": "Breitling",
  "bvlgari-men": "Bvlgari",
  "cartier": "Cartier",
  "tag-heuer": "TAG Heuer",
  "panerai": "Panerai",
  "iwc": "IWC",
  "richard-mille": "Richard Mille",
  "tudor": "Tudor",
  "vacheron-constantin": "Vacheron Constantin",
  "jaeger-lecoultre": "Jaeger-LeCoultre",
  "franck-muller": "Franck Muller",
  // Ladies brands
  "rolex-ladies": "Rolex",
  "bvlgari": "Bvlgari",
  "cartier-ladies": "Cartier",
  "audemars-piguet-ladies": "Audemars Piguet",
  "patek-philippe-ladies": "Patek Philippe",
};

/**
 * Per-brand SEO content. Keyed by the Brand display name (brandKey).
 * Adds unique long-form text, popular model keywords and FAQs so each
 * brand page can rank for "<brand> super clone / superclone / replica"
 * and the model-level long-tail (e.g. "rolex submariner super clone").
 */
type BrandSeo = { intro: string; models: string[]; faqs: { q: string; a: string }[] };

const BRAND_SEO: Record<string, BrandSeo> = {
  "Rolex": {
    intro:
      "Our Rolex super clone collection covers the models collectors actually search for — the Submariner, Daytona, GMT-Master II, Datejust, Day-Date, Yacht-Master, Oyster Perpetual, Explorer and Milgauss. Each Rolex replica is built to 1:1 specifications: correct case dimensions, Cerachrom-style bezels, applied gold markers and a clone movement tuned to mirror the original's feel and accuracy. Whether you want a 41mm Submariner, a two-tone 36mm Datejust or a President Day-Date, every piece is hand-checked before it ships.",
    models: ["Submariner", "Daytona", "GMT-Master II", "Datejust 36mm", "Datejust 31mm", "Day-Date", "Yacht-Master", "Oyster Perpetual", "Explorer", "Milgauss"],
    faqs: [
      { q: "How accurate are your Rolex super clones?", a: "Our top-tier Rolex super clones are 1:1 reproductions — case, dial, bezel and bracelet are dimensionally matched to the genuine reference, and the clone movement replicates the original's rate and functions." },
      { q: "What movement is inside a Rolex replica?", a: "Most Rolex super clones use a clone of the in-house caliber (e.g. clone 3235 / 4130) or a Swiss/Japanese automatic, depending on the tier you choose. Message us on WhatsApp for the exact movement of any model." },
      { q: "Are the Submariner and Daytona waterproof?", a: "Cases are sealed and water-resistant for daily wear, but we recommend keeping any replica away from deep diving or hot water to protect the seals over time." },
      { q: "Can you source a specific Rolex reference?", a: "Yes. If you don't see the exact Datejust, Daytona or GMT configuration you want, send us a photo or link on WhatsApp and we'll source it for you." },
    ],
  },
  "Patek Philippe": {
    intro:
      "Our Patek Philippe super clone range focuses on the icons: the Nautilus (including the 5711 and 5712), the Aquanaut and the dress-classic Calatrava. Each Patek replica reproduces the famous embossed dials, the integrated bracelet taper and the porthole Nautilus case to 1:1 tolerances, finished with a clone movement so the watch keeps the slim, refined wrist presence the originals are loved for.",
    models: ["Nautilus 5711", "Nautilus 5712", "Aquanaut", "Calatrava", "Grand Complications"],
    faqs: [
      { q: "How good is the Nautilus 5711 super clone?", a: "The 5711 super clone matches the genuine case thickness, the horizontal-embossed dial and the gradient blue/green colourways, with a clone caliber that keeps the profile slim — the detail collectors check first." },
      { q: "What movement powers the Patek super clones?", a: "Depending on tier, our Patek super clones run a clone of the 26-330 / 324 automatic or a reliable Swiss base. Ask on WhatsApp for the movement of a specific reference." },
      { q: "Is the Aquanaut replica suitable for daily wear?", a: "Yes — the Aquanaut's composite-style strap and sealed case make it a comfortable everyday super clone, water-resistant for normal use." },
      { q: "Do you ship Patek Philippe replicas worldwide?", a: "Yes, we ship worldwide with express, discreet packaging to 100+ countries." },
    ],
  },
  "Audemars Piguet": {
    intro:
      "Our Audemars Piguet super clone collection is led by the Royal Oak — including the 15500, 15510, 15400, 26240 and 26331 references — plus the Royal Oak Offshore and Royal Oak Chronograph. Each AP replica nails the part that matters most: the 'Tapisserie' dial texture, the octagonal bezel with its eight hexagonal screws, and the hand-finished integrated bracelet, paired with a clone movement for an authentic weight and feel.",
    models: ["Royal Oak 15500", "Royal Oak 15510", "Royal Oak 15400", "Royal Oak 26240", "Royal Oak 26331", "Royal Oak Offshore", "Royal Oak Chronograph"],
    faqs: [
      { q: "How realistic is the Royal Oak super clone?", a: "Our Royal Oak super clones reproduce the Tapisserie dial, the beveled octagonal bezel and the brushed/polished bracelet finishing to 1:1 standards — the hallmarks AP collectors inspect." },
      { q: "Which movement is in the AP replica?", a: "Royal Oak super clones use a clone of the 4302 / 3120 automatic or a Swiss base depending on tier. Contact us for the exact caliber of a reference." },
      { q: "Is the Royal Oak Offshore chronograph functional?", a: "Yes — on chronograph models the sub-dials and pushers are working. Tell us which functions you need and we'll match the right build." },
      { q: "Can I get a specific Royal Oak reference number?", a: "Yes, send us the reference (e.g. 15500ST, 26331) on WhatsApp and we'll source the closest 1:1 build available." },
    ],
  },
  "Richard Mille": {
    intro:
      "Our Richard Mille super clone collection covers the most-requested RM references — the RM 011, RM 035, RM 055, RM 011, RM 53 and RM 67-02. Richard Mille replicas are about engineering theatre: the tonneau case, the skeletonised baseplate, the bright rubber straps and the layered sapphire-style construction. Each RM super clone reproduces that architecture with a clone movement so the openworked dial actually looks alive on the wrist.",
    models: ["RM 011", "RM 035", "RM 055", "RM 67-02", "RM 53", "RM 38"],
    faqs: [
      { q: "Are Richard Mille super clones skeletonised like the originals?", a: "Yes — our RM super clones reproduce the openworked baseplate and tonneau case architecture, with a clone movement visible through the dial." },
      { q: "What strap options come with the RM replica?", a: "Most Richard Mille super clones ship with the signature rubber strap; colour options vary by reference. Ask on WhatsApp for current availability." },
      { q: "How durable is an RM 011 or RM 055 super clone?", a: "The tonneau cases are built for everyday wear, but as with any replica we recommend avoiding hard impacts to protect the sapphire-style crystal and case." },
      { q: "Can you source a specific Richard Mille reference?", a: "Yes — send us the RM reference you want and we'll source the closest 1:1 build." },
    ],
  },
  "Omega": {
    intro:
      "Our Omega super clone collection centres on the legends: the Speedmaster (including the Moonwatch) and the Seamaster Diver 300M. Each Omega replica reproduces the stepped Speedmaster dial and tachymeter bezel, or the Seamaster's wave-pattern dial and helium escape valve, with a clone movement modelled on Omega's co-axial calibers for an authentic wind and feel.",
    models: ["Speedmaster Moonwatch", "Speedmaster 300", "Seamaster Diver 300M", "Seamaster Planet Ocean", "Constellation"],
    faqs: [
      { q: "How good is the Seamaster super clone?", a: "The Seamaster 300M super clone reproduces the laser-engraved wave dial, the ceramic-style bezel and the polished/brushed bracelet to 1:1 standards." },
      { q: "Does the Speedmaster chronograph work?", a: "Yes — the Speedmaster super clone has functional chronograph sub-dials and pushers, matching the Moonwatch layout." },
      { q: "What movement is in the Omega replica?", a: "Depending on tier, Omega super clones use a clone co-axial caliber or a reliable Swiss/Japanese automatic. Ask us for the exact movement." },
      { q: "Do you ship Omega replicas discreetly?", a: "Yes — all orders ship worldwide with discreet, unbranded packaging." },
    ],
  },
  "Panerai": {
    intro:
      "Our Panerai super clone collection covers the Luminor, Submersible and Radiomir families — the cushion-case Italian icons. Each Panerai replica reproduces the signature crown-protecting lever bridge, the sandwich dial with its glowing numerals, and the thick cushion case, paired with a clone movement so the watch carries the same bold wrist presence Panerai is known for.",
    models: ["Luminor Marina", "Luminor GMT", "Submersible", "Radiomir", "Luminor Due"],
    faqs: [
      { q: "How accurate is the Panerai Luminor super clone?", a: "Our Luminor super clones reproduce the crown-guard bridge, the sandwich dial luminescence and the cushion case dimensions to 1:1 standards." },
      { q: "What movement is inside a Panerai replica?", a: "Panerai super clones use a clone of the P-series caliber or a Swiss/Japanese automatic depending on tier — contact us for a specific model." },
      { q: "Is the Submersible suitable for water?", a: "The Submersible super clone is sealed for everyday water resistance, though we advise against deep diving to protect the seals." },
      { q: "Can you source a specific Panerai PAM number?", a: "Yes — send us the PAM reference and we'll source the closest 1:1 build available." },
    ],
  },
  "Vacheron Constantin": {
    intro:
      "Our Vacheron Constantin super clone collection is led by the Overseas, alongside the Patrimony and Traditionnelle dress pieces. Each Vacheron replica reproduces the Maltese-cross bezel of the Overseas, the integrated bracelet with its quick-release links, and the clean guilloché dials of the dress models, finished with a clone movement for a refined, slim wrist feel.",
    models: ["Overseas", "Patrimony", "Traditionnelle", "Fiftysix", "Historiques"],
    faqs: [
      { q: "How good is the Overseas super clone?", a: "The Overseas super clone reproduces the Maltese-cross bezel, the textured dial and the quick-release integrated bracelet to 1:1 standards." },
      { q: "What movement powers the Vacheron replica?", a: "Depending on tier, our Vacheron super clones run a clone automatic or a Swiss base — ask on WhatsApp for the exact caliber." },
      { q: "Is the Vacheron super clone good for dress wear?", a: "Yes — the Patrimony and Traditionnelle super clones are slim, clean and ideal as a dress watch." },
      { q: "Do you ship Vacheron Constantin replicas worldwide?", a: "Yes — worldwide express shipping with discreet packaging to 100+ countries." },
    ],
  },
  "Cartier": {
    intro:
      "Our Cartier super clone collection covers the Santos, Tank, Ballon Bleu and Panthère — the shapes that defined modern dress watchmaking. Each Cartier replica reproduces the Roman-numeral dials, the blued sword hands, the sapphire cabochon crown and the case silhouettes to 1:1 tolerances, with a clone movement for an authentic, elegant wear.",
    models: ["Santos", "Tank", "Ballon Bleu", "Panthère", "Santos-Dumont"],
    faqs: [
      { q: "How accurate is the Cartier Santos super clone?", a: "Our Santos super clones reproduce the exposed-screw bezel, the Roman-numeral dial, the blued hands and the SmartLink-style bracelet to 1:1 standards." },
      { q: "What movement is in the Cartier replica?", a: "Cartier super clones use a clone automatic or quartz depending on the model and tier — contact us for specifics." },
      { q: "Is the Ballon Bleu available in ladies sizes?", a: "Yes — the Ballon Bleu and Panthère come in multiple sizes, including ladies options. Ask us for the size you want." },
      { q: "Do you offer the Panthère for women?", a: "Yes — the Panthère is a popular ladies super clone; see our Ladies collection or message us for availability." },
    ],
  },
};

function defaultFaqs(name: string): { q: string; a: string }[] {
  return [
    { q: `How good is the ${name} super clone quality?`, a: `Our top-tier ${name} super clones are 1:1 reproductions — case, dial and bracelet are matched to the original, with a clone movement that replicates the genuine feel and functions.` },
    { q: `What movement is inside the ${name} replica?`, a: `Depending on the tier you choose, our ${name} super clones run a clone automatic or a reliable Swiss/Japanese movement. Message us on WhatsApp for the exact caliber of any model.` },
    { q: `Do you ship ${name} replicas worldwide?`, a: `Yes — we ship worldwide with express, discreet packaging to 100+ countries.` },
    { q: `Can you source a specific ${name} model?`, a: `Yes. If you don't see the exact ${name} reference you want, send us a photo or link on WhatsApp and we'll source it for you.` },
  ];
}

export function generateStaticParams() {
  return ALL_CATALOG_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
  const entry = ALL_CATALOG_BRANDS.find((b) => b.slug === params.brand);
  if (!entry) return {};
  const isLadies = isLadiesBrand(params.brand);
  const title = isLadies
    ? `${entry.name} Replica Watches for Women — 1:1 Super Clone Quality`
    : `${entry.name} Superclone Replica Watches — Super Clone & 1:1 Quality`;
  const description = isLadies
    ? `Shop ${entry.name} superclone replica watches for women. Swiss mechanism options, 1:1 quality. Worldwide express shipping, discreet packaging.`
    : `Shop ${entry.name} superclone & super clone replica watches with 1:1 quality. Swiss mechanism options. Worldwide express shipping, discreet packaging to 100+ countries.`;
  return { title, description, alternates: { canonical: `/brand/${params.brand}` } };
}

export default async function BrandPage({ params }: { params: { brand: string } }) {
  const brandKey = BRAND_FROM_SLUG[params.brand];
  if (!brandKey) notFound();
  const entry = ALL_CATALOG_BRANDS.find((b) => b.slug === params.brand);
  if (!entry) notFound();
  const isLadies = isLadiesBrand(params.brand);
  const collections = getCollections(params.brand);
  // Get products — for ladies brands, filter by gender too
  let products = await getProductsByBrand(brandKey);
  if (isLadies) {
    products = products.filter(
      (p) => p.gender === "Women" || p.gender === "Unisex"
    );
  }

  // SEO content (unique per brand, with safe fallbacks)
  const seo = BRAND_SEO[brandKey];
  const models = seo?.models ?? collections.map((c) => c.name);
  const faqs = seo?.faqs ?? defaultFaqs(entry.name);
  const intro =
    seo?.intro ??
    `Explore our curated selection of ${entry.name} super clone and replica watches — faithfully built by the industry's most respected ateliers, with 1:1 quality and worldwide discreet shipping.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container py-12">
      {/* FAQ structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">›</span>
        {isLadies && (
          <>
            <Link href="/ladies" className="hover:text-gold transition-colors">Ladies Watches</Link>
            <span className="mx-2">›</span>
          </>
        )}
        {!isLadies && <><span>Brands</span><span className="mx-2">›</span></>}
        <span className="text-ink">{entry.name}</span>
      </nav>
      <header className="mb-10">
        <p className="chip-gold inline-block mb-4">
          {isLadies ? "LADIES COLLECTION" : "SUPER CLONE COLLECTION"}
        </p>
        <h1 className="h-serif text-4xl md:text-5xl">
          {isLadies
            ? `${entry.name} Replica Watches for Women`
            : `${entry.name} Super Clone & Replica Watches`}
        </h1>
        <p className="text-ink-muted mt-3 max-w-2xl">
          {isLadies
            ? `Discover our curated selection of ${entry.name} super clone watches for women — elegant 1:1 timepieces crafted with precision, with worldwide discreet shipping.`
            : `Explore our curated selection of ${entry.name} super clone watches — 1:1 quality, faithfully built by the industry's most respected ateliers.`}
        </p>
      </header>
      {/* Collection quick-filters */}
      {collections.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/brand/${params.brand}`}
            className="px-4 py-2 text-xs rounded-full border border-gold text-gold hover:bg-gold hover:text-[#0a0e17] transition-all font-medium"
          >
            All
          </Link>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/brand/${params.brand}?collection=${c.slug}`}
              className="px-4 py-2 text-xs rounded-full border border-line text-ink-muted hover:border-gold hover:text-gold transition-all"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
      <Suspense fallback={<div className="text-ink-muted text-sm">Loading...</div>}>
        <FilteredProductList products={products} />
      </Suspense>

      {/* SEO content block */}
      <div className="mt-20 max-w-3xl text-ink-muted text-sm leading-relaxed space-y-6">
        <div className="space-y-4">
          <h2 className="h-serif text-2xl text-ink">
            About {entry.name} {isLadies ? "Replica Watches" : "Super Clone Watches"}
          </h2>
          <p>{intro}</p>
        </div>

        {models.length > 0 && (
          <div className="space-y-3">
            <h3 className="h-serif text-xl text-ink">Popular {entry.name} Models</h3>
            <div className="flex flex-wrap gap-2">
              {models.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1.5 text-xs rounded-full border border-line text-ink-muted"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="h-serif text-2xl text-ink">
            {entry.name} Super Clone — Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-ink font-medium">{f.q}</h3>
                <p className="mt-1">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

