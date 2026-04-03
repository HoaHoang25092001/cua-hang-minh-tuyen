// app/(shop)/layout.tsx – Layout cho tất cả trang con của shop
import { ShopLayout } from "@/components/shop/shop-layout";

export default function ShopGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShopLayout>{children}</ShopLayout>;
}
