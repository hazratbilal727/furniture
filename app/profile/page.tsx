"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MobileProfile } from "./mobile-profile";
import { SiteHeader } from "../components/site-header";

type IconName =
  | "bell"
  | "settings"
  | "mail"
  | "phone"
  | "chevron"
  | "package"
  | "truck"
  | "check"
  | "return"
  | "wallet"
  | "pin"
  | "heart"
  | "ticket"
  | "star"
  | "headset"
  | "info"
  | "globe"
  | "logout";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.4 1.4-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2v-.4a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L9 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H7v-2h.8a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L9 9l1.4-1.4.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2v.4a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L20 9l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.8v2h-.8a1.7 1.7 0 0 0-1.8 1Z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M6.6 3.5 9 3l1.5 4-2 1.4a15.5 15.5 0 0 0 5.1 5.1l1.4-2 4 1.5-.5 2.4a2 2 0 0 1-2.2 1.6A16.5 16.5 0 0 1 4.9 5.7a2 2 0 0 1 1.7-2.2Z" />
    ),
    chevron: <path d="m9 6 6 6-6 6" />,
    package: (
      <>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M3 8v8l9 5 9-5V8M12 13v8" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </>
    ),
    check: (
      <>
        <path d="M5 12 10 17 20 7" />
        <path d="M3 12a9 9 0 1 0 18 0" />
      </>
    ),
    return: (
      <>
        <path d="M9 7 4 12l5 5" />
        <path d="M4 12h10a5 5 0 0 1 5 5v1" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H19v16H5.5A2.5 2.5 0 0 1 3 17.5v-11Z" />
        <path d="M3 7h16v4h-4a2 2 0 0 0 0 4h4v5M15 13h.01" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    heart: (
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.7 4.7 0 0 1 12 6.3a4.7 4.7 0 0 1 8.8 2.5Z" />
    ),
    ticket: <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z" />,
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),
    headset: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4ZM20 14h-3v5h2a1 1 0 0 0 1-1v-4Z" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    logout: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="profile-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const accountOptions: {
  title: string;
  subtitle: string;
  icon: IconName;
  action: string;
}[] = [
  {
    title: "My Orders",
    subtitle: "View, track and manage your orders",
    icon: "package",
    action: "orders",
  },
  {
    title: "My Wallet",
    subtitle: "View balance & payment methods",
    icon: "wallet",
    action: "wallet",
  },
  {
    title: "My Addresses",
    subtitle: "Manage your delivery addresses",
    icon: "pin",
    action: "addresses",
  },
  {
    title: "Wishlist",
    subtitle: "Your saved items",
    icon: "heart",
    action: "wishlist",
  },
  {
    title: "Coupons & Offers",
    subtitle: "Save more with exclusive deals",
    icon: "ticket",
    action: "deals",
  },
  {
    title: "Reviews & Ratings",
    subtitle: "Your feedback matters",
    icon: "star",
    action: "reviews",
  },
  {
    title: "Help & Support",
    subtitle: "Get help or contact us",
    icon: "headset",
    action: "support",
  },
  {
    title: "About Us",
    subtitle: "Learn more about our app",
    icon: "info",
    action: "about",
  },
  { title: "Language", subtitle: "English", icon: "globe", action: "language" },
];

const stats: { value: string; label: string; icon: IconName }[] = [
  { value: "12", label: "Total Orders", icon: "package" },
  { value: "02", label: "On the Way", icon: "truck" },
  { value: "08", label: "Delivered", icon: "check" },
  { value: "02", label: "Returns", icon: "return" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleAction = (action: string) => {
    if (action === "deals") router.push("/deals");
    else if (action === "about") router.push("/about");
    else if (action === "support") router.push("/contact");
    else
      setMessage(
        action === "language"
          ? "Language selection is ready."
          : `${action[0].toUpperCase()}${action.slice(1)} selected.`,
      );
  };

  return (
    <>
      <div className="mobile-profile-shell">
        <SiteHeader />
        <MobileProfile />
      </div>
      <main className="profile-page profile-legacy">
        <div className="profile-topbar">
          <span className="profile-kicker">MY ACCOUNT</span>
          <div className="profile-actions">
            <button
              className="profile-action-button profile-bell"
              type="button"
              aria-label="Open notifications"
              onClick={() => setMessage("You have 3 new notifications.")}
            >
              <Icon name="bell" size={21} />
              <span className="notification-dot" />
            </button>
            <button
              className="profile-action-button"
              type="button"
              aria-label="Open settings"
              onClick={() => setMessage("Settings selected.")}
            >
              <Icon name="settings" size={21} />
            </button>
          </div>
        </div>
        <Link href="/profile/details" className="profile-summary-card">
          <div
            className="profile-photo"
            aria-label="Profile photo of Muntazir Bukhari"
          >
            MB
          </div>
          <div className="profile-identity">
            <h1>Muntazir Bukhari</h1>
            <span>
              <Icon name="mail" size={15} />
              hello@muntazirandsons.com
            </span>
            <span>
              <Icon name="phone" size={15} />
              +92 300 1234567
            </span>
            <strong>GOLD MEMBER</strong>
          </div>
          <Icon name="chevron" size={21} />
        </Link>
        <section className="profile-stats" aria-label="Order statistics">
          {stats.map((stat) => (
            <div className="profile-stat" key={stat.label}>
              <Icon name={stat.icon} size={19} />
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>
        <section className="profile-section">
          <h2>Account</h2>
          <div className="account-options-card">
            {accountOptions.map((option) => (
              <button
                className="account-option"
                type="button"
                key={option.title}
                onClick={() => handleAction(option.action)}
              >
                <span className="account-option-icon">
                  <Icon name={option.icon} size={20} />
                </span>
                <span className="account-option-copy">
                  <strong>{option.title}</strong>
                  <small>{option.subtitle}</small>
                </span>
                <Icon name="chevron" size={19} />
              </button>
            ))}
          </div>
        </section>
        <button
          className="logout-option"
          type="button"
          onClick={() => setMessage("You have been signed out.")}
        >
          <span className="logout-icon">
            <Icon name="logout" size={20} />
          </span>
          <span className="account-option-copy">
            <strong>Log Out</strong>
            <small>Sign out from your account</small>
          </span>
          <Icon name="chevron" size={19} />
        </button>
        <Link className="profile-back-link" href="/">
          Back to Muntazir & Sons
        </Link>
        {message && (
          <button
            className="profile-message"
            type="button"
            onClick={() => setMessage("")}
            role="status"
          >
            {message}
            <span>Dismiss</span>
          </button>
        )}
      </main>
    </>
  );
}
