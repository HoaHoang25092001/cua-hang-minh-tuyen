// app/(shop)/ve-chung-toi/page.tsx – Trang giới thiệu cửa hàng Minh Tuyến
import type { Metadata } from "next";
import { CheckCircle, Phone, Mail, MapPin, Clock, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Về Chúng Tôi",
  description:
    "Cửa hàng Minh Tuyến – Chuyên cung cấp đồ dân dụng, vật tư tổng hợp tại Quảng Trị. Uy tín, chất lượng, an toàn.",
};

const VALUES = [
  {
    icon: "🏆",
    title: "Chính hãng & Uy tín",
    desc: "100% sản phẩm có nguồn gốc rõ ràng, đảm bảo chính hãng từ các nhà sản xuất uy tín.",
  },
  {
    icon: "💰",
    title: "Giá cả hợp lý",
    desc: "Cam kết giá cả cạnh tranh, minh bạch, không thu thêm phụ phí ẩn.",
  },
  {
    icon: "🤝",
    title: "Phục vụ tận tâm",
    desc: "Đội ngũ nhân viên nhiệt tình, tư vấn miễn phí và hỗ trợ kỹ thuật sau bán hàng.",
  },
  {
    icon: "🚀",
    title: "Giao hàng nhanh",
    desc: "Giao hàng nhanh chóng trong phạm vi tỉnh Quảng Trị và các vùng lân cận.",
  },
];

const CATEGORIES = [
  { icon: "🔧", name: "Ống nước & phụ kiện", desc: "Ống PVC, HDPE, co nối, tê, khớp nối..." },
  { icon: "⚡", name: "Điện dân dụng", desc: "Dây điện, công tắc, ổ cắm, CB, đèn..." },
  { icon: "⛵", name: "Đồ biển", desc: "Lưới, dây neo, phao, đèn tín hiệu..." },
  { icon: "🦐", name: "Đồ nuôi tôm cá", desc: "Máy sục khí, lưới ao, thức ăn, thuốc..." },
  { icon: "🏗️", name: "Dụng cụ xây dựng", desc: "Bu lông, vít, đinh, sơn, keo..." },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-emerald-600 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Cửa Hàng Minh Tuyến
          </h1>
          <p className="text-xl text-green-100 mb-6">
            Chính hãng · Uy tín · Chất lượng · An toàn · Đáng tin cậy
          </p>
          <p className="text-green-100 max-w-2xl mx-auto leading-relaxed">
            Hơn 10 năm phục vụ bà con tại Quảng Trị, chúng tôi tự hào là địa
            chỉ tin cậy cung cấp đồ dân dụng và vật tư tổng hợp chất lượng cao
            với giá cả hợp lý.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Câu chuyện của chúng tôi
          </h2>
          <div className="prose max-w-none text-gray-600 text-base leading-relaxed space-y-4">
            <p>
              Cửa hàng Minh Tuyến được thành lập với mục tiêu mang đến cho bà
              con tại Quảng Trị một địa chỉ mua sắm đồ dân dụng và vật tư tổng
              hợp uy tín, chất lượng và tiện lợi.
            </p>
            <p>
              Với kinh nghiệm nhiều năm trong lĩnh vực cung cấp vật tư – đồ dân
              dụng, chúng tôi hiểu rõ nhu cầu của khách hàng địa phương. Từ các
              dụng cụ thiết yếu cho nghề biển, đến vật tư nuôi trồng thủy sản,
              ống nước, điện dân dụng và dụng cụ xây dựng – tất cả đều có tại
              Minh Tuyến.
            </p>
            <p>
              Chúng tôi cam kết: <strong>Chính hãng – Uy tín – Chất lượng –
              An toàn – Đáng tin cậy</strong>. Mỗi sản phẩm đến tay khách hàng
              đều được kiểm tra kỹ lưỡng và có nguồn gốc rõ ràng.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start"
              >
                <span className="text-3xl">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
            Lĩnh vực kinh doanh
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="flex items-start gap-3 bg-green-50 rounded-xl p-4 border border-green-100"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-gray-800">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
                </div>
              </div>
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

      {/* Contact info */}
      <section className="py-14 px-4 bg-green-700 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Thông tin liên hệ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-xl mx-auto mb-8">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-green-300 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-0.5">Địa chỉ</p>
                <p className="text-green-100">
                  Thôn 2 Thanh Mỹ, xã Cam Hồng, Tỉnh Quảng Trị
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-green-300 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-0.5">Điện thoại</p>
                <a href="tel:0912134773" className="text-green-100 hover:text-white block">
                  0912.134.773
                </a>
                <a href="tel:0949234773" className="text-green-100 hover:text-white block">
                  0949.234.773
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-green-300 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-0.5">Email</p>
                <a
                  href="mailto:minhtuyen73QB@gmail.com"
                  className="text-green-100 hover:text-white break-all"
                >
                  minhtuyen73QB@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-green-300 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-0.5">Giờ làm việc</p>
                <p className="text-green-100">Thứ 2 – Chủ nhật</p>
                <p className="text-green-100">7:00 – 18:00</p>
              </div>
            </div>
          </div>
          <a
            href="tel:0912134773"
            className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-all shadow-lg"
          >
            📞 Liên hệ ngay
          </a>
        </div>
      </section>
    </div>
  );
}
