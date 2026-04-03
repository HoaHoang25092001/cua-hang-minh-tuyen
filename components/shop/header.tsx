"use client";
// components/shop/header.tsx – Header cửa hàng (logo, tìm kiếm, menu)

import Link from "next/link";
import { useState } from "react";
import { Search, Phone, Menu, X, ShoppingBag } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/ve-chung-toi" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Liên hệ", href: "/lien-he" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(query.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top banner */}
      <div className="bg-green-700 text-white py-1.5 px-4 text-xs hidden sm:flex justify-between items-center">
        <span>🌿 Chào mừng đến Cửa hàng Minh Tuyến – Uy tín, Chất lượng, An toàn</span>
        <a
          href="tel:0912134773"
          className="flex items-center gap-1 hover:text-green-200 transition-colors"
        >
          <Phone size={12} />
          <span>0912.134.773</span>
        </a>
      </div>

      {/* Main header row */}
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-green-700 transition-colors">
            <ShoppingBag size={22} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-green-700 leading-tight">
              Minh Tuyến
            </div>
            <div className="text-[10px] text-gray-500 leading-tight hidden sm:block">
              Đồ Dân Dụng · Vật Tư Tổng Hợp
            </div>
          </div>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-11 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Phone (desktop) */}
        <a
          href="tel:0912134773"
          className="hidden lg:flex items-center gap-2 text-green-700 font-bold shrink-0 hover:text-green-600 transition-colors"
        >
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Phone size={16} className="text-green-600" />
          </div>
          <span className="text-sm">0912.134.773</span>
        </a>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-green-700 transition-colors"
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Nav bar */}
      <nav className={`bg-green-700 ${menuOpen ? "block" : "hidden md:block"}`}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row md:items-center">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-5 text-white hover:bg-green-600 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Mobile phone */}
            <li className="md:hidden border-t border-green-600 mt-1">
              <a
                href="tel:0912134773"
                className="flex items-center gap-2 py-3 px-5 text-white text-sm font-medium"
              >
                <Phone size={14} />
                0912.134.773
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
