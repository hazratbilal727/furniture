"use client";

import { useEffect, useMemo, useState } from "react";
import { money, products, type Product } from "./site-data";

const categoryOptions = ["All", ...Array.from(new Set(products.map((product) => product.category)))];

export function ProductGrid({ onlyDeals = false, initialCategory = "All" }: { onlyDeals?: boolean; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  const [message, setMessage] = useState("");
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const categoryFromUrl = new URLSearchParams(window.location.search).get("category");
      if (categoryFromUrl && categoryOptions.includes(categoryFromUrl)) setCategory(categoryFromUrl);
      try { setCart(JSON.parse(localStorage.getItem("muntazir-cart") ?? "[]")); } catch { setCart([]); }
    }, 0);
    return () => window.clearTimeout(timeout);
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

  return <>
    <div className="route-toolbar"><label className="search-field"><i className="icon fa-solid fa-magnifying-glass" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search furniture" aria-label="Search furniture" /></label><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
    <div className="filter-row route-filters">{categoryOptions.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item === "All" ? "All pieces" : item}</button>)}<span className="product-count">{visible.length} pieces</span></div>
    <div className="product-grid route-product-grid">{visible.map((product) => <article className="product-card" key={product.id}><div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>{product.tag && <span className="product-tag">{product.tag}</span>}</div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p className="route-product-copy">{product.description}</p><strong>{money(product.price)} {product.originalPrice && <del>{money(product.originalPrice)}</del>}</strong></div><div className="product-actions"><button className="view-button" onClick={() => setMessage(product.description)}>Details</button><button className="add-button" onClick={() => addToCart(product)}>Add to cart <i className="icon fa-solid fa-plus" /></button></div></article>)}</div>
    {visible.length === 0 && <div className="empty-state"><h3>No pieces found</h3><p>Try another search or category.</p></div>}
    {cart.length > 0 && <aside className="cart-summary" id="cart"><div><p className="eyebrow">YOUR BAG</p><h3>{cart.reduce((total, item) => total + item.quantity, 0)} {cart.length === 1 ? "piece" : "pieces"} selected</h3></div><strong>{money(cart.reduce((total, item) => total + item.price * item.quantity, 0))}</strong><button className="button button-dark" onClick={() => setMessage("Checkout is available through our studio team.")}>Checkout <i className="icon fa-solid fa-arrow-right" /></button></aside>}
    {message && <div className="toast"><span className="toast-icon"><i className="icon fa-solid fa-check" /></span>{message}</div>}
  </>;
}
