# DATABASE_SCHEMA – Cửa Hàng Minh Tuyến

> File này mô tả toàn bộ schema Prisma hiện tại. Cập nhật mỗi khi thay đổi schema.

## Công nghệ

- **ORM**: Prisma 7.x
- **Database**: Neon Postgres (serverless, pooling)
- **Adapter**: @prisma/adapter-pg (bắt buộc với Prisma 7)
- **Config**: `prisma.config.ts` quản lý URL (không dùng `url` trong schema.prisma)

## Prisma Config (`prisma.config.ts`)

```ts
datasource: {
  url: process.env.DATABASE_URL, // Pooled connection string từ Neon
}
```

## Enums

### `Role`
Phân quyền người dùng trong hệ thống.
```prisma
enum Role {
  ADMIN     // Quản trị viên – có thể đăng nhập
  CUSTOMER  // Khách hàng – không cần đăng nhập
}
```

---

## Models

### `User` – Người dùng hệ thống
Dùng để xác thực Admin. Customer không cần user account.

| Field | Type | Mô tả |
|-------|------|--------|
| id | String (cuid) | Primary key |
| username | String (unique) | Tên đăng nhập |
| password | String | Mật khẩu đã hash (bcrypt) |
| name | String? | Tên hiển thị |
| role | Role | ADMIN hoặc CUSTOMER |
| createdAt | DateTime | Ngày tạo |
| updatedAt | DateTime | Ngày cập nhật |

**Table**: `users`

---

### `Manufacturer` – Nhà sản xuất / Thương hiệu

| Field | Type | Mô tả |
|-------|------|--------|
| id | String (cuid) | Primary key |
| name | String | Tên nhà sản xuất |
| slug | String (unique) | URL-friendly name |
| description | String? | Mô tả |
| logoUrl | String? | URL logo |
| website | String? | Website chính thức |
| products | Product[] | Danh sách sản phẩm |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Table**: `manufacturers`

---

### `Category` – Danh mục / Loại hàng
Hỗ trợ cây danh mục 2 cấp (parent → children).

**Danh mục gốc (cấp 1)**: Ống nước, Điện dân dụng, Đồ biển, Đồ nuôi tôm cá, Xây dựng...

| Field | Type | Mô tả |
|-------|------|--------|
| id | String (cuid) | Primary key |
| name | String | Tên danh mục |
| slug | String (unique) | URL slug |
| description | String? | Mô tả |
| imageUrl | String? | Ảnh đại diện |
| sortOrder | Int (default 0) | Thứ tự sắp xếp |
| isActive | Boolean (default true) | Đang hoạt động |
| parentId | String? | ID danh mục cha (null = cấp 1) |
| parent | Category? | Danh mục cha |
| children | Category[] | Danh mục con |
| products | Product[] | Sản phẩm thuộc danh mục |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Table**: `categories`

---

### `Product` – Sản phẩm

| Field | Type | Mô tả |
|-------|------|--------|
| id | String (cuid) | Primary key |
| name | String | Tên sản phẩm |
| slug | String (unique) | URL slug |
| description | String? | Mô tả chi tiết (rich text HTML từ tiptap) |
| price | String | Giá bán – text hoặc số (VD: "250.000đ", "Liên hệ") |
| comparePrice | Float? | Giá gốc (để hiện giảm giá) |
| unit | String? | Đơn vị tính (cái, mét, cuộn, bộ...) |
| sku | String? (unique) | Mã SKU |
| stock | Int (default 0) | Số lượng tồn kho |
| origin | String? | Xuất xứ sản phẩm (VD: Việt Nam, Nhật Bản) |
| imageUrl | String? | Ảnh chính sản phẩm (UploadThing) |
| isActive | Boolean (default true) | Đang bán |
| isFeatured | Boolean (default false) | Sản phẩm nổi bật |
| categoryId | String | FK → Category |
| category | Category | Danh mục |
| manufacturerId | String? | FK → Manufacturer |
| manufacturer | Manufacturer? | Nhà sản xuất |
| images | ProductImage[] | Ảnh sản phẩm (nhiều ảnh) |
| reviews | Review[] | Đánh giá |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Table**: `products`

---

### `ProductImage` – Ảnh sản phẩm

| Field | Type | Mô tả |
|-------|------|--------|
| id | String (cuid) | Primary key |
| url | String | URL ảnh |
| alt | String? | Alt text |
| sortOrder | Int (default 0) | Thứ tự hiển thị |
| isPrimary | Boolean (default false) | Ảnh chính |
| productId | String | FK → Product (cascade delete) |
| product | Product | Sản phẩm |
| createdAt | DateTime | |

**Table**: `product_images`

---

### `Review` – Đánh giá của khách hàng
Khách không cần đăng nhập để đánh giá. Admin duyệt trước khi hiển thị.
**Lưu ý**: `productId = null` = đánh giá chung về cửa hàng (store review). 

| Field | Type | Mô tả |
|-------|------|--------|
| id | String (cuid) | Primary key |
| authorName | String | Tên người đánh giá |
| rating | Int | Số sao (1–5) |
| comment | String? | Nội dung đánh giá |
| isApproved | Boolean (default false) | Admin đã duyệt |
| productId | String? | FK → Product (nullable – null = store review) |
| product | Product | Sản phẩm |
| createdAt | DateTime | |
| updatedAt | DateTime | |

**Table**: `reviews`

---

## Relations

```
User          (độc lập – chỉ dùng cho auth)
Category      ──< Product >──── Manufacturer
Category      ──< Category (tự tham chiếu, cây 2 cấp)
Product       ──< ProductImage
Product       ──< Review
```

## Lệnh hữu ích

```bash
# Tạo migration mới
npm run db:migrate -- --name ten-migration

# Generate Prisma Client
npm run db:generate

# Xem data với Prisma Studio
npm run db:studio

# Seed dữ liệu mẫu
npm run db:seed
```

## TODO Schema

- [ ] Thêm model `Order` và `OrderItem` khi làm tính năng đặt hàng
- [ ] Thêm model `Voucher` nếu cần giảm giá
- [ ] Thêm field `videoUrl` vào `ProductImage` khi hỗ trợ upload video
- [ ] Thêm `@db.Text` cho description nếu cần lưu HTML dài
