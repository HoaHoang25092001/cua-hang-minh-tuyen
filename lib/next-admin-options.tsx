// lib/next-admin-options.tsx – Cấu hình next-admin v8
import type { NextAdminOptions } from "@premieroctet/next-admin";
import { HookError } from "@premieroctet/next-admin";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { TiptapEditor } from "@/components/admin/tiptap-editor";
import { PlaceholderInput } from "@/components/admin/placeholder-input";

// Hàm format ngày dd-mm-yyyy dùng chung cho tất cả model
const formatDate = (value: unknown): string => {
  if (!value) return "";
  const d = new Date(value as string);
  if (isNaN(d.getTime())) return String(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export const options: NextAdminOptions = {
  title: "Cửa Hàng Minh Tuyến – Admin",
  model: {
    User: {
      toString: (user) => `${user.name ?? user.username}`,
      icon: "UsersIcon",
      list: {
        display: ["username", "name", "role", "createdAt"],
        search: ["username", "name"],
        filters: [
          {
            name: "Admin",
            active: false,
            value: { role: { equals: "ADMIN" } },
          },
          {
            name: "Customer",
            active: false,
            value: { role: { equals: "CUSTOMER" } },
          },
        ],
        fields: {
          createdAt: { formatter: formatDate },
        },
      },
      edit: {
        display: ["username", "name", "role"],
        fields: {
          username: {
            input: <PlaceholderInput placeholder="Tên đăng nhập (VD: admin)" />,
          },
          name: {
            input: <PlaceholderInput placeholder="Tên hiển thị (VD: Quản trị viên)" />,
          },
        },
      },
    },
    Category: {
      toString: (category) => `${category.name}`,
      icon: "TagIcon",
      list: {
        display: ["imageUrl", "name", "slug", "isActive", "sortOrder", "createdAt"],
        search: ["name", "slug"],
        fields: {
          createdAt: { formatter: formatDate },
          imageUrl: {
            formatter: (value) => {
              if (!value || typeof value !== "string") return null;
              // eslint-disable-next-line @next/next/no-img-element
              return (
                <img
                  src={value}
                  alt=""
                  style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                />
              );
            },
          },
        },
      },
      edit: {
        display: [
          "name",
          "slug",
          "description",
          "imageUrl",
          "sortOrder",
          "isActive",
          "parentId",
        ],
        fields: {
          name: {
            input: <PlaceholderInput placeholder="Tên danh mục (VD: Ống nước)" />,
          },
          slug: {
            input: <PlaceholderInput placeholder="URL slug (VD: ong-nuoc)" />,
          },
          description: {
            input: <PlaceholderInput placeholder="Mô tả ngắn về danh mục" />,
          },
          imageUrl: {
            input: <ImageUploadInput />,
          },
          sortOrder: {
            input: <PlaceholderInput type="number" placeholder="Thứ tự sắp xếp (VD: 1)" />,
          },
        },
        hooks: {
          beforeDb: async (data, mode) => {
            if (mode !== "create") return data;
            const errors: { property: string; message: string }[] = [];
            if (!data.name || (typeof data.name === "string" && !data.name.trim())) {
              errors.push({ property: "name", message: "Tên danh mục là bắt buộc" });
            }
            if (!data.slug || (typeof data.slug === "string" && !data.slug.trim())) {
              errors.push({ property: "slug", message: "Slug (đường dẫn URL) là bắt buộc" });
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
      },
    },
    Product: {
      toString: (product) => `${product.name}`,
      icon: "ShoppingBagIcon",
      list: {
        display: [
          "imageUrl",
          "name",
          "price",
          "unit",
          "stock",
          "isActive",
          "isFeatured",
          "category",
          "manufacturer",
          "createdAt",
        ],
        search: ["name", "slug", "sku"],
        filters: [
          {
            name: "Đang bán",
            active: false,
            value: { isActive: { equals: true } },
          },
          {
            name: "Nổi bật",
            active: false,
            value: { isFeatured: { equals: true } },
          },
        ],
        fields: {
          createdAt: { formatter: formatDate },
          imageUrl: {
            formatter: (value) => {
              if (!value || typeof value !== "string") return null;
              // eslint-disable-next-line @next/next/no-img-element
              return (
                <img
                  src={value}
                  alt=""
                  style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                />
              );
            },
          },
          category: {
            formatter: (value) =>
              (value as { name?: string } | null)?.name ?? "—",
          },
          manufacturer: {
            formatter: (value) =>
              (value as { name?: string } | null)?.name ?? "—",
          },
        },
      },
      edit: {
        display: [
          "name",
          "slug",
          "category",
          "manufacturer",
          "description",
          "price",
          "comparePrice",
          "unit",
          "sku",
          "stock",
          "origin",
          "imageUrl",
          "isActive",
          "isFeatured",
        ],
        fields: {
          name: {
            input: (
              <PlaceholderInput placeholder="Tên sản phẩm (VD: Ống PVC Tiền Phong 21mm)" />
            ),
          },
          slug: {
            input: (
              <PlaceholderInput placeholder="URL slug (VD: ong-pvc-tien-phong-21mm)" />
            ),
          },
          description: {
            input: <TiptapEditor />,
          },
          price: {
            input: (
              <PlaceholderInput placeholder="Giá bán (VD: 15.000đ, 250.000đ hoặc Liên hệ)" />
            ),
          },
          comparePrice: {
            input: (
              <PlaceholderInput
                type="number"
                placeholder="Giá gốc để hiển thị % giảm giá (VD: 300000)"
              />
            ),
          },
          unit: {
            input: (
              <PlaceholderInput placeholder="Đơn vị tính (VD: cái, bộ, mét, cuộn, kg)" />
            ),
          },
          sku: {
            input: (
              <PlaceholderInput placeholder="Mã SKU / mã vạch nội bộ (VD: ONG-PVC-21)" />
            ),
          },
          stock: {
            input: (
              <PlaceholderInput type="number" placeholder="Số lượng tồn kho (VD: 100)" />
            ),
          },
          origin: {
            input: (
              <PlaceholderInput placeholder="Xuất xứ sản phẩm (VD: Việt Nam, Nhật Bản, Trung Quốc)" />
            ),
          },
          imageUrl: {
            input: <ImageUploadInput />,
          },
        },
        hooks: {
          beforeDb: async (data, mode) => {
            if (mode !== "create") return data;
            const errors: { property: string; message: string }[] = [];
            if (!data.name || (typeof data.name === "string" && !data.name.trim())) {
              errors.push({ property: "name", message: "Tên sản phẩm là bắt buộc" });
            }
            if (!data.slug || (typeof data.slug === "string" && !data.slug.trim())) {
              errors.push({ property: "slug", message: "Slug (đường dẫn URL) là bắt buộc" });
            }
            if (!data.price || (typeof data.price === "string" && !data.price.trim())) {
              errors.push({ property: "price", message: "Giá bán là bắt buộc" });
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
      },
    },
    Manufacturer: {
      toString: (manufacturer) => `${manufacturer.name}`,
      icon: "BuildingOfficeIcon",
      list: {
        display: ["name", "slug", "website", "createdAt"],
        search: ["name", "slug"],
        fields: {
          createdAt: { formatter: formatDate },
        },
      },
      edit: {
        display: ["name", "slug", "description", "logoUrl", "website"],
        fields: {
          name: {
            input: <PlaceholderInput placeholder="Tên nhà sản xuất (VD: Tiền Phong, Bình Minh)" />,
          },
          slug: {
            input: <PlaceholderInput placeholder="URL slug (VD: tien-phong)" />,
          },
          description: {
            input: <PlaceholderInput placeholder="Mô tả ngắn về nhà sản xuất" />,
          },
          logoUrl: {
            input: <ImageUploadInput />,
          },
          website: {
            input: (
              <PlaceholderInput type="url" placeholder="Website chính thức (VD: https://nhua.com.vn)" />
            ),
          },
        },
        hooks: {
          beforeDb: async (data, mode) => {
            if (mode !== "create") return data;
            const errors: { property: string; message: string }[] = [];
            if (!data.name || (typeof data.name === "string" && !data.name.trim())) {
              errors.push({ property: "name", message: "Tên nhà sản xuất là bắt buộc" });
            }
            if (!data.slug || (typeof data.slug === "string" && !data.slug.trim())) {
              errors.push({ property: "slug", message: "Slug (đường dẫn URL) là bắt buộc" });
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
      },
    },
    Review: {
      toString: (review) => `Review #${review.id}`,
      icon: "StarIcon",
      list: {
        display: [
          "authorName",
          "rating",
          "isApproved",
          "createdAt",
        ],
        search: ["authorName", "comment"],
        filters: [
          {
            name: "Chờ duyệt",
            active: false,
            value: { isApproved: { equals: false } },
          },
          {
            name: "Đã duyệt",
            active: false,
            value: { isApproved: { equals: true } },
          },
        ],
        fields: {
          createdAt: { formatter: formatDate },
        },
      },
      edit: {
        display: [
          "authorName",
          "rating",
          "comment",
          "isApproved",
        ],
        fields: {
          authorName: {
            input: <PlaceholderInput placeholder="Tên người đánh giá" />,
          },
          rating: {
            input: <PlaceholderInput type="number" placeholder="Số sao (1–5)" />,
          },
          comment: {
            input: <PlaceholderInput placeholder="Nội dung đánh giá" />,
          },
        },
      },
    },
    ProductImage: {
      toString: (img) => `Image #${img.id}`,
      icon: "PhotoIcon",
      list: {
        display: ["url", "isPrimary", "sortOrder", "product"],
        search: ["url", "alt"],
      },
      edit: {
        display: ["url", "alt", "sortOrder", "isPrimary", "product"],
        fields: {
          url: {
            input: <ImageUploadInput />,
          },
          alt: {
            input: <PlaceholderInput placeholder="Mô tả ảnh (alt text, VD: Ống PVC 21mm màu trắng)" />,
          },
          sortOrder: {
            input: <PlaceholderInput type="number" placeholder="Thứ tự hiển thị (số nhỏ hiển thị trước)" />,
          },
        },
      },
    },
  },
  pages: {
    "/dashboard": {
      title: "Dashboard",
      icon: "HomeIcon",
    },
  },
};
