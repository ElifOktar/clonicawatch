"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/Toast";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
  status: "approved" | "pending";
  createdAt: string;
}

const SEED_REVIEWS: Review[] = [
  { id: "seed_1", name: "Michael T.", location: "London, UK", rating: 5,
    text: "Submariner arrived in 4 days — identical to my buddy's real one. Exceptional quality and discreet packaging. Will order again.",
    product: "Rolex Submariner 126610LN", status: "approved", createdAt: "2024-12-01" },
  { id: "seed_2", name: "Khalid A.", location: "Dubai, UAE", rating: 5,
    text: "Royal Oak Blue is perfection. The dial texture and hand polish are spot on. Team was responsive on WhatsApp throughout.",
    product: "AP Royal Oak 15400ST", status: "approved", createdAt: "2024-12-02" },
  { id: "seed_3", name: "Daniel R.", location: "New York, USA", rating: 5,
    text: "Second order from Clonicawatch. Nautilus exceeded expectations. Tracked via FedEx the whole way. Highly recommend.",
    product: "Patek Nautilus 5711", status: "approved", createdAt: "2024-12-03" },
  { id: "seed_4", name: "Marco V.", location: "Milan, Italy", rating: 5,
    text: "Daytona panda is stunning — the movement runs perfectly. Crystal clear communication and fair pricing.",
    product: "Rolex Daytona 116500LN", status: "approved", createdAt: "2024-12-04" },
];

const STORAGE_KEY = "clonicawatch_reviews";
const NOTIFICATIONS_KEY = "clonicawatch_notifications";

function getStoredReviews(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function addNotification(message: string) {
  try {
    const existing = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
    existing.push({
      type: "review",
      message,
      date: new Date().toISOString(),
      read: false,
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(existing));
  } catch {}
}

function ReviewForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [productName, setProductName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="bg-cream-elev border border-cream-line rounded-sm p-6 text-center">
        <p className="text-cream-muted mb-4">Sign in to leave a review</p>
        <a href="#auth" className="inline-block px-6 py-2 bg-gold text-bg font-medium rounded-sm hover:bg-gold-bright transition-colors">
          Sign In
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !reviewText.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const newReview: Review = {
        id: `usr_${Date.now().toString(36)}`,
        name: user.name,
        location: "Customer",
        rating,
        text: reviewText,
        product: productName,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const reviews = getStoredReviews();
      reviews.push(newReview);
      saveReviews(reviews);

      addNotification(`New review from ${user.name}`);

      showToast("Review submitted! It will appear after approval.", "success");
      setProductName("");
      setReviewText("");
      setRating(5);
      onSubmitSuccess();
    } catch (error) {
      showToast("Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cream-elev border border-cream-line rounded-sm p-6">
      <h3 className="text-lg font-serif text-cream-ink mb-4">Write a Review</h3>

      <div className="mb-4">
        <label className="block text-sm text-cream-muted mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-colors ${
                star <= rating ? "text-gold" : "text-cream-muted"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-cream-muted mb-2">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="e.g., Rolex Submariner 126610LN"
          className="w-full px-3 py-2 bg-bg border border-cream-line rounded-sm text-cream-ink text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-cream-muted mb-2">Review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this timepiece..."
          rows={4}
          className="w-full px-3 py-2 bg-bg border border-cream-line rounded-sm text-cream-ink text-sm focus:outline-none focus:border-gold resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-gold text-bg font-medium rounded-sm hover:bg-gold-bright disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayCount, setDisplayCount] = useState(8);

  useEffect(() => {
    const stored = getStoredReviews();
    const approved = SEED_REVIEWS.concat(stored).filter((r) => r.status === "approved");
    setReviews(approved);
  }, []);

  const displayedReviews = reviews.slice(0, displayCount);
  const hasMore = displayCount < reviews.length;

  return (
    <section className="section-cream py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="chip-gold inline-block mb-3">CUSTOMER STORIES</p>
          <h2 className="h-serif text-3xl md:text-4xl">Trusted by Collectors Worldwide</h2>
          <p className="text-cream-muted mt-3 max-w-xl mx-auto">What our customers say after their timepiece arrives.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {displayedReviews.map((r) => (
            <div key={r.id} className="bg-cream-elev border border-cream-line rounded-sm p-5">
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

        {hasMore && (
          <div className="text-center mb-12">
            <button
              onClick={() => setDisplayCount((prev) => prev + 4)}
              className="px-6 py-2 border border-gold text-gold rounded-sm hover:bg-gold/10 transition-colors text-sm font-medium"
            >
              Show More Reviews
            </button>
          </div>
        )}

        <div className="mt-16 pt-16 border-t border-cream-line">
          <div className="max-w-2xl mx-auto">
            <ReviewForm onSubmitSuccess={() => window.location.reload()} />
          </div>
        </div>
      </div>
    </section>
  );
}
