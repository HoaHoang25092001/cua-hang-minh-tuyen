# PROJECT_BRIEF – Cửa Hàng Minh Tuyến

## Mô tả dự án

**Cửa Hàng Minh Tuyến** là website bán lẻ đồ dân dụng / vật tư tổng hợp gồm:
- Ống nước và phụ kiện đường nước
- Điện dân dụng (dây điện, công tắc, thiết bị điện)
- Đồ biển (dụng cụ nghề biển)  
- Đồ nuôi tôm cá (vật tư thủy sản)
- Dụng cụ xây dựng

## Mục tiêu

- **Tốc độ cao**: Ship Admin panel xong trước để chủ shop quản lý được ngay
- **Admin-first**: Ưu tiên giao diện quản trị, sau mới làm trang khách
- **Đơn giản**: Không over-engineer, dùng next-admin cho CRUD nhanh
- **Scalable**: Có thể mở rộng module sau (SEO, đơn hàng, voucher)

## Stack kỹ thuật

| Layer | Công nghệ |
|-------|-----------|
| Framework | Next.js 16+ (App Router, TypeScript) |
| Database | Neon Postgres (serverless) |
| ORM | Prisma 7 (adapter-pg) |
| Admin UI | next-admin v8 (premieroctet) |
| Auth | Auth.js v5 (Credentials) |
| UI Components | shadcn/ui (Tailwind CSS v4) |
| Icons | lucide-react |
| Validation | Zod + React Hook Form |
| File Upload | UploadThing v7 (cloud, region SEA) |
| Rich Text | Tiptap (StarterKit + Table + Image extension) |

## Phân quyền

- **ADMIN**: Đăng nhập → quản lý toàn bộ shop
- **CUSTOMER**: **Không cần đăng nhập** – chỉ xem sản phẩm, đặt hàng (feature sau)

## Thứ tự phát triển

```
1. ✅ Config dự án (Prisma, Auth, Admin) 
2. ✅ Hoàn thiện Admin panel
3. 🔲 Seed đầy đủ sản phẩm
4. ✅ Trang khách hàng (SSR/Server Components)
5. 🔲 Tính năng đặt hàng
```

## Credentials

- Admin URL: http://localhost:3000/admin
- Login: http://localhost:3000/login
- Username: `admin` / Password: `admin123` (đổi sau khi deploy)
