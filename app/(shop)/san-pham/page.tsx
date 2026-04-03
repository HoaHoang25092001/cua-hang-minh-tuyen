// app/(shop)/san-pham/page.tsx – Trang tất cả sản phẩm với tìm kiếm & phân trang
import type { Metadata } from "next";
import { Suspense } from "react";
import { Search } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shop/product-card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sản Phẩm",
  description: "Toàn bộ sản phẩm tại Cửa hàng Minh Tuyến – Ống nước, điện dân dụng, đồ biển, vật tư thủy sản.",
};

const PAGE_SIZE = 24;

interface SearchParams {
  q?: string;
  page?: string;
  danh_muc?: string;
}

async function ProductsContent({ searchParams }: { searchParams: SearchParams }) {
  const query = searchParams.q?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));
  const categorySlug = searchParams.danh_muc || "";

  const where = {
    isActive: true,
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { description: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
        {/* Search */}
        <form method="GET" className="flex gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
              <Search size={16} />
            </button>
          </div>
          {categorySlug && <input type="hidden" name="danh_muc" value={categorySlug} />}
        </form>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/san-pham"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !categorySlug
                ? "bg-green-600 text-white border-green-600"
                : "border-gray-300 text-gray-600 hover:border-green-400"
            }`}
          >
            Tất cả
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/san-pham?danh_muc=${cat.slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                categorySlug === cat.slug
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-300 text-gray-600 hover:border-green-400"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-5">
        {query ? (
          <>
            Kết quả tìm kiếm cho <span className="font-semibold text-gray-800">&quot;{query}&quot;</span>:{" "}
          </>
        ) : (
          "Hiển thị: "
        )}
        <span className="font-semibold text-gray-800">{total}</span> sản phẩm
      </p>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p) => (
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
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">Không tìm thấy sản phẩm</p>
          <p className="text-sm mt-1">Thử từ khóa khác hoặc xem tất cả sản phẩm</p>
          <Link
            href="/san-pham"
            className="inline-block mt-4 text-sm text-green-600 hover:underline"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {page > 1 && (
            <Link
              href={`/san-pham?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(categorySlug ? { danh_muc: categorySlug } : {}),
                page: String(page - 1),
              })}`}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:border-green-500 hover:text-green-600 transition-colors"
            >
              ← Trước
            </Link>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                href={`/san-pham?${new URLSearchParams({
                  ...(query ? { q: query } : {}),
                  ...(categorySlug ? { danh_muc: categorySlug } : {}),
                  page: String(p),
                })}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 hover:border-green-500 hover:text-green-600"
                }`}
              >
                {p}
              </Link>
            );
          })}
          {page < totalPages && (
            <Link
              href={`/san-pham?${new URLSearchParams({
                ...(query ? { q: query } : {}),
                ...(categorySlug ? { danh_muc: categorySlug } : {}),
                page: String(page + 1),
              })}`}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:border-green-500 hover:text-green-600 transition-colors"
            >
              Tiếp →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="container mx-auto">
          <nav className="text-xs text-gray-400 mb-2">
            <Link href="/" className="hover:text-green-600">
              Trang chủ
            </Link>
            {" / "}
            <span className="text-gray-600">Sản phẩm</span>
          </nav>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Tất cả sản phẩm
          </h1>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
          </div>
        }
      >
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  );
}
