// app/page.tsx – Trang chủ cửa hàng Minh Tuyến
// force-dynamic: trang chủ fetch dữ liệu từ DB (sản phẩm nổi bật, danh mục, đánh giá)
// không được cache tĩnh trên Vercel — phải luôn render server-side để cập nhật ngay
export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { Tag, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import prisma from "@/lib/prisma";
import { ShopLayout } from "@/components/shop/shop-layout";
import { HeroSlider } from "@/components/shop/hero-slider";
import { ProductCard } from "@/components/shop/product-card";
import { ReviewsSection } from "@/components/shop/reviews-section";
import { AboutGallery } from "@/components/shop/about-gallery";

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidImageSrc(src: string | null | undefined): src is string {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

// ── Danh mục sản phẩm section ─────────────────────────────────────────────────
function CategorySection({
  categories,
}: {
  categories: { id: string; name: string; slug: string; imageUrl: string | null }[];
}) {
  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-gray-500 mt-2">
            Khám phá đa dạng sản phẩm theo từng danh mục
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
                {isValidImageSrc(cat.imageUrl) ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Tag size={52} className="text-green-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors text-lg">
                  {cat.name}
                </h3>
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1 font-medium">
                  Xem sản phẩm <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/san-pham"
            className="inline-block border-2 border-green-600 text-green-700 font-semibold px-8 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── About summary section ─────────────────────────────────────────────────────
function AboutSection() {
  const features = [
    "Sản phẩm chính hãng, có nguồn gốc rõ ràng",
    "Giá cả cạnh tranh, hợp lý cho bà con",
    "Tư vấn nhiệt tình, hỗ trợ kỹ thuật",
    "Giao hàng nhanh chóng tại Quảng Trị",
    "Đa dạng mặt hàng: ống nước, điện, đồ biển, thủy sản",
    "Hoạt động uy tín từ năm 2010",
  ];

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Google Map */}
          <div className="relative h-80 lg:h-full min-h-[320px] rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps?q=17.2618096,106.7963335&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ Cửa hàng Minh Tuyến"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Về chúng tôi
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Cửa Hàng Minh Tuyến
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Cửa hàng Minh Tuyến chuyên cung cấp đồ dân dụng, vật tư tổng hợp
              tại Thôn 2 Thanh Mỹ, xã Cam Hồng, tỉnh Quảng Trị. Với hơn 10 năm
              kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng những sản
              phẩm chất lượng với giá cả hợp lý và dịch vụ tận tâm nhất.
            </p>
            <ul className="space-y-2.5 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/ve-chung-toi"
              className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md"
            >
              Tìm hiểu thêm →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact CTA section ───────────────────────────────────────────────────────
function ContactCTA() {
  return (
    <section className="py-14 bg-green-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          LIÊN HỆ VỚI MINH TUYẾN NGAY
        </h2>
        <p className="text-green-100 max-w-xl mx-auto mb-8 text-base">
          Uy tín và chất lượng sản phẩm luôn là tiêu chí số 1 của chúng tôi.
          Hãy liên hệ cùng hợp tác.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Phone size={22} />
            </div>
            <div className="text-sm">
              <div className="font-bold">0912.134.773</div>
              <div className="font-bold">0949.234.773</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin size={22} />
            </div>
            <div className="text-sm text-center">
              Thôn 2 Thanh Mỹ, xã Cam Hồng,
              <br />
              Tỉnh Quảng Trị
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Mail size={22} />
            </div>
            <div className="text-sm break-all">minhtuyen73QB@gmail.com</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:0912134773"
            className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-all shadow-lg"
          >
            📞 Gọi ngay: 0912.134.773
          </a>
          <Link
            href="/lien-he"
            className="inline-block border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-all"
          >
            Xem thông tin liên hệ
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [categories, featuredProducts, approvedReviews] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, imageUrl: true },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        imageUrl: true,
        unit: true,
        origin: true,
        category: { select: { name: true } },
      },
    }),
    prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        authorName: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <ShopLayout>
      {/* Hero Slider */}
      <HeroSlider />

      {/* About Us Gallery */}
      <AboutGallery />

      {/* Category Grid */}
      <CategorySection categories={categories} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Sản Phẩm Nổi Bật
              </h2>
              <p className="text-gray-500 mt-2">
                Những sản phẩm được khách hàng yêu thích nhất
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  comparePrice={p.comparePrice}
                  imageUrl={p.imageUrl}
                  unit={p.unit}
                  origin={p.origin}
                  categoryName={p.category.name}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/san-pham"
                className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md"
              >
                Xem tất cả sản phẩm →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <ReviewsSection reviews={approvedReviews} />

      {/* About Summary */}
      <AboutSection />

      {/* Contact CTA */}
      <ContactCTA />
    </ShopLayout>
  );
}

