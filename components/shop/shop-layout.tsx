// components/shop/shop-layout.tsx – Wrapper layout cho trang khách hàng
import { Header } from "./header";
import { Footer } from "./footer";
import { StickySidebar } from "./sticky-sidebar";

export function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <StickySidebar />
    </>
  );
}
