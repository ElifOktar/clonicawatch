export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="h-serif text-4xl mb-6">About Us</h1>
      <div className="text-ink-muted leading-relaxed space-y-5">
        <p>
          We curate the finest super clone timepieces from the world's most
          respected ateliers and deliver them discreetly, worldwide.
        </p>
        <p>
          Our mission is simple: bring the design, craftsmanship, and presence
          of the world's most iconic watches within reach of the modern
          collector. Every piece we stock is personally vetted for fit, finish,
          and movement quality.
        </p>
        <h2 className="h-serif text-2xl text-ink mt-8">What Makes Us Different</h2>
        <ul className="space-y-2 list-none pl-0">
          <li className="flex gap-3"><span className="text-gold">◆</span><span><strong className="text-ink">Top-Tier Factories Only.</strong> We source exclusively from the ateliers known for best-in-class super clone production.</span></li>
          <li className="flex gap-3"><span className="text-gold">◆</span><span><strong className="text-ink">Discreet Worldwide Shipping.</strong> Plain packaging, neutral declarations, tracked delivery to 80+ countries.</span></li>
          <li className="flex gap-3"><span className="text-gold">◆</span><span><strong className="text-ink">Swiss Movement Options.</strong> Select pieces with authentic Swiss mechanisms for the purist.</span></li>
          <li className="flex gap-3"><span className="text-gold">◆</span><span><strong className="text-ink">Flexible Payment.</strong> Bank, crypto, Western Union, RIA — your choice.</span></li>
          <li className="flex gap-3"><span className="text-gold">◆</span><span><strong className="text-ink">Personal Service.</strong> Every inquiry answered by a real person, not a bot. Typical response: under 2 hours.</span></li>
        </ul>
        <p className="mt-8 italic">
          Craftsmanship. Discretion. Worldwide.
        </p>
      </div>
    </div>
  );
}
