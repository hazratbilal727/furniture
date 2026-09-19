"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, string> = {
    home: "fa-solid fa-house",
    shop: "fa-solid fa-store",
    category: "fa-solid fa-sliders",
    user: "fa-solid fa-user",
  };

  return (
    <i
      aria-hidden="true"
      className={`icon ${icons[name] ?? "fa-solid fa-circle"}`}
      style={{ fontSize: size }}
    />
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isShop = pathname === "/shop";
  const isCategory = pathname === "/category";
  const isProfile = pathname === "/profile";

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <Link
        className={isHome ? "mobile-nav-item active" : "mobile-nav-item"}
        href={isHome ? "#top" : "/"}
      >
        <Icon name="home" size={18} />
        <span>Home</span>
      </Link>
      <Link
        className={isShop ? "mobile-nav-item active" : "mobile-nav-item"}
        href={isHome ? "#collection" : "/shop"}
      >
        <Icon name="shop" size={18} />
        <span>Shop</span>
      </Link>
      <Link
        className={isCategory ? "mobile-nav-item active" : "mobile-nav-item"}
        href="/category"
      >
        <Icon name="category" size={18} />
        <span>Category</span>
      </Link>
      <Link
        className={isProfile ? "mobile-nav-item active" : "mobile-nav-item"}
        href="/profile"
      >
        <Icon name="user" size={18} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}
