"use client";
// components/shop/hero-slider.tsx – Hero banner với slide panel

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    badge: "Cửa hàng Minh Tuyến",
    title: "Chính Hãng · Uy Tín",
    subtitle: "Chất lượng, an toàn, đáng tin cậy",
    description:
      "Cung cấp đồ dân dụng, vật tư tổng hợp chất lượng cao tại Quảng Trị từ năm 2010.",
    gradient: "from-green-800 via-green-700 to-emerald-600",
    accent: "bg-emerald-500",
    pattern: "🌿",
  },
  {
    badge: "Đa dạng sản phẩm",
    title: "Ống Nước · Điện Dân Dụng",
    subtitle: "Đồ biển · Vật tư thủy sản · Xây dựng",
    description:
      "Hàng ngàn sản phẩm phục vụ nhu cầu đời sống và sản xuất cho bà con Quảng Trị.",
    gradient: "from-blue-800 via-blue-700 to-cyan-600",
    accent: "bg-cyan-500",
    pattern: "⚙️",
  },
  {
    badge: "Tư vấn miễn phí",
    title: "Phục Vụ Tận Tâm",
    subtitle: "Giá cả hợp lý · Giao hàng nhanh",
    description:
      "Liên hệ ngay để được tư vấn và nhận báo giá tốt nhất. Chúng tôi luôn sẵn sàng hỗ trợ.",
    gradient: "from-orange-700 via-orange-600 to-amber-500",
    accent: "bg-amber-500",
    pattern: "🏪",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(idx);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [current, goTo]
  );

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden h-[380px] sm:h-[460px] md:h-[520px]">
      {/* Slides */}
      {SLIDES.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-700 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/5 rounded-full" />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center text-white max-w-3xl mx-auto">
              {/* Badge */}
              <span
                className={`inline-block ${slide.accent} text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 shadow-md`}
              >
                {slide.badge}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 drop-shadow-lg leading-tight">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-white/90 font-medium mb-2">
                {slide.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/75 max-w-xl mx-auto mb-8 leading-relaxed">
                {slide.description}
              </p>

              {/* CTA */}
              <Link
                href="/ve-chung-toi"
                className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
              >
                Về chúng tôi →
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Prev arrow */}
      <button
        onClick={prev}
        aria-label="Slide trước"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm rounded-full p-2 transition-all"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next arrow */}
      <button
        onClick={next}
        aria-label="Slide tiếp theo"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm rounded-full p-2 transition-all"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Đến slide ${idx + 1}`}
            className={`rounded-full transition-all duration-300 ${
              idx === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
