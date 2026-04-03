// app/(shop)/san-pham/[slug]/page.tsx – Trang chi tiết sản phẩm
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Tag,
  Phone,
  ChevronRight,
  MapPin,
  Factory,
  Layers,
} from "lucide-react";
import prisma from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Sản phẩm không tồn tại" };
  return {
    title: product.name,
    description: product.description
      ? product.description.replace(/<[^>]+>/g, "").slice(0, 155)
      : `${product.name} tại Cửa hàng Minh Tuyến`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true } },
      manufacturer: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || !product.isActive) notFound();

  // Related products
  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    orderBy: { isFeatured: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      imageUrl: true,
      unit: true,
    },
  });

  const allImages = [
    ...(product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : []),
    ...product.images.map((img) => ({ url: img.url, alt: img.alt || product.name })),
  ];

  // Discount
  const priceNum = parseFloat(product.price.replace(/[^\d.]/g, ""));
  const discountPct =
    product.comparePrice && !isNaN(priceNum) && product.comparePrice > priceNum
      ? Math.round(((product.comparePrice - priceNum) / product.comparePrice) * 100)
      : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <nav className="container mx-auto flex items-center gap-1 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-green-600">
            Trang chủ
          </Link>
          <ChevronRight size={12} />
          <Link href="/san-pham" className="hover:text-green-600">
            Sản phẩm
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/danh-muc/${product.category.slug}`}
            className="hover:text-green-600"
          >
            {product.category.name}
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 line-clamp-1">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image gallery */}
            <div>
              <div className="relative h-72 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 mb-3">
                {allImages[0] ? (
                  <Image
                    src={allImages[0].url}
                    alt={allImages[0].alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package size={72} className="text-gray-200" />
                  </div>
                )}
                {discountPct && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                    -{discountPct}%
                  </span>
                )}
              </div>

              {/* Thumbnail row */}
              {allImages.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {allImages.slice(1, 6).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-green-400 transition-colors"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              {/* Category badge */}
              <Link
                href={`/danh-muc/${product.category.slug}`}
                className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100 mb-3 hover:bg-green-100 transition-colors"
              >
                <Tag size={12} />
                {product.category.name}
              </Link>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-green-600">
                    {product.price}
                    {product.unit && (
                      <span className="text-base text-gray-400 font-normal ml-1">
                        /{product.unit}
                      </span>
                    )}
                  </span>
                  {product.comparePrice && !isNaN(priceNum) && product.comparePrice > priceNum && (
                    <span className="text-lg text-gray-400 line-through">
                      {product.comparePrice.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                </div>
                {product.price === "Liên hệ" && (
                  <p className="text-xs text-orange-500 mt-1">
                    Vui lòng liên hệ để biết giá tốt nhất
                  </p>
                )}
              </div>

              {/* Meta info */}
              <div className="space-y-2.5 mb-6 text-sm">
                {product.sku && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Layers size={16} className="text-gray-400 shrink-0" />
                    <span>
                      Mã SP: <span className="font-medium text-gray-800">{product.sku}</span>
                    </span>
                  </div>
                )}
                {product.origin && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-gray-400 shrink-0" />
                    <span>
                      Xuất xứ:{" "}
                      <span className="font-medium text-gray-800">{product.origin}</span>
                    </span>
                  </div>
                )}
                {product.manufacturer && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Factory size={16} className="text-gray-400 shrink-0" />
                    <span>
                      Thương hiệu:{" "}
                      <span className="font-medium text-gray-800">
                        {product.manufacturer.name}
                      </span>
                    </span>
                  </div>
                )}
                {product.stock > 0 ? (
                  <div className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Còn hàng ({product.stock} {product.unit || "sản phẩm"})
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Hết hàng – Liên hệ đặt trước
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:0912134773"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-md flex-1"
                >
                  <Phone size={18} />
                  Gọi đặt hàng: 0912.134.773
                </a>
                <a
                  href="tel:0949234773"
                  className="flex items-center justify-center gap-2 border-2 border-orange-400 text-orange-600 font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition-all flex-1"
                >
                  <Phone size={18} />
                  0949.234.773
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Mô tả sản phẩm
              </h2>
              <div
                className="prose-product text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/san-pham/${p.slug}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative h-32 bg-gray-50 overflow-hidden">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package size={28} className="text-gray-200" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {p.name}
                    </p>
                    <p className="text-green-600 text-xs font-bold mt-1">
                      {p.price}
                      {p.unit && (
                        <span className="text-gray-400 font-normal">
                          /{p.unit}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
