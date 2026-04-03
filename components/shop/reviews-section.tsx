"use client";
// components/shop/reviews-section.tsx – Section đánh giá & form gửi đánh giá

import { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
}

// ── Star Rating display ───────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt);
  const dateStr = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-w-[280px] max-w-[320px] bg-white rounded-2xl shadow-md p-5 border border-gray-100 mx-3 shrink-0">
      <StarRating rating={review.rating} />
      {review.comment && (
        <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">
          &ldquo;{review.comment}&rdquo;
        </p>
      )}
      <div className="mt-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
          {review.authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">
            {review.authorName}
          </p>
          <p className="text-xs text-gray-400">{dateStr}</p>
        </div>
      </div>
    </div>
  );
}

// ── Star picker for form ──────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            size={28}
            className={
              s <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400 transition-colors"
                : "fill-gray-200 text-gray-200 transition-colors"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ── Review Form ───────────────────────────────────────────────────────────────
function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName: name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra");
      } else {
        setSuccess(true);
        setName("");
        setRating(5);
        setComment("");
      }
    } catch {
      setError("Không thể kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center max-w-lg mx-auto">
        <div className="text-3xl mb-2">🎉</div>
        <p className="text-green-700 font-semibold">
          Cảm ơn bạn đã đánh giá!
        </p>
        <p className="text-green-600 text-sm mt-1">
          Đánh giá của bạn sẽ được hiển thị sau khi được duyệt.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-700 underline"
        >
          Gửi đánh giá khác
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg mx-auto"
    >
      <h3 className="font-bold text-gray-800 text-lg mb-4">
        Gửi đánh giá của bạn
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên của bạn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá <span className="text-red-500">*</span>
          </label>
          <StarPicker value={rating} onChange={setRating} />
          <p className="text-xs text-gray-400 mt-1">
            {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"][rating]}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhận xét
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về cửa hàng..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </div>
    </form>
  );
}

// ── Main Reviews Section ──────────────────────────────────────────────────────
export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  // Duplicate array for seamless infinite scroll
  const displayReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];

  return (
    <section className="py-14 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Khách Hàng Nói Gì?
        </h2>
        <p className="text-gray-500 mt-2">
          Đánh giá thực tế từ khách hàng của Cửa hàng Minh Tuyến
        </p>
      </div>

      {/* Scrolling reviews ticker */}
      {displayReviews.length > 0 ? (
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-green-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-emerald-50 to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-0 animate-marquee"
            style={{
              animationDuration: `${Math.max(displayReviews.length * 4, 20)}s`,
            }}
          >
            {displayReviews.map((review, idx) => (
              <ReviewCard key={`${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </div>
      )}

      {/* Form */}
      <div className="container mx-auto px-4 mt-12">
        <ReviewForm />
      </div>
    </section>
  );
}
