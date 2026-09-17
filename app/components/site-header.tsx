"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HeaderProps = {
  query?: string;
  onQueryChange?: (value: string) => void;
  wishlistCount?: number;
  onCartOpen?: () => void;
  onToast?: (message: string) => void;
  onProfileEdit?: () => void;
};

type CartEntry = { id: number; name: string; price: number; image: string; quantity: number };

const primaryNav = ["Home", "Shop", "Category", "Deals", "About Us", "Contact Us"];
const primaryNavIcons: Record<string, string> = { Home: "home", Shop: "shop", Category: "filter", Deals: "tag", "About Us": "user", "Contact Us": "headset" };
const searchSuggestions = ["Sofas", "Beds", "Dining tables", "Coffee tables", "Storage units", "Office desks"];
const profileOptions = [
  { label: "Edit Profile", icon: "user" }, { label: "My Orders", icon: "bag" }, { label: "Saved Items", icon: "heart" },
  { label: "Address Book", icon: "map" }, { label: "Support", icon: "headset" }, { label: "Logout", icon: "logout" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, string> = {
    home: "fa-solid fa-house", shop: "fa-solid fa-store", search: "fa-solid fa-magnifying-glass", bag: "fa-solid fa-bag-shopping", heart: "fa-solid fa-heart", menu: "fa-solid fa-bars", arrow: "fa-solid fa-arrow-right", close: "fa-solid fa-xmark", filter: "fa-solid fa-sliders", tag: "fa-solid fa-tag", user: "fa-solid fa-user", map: "fa-solid fa-map-location-dot", headset: "fa-solid fa-headset", logout: "fa-solid fa-right-from-bracket",
  };
  return <i aria-hidden="true" className={`icon ${icons[name] ?? "fa-solid fa-circle"}`} style={{ fontSize: size }} />;
}

const money = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

export function SiteHeader({ query = "", onQueryChange, wishlistCount = 0, onCartOpen, onToast, onProfileEdit }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [routeQuery, setRouteQuery] = useState(query);
  const profile = { name: "Muntazir Bukhari", email: "hello@muntazirandsons.com" };

  const readCart = () => {
    try { setCart(JSON.parse(window.localStorage.getItem("muntazir-cart") ?? "[]")); } catch { setCart([]); }
  };
  useEffect(() => {
    const timeout = window.setTimeout(readCart, 0);
    window.addEventListener("muntazir-cart-updated", readCart);
    window.addEventListener("storage", readCart);
    return () => { window.clearTimeout(timeout); window.removeEventListener("muntazir-cart-updated", readCart); window.removeEventListener("storage", readCart); };
  }, []);
  useEffect(() => {
    const timeout = window.setTimeout(() => setRouteQuery(query), 0);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const profileInitials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const activeItem = pathname === "/" ? "Home" : pathname === "/shop" ? "Shop" : pathname === "/category" ? "Category" : pathname === "/deals" ? "Deals" : pathname === "/about" ? "About Us" : pathname === "/contact" ? "Contact Us" : "";
  const hrefFor = (item: string) => item === "Home" ? (pathname === "/" ? "#top" : "/") : item === "About Us" ? "/about" : item === "Contact Us" ? "/contact" : `/${item.toLowerCase()}`;
  const notify = (message: string) => onToast?.(message);
  const openBag = () => onCartOpen ? onCartOpen() : setCartOpen(true);
  const handleSearch = (value: string) => {
    setRouteQuery(value);
    if (onQueryChange) onQueryChange(value);
    else if (pathname !== "/shop") router.push(`/shop?query=${encodeURIComponent(value)}`);
  };

  return <>
    <header className="site-header">
      <div className="header-main">
        <Link href={pathname === "/" ? "#top" : "/"} className="brand" aria-label="Muntazir and Sons Furniture home"><span className="brand-mark">M</span><span>Muntazir <em>&</em> Sons <small>FURNITURE</small></span></Link>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Primary navigation">
          {primaryNav.map((item) => <Link key={item} href={hrefFor(item)} className={activeItem === item ? "nav-item active" : "nav-item"} onClick={() => setMenuOpen(false)}><span className="mobile-drawer-icon"><Icon name={primaryNavIcons[item]} size={16} /></span>{item}</Link>)}
        </nav>
        {menuOpen && <button className="mobile-menu-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
        <Link className="header-shop-button" href={pathname === "/" ? "#collection" : "/shop"}>Shop now <Icon name="arrow" size={15} /></Link>
        <div className="header-search"><label className="search-shell" aria-label="Search furniture products"><Icon name="search" size={17} /><input value={routeQuery} onChange={(event) => handleSearch(event.target.value)} list="search-suggestions" placeholder="Search furniture..." aria-label="Search furniture products" /><datalist id="search-suggestions">{searchSuggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}</datalist></label></div>
        <div className="header-actions">
          <button aria-label={`Wishlist, ${wishlistCount} items saved`} className="header-action header-action--icon action-tooltip" type="button" data-tooltip="Wishlist" onClick={() => notify(wishlistCount ? `${wishlistCount} items saved for later` : "Your wishlist is empty")}><Icon name="heart" size={20} />{wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}</button>
          <button aria-label={`Open cart, ${cartCount} items`} className="header-action header-action--icon cart-button action-tooltip" type="button" data-tooltip="Bag" onClick={openBag}><Icon name="bag" size={20} />{cartCount > 0 && <span className="icon-badge">{cartCount}</span>}</button>
          <div className="profile-menu-wrap"><button aria-label="Open profile menu" aria-expanded={profileOpen} className="header-action profile-button action-tooltip" type="button" data-tooltip="Profile" onClick={() => setProfileOpen((current) => !current)}><Icon name="user" size={20} /></button>{profileOpen && <div className="profile-panel" role="menu" aria-label="Profile menu"><div className="profile-summary"><div className="profile-avatar">{profileInitials}</div><div><strong>{profile.name}</strong><span>{profile.email}</span></div></div><div className="profile-options">{profileOptions.map((option) => <button key={option.label} type="button" className="profile-option" onClick={() => { setProfileOpen(false); if (option.label === "Edit Profile") onProfileEdit?.(); else notify(option.label === "Logout" ? "You have been signed out." : `${option.label} selected`); }}><span className="profile-option-icon"><Icon name={option.icon} size={15} /></span><span>{option.label}</span></button>)}</div></div>}</div>
          <button className="menu-button" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} type="button" onClick={() => setMenuOpen((current) => !current)}><Icon name="menu" size={19} /></button>
        </div>
      </div>
    </header>
    {cartOpen && <div className="drawer-backdrop" role="presentation" onClick={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart"><Icon name="close" /></button></div>{cart.length === 0 ? <div className="cart-empty"><Icon name="bag" size={34} /><p>Your bag is waiting for something special.</p><Link className="button button-dark" href="/shop" onClick={() => setCartOpen(false)}>Explore collection</Link></div> : <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div className="cart-thumb" style={{ backgroundImage: `url(${item.image})` }} /><div className="cart-item-info"><h3>{item.name}</h3><strong>{money(item.price)}</strong><span>Quantity: {item.quantity}</span></div></div>)}<button className="button button-primary checkout-button" onClick={() => notify("Order request received. We will contact you shortly.")}>Proceed to checkout <Icon name="arrow" size={17} /></button></div>}</aside></div>}
  </>;
}
