const REVIEWS = [
  { name: "Michael T.", location: "London, UK", rating: 5,
    text: "Clean Factory Submariner arrived in 4 days — identical to my buddy's real one. Exceptional quality and discreet packaging. Will order again.",
    product: "Rolex Submariner 126610LN" },
  { name: "Khalid A.", location: "Dubai, UAE", rating: 5,
    text: "APF Royal Oak Blue is perfection. The dial texture and hand polish are spot on. Team was responsive on WhatsApp throughout.",
    product: "AP Royal Oak 15400ST" },
  { name: "Daniel R.", location: "New York, USA", rating: 5,
    text: "Second order from Clonicawatch. BP Nautilus exceeded expectations. Tracked via FedEx the whole way. Highly recommend.",
    product: "Patek Nautilus 5711" },
  { name: "Marco V.", location: "Milan, Italy", rating: 5,
    text: "Daytona panda is stunning — Clone 4130 runs perfectly. Crystal clear communication and fair pricing.",
    product: "Rolex Daytona 116500LN" },
];

export function Reviews() {
  return (
    <section className="section-cream py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="chip-gold inline-block mb-3">CUSTOMER STORIES</p>
          <h2 className="h-serif text-3xl md:text-4xl">Trusted by Collectors Worldwide</h2>
          <p className="text-cream-muted mt-3 max-w-xl mx-auto">What our customers say after their timepiece arrives.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-cream-elev border border-cream-line rounded-sm p-5">
              <div className="flex items-center gap-1 text-gold">
                {"★".repeat(r.rating)}<span className="text-cream-muted">{"★".repeat(5 - r.rating)}</span>
              </div>
              <p className="text-cream-ink text-sm mt-3 leading-relaxed">"{r.text}"</p>
              <div className="mt-4 pt-4 border-t border-cream-line">
                <p className="font-medium text-cream-ink text-sm">{r.name}</p>
                <p className="text-cream-muted text-xs">{r.location}</p>
                <p className="text-cream-muted text-xs mt-1 italic">{r.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
