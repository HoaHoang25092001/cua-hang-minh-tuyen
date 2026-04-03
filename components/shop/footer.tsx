// components/shop/footer.tsx – Footer cửa hàng
import Link from "next/link";
import { Phone, Mail, MapPin, ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">
                  Minh Tuyến
                </div>
                <div className="text-xs text-gray-400 leading-tight">
                  Đồ Dân Dụng · Vật Tư Tổng Hợp
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cung cấp đồ dân dụng, vật tư tổng hợp chất lượng cao cho bà con
              tại Quảng Trị. Uy tín và chất lượng luôn là tiêu chí hàng đầu.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Về chúng tôi", href: "/ve-chung-toi" },
                { label: "Sản phẩm", href: "/san-pham" },
                { label: "Liên hệ", href: "/lien-he" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-green-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-green-400 shrink-0 mt-0.5" />
                <span>
                  Thôn 2 Thanh Mỹ, xã Cam Hồng, Tỉnh Quảng Trị
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-green-400 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <a
                    href="tel:0912134773"
                    className="hover:text-green-400 transition-colors"
                  >
                    0912.134.773
                  </a>
                  <a
                    href="tel:0949234773"
                    className="hover:text-green-400 transition-colors"
                  >
                    0949.234.773
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-green-400 shrink-0" />
                <a
                  href="mailto:minhtuyen73QB@gmail.com"
                  className="hover:text-green-400 transition-colors break-all"
                >
                  minhtuyen73QB@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Cửa hàng Minh Tuyến. Tất cả quyền được bảo lưu.</span>
          <span>Thôn 2 Thanh Mỹ, xã Cam Hồng, Tỉnh Quảng Trị</span>
        </div>
      </div>
    </footer>
  );
}
