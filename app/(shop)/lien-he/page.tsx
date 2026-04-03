// app/(shop)/lien-he/page.tsx – Trang liên hệ
import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description:
    "Liên hệ với Cửa hàng Minh Tuyến – Điện thoại: 0912.134.773 | 0949.234.773. Thôn 2 Thanh Mỹ, xã Cam Hồng, Quảng Trị.",
};

const CONTACT_ITEMS = [
  {
    icon: Phone,
    title: "Điện thoại",
    lines: [
      { text: "0912.134.773", href: "tel:0912134773" },
      { text: "0949.234.773", href: "tel:0949234773" },
    ],
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mail,
    title: "Email",
    lines: [{ text: "minhtuyen73QB@gmail.com", href: "mailto:minhtuyen73QB@gmail.com" }],
    color: "bg-red-100 text-red-600",
  },
  {
    icon: MapPin,
    title: "Địa chỉ",
    lines: [
      {
        text: "Cửa hàng Minh Tuyến, Thôn 2 Thanh Mỹ, xã Cam Hồng, Tỉnh Quảng Trị",
        href: "https://maps.app.goo.gl/vhDMdRpijQwTrG6h7",
      },
    ],
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Clock,
    title: "Giờ làm việc",
    lines: [
      { text: "Thứ 2 – Chủ nhật", href: null },
      { text: "7:00 – 18:00", href: null },
    ],
    color: "bg-orange-100 text-orange-600",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-emerald-600 text-white py-16 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            LIÊN HỆ VỚI MINH TUYẾN NGAY
          </h1>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Uy tín và chất lượng sản phẩm luôn là tiêu chí số 1 của chúng tôi.
            Hãy liên hệ cùng hợp tác.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CONTACT_ITEMS.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} mb-4`}
                >
                  <item.icon size={22} />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <div className="space-y-1">
                  {item.lines.map((line) =>
                    line.href ? (
                      <a
                        key={line.text}
                        href={line.href}
                        target={line.href.startsWith("http") ? "_blank" : undefined}
                        rel={line.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block text-sm text-green-700 hover:text-green-600 font-medium transition-colors"
                      >
                        {line.text}
                      </a>
                    ) : (
                      <p key={line.text} className="text-sm text-gray-600">
                        {line.text}
                      </p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Gọi cho chúng tôi ngay hôm nay
          </h2>
          <p className="text-gray-500 mb-8">
            Đội ngũ nhân viên luôn sẵn sàng tư vấn và giải đáp mọi thắc mắc của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0912134773"
              className="flex items-center justify-center gap-3 bg-green-600 text-white font-bold px-8 py-4 rounded-full hover:bg-green-700 transition-all shadow-lg text-lg"
            >
              <Phone size={22} />
              0912.134.773
            </a>
            <a
              href="tel:0949234773"
              className="flex items-center justify-center gap-3 bg-orange-500 text-white font-bold px-8 py-4 rounded-full hover:bg-orange-600 transition-all shadow-lg text-lg"
            >
              <Phone size={22} />
              0949.234.773
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Hoặc email:{" "}
            <a
              href="mailto:minhtuyen73QB@gmail.com"
              className="text-green-600 hover:underline"
            >
              minhtuyen73QB@gmail.com
            </a>
          </p>
        </div>
      </section>

      {/* Map embed placeholder */}
      <section className="pb-14 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl h-64 flex items-center justify-center border border-green-200">
            <div className="text-center text-green-700">
              <MapPin size={36} className="mx-auto mb-2" />
              <p className="font-semibold">Bản đồ cửa hàng</p>
              <p className="text-sm text-green-600 mt-1">
                Thôn 2 Thanh Mỹ, xã Cam Hồng, Tỉnh Quảng Trị
              </p>
              <a
                href="https://maps.app.goo.gl/vhDMdRpijQwTrG6h7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm bg-white text-green-700 font-semibold px-5 py-2 rounded-full hover:bg-green-50 transition border border-green-300 shadow-sm"
              >
                Xem trên Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
