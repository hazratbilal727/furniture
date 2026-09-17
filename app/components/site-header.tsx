"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  query?: string;
  onQueryChange?: (value: string) => void;
  wishlistCount?: number;
  onCartOpen?: () => void;
};

type CartEntry = { id: number; name: string; price: number; image: string; quantity: number };
type Profile = { name: string; phone: string; email: string; city: string; avatar: string };
const defaultProfile: Profile = { name: "Muntazir Bukhari", phone: "+92 300 1234567", email: "hello@muntazirandsons.com", city: "Peshawar, Pakistan", avatar: "" };

const primaryNav = ["Home", "Shop", "Category", "Deals", "About Us", "Contact Us"];
const primaryNavIcons: Record<string, string> = { Home: "home", Shop: "shop", Category: "filter", Deals: "tag", "About Us": "user", "Contact Us": "headset" };
const searchSuggestions = ["Sofas", "Beds", "Dining tables", "Coffee tables", "Storage units", "Office desks"];
const profileOptions = [
  { label: "Edit Profile", icon: "user" }, { label: "My Orders", icon: "bag" }, { label: "Saved Items", icon: "heart" },
  { label: "Address Book", icon: "map" }, { label: "Support", icon: "headset" }, { label: "Logout", icon: "logout" },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, string> = {
    home: "fa-solid fa-house", shop: "fa-solid fa-store", search: "fa-solid fa-magnifying-glass", bag: "fa-solid fa-bag-shopping", heart: "fa-solid fa-heart", menu: "fa-solid fa-bars", arrow: "fa-solid fa-arrow-right", close: "fa-solid fa-xmark", check: "fa-solid fa-check", trash: "fa-solid fa-trash-can", filter: "fa-solid fa-sliders", tag: "fa-solid fa-tag", user: "fa-solid fa-user", map: "fa-solid fa-map-location-dot", headset: "fa-solid fa-headset", logout: "fa-solid fa-right-from-bracket",
  };
  return <i aria-hidden="true" className={`icon ${icons[name] ?? "fa-solid fa-circle"}`} style={{ fontSize: size }} />;
}

const money = (price: number) => `Rs. ${price.toLocaleString("en-PK")}`;

export function SiteHeader({ query = "", onQueryChange, wishlistCount = 0, onCartOpen }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [routeQuery, setRouteQuery] = useState(query);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [profileDraft, setProfileDraft] = useState<Profile>(defaultProfile);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const currentUrl = useRef("");

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
    const timeout = window.setTimeout(() => {
      try {
        const savedProfile = window.localStorage.getItem("muntazir-profile");
        if (savedProfile) setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      } catch { setProfile(defaultProfile); }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const timeout = window.setTimeout(() => setRouteQuery(query), 0);
    return () => window.clearTimeout(timeout);
  }, [query]);
  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const profileDirty = profileEditorOpen && JSON.stringify(profileDraft) !== JSON.stringify(profile);
  const profileInitials = profile.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const activeItem = pathname === "/" ? "Home" : pathname === "/shop" ? "Shop" : pathname === "/category" ? "Category" : pathname === "/deals" ? "Deals" : pathname === "/about" ? "About Us" : pathname === "/contact" ? "Contact Us" : "";
  const hrefFor = (item: string) => item === "Home" ? (pathname === "/" ? "#top" : "/") : item === "About Us" ? "/about" : item === "Contact Us" ? "/contact" : `/${item.toLowerCase()}`;
  const notify = (message: string) => setToastMessage(message);
  const removeCartItem = (id: number) => {
    const next = cart.filter((item) => item.id !== id);
    setCart(next);
    window.localStorage.setItem("muntazir-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("muntazir-cart-updated"));
    notify("Item removed from your bag");
  };
  const removeAllCartItems = () => {
    if (!window.confirm("Are you sure you want to remove all items from your bag?")) return;
    setCart([]);
    window.localStorage.removeItem("muntazir-cart");
    window.dispatchEvent(new Event("muntazir-cart-updated"));
    notify("All items removed from your bag");
  };
  const openBag = () => onCartOpen ? onCartOpen() : setCartOpen(true);
  const handleSearch = (value: string) => {
    setRouteQuery(value);
    if (onQueryChange) onQueryChange(value);
    else if (pathname !== "/shop") router.push(`/shop?query=${encodeURIComponent(value)}`);
  };
  const openProfileEditor = () => { setProfileDraft(profile); setProfileEditorOpen(true); setProfileOpen(false); };
  useEffect(() => {
    const openProfile = () => { setProfileDraft(profile); setProfileEditorOpen(true); setProfileOpen(false); };
    window.addEventListener("muntazir-open-profile", openProfile);
    return () => window.removeEventListener("muntazir-open-profile", openProfile);
  }, [profile]);
  const handleProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfileDraft((current) => ({ ...current, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };
  const saveProfile = () => {
    if (!profileDraft.name.trim() || !profileDraft.email.trim()) { notify("Name and email are required"); return; }
    const changedFields = [
      profileDraft.avatar !== profile.avatar && "profile image",
      profileDraft.name !== profile.name && "name",
      profileDraft.email !== profile.email && "email",
      profileDraft.phone !== profile.phone && "phone number",
      profileDraft.city !== profile.city && "city",
    ].filter(Boolean) as string[];
    setProfile(profileDraft);
    window.localStorage.setItem("muntazir-profile", JSON.stringify(profileDraft));
    setProfileEditorOpen(false);
    notify(changedFields.length ? `${changedFields.join(", ")} updated` : "Profile is up to date");
  };
  const requestCloseProfile = () => {
    if (profileDirty) { pendingAction.current = null; setDiscardConfirmOpen(true); return; }
    setProfileEditorOpen(false);
  };
  const discardProfileChanges = () => {
    setProfileDraft(profile);
    setDiscardConfirmOpen(false);
    setProfileEditorOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  };
  const saveBeforeLeaving = () => {
    if (!profileDraft.name.trim() || !profileDraft.email.trim()) { notify("Name and email are required"); return; }
    const changedFields = [
      profileDraft.avatar !== profile.avatar && "profile image",
      profileDraft.name !== profile.name && "name",
      profileDraft.email !== profile.email && "email",
      profileDraft.phone !== profile.phone && "phone number",
      profileDraft.city !== profile.city && "city",
    ].filter(Boolean) as string[];
    setProfile(profileDraft);
    window.localStorage.setItem("muntazir-profile", JSON.stringify(profileDraft));
    setDiscardConfirmOpen(false);
    setProfileEditorOpen(false);
    notify(changedFields.length ? `${changedFields.join(", ")} updated` : "Profile is up to date");
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  };
  useEffect(() => {
    if (!profileDirty) return;
    currentUrl.current = window.location.href;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const guardClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".profile-editor, .profile-discard-dialog")) return;
      event.preventDefault();
      event.stopPropagation();
      const link = target.closest("a");
      pendingAction.current = link?.href ? () => router.push(new URL(link.href).pathname + new URL(link.href).search + new URL(link.href).hash) : null;
      setDiscardConfirmOpen(true);
    };
    const guardBack = () => {
      window.history.pushState(null, "", currentUrl.current);
      pendingAction.current = () => window.history.back();
      setDiscardConfirmOpen(true);
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", guardClick, true);
    window.addEventListener("popstate", guardBack);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", guardClick, true);
      window.removeEventListener("popstate", guardBack);
    };
  }, [profileDirty, router]);

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
          <div className="profile-menu-wrap"><button aria-label="Open profile menu" aria-expanded={profileOpen} className="header-action profile-button action-tooltip" type="button" data-tooltip="Profile" onClick={() => setProfileOpen((current) => !current)}><Icon name="user" size={20} /></button>{profileOpen && <div className="profile-panel" role="menu" aria-label="Profile menu"><div className="profile-summary">{profile.avatar ? <img className="profile-avatar" src={profile.avatar} alt="" /> : <div className="profile-avatar">{profileInitials}</div>}<div><strong>{profile.name}</strong><span>{profile.email}</span></div></div><div className="profile-options">{profileOptions.map((option) => <button key={option.label} type="button" className="profile-option" onClick={() => { if (option.label === "Edit Profile") openProfileEditor(); else { setProfileOpen(false); notify(option.label === "Logout" ? "You have been signed out." : `${option.label} selected`); } }}><span className="profile-option-icon"><Icon name={option.icon} size={15} /></span><span>{option.label}</span></button>)}</div></div>}</div>
          <button className="menu-button" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} type="button" onClick={() => setMenuOpen((current) => !current)}><Icon name="menu" size={19} /></button>
        </div>
      </div>
    </header>
    {profileEditorOpen && <div className="modal-backdrop" role="presentation" onClick={requestCloseProfile}><div className="profile-editor" role="dialog" aria-modal="true" aria-labelledby="shared-profile-editor-title" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Enter" && event.target instanceof HTMLInputElement) { event.preventDefault(); saveProfile(); } }}><div className="editor-heading"><div><p className="eyebrow">YOUR DETAILS</p><h2 id="shared-profile-editor-title">Edit profile</h2></div><button className="modal-close" type="button" onClick={requestCloseProfile} aria-label="Close profile editor"><Icon name="close" /></button></div><div className="editor-avatar"><div className="editor-avatar-image">{profileDraft.avatar ? <img src={profileDraft.avatar} alt="Profile preview" /> : profileInitials}</div><label className="upload-button">Upload photo<input type="file" accept="image/*" onChange={handleProfilePhoto} /></label></div><div className="profile-form"><label>Full name<input value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} /></label><label>Mobile number<input type="tel" value={profileDraft.phone} onChange={(event) => setProfileDraft({ ...profileDraft, phone: event.target.value })} /></label><label>Email address<input type="email" value={profileDraft.email} onChange={(event) => setProfileDraft({ ...profileDraft, email: event.target.value })} /></label><label>City / country<input value={profileDraft.city} onChange={(event) => setProfileDraft({ ...profileDraft, city: event.target.value })} /></label></div><div className="editor-actions"><button className="button button-dark" type="button" onClick={requestCloseProfile}><Icon name="close" size={14} /> Cancel</button><button className="button button-primary" type="button" onClick={saveProfile}>Save changes <Icon name="check" size={16} /></button></div></div></div>}
    {discardConfirmOpen && <div className="modal-backdrop" role="presentation"><div className="profile-discard-dialog" role="alertdialog" aria-modal="true" aria-labelledby="discard-profile-title"><button className="profile-discard-close" type="button" onClick={discardProfileChanges} aria-label="Discard profile changes"><Icon name="close" /></button><p className="eyebrow">UNSAVED PROFILE CHANGES</p><h2 id="discard-profile-title">Leave without saving?</h2><p>Your profile edits have not been saved. Would you like to save them before leaving?</p><div className="editor-actions"><button className="button button-primary" type="button" onClick={saveBeforeLeaving}>Save changes</button><button className="button button-dark profile-keep-editing" type="button" onClick={() => { setDiscardConfirmOpen(false); pendingAction.current = null; }}>Keep editing</button></div></div></div>}
    {cartOpen && <div className="drawer-backdrop" role="presentation" onClick={() => setCartOpen(false)}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag</h2></div><div className="drawer-heading-actions">{cart.length > 0 && <button className="remove-all-button" type="button" onClick={removeAllCartItems}>Remove all</button>}<button onClick={() => setCartOpen(false)} aria-label="Close cart"><Icon name="close" /></button></div></div>{cart.length === 0 ? <div className="cart-empty"><Icon name="bag" size={34} /><p>Your bag is waiting for something special.</p><Link className="button button-dark" href="/shop" onClick={() => setCartOpen(false)}>Explore collection</Link></div> : <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div className="cart-thumb" style={{ backgroundImage: `url(${item.image})` }} /><div className="cart-item-info"><h3>{item.name}</h3><strong>{money(item.price)}</strong><span>Quantity: {item.quantity}</span></div><button className="remove-item" type="button" onClick={() => removeCartItem(item.id)} aria-label={`Remove ${item.name}`}><Icon name="trash" size={17} /></button></div>)}<button className="button button-primary checkout-button" onClick={() => notify("Order request received. We will contact you shortly.")}>Proceed to checkout <Icon name="arrow" size={17} /></button></div>}</aside></div>}
    {toastMessage && <div className="profile-toast" role="status"><span className="profile-toast-icon"><Icon name="check" size={13} /></span><span>{toastMessage}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToastMessage("")}><Icon name="close" size={12} /></button></div>}
  </>;
}
