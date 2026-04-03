// components/shop/product-card.tsx – Card hiển thị sản phẩm
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: number | null;
  imageUrl?: string | null;
  unit?: string | null;
  origin?: string | null;
  categoryName?: string;
}

export function ProductCard({
  name,
  slug,
  price,
  comparePrice,
  imageUrl,
  unit,
  origin,
  categoryName,
}: ProductCardProps) {
  // Calculate discount % if comparePrice exists and price is numeric
  const priceNum = parseFloat(price.replace(/[^\d.]/g, ""));
  const discountPct =
    comparePrice && !isNaN(priceNum) && comparePrice > priceNum
      ? Math.round(((comparePrice - priceNum) / comparePrice) * 100)
      : null;

  return (
    <Link
      href={`/san-pham/${slug}`}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Package size={40} className="text-gray-300" />
          </div>
        )}
        {discountPct && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
            -{discountPct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {categoryName && (
          <span className="text-xs text-gray-400 mb-1">{categoryName}</span>
        )}
        <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-green-700 transition-colors flex-1">
          {name}
        </h3>
        <div className="flex items-end justify-between mt-auto">
          <div>
            <span className="text-green-600 font-bold text-base">
              {price}
              {unit && (
                <span className="text-xs text-gray-400 font-normal ml-1">
                  /{unit}
                </span>
              )}
            </span>
            {comparePrice && !isNaN(priceNum) && comparePrice > priceNum && (
              <div className="text-xs text-gray-400 line-through">
                {comparePrice.toLocaleString("vi-VN")}đ
              </div>
            )}
          </div>
          {origin && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
              {origin}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
