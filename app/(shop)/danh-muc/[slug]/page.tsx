// app/(shop)/danh-muc/[slug]/page.tsx – Trang sản phẩm theo danh mục
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/shop/product-card";

const INITIAL_LIMIT = 12;
const PAGE_SIZE = 24;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; all?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!cat) return { title: "Danh mục không tồn tại" };
  return {
    title: cat.name,
    description:
      cat.description || `Sản phẩm danh mục ${cat.name} tại Cửa hàng Minh Tuyến`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr, all } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      children: {
        where: { isActive: true },
        select: { id: true, name: true, slug: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!category) notFound();

  const showAll = all === "1";
  const page = Math.max(1, parseInt(pageStr || "1", 10));

  const where = {
    isActive: true,
    OR: [
      { category: { slug } },
      { category: { parent: { slug } } },
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: showAll ? (page - 1) * PAGE_SIZE : 0,
      take: showAll ? PAGE_SIZE : INITIAL_LIMIT,
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
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Category hero */}
      <div className="bg-white border-b border-gray-200 py-10 px-4">
        <div className="container mx-auto">
          <nav className="text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-green-600">
              Trang chủ
            </Link>
            {" / "}
            <Link href="/san-pham" className="hover:text-green-600">
              Sản phẩm
            </Link>
            {" / "}
            <span className="text-gray-600">{category.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
              <Tag size={28} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-500 text-sm mt-1">{category.description}</p>
              )}
            </div>
          </div>

          {/* Subcategory chips */}
          {category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category.children.map((child) => (
                <Link
                  key={child.slug}
                  href={`/danh-muc/${child.slug}`}
                  className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 hover:bg-green-100 transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-10">
        {total === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Tag size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Chưa có sản phẩm nào</p>
            <p className="text-sm mt-1">Vui lòng quay lại sau</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {showAll ? `Tất cả` : `Đang hiển thị ${Math.min(INITIAL_LIMIT, total)}/`}
              <span className="font-semibold text-gray-800">
                {showAll ? ` ${total}` : total} sản phẩm
              </span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

            {/* Show all / Pagination */}
            {!showAll && total > INITIAL_LIMIT && (
              <div className="text-center mt-10">
                <Link
                  href={`/danh-muc/${slug}?all=1`}
                  className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow-md"
                >
                  Xem toàn bộ {total} sản phẩm →
                </Link>
              </div>
            )}

            {showAll && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10 flex-wrap">
                {page > 1 && (
                  <Link
                    href={`/danh-muc/${slug}?all=1&page=${page - 1}`}
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
                      href={`/danh-muc/${slug}?all=1&page=${p}`}
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
                    href={`/danh-muc/${slug}?all=1&page=${page + 1}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:border-green-500 hover:text-green-600 transition-colors"
                  >
                    Tiếp →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
