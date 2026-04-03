# TODO_NEXT_STEPS – Việc cần làm tiếp theo

## ✅ Đã hoàn thành (config ban đầu)

- [x] Cài packages (Prisma, Auth.js, next-admin, shadcn/ui)
- [x] Prisma schema + Neon Postgres migration
- [x] next-admin v8 setup (route `/admin`, API `/api/admin`)
- [x] Auth.js v5 Credentials provider (login `/login`)
- [x] Middleware bảo vệ `/admin`
- [x] Seed admin user + categories mẫu
- [x] Tích hợp UploadThing v7 (upload ảnh từ máy tính trong Admin)
- [x] **Product form nâng cao**:
  - `price` đổi thành `String` (chấp nhận "Liên hệ" hoặc giá số)
  - Trường `origin` (xuất xứ – nhập tay)
  - Trường `imageUrl` (ảnh chính – upload qua UploadThing)
  - `description` là rich text editor với tiptap (hỗ trợ bảng, heading, list, bold, **chèn ảnh**)
  - Tất cả trường đều có placeholder rõ ràng
  - Component tái sử dụng: `PlaceholderInput`, `TiptapEditor`
  - Relation picker (Category, Manufacturer) dùng tên relation → dropdown chọn từ danh sách
  - Fix `scripts/patch-next-admin.js` để enrich relation fields với `__nextadmin.kind = "object"`
- [x] **Cải thiện giao diện Admin list/table** (31-03-2026):
  - Format cột `createdAt` → `dd-mm-yyyy` cho tất cả model
  - Ẩn cột `id` khỏi tất cả table list
  - Hiển thị thumbnail `imageUrl` inline trong list Category
  - Thêm HeroIcon phù hợp cho từng model trong sidebar nav
  - Sidebar thu/mở được trên desktop (`components/admin/sidebar-toggle.tsx`)
  - Fix search: `export const dynamic = "force-dynamic"` trong admin page
- [x] **Nâng cấp bảng Product + Dashboard Admin** (31-03-2026):
  - Thêm cột `imageUrl` (thumbnail), `unit`, `manufacturer` vào list Product
  - Hiển thị tên Category và Manufacturer thay vì ID trong bảng Product
  - Tạo Dashboard tổng quan tại `/admin` với thống kê: tổng sản phẩm/danh mục/nhà sản xuất/đánh giá
  - Dashboard hiển thị sản phẩm sắp hết hàng (stock < 5) và đánh giá chờ duyệt
  - Thêm mục "Dashboard" vào sidebar nav (icon: HomeIcon, path: `/dashboard`)
  - Server Component `AdminDashboard` fetch data trực tiếp từ Prisma

---

## 🔥 Phase 1: Hoàn thiện Admin Panel (ưu tiên cao)

### 1.1 Kiểm tra và test Admin
- [ ] Chạy `npm run dev`, truy cập `http://localhost:3000/admin`
- [ ] Đăng nhập với `admin` / `admin123`
- [ ] Test CRUD Category, Product, Manufacturer, Review
- [ ] Kiểm tra middleware redirect khi chưa login
- [x] **Fix lỗi Prisma validation hiển thị raw error**: dùng `hooks.beforeDb` + `HookError` để bắt thiếu field bắt buộc (`name`, `slug`, `price`) và trả về thông báo tiếng Việt thay vì dump lỗi Prisma thô
- [x] **Fix Admin không login được trên Vercel** (03/04/2026): chuyển middleware từ `getToken()` (next-auth/jwt v4 – chỉ đọc JWS) sang `auth` wrapper của Auth.js v5 (đọc được JWE encrypted). Tạo `lib/auth.config.ts` (edge-safe, không có prisma/bcrypt) và split từ `lib/auth.ts`.

### 1.2 Cải thiện next-admin options
- [ ] Add i18n tiếng Việt (xem `next-admin.js.org/docs/i18n`)
- [ ] Ẩn field `password` khỏi User list/edit trong next-admin
- [ ] Custom `toString` cho các model phức tạp hơn
- [ ] Thêm validators cho slug, price, stock

### 1.3 Admin Dashboard custom
- [x] Dashboard được hiển thị tại `/admin` (trang chủ admin) và `/admin/dashboard`
  - Stat cards: tổng sản phẩm, danh mục, nhà sản xuất, đánh giá
  - Danh sách sản phẩm sắp hết hàng (stock < 5)
  - Danh sách đánh giá chờ duyệt
  - Quick links truy cập nhanh các module
- [ ] Có thể bổ sung biểu đồ doanh thu sau khi có module đơn hàng

### 1.4 Tính năng reset mật khẩu Admin
- [ ] Tạo Server Action `resetPassword(userId, newPassword)`
- [ ] Tạo custom page hoặc dialog trong Admin

---

## 🌱 Phase 2: Seed Data thực tế

- [ ] Seed đủ danh mục con (ví dụ: Ống nước → Ống PVC, Ống đồng)
- [ ] Seed sản phẩm mẫu mỗi danh mục (5–10 sản phẩm mỗi loại)
- [ ] Seed manufacturers (nhà sản xuất thực tế: Tiền Phong, Bình Minh...)
- [x] Upload ảnh sản phẩm bằng URL
- [ ] Seed sản phẩm mẫu mỗi danh mục (5–10 sản phẩm mỗi loại), dùng `origin` và `imageUrl`

---

## 🛒 Phase 3: Trang khách hàng (sau khi Admin xong)

### 3.1 Layout khách hàng ✅
- [x] Header: Logo "Minh Tuyến", thanh tìm kiếm, SĐT, menu nav (Trang chủ / Về chúng tôi / Sản phẩm / Liên hệ)
- [x] Footer: thông tin cửa hàng, địa chỉ, email, SĐT
- [x] Sticky sidebar: SĐT bên trái (0912 + 0949), icon Zalo/Gmail/Maps bên phải
- [x] Responsive mobile-first (hamburger menu)
- [x] Route group `(shop)` với nested layout

### 3.2 Trang chủ ✅
- [x] Hero Slider 3 slides với gradient + text động, button "Về chúng tôi"
- [x] **About Gallery section** (03/04/2026): hiển thị giữa Hero Slider và Danh mục sản phẩm
  - Mô tả cửa hàng ấn tượng, nổi bật các USP (10 năm, hàng chính hãng, tư vấn miễn phí, giao hàng nhanh)
  - 4 highlight cards (icon + tiêu đề + mô tả ngắn)
  - Gallery 6 ảnh từ `public/images/` với animation slide-in từ trái sang phải (IntersectionObserver)
  - 3 ảnh/hàng trên desktop (lg), 1 ảnh/hàng trên mobile – hiệu ứng hover overlay
  - Component: `components/shop/about-gallery.tsx` (Client Component)
- [x] Danh mục sản phẩm: 3 cột desktop / 1 cột mobile, ảnh default nếu null
- [x] Sản phẩm nổi bật (isFeatured = true, SSR + `dynamic = "force-dynamic"` fix – 03/04/2026)
- [x] Section đánh giá cửa hàng (marquee ticker từ trái sang phải)
- [x] Form gửi đánh giá khách hàng
- [x] About summary section (bản đồ + danh sách điểm mạnh + CTA)
- [x] Contact CTA với SĐT + địa chỉ + email

### 3.3 Trang danh mục ✅
- [x] URL: `/danh-muc/[slug]`
- [x] Hiển thị 12 sản phẩm ban đầu
- [x] Nút "Xem toàn bộ X sản phẩm" → `?all=1`
- [x] Phân trang đầy đủ ở chế độ xem tất cả

### 3.4 Trang sản phẩm ✅
- [x] URL: `/san-pham/[slug]`
- [x] Gallery ảnh (ảnh chính + thumbnail)
- [x] Thông tin chi tiết: giá, tồn kho, xuất xứ, SKU, nhà sản xuất
- [x] Rich text description
- [x] Related products
- [x] CTA gọi đặt hàng

### 3.5 Trang all products ✅
- [x] URL: `/san-pham` + `?q=` (tìm kiếm) + `?danh_muc=` (lọc)
- [x] Phân trang 24 sản phẩm/trang

### 3.6 Trang "Về chúng tôi" ✅
- [x] URL: `/ve-chung-toi`
- [x] Story, giá trị cốt lõi, lĩnh vực kinh doanh, thông tin liên hệ

### 3.7 Trang Liên hệ ✅
- [x] URL: `/lien-he`
- [x] Cards: SĐT, email, địa chỉ, giờ làm việc
- [x] Google Maps placeholder
- [x] **Cập nhật link Google Maps** (03/04/2026): đổi tất cả href Google Maps sang `https://maps.app.goo.gl/vhDMdRpijQwTrG6h7` (sticky-sidebar, lien-he page)
- [x] **Fix icon Zalo** (03/04/2026): thay SVG cũ (sai) bằng SVG chính thức từ SimpleIcons (viewBox 0 0 24 24, hiển thị chữ "Zalo" stylized)

### 3.8 Đánh giá cửa hàng ✅
- [x] Schema: `Review.productId` đổi sang nullable (đánh giá chung cửa hàng)
- [x] API route `POST /api/reviews` để tiếp nhận đánh giá từ khách
- [x] Admin: Đánh giá chờ duyệt không còn hiển thị tên sản phẩm (store review)
- [x] Cập nhật next-admin-options: xóa `product` khỏi Review list/edit

---

### 3.5 SEO
- [ ] generateMetadata cho từng trang
- [ ] Open Graph image
- [ ] Sitemap

---

## 📦 Phase 4: Tính năng đặt hàng (kế hoạch xa)

- [ ] Model `Order`, `OrderItem` thêm vào schema
- [ ] Giỏ hàng (localStorage hoặc server-side)
- [ ] Form đặt hàng (tên, SĐT, địa chỉ giao)
- [ ] Quản lý đơn hàng trong Admin
- [ ] Thông báo email khi có đơn mới

---

## 🖼 Phase 5: Upload ảnh / video

- [x] Tích hợp UploadThing v7 (cloud storage, region SEA)
  - `app/api/uploadthing/core.ts` – FileRouter (bảo vệ bằng ADMIN auth)
  - `app/api/uploadthing/route.ts` – Next.js route handler
  - `lib/uploadthing.ts` – React helpers (`useUploadThing`)
  - `components/admin/image-upload-input.tsx` – Custom input cho next-admin
  - Áp dụng cho: `Category.imageUrl`, `Manufacturer.logoUrl`, `ProductImage.url`
- [ ] Drag & drop nhiều ảnh, reorder (Phase sau)
- [ ] Upload video ngắn giới thiệu sản phẩm

---

## 🚀 Deployment

- [ ] Thêm `AUTH_SECRET` production (dùng `openssl rand -base64 32`)
- [ ] Đặt `AUTH_URL` = domain chính thức (ví dụ: `https://your-app.vercel.app`) – cần thiết cho Auth.js v5 trên Vercel
- [x] Fix middleware Auth.js v5 (encrypted JWT, split-config pattern) – 03/04/2026
- [x] Fix homepage static caching – thêm `dynamic = "force-dynamic"` – 03/04/2026
- [ ] Deploy lên Vercel
- [ ] Test production với Neon database

---

## Lệnh hay dùng khi phát triển

```bash
# Chạy dev server
npm run dev

# Mở Prisma Studio (xem data GUI)
npm run db:studio

# Tạo migration sau khi sửa schema
npm run db:migrate -- --name mo-ta-thay-doi

# Seed lại data
npm run db:seed

# Build kiểm tra lỗi
npm run build
```
