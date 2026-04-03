# CODING_GUIDELINES – Quy tắc lập trình

## Triết lý chung

1. **Admin-first**: Ưu tiên Admin panel hoàn chỉnh trước khi làm trang khách
2. **Không over-engineer**: Dùng next-admin cho CRUD, chỉ code custom khi thực sự cần
3. **Server-first**: Mọi component mặc định là Server Component trừ khi cần client interactivity

---

## Quy tắc đặt tên

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Files & folders | `kebab-case` | `product-list.tsx`, `next-admin-options.ts` |
| React components | `PascalCase` | `ProductCard`, `AdminLayout` |
| Variables & functions | `camelCase` | `handleSubmit`, `getProducts` |
| Constants | `UPPER_SNAKE_CASE` | `DEFAULT_PAGE_SIZE` |
| Prisma models | `PascalCase` | `Product`, `Category` |
| Database tables | `snake_case` | `products`, `product_images` |
| TypeScript types/interfaces | `PascalCase` | `ProductWithImages`, `SessionUser` |

---

## React & Next.js

### Server Components (mặc định)
```tsx
// ✅ Mặc định – Server Component
export default async function ProductPage() {
  const products = await prisma.product.findMany();
  return <ProductList products={products} />;
}
```

### Client Components (chỉ khi cần)
```tsx
// ✅ Khai báo rõ khi cần state/event
"use client";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

### Server Actions (cho forms)
```tsx
// ✅ Dùng Server Actions thay vì API routes cho forms
"use server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  await prisma.product.create({ data: { name, ... } });
  redirect("/admin/Product");
}
```

---

## next-admin: Validation lỗi server-side

Dùng `hooks.beforeDb` + `HookError` để bắt lỗi trước khi Prisma ném raw error:

```ts
// lib/next-admin-options.tsx
import { HookError } from "@premieroctet/next-admin";

// Trong edit options của model:
hooks: {
  beforeDb: async (data) => {
    const errors: { property: string; message: string }[] = [];
    if (!data.name || (typeof data.name === "string" && !data.name.trim())) {
      errors.push({ property: "name", message: "Tên là bắt buộc" });
    }
    if (errors.length > 0) {
      throw new HookError(400, {
        error: "Vui lòng điền đầy đủ các trường bắt buộc",
        validation: errors,
      });
    }
    return data;
  },
},
```

- `HookError(status, { error, validation })` trả về lỗi có field-level message hiển thị ngay dưới input
- `validation` là mảng `{ property: string; message: string }[]`



### Static Generation (SSG) – Trang khách hàng
```tsx
// Dùng cho trang danh mục và sản phẩm (ít thay đổi)
export async function generateStaticParams() {
  const categories = await prisma.category.findMany();
  return categories.map(c => ({ slug: c.slug }));
}

export const revalidate = 3600; // ISR: revalidate sau 1 giờ
```

### Dynamic – Trang Admin
```tsx
// Admin luôn dynamic (cần auth check)
export const dynamic = "force-dynamic";
```

---

## Database (Prisma 7)

### Khởi tạo PrismaClient
```ts
// Luôn import từ lib/prisma.ts, KHÔNG tạo PrismaClient mới
import prisma from "@/lib/prisma";
```

### Queries cơ bản
```ts
// Lấy sản phẩm với pagination
const products = await prisma.product.findMany({
  where: { isActive: true },
  include: { images: { where: { isPrimary: true } } },
  orderBy: { createdAt: "desc" },
  take: 12,
  skip: (page - 1) * 12,
});
```

### Type safety
```ts
// Dùng Prisma generated types
import type { Product, Category, Prisma } from "@prisma/client";

// Hoặc tạo custom types
type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true; images: true };
}>;
```

---

## Authentication

```ts
// Lấy session trong Server Component
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");
  // ...
}
```

---

## File Upload (UploadThing v7)

```ts
// Luôn dùng useUploadThing từ lib/uploadthing.ts, KHÔNG import trực tiếp uploadthing
import { useUploadThing } from "@/lib/uploadthing";

// Trong Client Component:
const { startUpload, isUploading } = useUploadThing("imageUploader");
const [res] = await startUpload([file]);
const url = res?.ufsUrl ?? res?.url;
```

- FileRouter định nghĩa tại `app/api/uploadthing/core.ts`
- Mọi upload đều kiểm tra auth – chỉ ADMIN mới upload được
- Custom input `ImageUploadInput` tích hợp vào next-admin cho các field ảnh

---

## Custom Inputs cho next-admin

Khi cần thêm placeholder hoặc type đặc biệt cho field trong next-admin, dùng `PlaceholderInput`:

```tsx
// lib/next-admin-options.tsx
import { PlaceholderInput } from "@/components/admin/placeholder-input";

fields: {
  name: {
    input: <PlaceholderInput placeholder="Tên sản phẩm (VD: Ống PVC 21mm)" />,
  },
  stock: {
    input: <PlaceholderInput type="number" placeholder="Số lượng tồn kho" />,
  },
}
```

Cho rich text editor (field `description`), dùng `TiptapEditor`:

```tsx
import { TiptapEditor } from "@/components/admin/tiptap-editor";

fields: {
  description: {
    input: <TiptapEditor />,
  },
}
```

- `TiptapEditor` hỗ trợ: Bold, Italic, Heading 1–3, Bullet/Ordered list, Blockquote, Table (thêm/xóa hàng cột), **Chèn ảnh từ máy tính qua UploadThing**, Undo/Redo
- Dữ liệu lưu dạng HTML string trong DB

---

## Relation Picker trong next-admin

Để next-admin render relation fields thành **dropdown picker** (thay vì text input thủ công), cần dùng **tên relation** (không phải FK) trong `display` array:

```tsx
// ✅ Đúng – hiển thị dropdown chọn từ danh sách
edit: {
  display: ["name", "price", "category", "manufacturer"],
}
```

**Điều kiện hoạt động**: Schema (`schema.cjs`) phải có `__nextadmin.kind = "object"` trên relation field. Điều này được đảm bảo bởi `scripts/patch-next-admin.js` – script tự động thêm metadata cho:
- `$ref` → required single relation (VD: `category`)
- `anyOf[$ref, null]` → optional single relation (VD: `manufacturer`)
- `type: "array", items.$ref` → one-to-many (VD: `images`, `reviews`)

Sau khi sửa `schema.prisma`, luôn chạy `npm run db:generate` để cập nhật `schema.cjs`.

---

## Cấu trúc thư mục

```
app/
  (auth)/            ← Route group – không ảnh hưởng URL
    login/
      page.tsx
  admin/
    [[...nextadmin]]/ ← next-admin catch-all route
      page.tsx
  api/
    auth/[...nextauth]/route.ts
    admin/[...nextadmin]/route.ts
  layout.tsx
  page.tsx           ← Trang chủ (làm sau)
  
lib/
  auth.ts            ← Auth.js config
  prisma.ts          ← Prisma singleton
  next-admin-options.tsx ← next-admin config (TSX, chứa JSX cho custom inputs)
  uploadthing.ts     ← UploadThing React helpers
  
components/
  ui/                ← shadcn/ui components
  admin/             ← Custom admin components (ImageUploadInput, ...)
  
prisma/
  schema.prisma
  seed.ts
  migrations/
```

---

## UI / Styling

- **Tailwind CSS v4**: Không dùng `tailwind.config.js`, config qua CSS
- **shadcn/ui**: Import từ `@/components/ui/`
- **lucide-react**: Dùng cho icons
- **next-admin**: Tự có UI riêng, không cần style lại

```tsx
// ✅ Import đúng cách
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
```

---

## Validation (Zod)

```ts
// Validate input ở Server Actions
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được trống"),
  price: z.number().positive("Giá phải lớn hơn 0"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số, dấu gạch"),
});
```

---

## Security

- **Không bao giờ commit** file `.env` hay `.env.local`
- **Hash password** với bcrypt (salt rounds ≥ 12)
- **Validate input** với Zod ở mọi Server Action
- **Auth check** ở cả middleware + page/route handler
- **Prisma parameterized queries** – không bao giờ string concatenate SQL
