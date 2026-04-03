"use client";
// components/shop/sticky-sidebar.tsx – Sidebar sticky: SĐT bên trái, mạng XH bên phải

import { Phone } from "lucide-react";

// Zalo SVG icon (official from SimpleIcons)
function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12.49 10.2722v-.4496h1.3467v6.3218h-.7704a.576.576 0 01-.5763-.5729l-.0006.0005a3.273 3.273 0 01-1.9372.6321c-1.8138 0-3.2844-1.4697-3.2844-3.2823 0-1.8125 1.4706-3.2822 3.2844-3.2822a3.273 3.273 0 011.9372.6321l.0006.0005zM6.9188 7.7896v.205c0 .3823-.051.6944-.2995 1.0605l-.03.0343c-.0542.0615-.1815.206-.2421.2843L2.024 14.8h4.8948v.7682a.5764.5764 0 01-.5767.5761H0v-.3622c0-.4436.1102-.6414.2495-.8476L4.8582 9.23H.1922V7.7896h6.7266zm8.5513 8.3548a.4805.4805 0 01-.4803-.4798v-7.875h1.4416v8.3548H15.47zM20.6934 9.6C22.52 9.6 24 11.0807 24 12.9044c0 1.8252-1.4801 3.306-3.3066 3.306-1.8264 0-3.3066-1.4808-3.3066-3.306 0-1.8237 1.4802-3.3044 3.3066-3.3044zm-10.1412 5.253c1.0675 0 1.9324-.8645 1.9324-1.9312 0-1.065-.865-1.9295-1.9324-1.9295s-1.9324.8644-1.9324 1.9295c0 1.0667.865 1.9312 1.9324 1.9312zm10.1412-.0033c1.0737 0 1.945-.8707 1.945-1.9453 0-1.073-.8713-1.9436-1.945-1.9436-1.0753 0-1.945.8706-1.945 1.9436 0 1.0746.8697 1.9453 1.945 1.9453z"/>
    </svg>
  );
}

// Gmail SVG icon
function GmailIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5" fill="currentColor">
      <path d="M8 10h32l-16 14L8 10zm-2 2v24h36V12L24 26 10 12H6z"/>
    </svg>
  );
}

// Google Maps icon
function MapsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  );
}

export function StickySidebar() {
  return (
    <>
      {/* LEFT – Sticky phone numbers */}
      <div className="fixed left-0 bottom-24 z-40 flex flex-col gap-2 pl-1">
        <a
          href="tel:0912134773"
          className="flex items-center gap-2 bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-r-full shadow-lg hover:bg-green-700 transition-all hover:pl-4 group"
        >
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
            <Phone size={14} className="text-green-600" />
          </div>
          <span className="hidden sm:inline">0912.134.773</span>
        </a>
        <a
          href="tel:0949234773"
          className="flex items-center gap-2 bg-orange-500 text-white text-xs font-semibold px-3 py-2 rounded-r-full shadow-lg hover:bg-orange-600 transition-all hover:pl-4 group"
        >
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0">
            <Phone size={14} className="text-orange-500" />
          </div>
          <span className="hidden sm:inline">0949.234.773</span>
        </a>
      </div>

      {/* RIGHT – Social / contact icons */}
      <div className="fixed right-3 bottom-24 z-40 flex flex-col gap-3">
        {/* Zalo */}
        <a
          href="https://zalo.me/0912134773"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Zalo: 0912.134.773"
          className="w-11 h-11 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all hover:scale-110"
        >
          <ZaloIcon />
        </a>

        {/* Gmail */}
        <a
          href="mailto:minhtuyen73QB@gmail.com"
          title="Email: minhtuyen73QB@gmail.com"
          className="w-11 h-11 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110"
        >
          <GmailIcon />
        </a>

        {/* Google Maps */}
        <a
          href="https://maps.app.goo.gl/vhDMdRpijQwTrG6h7"
          target="_blank"
          rel="noopener noreferrer"
          title="Xem bản đồ cửa hàng"
          className="w-11 h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110"
        >
          <MapsIcon />
        </a>
      </div>
    </>
  );
}
