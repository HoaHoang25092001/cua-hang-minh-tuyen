"use client";
// components/admin/sidebar-toggle.tsx
// Nút thu/mở sidebar trái cho Admin panel (chỉ hiện trên desktop lg+)
import { useCallback, useSyncExternalStore } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const STORAGE_KEY = "admin-sidebar-collapsed";
const COLLAPSED_CLASS = "admin-sidebar-collapsed";

// useSyncExternalStore helpers – đọc localStorage an toàn phía client
const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};
const getSnapshot = () => localStorage.getItem(STORAGE_KEY) === "true";
const getServerSnapshot = () => false; // luôn là false khi render trên server

export function SidebarToggle() {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    const next = !collapsed;
    if (next) {
      document.documentElement.classList.add(COLLAPSED_CLASS);
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      document.documentElement.classList.remove(COLLAPSED_CLASS);
      localStorage.setItem(STORAGE_KEY, "false");
    }
    // Force re-render bằng cách dispatch storage event
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  }, [collapsed]);

  // Sync class lên <html> khi component mount (dựa vào giá trị localStorage)
  if (typeof window !== "undefined") {
    if (collapsed) {
      document.documentElement.classList.add(COLLAPSED_CLASS);
    } else {
      document.documentElement.classList.remove(COLLAPSED_CLASS);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={collapsed ? "Mở sidebar" : "Thu sidebar"}
      title={collapsed ? "Mở sidebar" : "Thu sidebar"}
      className="fixed top-4 z-9999 hidden lg:flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
      style={{ left: collapsed ? "0.5rem" : "17.25rem" }}
      suppressHydrationWarning
    >
      {collapsed ? (
        <PanelLeftOpen className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
      ) : (
        <PanelLeftClose className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
      )}
    </button>
  );
}
