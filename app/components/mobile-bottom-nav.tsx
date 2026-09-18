"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, string> = {
    home: "fa-solid fa-house",
    shop: "fa-solid fa-store",
    search: "fa-solid fa-magnifying-glass",
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
  const router = useRouter();
  const [searchActive, setSearchActive] = useState(false);

  const isHome = pathname === "/";
  const isShop = pathname === "/shop";
  const isProfile = pathname === "/profile";

  const openSearch = () => {
    setSearchActive(true);
    if (!isHome) {
      router.push("/shop");
      return;
    }

    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(
      () =>
        document
          .querySelector<HTMLInputElement>(
            ".collection-tools .search-field input",
          )
          ?.focus(),
      450,
    );
  };

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
      <button
        className={searchActive ? "mobile-nav-item active" : "mobile-nav-item"}
        type="button"
        onClick={openSearch}
      >
        <Icon name="search" size={18} />
        <span>Search</span>
      </button>
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