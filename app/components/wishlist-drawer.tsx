"use client";

import Link from "next/link";
import { money, type Product } from "./site-data";

export function WishlistDrawer({
  items,
  onClose,
  onRemove,
  onClear,
  onAddToCart,
}: {
  items: Product[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  onAddToCart: (product: Product) => void;
}) {
  return (
    <div
      className="wishlist-drawer-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <aside
        className="wishlist-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">SAVED FOR LATER</p>
            <h2>Wishlist</h2>
          </div>
          <div className="wishlist-heading-actions">
            {items.length > 0 && (
              <button
                className="wishlist-clear"
                type="button"
                onClick={onClear}
              >
                Remove all
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Close wishlist">
              <i className="icon fa-solid fa-xmark" />
            </button>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="wishlist-empty">
            <i className="icon fa-regular fa-heart" />
            <h3>Your wishlist is empty</h3>
            <p>Save pieces you love and keep them close while you browse.</p>
            <Link className="button button-dark" href="/shop" onClick={onClose}>
              Explore furniture
            </Link>
          </div>
        ) : (
          <div className="wishlist-items">
            {items.map((product) => (
              <article className="wishlist-item" key={product.id}>
                <div
                  className="wishlist-thumb"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <div className="wishlist-item-info">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <strong>{money(product.price)}</strong>
                  <button type="button" onClick={() => onAddToCart(product)}>
                    Add to bag <i className="icon fa-solid fa-arrow-right" />
                  </button>
                </div>
                <button
                  className="wishlist-remove"
                  type="button"
                  onClick={() => onRemove(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <i className="icon fa-solid fa-trash-can" />
                </button>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
