"use client";

import { useEffect, useMemo, useState } from "react";
import { money, products, type Product } from "./site-data";

const categoryOptions = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

export function ProductGrid({ onlyDeals = false, initialCategory = "All", showSearchPanel = false }: { onlyDeals?: boolean; initialCategory?: string; showSearchPanel?: boolean }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  useEffect(() => {
    const syncWishlist = () => {
      try { setWishlist(JSON.parse(localStorage.getItem("muntazir-wishlist") ?? "[]")); } catch { setWishlist([]); }
    };
    const timeout = window.setTimeout(() => {
      const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
      if (categoryFromUrl && categoryOptions.includes(categoryFromUrl)) setCategory(categoryFromUrl);
      try {
        setCart(JSON.parse(localStorage.getItem("muntazir-cart") ?? "[]"));
        setWishlist(JSON.parse(localStorage.getItem("muntazir-wishlist") ?? "[]"));
      } catch { setCart([]); setWishlist([]); }
    }, 0);
    window.addEventListener("muntazir-wishlist-updated", syncWishlist);
    return () => { window.clearTimeout(timeout); window.removeEventListener("muntazir-wishlist-updated", syncWishlist); };
  }, []);
  const visible = useMemo(() => products.filter((product) => (!onlyDeals || product.originalPrice) && (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id), [category, onlyDeals, query, sort]);

  const addToCart = (product: Product) => {
    const stored = JSON.parse(localStorage.getItem("muntazir-cart") ?? "[]") as Array<Product & { quantity: number }>;
    const next = stored.some((item) => item.id === product.id) ? stored.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...stored, { ...product, quantity: 1 }];
    localStorage.setItem("muntazir-cart", JSON.stringify(next));
    setCart(next);
    window.dispatchEvent(new Event("muntazir-cart-updated"));
    setMessage(`${product.name} added to your bag`);
    window.setTimeout(() => setMessage(""), 2400);
  };
  const toggleWishlist = (product: Product) => {
    const saved = wishlist.includes(product.id);
    const next = saved ? wishlist.filter((id) => id !== product.id) : [...wishlist, product.id];
    setWishlist(next);
    localStorage.setItem("muntazir-wishlist", JSON.stringify(next));
    window.dispatchEvent(new Event("muntazir-wishlist-updated"));
    setMessage(saved ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
    window.setTimeout(() => setMessage(""), 2400);
  };

  const openDetails = (product: Product, position: number) => {
    if ((onlyDeals && position < 8) || (!onlyDeals && product.id <= 8)) setSelectedProduct(product);
    else setMessage("Detailed views are currently available for the first eight pieces.");
  };

  return <>
    <div className="route-toolbar">{showSearchPanel ? <div className="shop-search-panel"><label className="search-field"><i className="icon fa-solid fa-magnifying-glass" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, room, or style" aria-label="Search furniture by name, room, or style" />{query && <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear furniture search"><i className="icon fa-solid fa-xmark" /></button>}</label></div> : <label className="search-field"><i className="icon fa-solid fa-magnifying-glass" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search furniture" aria-label="Search furniture" /></label>}<select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Sort: Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
    <div className="filter-row route-filters">{categoryOptions.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item === "All" ? "All pieces" : item}</button>)}<span className="product-count">{visible.length} pieces</span></div>
    <div className="product-grid route-product-grid">{visible.map((product, position) => <article className="product-card" key={product.id}><div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>{product.tag && <span className="product-tag">{product.tag}</span>}<button className={wishlist.includes(product.id) ? "product-wishlist selected" : "product-wishlist"} type="button" onClick={() => toggleWishlist(product)} aria-label={`${wishlist.includes(product.id) ? "Remove" : "Add"} ${product.name} ${wishlist.includes(product.id) ? "from" : "to"} wishlist`} aria-pressed={wishlist.includes(product.id)}><i className={wishlist.includes(product.id) ? "icon fa-solid fa-heart" : "icon fa-regular fa-heart"} /></button></div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p className="route-product-copy">{product.description}</p><strong>{money(product.price)} {product.originalPrice && <del>{money(product.originalPrice)}</del>}</strong></div><div className="product-actions"><button className="view-button" onClick={() => openDetails(product, position)}>Details</button><button className="add-button" onClick={() => addToCart(product)}>Add to cart <i className="icon fa-solid fa-plus" /></button></div></article>)}</div>
    {visible.length === 0 && <div className="empty-state"><h3>No pieces found</h3><p>Try another search or category.</p></div>}
    {cart.length > 0 && <aside className="cart-summary" id="cart"><div><p className="eyebrow">YOUR BAG</p><h3>{cart.reduce((total, item) => total + item.quantity, 0)} {cart.length === 1 ? "piece" : "pieces"} selected</h3></div><strong>{money(cart.reduce((total, item) => total + item.price * item.quantity, 0))}</strong><button className="button button-dark" onClick={() => setMessage("Checkout is available through our studio team.")}>Checkout <i className="icon fa-solid fa-arrow-right" /></button></aside>}
    {selectedProduct && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProduct(null)}><div className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="shop-product-detail-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><i className="icon fa-solid fa-xmark" /></button><div className="detail-image" role="img" aria-label={selectedProduct.name} style={{ backgroundImage: `url(${selectedProduct.image})` }} /><div className="detail-content"><p className="eyebrow">{selectedProduct.category}</p><h2 id="shop-product-detail-title">{selectedProduct.name}</h2><strong>{money(selectedProduct.price)} {selectedProduct.originalPrice && <del>{money(selectedProduct.originalPrice)}</del>}</strong><p>{selectedProduct.description}</p><div className="detail-actions"><button className="button button-primary" type="button" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Add to cart <i className="icon fa-solid fa-plus" /></button><span className="detail-note"><i className="icon fa-solid fa-truck" /> Delivery across Pakistan</span></div></div></div></div>}
    {message && <div className="toast"><span className="toast-icon"><i className="icon fa-solid fa-check" /></span>{message}</div>}
  </>;
}
