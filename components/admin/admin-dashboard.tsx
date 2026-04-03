// components/admin/admin-dashboard.tsx – Dashboard tổng quan Admin
// Server Component – fetch data trực tiếp từ Prisma

import prisma from "@/lib/prisma";

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "20px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        borderLeft: `4px solid ${color}`,
        minWidth: 160,
      }}
    >
      <div
        style={{ fontSize: 28, fontWeight: 700, color: "#111", lineHeight: 1.2 }}
      >
        {value.toLocaleString("vi-VN")}
      </div>
      <div style={{ fontSize: 14, color: "#555", marginTop: 4 }}>{label}</div>
      {sub && (
        <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

// ── Low Stock Row ──────────────────────────────────────────────────────────────
function LowStockRow({
  name,
  stock,
  price,
}: {
  name: string;
  stock: number;
  price: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <span style={{ fontSize: 14, color: "#222", flex: 1 }}>{name}</span>
      <span
        style={{
          fontSize: 13,
          color: "#888",
          marginRight: 16,
          minWidth: 80,
          textAlign: "right",
        }}
      >
        {price}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: stock === 0 ? "#e53e3e" : "#d97706",
          minWidth: 60,
          textAlign: "right",
        }}
      >
        {stock === 0 ? "Hết hàng" : `Còn ${stock}`}
      </span>
    </div>
  );
}

// ── Pending Review Row ─────────────────────────────────────────────────────────
function PendingReviewRow({
  authorName,
  rating,
  productName,
  createdAt,
}: {
  authorName: string;
  rating: number;
  productName: string | null;
  createdAt: Date;
}) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const dateStr = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(createdAt);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 14, color: "#222", fontWeight: 500 }}>
          {authorName}
        </span>
        <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
          {dateStr}
        </span>
      </div>
      <span style={{ fontSize: 13, color: "#f59e0b", marginRight: 16 }}>
        {stars}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "#666",
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {productName ?? "Đánh giá cửa hàng"}
      </span>
    </div>
  );
}

// ── Section Card ───────────────────────────────────────────────────────────────
function SectionCard({
  title,
  children,
  emptyMsg,
}: {
  title: string;
  children: React.ReactNode;
  emptyMsg: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: "20px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#111",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid #eee",
        }}
      >
        {title}
      </h3>
      {children ?? (
        <p style={{ fontSize: 14, color: "#aaa", textAlign: "center", padding: "16px 0" }}>
          {emptyMsg}
        </p>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export async function AdminDashboard() {
  // Fetch thống kê song song
  const [
    totalProducts,
    activeProducts,
    featuredProducts,
    totalCategories,
    activeCategories,
    totalManufacturers,
    totalReviews,
    pendingReviews,
    lowStockProducts,
    recentPendingReviews,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.manufacturer.count(),
    prisma.review.count(),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.product.findMany({
      where: { stock: { lt: 5 } },
      orderBy: { stock: "asc" },
      take: 10,
      select: { id: true, name: true, stock: true, price: true },
    }),
    prisma.review.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        authorName: true,
        rating: true,
        createdAt: true,
        product: { select: { name: true } }, // nullable
      },
    }),
  ]);

  const now = new Date();
  const dateStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(now);

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 4 }}
        >
          Tổng quan cửa hàng
        </h1>
        <p style={{ fontSize: 14, color: "#888" }}>{dateStr}</p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          label="Tổng sản phẩm"
          value={totalProducts}
          sub={`${activeProducts} đang bán · ${featuredProducts} nổi bật`}
          color="#3b82f6"
        />
        <StatCard
          label="Danh mục"
          value={totalCategories}
          sub={`${activeCategories} đang hoạt động`}
          color="#10b981"
        />
        <StatCard
          label="Nhà sản xuất"
          value={totalManufacturers}
          color="#8b5cf6"
        />
        <StatCard
          label="Đánh giá"
          value={totalReviews}
          sub={
            pendingReviews > 0
              ? `${pendingReviews} chờ duyệt`
              : "Tất cả đã duyệt"
          }
          color={pendingReviews > 0 ? "#f59e0b" : "#6b7280"}
        />
      </div>

      {/* Detail Sections */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* Sản phẩm sắp hết hàng */}
        <SectionCard
          title={`⚠️ Sắp hết hàng (${lowStockProducts.length})`}
          emptyMsg="Không có sản phẩm nào sắp hết hàng"
        >
          {lowStockProducts.length > 0 ? (
            <div>
              {lowStockProducts.map((p) => (
                <LowStockRow
                  key={p.id}
                  name={p.name}
                  stock={p.stock}
                  price={p.price}
                />
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: 14,
                color: "#aaa",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              Không có sản phẩm nào sắp hết hàng
            </p>
          )}
        </SectionCard>

        {/* Đánh giá chờ duyệt */}
        <SectionCard
          title={`📝 Đánh giá chờ duyệt (${pendingReviews})`}
          emptyMsg="Không có đánh giá nào chờ duyệt"
        >
          {recentPendingReviews.length > 0 ? (
            <div>
              {recentPendingReviews.map((r) => (
                <PendingReviewRow
                  key={r.id}
                  authorName={r.authorName}
                  rating={r.rating}
                  productName={r.product?.name ?? null}
                  createdAt={r.createdAt}
                />
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: 14,
                color: "#aaa",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              Không có đánh giá nào chờ duyệt
            </p>
          )}
        </SectionCard>
      </div>

      {/* Quick Links */}
      <div
        style={{
          marginTop: 24,
          background: "#f8fafc",
          borderRadius: 10,
          padding: "16px 24px",
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 14, color: "#555", fontWeight: 500 }}>
          Truy cập nhanh:
        </span>
        {[
          { label: "Sản phẩm", href: "/admin/Product" },
          { label: "Danh mục", href: "/admin/Category" },
          { label: "Nhà sản xuất", href: "/admin/Manufacturer" },
          { label: "Đánh giá", href: "/admin/Review" },
          { label: "Người dùng", href: "/admin/User" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: 13,
              color: "#3b82f6",
              textDecoration: "none",
              padding: "4px 12px",
              background: "#eff6ff",
              borderRadius: 6,
              border: "1px solid #bfdbfe",
              fontWeight: 500,
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
