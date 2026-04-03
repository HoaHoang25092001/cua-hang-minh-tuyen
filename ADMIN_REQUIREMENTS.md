# ADMIN_REQUIREMENTS – Yêu cầu giao diện Admin

## Tổng quan

Admin panel sử dụng **next-admin v8** (tự động generate CRUD từ Prisma schema) và có thể bổ sung **custom pages** cho các tính năng đặc biệt.

**URL Admin**: `/admin`  
**Bảo vệ**: Chỉ user có `role = ADMIN` mới truy cập được

### Cải tiến giao diện đã thực hiện
- ✅ Cột `createdAt` format `dd-mm-yyyy` cho tất cả table
- ✅ Ẩn cột `id` khỏi tất cả table list
- ✅ Thumbnail `imageUrl` hiển thị inline trong list Category
- ✅ HeroIcon cho từng mục trong sidebar navigation
- ✅ Sidebar thu/mở được trên desktop (`SidebarToggle`)
- ✅ Search hoạt động đúng với `force-dynamic` rendering
- ✅ Bảng Product: hiển thị thumbnail ảnh, cột `unit`, `manufacturer` (tên)
- ✅ Bảng Product: `category` và `manufacturer` hiển thị tên thay vì ID
- ✅ Dashboard tổng quan tại `/admin` và `/admin/dashboard`: stat cards, sản phẩm sắp hết hàng, đánh giá chờ duyệt, quick links

---

## Module quản lý đã có (next-admin tự tạo)

### 0. Dashboard tổng quan

**URL**: `/admin` (trang chủ) và `/admin/dashboard` (sidebar link)  
**Component**: `components/admin/admin-dashboard.tsx` (Server Component)

**Nội dung hiển thị**:
- [x] Stat cards: Tổng sản phẩm (đang bán / nổi bật), Danh mục (hoạt động), Nhà sản xuất, Đánh giá (chờ duyệt)
- [x] Bảng sản phẩm sắp hết hàng (stock < 5): tên, giá, số lượng tồn
- [x] Danh sách đánh giá chờ duyệt (mới nhất, tối đa 8): tác giả, số sao, tên sản phẩm
- [x] Quick links truy cập nhanh: Product, Category, Manufacturer, Review, User
- [ ] Biểu đồ doanh thu (sau khi có module đơn hàng)

---

### 1. Quản lý Loại hàng / Danh mục (`Category`)

**Mục đích**: Phân loại sản phẩm theo nhóm
**Danh mục ví dụ**:
- 🔧 Ống nước (Ống PVC, Ống HDPE, Ống đồng, Co nối, Tê, Khớp nối...)
- ⚡ Điện dân dụng (Dây điện, Công tắc, Ổ cắm, CB, Aptomat, Đèn...)
- ⛵ Đồ biển (Lưới, Dây neo, Phao, Đèn tín hiệu, Ắc quy thuyền...)
- 🦐 Đồ nuôi tôm cá (Máy sục khí, Lưới ao, Thức ăn, Thuốc, Oxy viên...)
- 🏗 Dụng cụ xây dựng (Bu lông, Vít, Đinh, Sơn, Keo...)

**CRUD cần**:
- [x] Thêm / Sửa / Xóa danh mục
- [x] Phân cấp cha – con (Ống nước → Ống PVC)
- [x] Bật/tắt hiển thị (`isActive`)
- [x] Sắp xếp thứ tự (`sortOrder`)
  - [x] Upload ảnh đại diện qua UploadThing

### 2. Quản lý Sản phẩm (`Product`)

**CRUD cần**:
- [x] Thêm / Sửa / Xóa sản phẩm
- [x] Gán danh mục và nhà sản xuất
- [x] Quản lý giá bán (text hoặc số, VD: "Liên hệ"), giá gốc, tồn kho
- [x] Mô tả sản phẩm bằng rich text editor (tiptap, hỗ trợ bảng, **chèn ảnh từ máy tính**)
- [x] Chọn danh mục (Category) qua relation picker
- [x] Chọn nhà sản xuất (Manufacturer) qua relation picker
- [x] Nhập xuất xứ sản phẩm (trường `origin`, tự nhập)
- [x] Upload ảnh chính sản phẩm qua UploadThing (`imageUrl`)
- [x] Bật/tắt hiển thị, đánh dấu nổi bật
- [x] Placeholder đầy đủ cho tất cả các trường input
- [x] **Validation lỗi tiếng Việt**: `hooks.beforeDb` bắt trường bắt buộc (`name`, `slug`, `price`) và trả thông báo lỗi rõ ràng thay vì raw Prisma error
- [x] **Bảng list hiển thị**: thumbnail ảnh, tên, giá, đơn vị (`unit`), tồn kho, trạng thái, danh mục (tên), nhà sản xuất (tên), ngày tạo
**Trường quan trọng**:
- `price` (String): Giá bán linh hoạt – số hoặc văn bản ("Liên hệ", "250.000đ/mét")
- `comparePrice` (Float?): Giá gốc để tính % giảm giá
- `unit`: Đơn vị bán (cái, mét, cuộn, kg, bộ...)
- `stock`: Tồn kho thực tế
- `sku`: Mã vạch / mã nội bộ
- `origin`: Xuất xứ sản phẩm (nhập tay)
- `imageUrl`: Ảnh chính (upload qua UploadThing)
- `description`: Rich text HTML (tiptap, có toolbar + table + **chèn ảnh qua UploadThing**)

---

### 3. Quản lý Nhà sản xuất (`Manufacturer`)

**CRUD cần**:
- [x] Thêm / Sửa / Xóa nhà sản xuất / thương hiệu
- [x] Logo, website, mô tả
- [ ] Liên kết với sản phẩm

---

### 5. Quản lý Đánh giá (`Review`) – cập nhật 02/04/2026

**Thay đổi**: Đánh giá không còn gắn với sản phẩm — là đánh giá **chung về cửa hàng**.
- `productId` đổi sang **nullable** (`String?`) — null = store review
- Admin list chỉ hiển thị: `authorName`, `rating`, `isApproved`, `createdAt`
- Khách hàng gửi đánh giá qua form trên trang chủ → `POST /api/reviews`
- Admin duyệt trước khi hiển thị công khai

**CRUD cần**:
- [x] Xem danh sách user
- [x] Tạo user Admin mới
- [x] Thay đổi role
- [ ] Reset mật khẩu (cần custom page)
- **Lưu ý**: Không hiển thị field `password` trong list, chỉ cho phép đặt lại từ form riêng

---

### 5. Quản lý Đánh giá (`Review`)

**CRUD cần**:
- [x] Xem tất cả đánh giá
- [x] Duyệt / Ẩn đánh giá (`isApproved`)
- [x] Xóa đánh giá spam
- [x] Filter: Chờ duyệt / Đã duyệt

---

### 6. Quản lý Ảnh sản phẩm (`ProductImage`)

**CRUD cần**:
- [x] Xem, sửa, xóa ảnh
- [x] Upload từ máy tính qua UploadThing
- [ ] Sắp xếp thứ tự ảnh drag & drop
---

## Custom Pages cần làm thêm

### `/admin/custom/upload-image`
~~Upload ảnh sản phẩm lên storage~~ – **Không cần nữa**: đã tích hợp UploadThing trực tiếp vào next-admin qua `ImageUploadInput`

### `/admin/custom/reset-password`
Form đặt lại mật khẩu cho user

### `/admin/custom/dashboard` (trang chủ Admin)
- Tổng sản phẩm, danh mục, đánh giá chờ duyệt
- Sản phẩm sắp hết hàng (stock < 5)
- Đánh giá mới nhất chờ duyệt

---

## UI Guidelines cho Admin

- Dùng **next-admin** cho mọi CRUD thông thường  
- Dùng **shadcn/ui** cho custom pages (Button, Card, Table, Form, Dialog, Sheet)
- Màu theme: Zinc (neutral)
- Ngôn ngữ giao diện: Tiếng Việt (có thể config i18n next-admin)

---

## Tính năng Upload

- **Phase 1**: ~~Nhập URL ảnh thủ công~~ (vẫn hỗ trợ nhưng không cần nữa)
- **Phase 2 ✅**: Upload lên UploadThing (cloud, region SEA)
  - Custom input `ImageUploadInput` tích hợp vào next-admin
  - Áp dụng cho: `Category.imageUrl`, `Manufacturer.logoUrl`, `ProductImage.url`, `Product.imageUrl`
  - Bảo vệ bằng auth middleware (chỉ ADMIN)
- **Phase 3**: Drag & drop nhiều ảnh, preview, sắp xếp
- **Phase 4**: Upload video ngắn giới thiệu sản phẩm
