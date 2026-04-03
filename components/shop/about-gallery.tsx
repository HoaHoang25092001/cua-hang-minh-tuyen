"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Store, Shield, ThumbsUp, Truck, ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "/images/image-0.jpg", alt: "Cửa hàng Minh Tuyến" },
  { src: "/images/image-1.jpg", alt: "Kho hàng đa dạng" },
  { src: "/images/image-2.jpg", alt: "Vật tư chất lượng" },
  { src: "/images/image-3.jpg", alt: "Phục vụ tận tâm" },
  { src: "/images/image-4.jpg", alt: "Đội ngũ nhiệt huyết" },
  { src: "/images/image-5.jpg", alt: "Sản phẩm phong phú" },
];

const HIGHLIGHTS = [
  {
    icon: Store,
    title: "Hơn 10 năm kinh nghiệm",
    desc: "Phục vụ hàng nghìn khách hàng tại Quảng Trị từ năm 2010",
  },
  {
    icon: Shield,
    title: "Hàng chính hãng 100%",
    desc: "Tất cả sản phẩm đều có nguồn gốc xuất xứ rõ ràng, chất lượng đảm bảo",
  },
  {
    icon: ThumbsUp,
    title: "Tư vấn miễn phí",
    desc: "Đội ngũ nhiệt tình, sẵn sàng hỗ trợ kỹ thuật và tư vấn lựa chọn sản phẩm",
  },
  {
    icon: Truck,
    title: "Giao hàng nhanh chóng",
    desc: "Giao tận nơi trong huyện Cam Lộ và các khu vực lân cận tại Quảng Trị",
  },
];

export function AboutGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  // Number of visible slides: 3 on lg, 1 on mobile
  // We use CSS for responsive display but track index for JS scroll
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth >= 1024 ? 3 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = GALLERY_IMAGES.length - perView;

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(maxIndex, c + 1));
  }, [maxIndex]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-linear-to-b from-green-50 to-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* ── Heading ── */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Về chúng tôi
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-5 leading-tight">
            Minh Tuyến &ndash; Người Bạn Đồng Hành
            <br className="hidden sm:block" /> Đáng Tin Cậy Của Mọi Nhà
          </h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            Cửa hàng Minh Tuyến chuyên cung cấp{" "}
            <strong className="text-green-700">vật tư tổng hợp</strong> – ống
            nước, điện dân dụng, đồ nghề biển, vật tư thủy sản và dụng cụ xây
            dựng tại{" "}
            <strong className="text-green-700">
              Thôn 2 Thanh Mỹ, xã Cam Hồng, tỉnh Quảng Trị
            </strong>
            . Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến sản phẩm
            chất lượng, giá minh bạch và dịch vụ tận tâm – để mỗi bà con đều
            được phục vụ tốt nhất.
          </p>
        </div>

        {/* ── Highlight cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Icon size={22} className="text-green-700" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-snug">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Gallery slider ── */}
        <div
          className="relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Prev button */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Ảnh trước"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-gray-700 hover:text-green-700 hover:border-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Track wrapper – clips overflow */}
          <div className="overflow-hidden rounded-2xl">
            <div
              ref={trackRef}
              className="flex gap-5 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${current} * (100% / ${perView}) - ${current} * (20px / ${perView})))`,
              }}
            >
              {GALLERY_IMAGES.map((img, i) => (
                <div
                  key={i}
                  className="shrink-0 group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                  style={{ width: `calc(${100 / perView}% - ${(20 * (perView - 1)) / perView}px)` }}
                >
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-green-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white font-semibold text-sm">{img.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            disabled={current >= maxIndex}
            aria-label="Ảnh tiếp theo"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 text-gray-700 hover:text-green-700 hover:border-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Tới ảnh ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-green-600 w-5" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
