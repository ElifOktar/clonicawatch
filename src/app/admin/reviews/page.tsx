"use client";
import { useEffect, useState } from "react";

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

const STORAGE_KEY = "clonicawatch_reviews";

function getReviews(): Review[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveReviews(reviews: Review[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    const stored = getReviews();
    setReviews(stored);
    setLoading(false);
  }, []);

  const handleApprove = (id: string) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    saveReviews(updated);
    setReviews(updated);
  };

  const handleDelete = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
    setReviews(updated);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return r.status === "pending";
    if (filter === "approved") return r.status === "approved";
    return true;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  if (loading) {
    return <div className="text-ink-muted py-12">Yukleniyor...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Degerlendirmeler</h1>
          <p className="text-ink-muted text-sm mt-1">Musteri yorumlarini yonet ve onayla</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-gold/10 border border-gold/20 text-gold px-4 py-2 rounded-lg">
            <div className="text-sm font-medium">{pendingCount} onay bekliyor</div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-line">
        {(["all", "pending", "approved"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? "border-gold text-gold"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab === "all" && "Tumu"}
            {tab === "pending" && "Onay Bekleyen"}
            {tab === "approved" && "Onaylanan"}
          </button>
        ))}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-ink-muted">
            {filter === "pending" && "Onay bekleyen degerlendirme yok"}
            {filter === "approved" && "Onaylanan degerlendirme yok"}
            {filter === "all" && "Hic degerlendirme yok"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-bg-elev border border-line rounded-xl p-6"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-ink">{review.name}</p>
                      <p className="text-xs text-ink-muted">{review.location}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      {"★".repeat(review.rating)}
                      <span className="text-ink-muted">{"★".repeat(5 - review.rating)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-ink-muted italic mb-2">{review.product}</p>
                  <p className="text-sm text-ink leading-relaxed mb-3">"{review.text}"</p>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-ink-dim">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        review.status === "approved"
                          ? "bg-green-400/15 text-green-400"
                          : "bg-yellow-400/15 text-yellow-400"
                      }`}
                    >
                      {review.status === "approved" ? "Onaylandi" : "Onay Bekliyor"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {review.status === "pending" && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="px-4 py-2 bg-green-400/15 text-green-400 text-sm font-medium rounded-lg hover:bg-green-400/25 transition-colors"
                    >
                      Onayla
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-red-400/15 text-red-400 text-sm font-medium rounded-lg hover:bg-red-400/25 transition-colors"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
