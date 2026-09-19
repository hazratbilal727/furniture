"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { money, products, type Product } from "../components/site-data";

type Profile = {
  name: string;
  phone: string;
  email: string;
  city: string;
  avatar: string;
};
type CartItem = Product & { quantity: number };
type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line: string;
  city: string;
  isDefault: boolean;
};
type Order = {
  id: string;
  date: string;
  status: "Pending" | "Delivered" | "Cancelled";
  items: Array<{ productId: number; quantity: number }>;
};
type Modal =
  | "edit"
  | "orders"
  | "addresses"
  | "payments"
  | "notifications"
  | "settings"
  | "list"
  | "logout"
  | "cart"
  | null;

type IconName =
  | "user"
  | "check"
  | "box"
  | "clock"
  | "truck"
  | "heart"
  | "bag"
  | "pin"
  | "card"
  | "bell"
  | "lock"
  | "globe"
  | "help"
  | "info"
  | "logout"
  | "chevron"
  | "plus"
  | "close"
  | "camera";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const icons: Record<IconName, string> = {
    user: "fa-solid fa-user",
    check: "fa-solid fa-circle-check",
    box: "fa-solid fa-box",
    clock: "fa-solid fa-clock",
    truck: "fa-solid fa-truck",
    heart: "fa-solid fa-heart",
    bag: "fa-solid fa-bag-shopping",
    pin: "fa-solid fa-location-dot",
    card: "fa-solid fa-credit-card",
    bell: "fa-solid fa-bell",
    lock: "fa-solid fa-lock",
    globe: "fa-solid fa-globe",
    help: "fa-solid fa-circle-question",
    info: "fa-solid fa-circle-info",
    logout: "fa-solid fa-right-from-bracket",
    chevron: "fa-solid fa-chevron-right",
    plus: "fa-solid fa-plus",
    close: "fa-solid fa-xmark",
    camera: "fa-solid fa-camera",
  };
  return (
    <i
      aria-hidden="true"
      className={`icon ${icons[name]}`}
      style={{ fontSize: size }}
    />
  );
}

const defaultProfile: Profile = {
  name: "Muntazir Bukhari",
  phone: "+92 300 1234567",
  email: "hello@muntazirandsons.com",
  city: "Peshawar, Pakistan",
  avatar: "",
};
const defaultAddress: Address = {
  id: "home",
  label: "Home",
  recipient: "Muntazir Bukhari",
  phone: "+92 300 1234567",
  line: "University Road, House 18",
  city: "Peshawar, Pakistan",
  isDefault: true,
};
const defaultOrders: Order[] = [];
const defaultSettings = {
  orderAlerts: true,
  promotions: false,
  language: "English",
  currency: "PKR",
};
const defaultNotifications = [
  {
    id: "welcome",
    title: "Welcome to Muntazir & Sons",
    copy: "Your furniture wish list is ready for beautiful things.",
    time: "Today",
  },
  {
    id: "shipping",
    title: "Delivery updates appear here",
    copy: "We will notify you when an order moves to the next stage.",
    time: "Account",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(
      window.localStorage.getItem(key) ?? JSON.stringify(fallback),
    ) as T;
  } catch {
    return fallback;
  }
}

export function MobileProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [draft, setDraft] = useState<Profile>(defaultProfile);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [notice, setNotice] = useState("");
  const [addressDraft, setAddressDraft] = useState<Address>(defaultAddress);
  const [settings, setSettings] = useState(defaultSettings);

  const refresh = () => {
    setProfile({ ...defaultProfile, ...readStorage("muntazir-profile", {}) });
    setCart(readStorage("muntazir-cart", []));
    setWishlist(readStorage("muntazir-wishlist", []));
    setOrders(readStorage("muntazir-orders", defaultOrders));
    setAddresses(readStorage("muntazir-addresses", [defaultAddress]));
    setSettings(readStorage("muntazir-settings", defaultSettings));
  };

  useEffect(() => {
    const timeout = window.setTimeout(refresh, 0);
    const sync = () => refresh();
    window.addEventListener("storage", sync);
    window.addEventListener("muntazir-cart-updated", sync);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("storage", sync);
      window.removeEventListener("muntazir-cart-updated", sync);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const orderCounts = {
    pending: orders.filter((order) => order.status === "Pending").length,
    delivered: orders.filter((order) => order.status === "Delivered").length,
    cancelled: orders.filter((order) => order.status === "Cancelled").length,
  };
  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.id)),
    [wishlist],
  );

  const saveProfile = () => {
    if (!draft.name.trim() || !draft.email.trim()) {
      setNotice("Name and email are required");
      return;
    }
    setProfile(draft);
    window.localStorage.setItem("muntazir-profile", JSON.stringify(draft));
    setModal(null);
    setNotice("Profile updated");
  };
  const uploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setDraft((current) => ({ ...current, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };
  const saveAddresses = (next: Address[]) => {
    setAddresses(next);
    window.localStorage.setItem("muntazir-addresses", JSON.stringify(next));
  };
  const saveSettings = (next: typeof settings) => {
    setSettings(next);
    window.localStorage.setItem("muntazir-settings", JSON.stringify(next));
  };
  const openEdit = () => {
    setDraft(profile);
    setModal("edit");
  };
  const openAddressEditor = (address?: Address) => {
    setAddressDraft(
      address ?? {
        ...defaultAddress,
        id: String(Date.now()),
        isDefault: addresses.length === 0,
      },
    );
    setModal("addresses");
  };
  const saveAddress = () => {
    const next = addresses.some((address) => address.id === addressDraft.id)
      ? addresses.map((address) =>
          address.id === addressDraft.id ? addressDraft : address,
        )
      : [...addresses, addressDraft];
    saveAddresses(
      addressDraft.isDefault
        ? next.map((address) => ({
            ...address,
            isDefault: address.id === addressDraft.id,
          }))
        : next,
    );
    setNotice("Address saved");
  };
  const removeAddress = (id: string) =>
    saveAddresses(addresses.filter((address) => address.id !== id));
  const cancelOrder = (id: string) => {
    const next = orders.map((order) =>
      order.id === id ? { ...order, status: "Cancelled" as const } : order,
    );
    setOrders(next);
    window.localStorage.setItem("muntazir-orders", JSON.stringify(next));
    setNotice("Order cancelled");
  };
  const confirmLogout = () => {
    setModal(null);
    setNotice("You have been signed out.");
  };

  const option = (
    icon: IconName,
    title: string,
    copy: string,
    action: () => void,
  ) => (
    <button className="mobile-profile-option" type="button" onClick={action}>
      <span className="mobile-profile-option-icon">
        <Icon name={icon} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{copy}</small>
      </span>
      <Icon name="chevron" size={13} />
    </button>
  );

  return (
    <main className="mobile-profile-page">
      <header className="mobile-profile-heading">
        <div>
          <span className="mobile-profile-eyebrow">MY ACCOUNT</span>
          <h1>Your profile</h1>
        </div>
        <button
          type="button"
          className="mobile-profile-notification"
          aria-label="Open notifications"
          onClick={() => setModal("notifications")}
        >
          <Icon name="bell" />
          <span />
        </button>
      </header>
      <section className="mobile-profile-card mobile-profile-identity-card">
        <div className="mobile-profile-avatar">
          {profile.avatar ? <img src={profile.avatar} alt="" /> : initials}
          <button
            type="button"
            aria-label="Edit profile photo"
            onClick={openEdit}
          >
            <Icon name="camera" size={12} />
          </button>
        </div>
        <div className="mobile-profile-identity">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <p>{profile.phone}</p>
          <span>
            <Icon name="check" size={12} /> Verified account
          </span>
        </div>
        <button
          className="mobile-profile-edit"
          type="button"
          onClick={openEdit}
        >
          Edit
        </button>
      </section>
      <section className="mobile-profile-card mobile-profile-overview">
        <div className="mobile-profile-section-title">
          <div>
            <span className="mobile-profile-eyebrow">AT A GLANCE</span>
            <h2>Shopping overview</h2>
          </div>
          <button type="button" onClick={() => setModal("orders")}>
            View orders
          </button>
        </div>
        <div className="mobile-profile-stat-grid">
          <button type="button" onClick={() => setModal("orders")}>
            <Icon name="box" />
            <strong>{orders.length}</strong>
            <span>My orders</span>
          </button>
          <button type="button" onClick={() => setModal("orders")}>
            <Icon name="clock" />
            <strong>{orderCounts.pending}</strong>
            <span>Pending</span>
          </button>
          <button type="button" onClick={() => setModal("orders")}>
            <Icon name="truck" />
            <strong>{orderCounts.delivered}</strong>
            <span>Delivered</span>
          </button>
          <button type="button" onClick={() => setModal("orders")}>
            <Icon name="check" />
            <strong>{orderCounts.cancelled}</strong>
            <span>Cancelled</span>
          </button>
        </div>
        <div className="mobile-profile-quick-links">
          <button type="button" onClick={() => setModal("list")}>
            <Icon name="heart" /> Wishlist <b>{wishlist.length}</b>
          </button>
          <button type="button" onClick={() => setModal("cart")}>
            <Icon name="bag" /> Cart <b>{cartCount}</b>
          </button>
        </div>
      </section>
      <section className="mobile-profile-section">
        <div className="mobile-profile-section-title">
          <div>
            <span className="mobile-profile-eyebrow">MANAGE</span>
            <h2>Account options</h2>
          </div>
        </div>
        <div className="mobile-profile-options">
          {option("user", "Edit profile", "Name, contact and photo", openEdit)}
          {option("box", "My orders", "Track or cancel an order", () =>
            setModal("orders"),
          )}
          {option("heart", "Wishlist", `${wishlist.length} saved items`, () =>
            setModal("list"),
          )}
          {option(
            "pin",
            "Saved addresses",
            `${addresses.length} delivery address${addresses.length === 1 ? "" : "es"}`,
            () => setModal("addresses"),
          )}
          {option("card", "Payment methods", "Securely manage your cards", () =>
            setModal("payments"),
          )}
          {option(
            "bag",
            "Shopping cart",
            `${cartCount} item${cartCount === 1 ? "" : "s"} ready to check out`,
            () => setModal("cart"),
          )}
          {option("bell", "Notifications", "Order updates and offers", () =>
            setModal("notifications"),
          )}
          {option("lock", "Settings", "Preferences, privacy and support", () =>
            setModal("settings"),
          )}
        </div>
      </section>
      <button
        className="mobile-profile-logout"
        type="button"
        onClick={() => setModal("logout")}
      >
        <Icon name="logout" /> Log out
      </button>
      {notice && (
        <button
          className="mobile-profile-toast"
          type="button"
          onClick={() => setNotice("")}
          role="status"
        >
          {notice}
          <span>Dismiss</span>
        </button>
      )}
      {modal === "edit" && (
        <div className="mobile-profile-modal-wrap">
          <div className="mobile-profile-modal" role="dialog" aria-modal="true">
            <ModalTitle title="Edit profile" close={() => setModal(null)} />
            <div className="mobile-profile-edit-avatar">
              {draft.avatar ? (
                <img src={draft.avatar} alt="Profile preview" />
              ) : (
                initials
              )}
              <label>
                Change photo
                <input type="file" accept="image/*" onChange={uploadPhoto} />
              </label>
            </div>
            <label>
              Name
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={draft.phone}
                onChange={(event) =>
                  setDraft({ ...draft, phone: event.target.value })
                }
              />
            </label>
            <label>
              City
              <input
                value={draft.city}
                onChange={(event) =>
                  setDraft({ ...draft, city: event.target.value })
                }
              />
            </label>
            <button
              className="mobile-profile-primary"
              type="button"
              onClick={saveProfile}
            >
              Save changes
            </button>
          </div>
        </div>
      )}
      {modal === "orders" && (
        <Panel title="My orders" close={() => setModal(null)}>
          <div className="mobile-profile-panel-list">
            {orders.length === 0 ? (
              <EmptyState
                icon="box"
                title="No orders yet"
                copy="Your placed orders and delivery updates will appear here."
                href="/shop"
                action="Explore the shop"
              />
            ) : (
              orders.map((order) => (
                <div className="mobile-profile-order" key={order.id}>
                  <div>
                    <strong>{order.id}</strong>
                    <small>
                      {order.date} ·{" "}
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}{" "}
                      item(s)
                    </small>
                  </div>
                  <span
                    className={`order-status order-status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                  {order.status === "Pending" && (
                    <button type="button" onClick={() => cancelOrder(order.id)}>
                      Cancel order
                    </button>
                  )}
                  {order.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() =>
                        setNotice(`Tracking for ${order.id} is being prepared`)
                      }
                    >
                      Track order
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </Panel>
      )}
      {modal === "addresses" && (
        <Panel
          title="Saved addresses"
          close={() => setModal(null)}
          action={
            <button
              className="mobile-profile-panel-action"
              type="button"
              onClick={() => openAddressEditor()}
            >
              <Icon name="plus" size={13} /> Add
            </button>
          }
        >
          <div className="mobile-profile-panel-list">
            {addresses.length === 0 ? (
              <EmptyState
                icon="pin"
                title="No saved addresses"
                copy="Add an address for a faster checkout."
              />
            ) : (
              addresses.map((address) => (
                <div className="mobile-profile-address" key={address.id}>
                  <div>
                    <strong>
                      {address.label}
                      {address.isDefault && <em>Default</em>}
                    </strong>
                    <small>
                      {address.recipient} · {address.phone}
                      <br />
                      {address.line}, {address.city}
                    </small>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openAddressEditor(address)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAddress(address.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {modal === "addresses" && (
            <div className="mobile-profile-address-form">
              <h3>
                {addressDraft.id &&
                addresses.some((address) => address.id === addressDraft.id)
                  ? "Edit address"
                  : "Add address"}
              </h3>
              <input
                aria-label="Address label"
                placeholder="Label (Home, Office)"
                value={addressDraft.label}
                onChange={(event) =>
                  setAddressDraft({
                    ...addressDraft,
                    label: event.target.value,
                  })
                }
              />
              <input
                aria-label="Recipient"
                placeholder="Recipient name"
                value={addressDraft.recipient}
                onChange={(event) =>
                  setAddressDraft({
                    ...addressDraft,
                    recipient: event.target.value,
                  })
                }
              />
              <input
                aria-label="Address"
                placeholder="Street address"
                value={addressDraft.line}
                onChange={(event) =>
                  setAddressDraft({ ...addressDraft, line: event.target.value })
                }
              />
              <input
                aria-label="City"
                placeholder="City and country"
                value={addressDraft.city}
                onChange={(event) =>
                  setAddressDraft({ ...addressDraft, city: event.target.value })
                }
              />
              <label className="mobile-profile-check">
                <input
                  type="checkbox"
                  checked={addressDraft.isDefault}
                  onChange={(event) =>
                    setAddressDraft({
                      ...addressDraft,
                      isDefault: event.target.checked,
                    })
                  }
                />{" "}
                Make default address
              </label>
              <button
                className="mobile-profile-primary"
                type="button"
                onClick={saveAddress}
              >
                Save address
              </button>
            </div>
          )}
        </Panel>
      )}
      {modal === "payments" && (
        <Panel title="Payment methods" close={() => setModal(null)}>
          <EmptyState
            icon="card"
            title="No payment methods saved"
            copy="Payment details are collected securely during checkout. We never show full card numbers here."
            action="Shop securely"
            href="/shop"
          />
        </Panel>
      )}
      {modal === "notifications" && (
        <Panel title="Notifications" close={() => setModal(null)}>
          <div className="mobile-profile-panel-list">
            {defaultNotifications.map((item) => (
              <div className="mobile-profile-notification-row" key={item.id}>
                <span>
                  <Icon name="bell" />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.copy}</p>
                  <small>{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {modal === "settings" && (
        <Panel title="Settings" close={() => setModal(null)}>
          <div className="mobile-profile-settings">
            <label>
              <span>Order updates</span>
              <input
                type="checkbox"
                checked={settings.orderAlerts}
                onChange={(event) =>
                  saveSettings({
                    ...settings,
                    orderAlerts: event.target.checked,
                  })
                }
              />
            </label>
            <label>
              <span>Promotional messages</span>
              <input
                type="checkbox"
                checked={settings.promotions}
                onChange={(event) =>
                  saveSettings({
                    ...settings,
                    promotions: event.target.checked,
                  })
                }
              />
            </label>
            <label>
              <span>Language</span>
              <select
                value={settings.language}
                onChange={(event) =>
                  saveSettings({ ...settings, language: event.target.value })
                }
              >
                <option>English</option>
                <option>Urdu</option>
              </select>
            </label>
            <label>
              <span>Currency</span>
              <select
                value={settings.currency}
                onChange={(event) =>
                  saveSettings({ ...settings, currency: event.target.value })
                }
              >
                <option>PKR</option>
                <option>USD</option>
              </select>
            </label>
            <Link href="/contact" onClick={() => setModal(null)}>
              Help & Support <Icon name="chevron" size={13} />
            </Link>
            <Link href="/about" onClick={() => setModal(null)}>
              About the app <Icon name="chevron" size={13} />
            </Link>
          </div>
        </Panel>
      )}
      {modal === "list" && (
        <Panel title="Wishlist" close={() => setModal(null)}>
          <div className="mobile-profile-panel-list">
            {wishlistProducts.length === 0 ? (
              <EmptyState
                icon="heart"
                title="Your wishlist is empty"
                copy="Save the pieces you love while browsing."
                href="/shop"
                action="Find a piece"
              />
            ) : (
              wishlistProducts.map((product) => (
                <div className="mobile-profile-wishlist-row" key={product.id}>
                  <img src={product.image} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <small>{money(product.price)}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>
      )}
      {modal === "cart" && (
        <Panel title="Shopping cart" close={() => setModal(null)}>
          {cart.length === 0 ? (
            <EmptyState
              icon="bag"
              title="Your cart is empty"
              copy="Beautiful pieces are waiting in the shop."
              href="/shop"
              action="Browse furniture"
            />
          ) : (
            <div className="mobile-profile-panel-list">
              {cart.map((item) => (
                <div className="mobile-profile-wishlist-row" key={item.id}>
                  <img src={item.image} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.quantity} × {money(item.price)}
                    </small>
                  </div>
                </div>
              ))}
              <Link
                className="mobile-profile-primary mobile-profile-link-button"
                href="/shop"
                onClick={() => setModal(null)}
              >
                Continue shopping
              </Link>
            </div>
          )}
        </Panel>
      )}
      {modal === "logout" && (
        <div className="mobile-profile-modal-wrap">
          <div
            className="mobile-profile-confirm"
            role="alertdialog"
            aria-modal="true"
          >
            <Icon name="logout" size={22} />
            <h2>Log out of your account?</h2>
            <p>You can sign in again any time.</p>
            <div>
              <button type="button" onClick={() => setModal(null)}>
                Stay signed in
              </button>
              <button
                className="mobile-profile-primary"
                type="button"
                onClick={confirmLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ModalTitle({
  title,
  close,
  action,
}: {
  title: string;
  close: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="mobile-profile-modal-title">
      <div>
        <span className="mobile-profile-eyebrow">ACCOUNT</span>
        <h2>{title}</h2>
      </div>
      {action}
      <button type="button" aria-label={`Close ${title}`} onClick={close}>
        <Icon name="close" />
      </button>
    </div>
  );
}
function Panel({
  title,
  close,
  action,
  children,
}: {
  title: string;
  close: () => void;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-profile-modal-wrap">
      <div className="mobile-profile-modal" role="dialog" aria-modal="true">
        <ModalTitle title={title} close={close} action={action} />
        {children}
      </div>
    </div>
  );
}
function EmptyState({
  icon,
  title,
  copy,
  href,
  action,
}: {
  icon: IconName;
  title: string;
  copy: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mobile-profile-empty">
      <Icon name={icon} size={25} />
      <strong>{title}</strong>
      <p>{copy}</p>
      {href && action && <Link href={href}>{action}</Link>}
    </div>
  );
}
