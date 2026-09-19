"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type TabKey =
  | "dashboard"
  | "products"
  | "categories"
  | "collections"
  | "orders"
  | "customers"
  | "inventory"
  | "discounts"
  | "reviews"
  | "settings"
  | "logout";

type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

type NavItem = {
  key: TabKey;
  label: string;
  icon: string;
  href?: string;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    href: "/admin",
  },
  {
    key: "products",
    label: "Products",
    icon: "fa-solid fa-cube",
    href: "/admin/products",
  },
  {
    key: "categories",
    label: "Categories",
    icon: "fa-solid fa-tags",
    href: "/admin/categories",
  },
  {
    key: "collections",
    label: "Collections",
    icon: "fa-solid fa-layer-group",
    href: "/admin/collections",
  },
  {
    key: "orders",
    label: "Orders",
    icon: "fa-solid fa-bag-shopping",
    href: "/admin/orders",
  },
  {
    key: "customers",
    label: "Customers",
    icon: "fa-solid fa-user-group",
    href: "/admin/customers",
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: "fa-solid fa-boxes-stacked",
    href: "/admin/inventory",
  },
  {
    key: "discounts",
    label: "Promotions",
    icon: "fa-solid fa-percent",
    href: "/admin/promotions",
  },
  {
    key: "reviews",
    label: "Reviews",
    icon: "fa-solid fa-star",
    href: "/admin/reviews",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "fa-solid fa-gear",
    href: "/admin/settings",
  },
  { key: "logout", label: "Logout", icon: "fa-solid fa-right-from-bracket" },
];

const dashboardStats = [
  {
    label: "Total products",
    value: "1,284",
    change: "+12.4%",
    tone: "success",
  },
  { label: "Total orders", value: "3,842", change: "+8.1%", tone: "info" },
  { label: "Pending orders", value: "184", change: "-3.2%", tone: "warning" },
  {
    label: "Completed orders",
    value: "2,948",
    change: "+11.8%",
    tone: "success",
  },
  { label: "Revenue", value: "PKR 14.8M", change: "+18.7%", tone: "success" },
  { label: "Customers", value: "2,106", change: "+7.4%", tone: "info" },
] as const;

const defaultOrderRows: AdminOrderRow[] = [
  {
    id: "#A-2048",
    customer: "Ayesha Khan",
    amount: "PKR 92,500",
    status: "Processing",
    date: "Today, 11:40 AM",
  },
  {
    id: "#A-2047",
    customer: "Bilal Ahmed",
    amount: "PKR 58,000",
    status: "Shipped",
    date: "Today, 09:15 AM",
  },
  {
    id: "#A-2046",
    customer: "Sana Mir",
    amount: "PKR 135,000",
    status: "Delivered",
    date: "Yesterday",
  },
  {
    id: "#A-2045",
    customer: "Hassan Raza",
    amount: "PKR 74,200",
    status: "Pending",
    date: "Yesterday",
  },
];

const recentProducts = [
  {
    name: "Almond Cane Accent Chair",
    category: "Living Room",
    stock: "18 in stock",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=240&q=80",
  },
  {
    name: "Nilo Dining Table",
    category: "Dining",
    stock: "6 in stock",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=240&q=80",
  },
  {
    name: "Haven Platform Bed",
    category: "Bedroom",
    stock: "9 in stock",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=240&q=80",
  },
  {
    name: "Luma Storage Cabinet",
    category: "Storage",
    stock: "12 in stock",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=240&q=80",
  },
];

const revenueBars = [
  { label: "Mon", value: "PKR 68,000", height: 58 },
  { label: "Tue", value: "PKR 74,000", height: 64 },
  { label: "Wed", value: "PKR 92,000", height: 78 },
  { label: "Thu", value: "PKR 81,000", height: 71 },
  { label: "Fri", value: "PKR 108,000", height: 92 },
  { label: "Sat", value: "PKR 96,000", height: 84 },
  { label: "Sun", value: "PKR 88,000", height: 76 },
];

const quickActions = [
  {
    label: "Add product",
    icon: "fa-solid fa-plus",
    href: "/admin/products",
    action: "Product form opened",
  },
  {
    label: "Manage inventory",
    icon: "fa-solid fa-boxes-stacked",
    href: "/admin/inventory",
    action: "Inventory dashboard opened",
  },
  {
    label: "New order",
    icon: "fa-solid fa-truck",
    href: "/admin/orders",
    action: "Order queue opened",
  },
  {
    label: "Create promo",
    icon: "fa-solid fa-tag",
    href: "/admin/promotions",
    action: "Promotion editor opened",
  },
  {
    label: "Customers",
    icon: "fa-solid fa-user-group",
    href: "/admin/customers",
    action: "Customer list opened",
  },
  {
    label: "Reviews",
    icon: "fa-solid fa-star",
    href: "/admin/reviews",
    action: "Reviews panel opened",
  },
  {
    label: "Categories",
    icon: "fa-solid fa-tags",
    href: "/admin/categories",
    action: "Category manager opened",
  },
  {
    label: "Export report",
    icon: "fa-solid fa-file-export",
    href: null,
    action: "Report export started",
  },
] as const;

const defaultProductRows: AdminProductRow[] = [
  {
    name: "Almond Cane Accent Chair",
    sku: "AC-2104",
    category: "Living Room",
    price: "PKR 42,000",
    stock: 18,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=240&q=80",
    description:
      "Cane detailing and a softly curved frame for a favourite corner.",
    tag: "20% off",
    originalPrice: "PKR 48,000",
  },
  {
    name: "Nilo Dining Table",
    sku: "DT-8021",
    category: "Dining",
    price: "PKR 96,500",
    stock: 5,
    status: "Low stock",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=240&q=80",
    description: "Made for generous meals and the people who stay after them.",
    tag: "New",
  },
  {
    name: "Haven Platform Bed",
    sku: "HB-4457",
    category: "Bedroom",
    price: "PKR 148,000",
    stock: 9,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=240&q=80",
    description: "A generous upholstered bed with considered storage beneath.",
    tag: "Bestseller",
    originalPrice: "PKR 165,000",
  },
  {
    name: "Luma Storage Cabinet",
    sku: "SC-1802",
    category: "Storage",
    price: "PKR 66,000",
    stock: 0,
    status: "Out of stock",
    image:
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=240&q=80",
    description:
      "A quiet storage cabinet designed to keep essentials neatly tucked away.",
    tag: "Popular",
  },
  {
    name: "Pindora Accent Stool",
    sku: "AS-9154",
    category: "Accessories",
    price: "PKR 19,800",
    stock: 31,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=240&q=80",
    description:
      "A compact stool with a sculptural silhouette and layered texture.",
    tag: "Draft",
  },
];

const defaultCategoryRows: AdminCategoryRow[] = [
  {
    name: "Living Room",
    copy: "Make room for good company.",
    products: 186,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dining Room",
    copy: "Gather around something beautiful.",
    products: 94,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Bedroom",
    copy: "Quiet forms for better rest.",
    products: 122,
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Storage",
    copy: "Order for the things you love.",
    products: 71,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Office",
    copy: "A little more focus, made comfortable.",
    products: 42,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Decor",
    copy: "The details make the room.",
    products: 58,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  },
];

const defaultCollectionRows: AdminCollectionRow[] = [
  {
    name: "Urban Comfort",
    description: "Warm textures and everyday ease for the main room.",
    products: 24,
    featured: true,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Soft Living",
    description: "A quieter palette that makes every corner feel restful.",
    products: 17,
    featured: false,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Material Study",
    description: "Contrast, texture, and tone in a considered edit.",
    products: 13,
    featured: true,
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
  },
];

const defaultCustomerRows: AdminCustomerRow[] = [
  {
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    phone: "+92 300 1112233",
    orders: 12,
    spend: "PKR 586,000",
    status: "Active",
    joined: "12 Jan 2026",
  },
  {
    name: "Bilal Ahmed",
    email: "bilal@example.com",
    phone: "+92 301 2223344",
    orders: 8,
    spend: "PKR 410,120",
    status: "Active",
    joined: "28 Feb 2026",
  },
  {
    name: "Sana Mir",
    email: "sana@example.com",
    phone: "+92 302 3334455",
    orders: 16,
    spend: "PKR 891,400",
    status: "VIP",
    joined: "04 Mar 2026",
  },
  {
    name: "Hassan Raza",
    email: "hassan@example.com",
    phone: "+92 303 4445566",
    orders: 4,
    spend: "PKR 204,500",
    status: "Inactive",
    joined: "19 Apr 2026",
  },
];

const defaultInventoryRows: AdminInventoryRow[] = [
  {
    name: "Almond Cane Accent Chair",
    sku: "AC-2104",
    available: 18,
    reorder: 10,
    status: "Healthy",
  },
  {
    name: "Nilo Dining Table",
    sku: "DT-8021",
    available: 5,
    reorder: 12,
    status: "Low stock",
  },
  {
    name: "Haven Platform Bed",
    sku: "HB-4457",
    available: 9,
    reorder: 8,
    status: "Healthy",
  },
  {
    name: "Luma Storage Cabinet",
    sku: "SC-1802",
    available: 0,
    reorder: 15,
    status: "Out of stock",
  },
];

const defaultPromoRows: AdminPromoRow[] = [
  {
    code: "FURNISH20",
    type: "Percentage",
    discount: "20%",
    status: "Active",
    usage: "1,342 / 2,000",
  },
  {
    code: "HOME10",
    type: "Percentage",
    discount: "10%",
    status: "Scheduled",
    usage: "0 / 500",
  },
  {
    code: "WEEKEND50",
    type: "Fixed",
    discount: "PKR 5,000",
    status: "Active",
    usage: "420 / 600",
  },
];

const defaultReviewRows: AdminReviewRow[] = [
  {
    customer: "Ayesha Khan",
    product: "Almond Cane Accent Chair",
    rating: 5,
    comment: "Beautiful finish and very comfortable.",
    status: "Published",
    date: "10 Sep 2026",
  },
  {
    customer: "Bilal Ahmed",
    product: "Nilo Dining Table",
    rating: 4,
    comment: "Excellent quality and very stable.",
    status: "Pending",
    date: "09 Sep 2026",
  },
  {
    customer: "Sana Mir",
    product: "Haven Platform Bed",
    rating: 5,
    comment: "Looks premium and feels solid.",
    status: "Published",
    date: "08 Sep 2026",
  },
];

const settingsSections = [
  "Store Information",
  "Admin Profile",
  "Notification Preferences",
  "Order Settings",
  "Delivery & Shipping",
  "Security",
  "Appearance",
];

type SettingsFlags = {
  orderEmails: boolean;
  lowStockAlerts: boolean;
  reviewAlerts: boolean;
  guestCheckout: boolean;
  autoConfirmOrders: boolean;
  deliveryUpdates: boolean;
  twoFactorAuth: boolean;
  compactMode: boolean;
};

type AdminProfile = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
};

type CropSettings = {
  zoom: number;
  x: number;
  y: number;
};

type AdminNotification = {
  id: number;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

type AdminCategoryRow = {
  name: string;
  copy: string;
  image: string;
  status: "Active" | "Inactive";
  products: number;
};

type AdminCustomerRow = {
  name: string;
  email: string;
  phone: string;
  orders: number;
  spend: string;
  status: "Active" | "VIP" | "Inactive";
  joined: string;
};

type AdminOrderRow = {
  id: string;
  customer: string;
  amount: string;
  status: "Processing" | "Shipped" | "Delivered" | "Pending";
  date: string;
};
type AdminInventoryRow = {
  name: string;
  sku: string;
  available: number;
  reorder: number;
  status: "Healthy" | "Low stock" | "Out of stock";
};
type AdminPromoRow = {
  code: string;
  type: "Percentage" | "Fixed";
  discount: string;
  status: "Active" | "Scheduled" | "Paused";
  usage: string;
};
type AdminReviewRow = {
  customer: string;
  product: string;
  rating: number;
  comment: string;
  status: "Published" | "Pending";
  date: string;
};

type AdminCollectionRow = {
  name: string;
  description: string;
  image: string;
  status: "Active" | "Draft";
  products: number;
  featured: boolean;
};

type AdminProductRow = {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Low stock" | "Out of stock" | "Draft";
  image: string;
  description: string;
  tag?: string;
  originalPrice?: string;
};

type ExportFile = {
  name: string;
  content: string;
  type: string;
};

const badgeClass = (tone: StatusTone) =>
  ({
    success: "status-badge success",
    warning: "status-badge warning",
    danger: "status-badge danger",
    info: "status-badge info",
    neutral: "status-badge neutral",
  })[tone];

const defaultProfile: AdminProfile = {
  name: "Muntazir Khan",
  email: "admin@muntazirandsons.com",
  phone: "+92 300 1234567",
  avatar: "",
};

const defaultNotifications: AdminNotification[] = [
  {
    id: 1,
    title: "New order received",
    detail: "Order #A-2048 is ready for processing.",
    time: "12 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Low stock alert",
    detail: "Nilo Dining Table has reached its reorder level.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    title: "Review awaiting approval",
    detail: "Bilal Ahmed left a review for Nilo Dining Table.",
    time: "Yesterday",
    unread: false,
  },
];

const defaultSettingsFlags: SettingsFlags = {
  orderEmails: true,
  lowStockAlerts: true,
  reviewAlerts: false,
  guestCheckout: true,
  autoConfirmOrders: false,
  deliveryUpdates: true,
  twoFactorAuth: true,
  compactMode: false,
};

const readLocalStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocalStorage = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export default function AdminPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() =>
    readLocalStorage("muntazir-admin-sidebar", false),
  );
  const [search, setSearch] = useState("");
  const [activeSettingsSection, setActiveSettingsSection] =
    useState("Store Information");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [profile, setProfile] = useState<AdminProfile>(() =>
    readLocalStorage("muntazir-admin-profile", defaultProfile),
  );
  const [profileDraft, setProfileDraft] = useState<AdminProfile>(profile);
  const [categoryRows, setCategoryRows] = useState<AdminCategoryRow[]>(() =>
    readLocalStorage("muntazir-admin-categories", defaultCategoryRows),
  );
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryFormDraft, setCategoryFormDraft] = useState({
    name: "",
    copy: "",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    status: "Active" as AdminCategoryRow["status"],
  });
  const [collectionRows, setCollectionRows] = useState<AdminCollectionRow[]>(
    () => readLocalStorage("muntazir-admin-collections", defaultCollectionRows),
  );
  const [collectionFormOpen, setCollectionFormOpen] = useState(false);
  const [collectionDraft, setCollectionDraft] = useState({
    name: "",
    description: "",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    featured: false,
    status: "Active" as AdminCollectionRow["status"],
  });
  const [collectionEditIndex, setCollectionEditIndex] = useState<number | null>(
    null,
  );
  const [customerRows, setCustomerRows] = useState<AdminCustomerRow[]>(() =>
    readLocalStorage("muntazir-admin-customers", defaultCustomerRows),
  );
  const [customerFormOpen, setCustomerFormOpen] = useState(false);
  const [customerEditIndex, setCustomerEditIndex] = useState<number | null>(
    null,
  );
  const [customerStatusFilter, setCustomerStatusFilter] = useState<
    "All" | AdminCustomerRow["status"]
  >("All");
  const [customerDraft, setCustomerDraft] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active" as AdminCustomerRow["status"],
  });
  const [orderRows, setOrderRows] = useState<AdminOrderRow[]>(() =>
    readLocalStorage("muntazir-admin-orders", defaultOrderRows),
  );
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderDraft, setOrderDraft] = useState({
    customer: "",
    amount: "",
    status: "Pending" as AdminOrderRow["status"],
  });
  const [inventoryState, setInventoryState] = useState<AdminInventoryRow[]>(
    () => readLocalStorage("muntazir-admin-inventory", defaultInventoryRows),
  );
  const [promoState, setPromoState] = useState<AdminPromoRow[]>(() =>
    readLocalStorage("muntazir-admin-promotions", defaultPromoRows),
  );
  const [promoFormOpen, setPromoFormOpen] = useState(false);
  const [promoDraft, setPromoDraft] = useState({
    code: "",
    type: "Percentage" as AdminPromoRow["type"],
    discount: "",
    status: "Active" as AdminPromoRow["status"],
  });
  const [reviewState, setReviewState] = useState<AdminReviewRow[]>(() =>
    readLocalStorage("muntazir-admin-reviews", defaultReviewRows),
  );
  const [productRows, setProductRows] = useState<AdminProductRow[]>(() =>
    readLocalStorage("muntazir-admin-product-rows", defaultProductRows),
  );
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productFormDraft, setProductFormDraft] = useState({
    name: "",
    category: "Living Room",
    price: "",
    originalPrice: "",
    stock: "1",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    description: "",
    tag: "",
    status: "Active" as AdminProductRow["status"],
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [cropSource, setCropSource] = useState("");
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    zoom: 1,
    x: 0,
    y: 0,
  });
  const [cropOpen, setCropOpen] = useState(false);
  const cropDrag = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const pendingProfileAction = useRef<(() => void) | null>(null);
  const allowProfileNavigation = useRef(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<
    "idle" | "processing" | "ready"
  >("idle");
  const [exportProgress, setExportProgress] = useState(0);
  const [exportDuration, setExportDuration] = useState(5000);
  const [exportMode, setExportMode] = useState<
    | "dashboard"
    | "customers"
    | "orders"
    | "inventory"
    | "promotions"
    | "reviews"
  >("dashboard");
  const [exportFiles, setExportFiles] = useState<ExportFile[]>([]);
  const [selectedExportFiles, setSelectedExportFiles] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    readLocalStorage("muntazir-admin-notifications", defaultNotifications),
  );
  const [settingsFlags, setSettingsFlags] = useState<SettingsFlags>(() =>
    readLocalStorage("muntazir-admin-settings", defaultSettingsFlags),
  );

  useEffect(() => {
    writeLocalStorage("muntazir-admin-sidebar", sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-profile", profile);
  }, [profile]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-categories", categoryRows);
  }, [categoryRows]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-collections", collectionRows);
  }, [collectionRows]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-customers", customerRows);
  }, [customerRows]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-orders", orderRows);
  }, [orderRows]);
  useEffect(() => {
    writeLocalStorage("muntazir-admin-inventory", inventoryState);
  }, [inventoryState]);
  useEffect(() => {
    writeLocalStorage("muntazir-admin-promotions", promoState);
  }, [promoState]);
  useEffect(() => {
    writeLocalStorage("muntazir-admin-reviews", reviewState);
  }, [reviewState]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-product-rows", productRows);
  }, [productRows]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-notifications", notifications);
  }, [notifications]);

  useEffect(() => {
    writeLocalStorage("muntazir-admin-settings", settingsFlags);
  }, [settingsFlags]);

  useEffect(() => {
    if (exportStatus !== "processing") return;
    const progressStep = 84 / (exportDuration / 180);
    const progressTimer = window.setInterval(() => {
      setExportProgress((current) =>
        Math.min(Math.round(current + progressStep), 92),
      );
    }, 180);
    return () => window.clearInterval(progressTimer);
  }, [exportDuration, exportStatus]);

  const activeTab =
    navItems.find((item) => item.href === pathname)?.key ?? "dashboard";

  const createSku = (name: string) => {
    const code =
      name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 8) || "NEW";
    const suffix = String(productRows.length + 1).padStart(3, "0");
    return `${code}-${suffix}`;
  };

  const resetProductForm = () => {
    setProductFormDraft({
      name: "",
      category: "Living Room",
      price: "",
      originalPrice: "",
      stock: "1",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      description: "",
      tag: "",
      status: "Active",
    });
  };

  const addProduct = () => {
    const name = productFormDraft.name.trim();
    const category = productFormDraft.category.trim();
    const description = productFormDraft.description.trim();
    const priceValue = Number(productFormDraft.price);
    const stockValue = Number(productFormDraft.stock);

    if (
      !name ||
      !category ||
      !description ||
      !productFormDraft.price ||
      Number.isNaN(priceValue) ||
      Number.isNaN(stockValue)
    ) {
      showToast("Please complete all required product fields");
      return;
    }

    const safeImage =
      productFormDraft.image.trim() ||
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80";
    const normalizedStatus: AdminProductRow["status"] =
      stockValue === 0
        ? "Out of stock"
        : stockValue < 10
          ? "Low stock"
          : productFormDraft.status;
    const nextProduct: AdminProductRow = {
      name,
      sku: createSku(name),
      category,
      price: `PKR ${new Intl.NumberFormat("en-PK").format(priceValue)}`,
      stock: stockValue,
      status: normalizedStatus,
      image: safeImage,
      description,
      tag: productFormDraft.tag.trim() || undefined,
      originalPrice:
        productFormDraft.originalPrice &&
        !Number.isNaN(Number(productFormDraft.originalPrice))
          ? `PKR ${new Intl.NumberFormat("en-PK").format(Number(productFormDraft.originalPrice))}`
          : undefined,
    };

    setProductRows((current) => [nextProduct, ...current]);
    setProductFormOpen(false);
    resetProductForm();
    showToast("Product added successfully");
  };

  const resetCategoryForm = () => {
    setCategoryFormDraft({
      name: "",
      copy: "",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      status: "Active",
    });
  };

  const addCategory = () => {
    const name = categoryFormDraft.name.trim();
    const copy = categoryFormDraft.copy.trim();
    const image = categoryFormDraft.image.trim();

    if (!name || !copy || !image) {
      showToast("Please complete all required category fields");
      return;
    }

    setCategoryRows((current) => [
      {
        name,
        copy,
        image,
        status: categoryFormDraft.status,
        products: 0,
      },
      ...current,
    ]);
    setCategoryFormOpen(false);
    resetCategoryForm();
    showToast("Category added successfully");
  };

  const resetCollectionForm = () => {
    setCollectionDraft({
      name: "",
      description: "",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      featured: false,
      status: "Active",
    });
    setCollectionEditIndex(null);
  };

  const saveCollection = () => {
    const name = collectionDraft.name.trim();
    const description = collectionDraft.description.trim();
    const image = collectionDraft.image.trim();

    if (!name || !description || !image) {
      showToast("Please complete all required collection fields");
      return;
    }

    const nextCollection: AdminCollectionRow = {
      name,
      description,
      image,
      status: collectionDraft.status,
      featured: collectionDraft.featured,
      products:
        collectionEditIndex !== null
          ? (collectionRows[collectionEditIndex]?.products ?? 0)
          : 0,
    };

    if (collectionEditIndex !== null) {
      setCollectionRows((current) =>
        current.map((collection, index) =>
          index === collectionEditIndex ? nextCollection : collection,
        ),
      );
      showToast("Collection updated successfully");
    } else {
      setCollectionRows((current) => [nextCollection, ...current]);
      showToast("Collection added successfully");
    }

    setCollectionFormOpen(false);
    resetCollectionForm();
  };

  const removeCollection = (name: string) => {
    setCollectionRows((current) =>
      current.filter((collection) => collection.name !== name),
    );
    showToast(`${name} removed`);
  };

  const openCollectionEditor = (
    collection: AdminCollectionRow,
    index: number,
  ) => {
    setCollectionDraft({
      name: collection.name,
      description: collection.description,
      image: collection.image,
      featured: collection.featured,
      status: collection.status,
    });
    setCollectionEditIndex(index);
    setCollectionFormOpen(true);
  };

  const resetCustomerForm = () => {
    setCustomerDraft({ name: "", email: "", phone: "", status: "Active" });
    setCustomerEditIndex(null);
  };

  const saveCustomer = () => {
    const name = customerDraft.name.trim();
    const email = customerDraft.email.trim().toLowerCase();
    const phone = customerDraft.phone.trim();
    if (!name || !email || !phone || !/^\S+@\S+\.\S+$/.test(email)) {
      showToast("Enter a valid name, email, and phone number");
      return;
    }
    const duplicateEmail = customerRows.some(
      (customer, index) =>
        customer.email === email && index !== customerEditIndex,
    );
    if (duplicateEmail) {
      showToast("A customer with this email already exists");
      return;
    }
    const nextCustomer: AdminCustomerRow =
      customerEditIndex === null
        ? {
            name,
            email,
            phone,
            status: customerDraft.status,
            orders: 0,
            spend: "PKR 0",
            joined: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          }
        : {
            ...customerRows[customerEditIndex],
            name,
            email,
            phone,
            status: customerDraft.status,
          };
    if (customerEditIndex === null) {
      setCustomerRows((current) => [nextCustomer, ...current]);
      showToast("Customer added successfully");
    } else {
      setCustomerRows((current) =>
        current.map((customer, index) =>
          index === customerEditIndex ? nextCustomer : customer,
        ),
      );
      showToast("Customer updated successfully");
    }
    setCustomerFormOpen(false);
    resetCustomerForm();
  };

  const openCustomerEditor = (customer: AdminCustomerRow, index: number) => {
    setCustomerDraft({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
    });
    setCustomerEditIndex(index);
    setCustomerFormOpen(true);
  };

  const removeCustomer = (email: string) => {
    setCustomerRows((current) =>
      current.filter((customer) => customer.email !== email),
    );
    showToast("Customer removed");
  };

  const openCustomerExport = () => openExportDialog("customers");
  const openOperationalExport = (
    mode: "orders" | "inventory" | "promotions" | "reviews",
  ) => openExportDialog(mode);

  const createCustomerExportFiles = () => {
    const csv = [
      ["Name", "Email", "Phone", "Orders", "Total spend", "Status", "Joined"],
      ...customerRows.map((customer) => [
        customer.name,
        customer.email,
        customer.phone,
        customer.orders,
        customer.spend,
        customer.status,
        customer.joined,
      ]),
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");
    const generatedAt = new Date().toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const escapeHtml = (value: string | number) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const rows = customerRows
      .map(
        (customer) =>
          `<tr><td>${escapeHtml(customer.name)}</td><td>${escapeHtml(customer.email)}</td><td>${escapeHtml(customer.phone)}</td><td>${customer.orders}</td><td>${escapeHtml(customer.spend)}</td><td>${escapeHtml(customer.status)}</td><td>${escapeHtml(customer.joined)}</td></tr>`,
      )
      .join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Muntazir Customer Report</title><style>body{max-width:1100px;margin:0 auto;padding:48px;font-family:Georgia,'Times New Roman',serif;color:#20201e}header{border-bottom:2px solid #20201e;padding-bottom:18px}h1{font-weight:500;margin:8px 0}p{color:#6c6962;font-size:13px}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{text-align:left;padding:9px;border-bottom:1px solid #ddd8cf;font-size:13px}th{background:#f0ece4}@media print{@page{margin:16mm}body{padding:0}}</style></head><body><header><p>Muntazir Admin / CRM</p><h1>Customer report</h1><p>Generated ${escapeHtml(generatedAt)} · ${customerRows.length} customers</p></header><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total spend</th><th>Status</th><th>Joined</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const json = JSON.stringify(
      { generatedAt, customers: customerRows },
      null,
      2,
    );
    setExportFiles([
      {
        name: "muntazir-customers.html",
        content: html,
        type: "text/html;charset=utf-8",
      },
      {
        name: "muntazir-customers.csv",
        content: csv,
        type: "text/csv;charset=utf-8",
      },
      {
        name: "muntazir-customers.json",
        content: json,
        type: "application/json;charset=utf-8",
      },
    ]);
    setSelectedExportFiles([
      "muntazir-customers.html",
      "muntazir-customers.csv",
      "muntazir-customers.json",
    ]);
    setExportProgress(100);
    setExportStatus("ready");
  };

  const profileDirty =
    profileOpen && JSON.stringify(profileDraft) !== JSON.stringify(profile);

  const runProfileAction = (action: () => void) => {
    if (!profileDirty) {
      action();
      return;
    }
    pendingProfileAction.current = action;
    setDiscardConfirmOpen(true);
  };

  const navigateTo = (item: NavItem) => {
    if (item.key === "logout") {
      if (profileDirty) {
        runProfileAction(() => setLogoutConfirmOpen(true));
      } else {
        setLogoutConfirmOpen(true);
      }
      return;
    }

    if (item.href) runProfileAction(() => router.push(item.href as string));
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const openExportDialog = (
    mode:
      | "dashboard"
      | "customers"
      | "orders"
      | "inventory"
      | "promotions"
      | "reviews" = "dashboard",
  ) => {
    setExportMode(mode);
    setExportStatus("idle");
    setExportProgress(0);
    setExportFiles([]);
    setSelectedExportFiles([]);
    setExportOpen(true);
  };

  const downloadExportFiles = () => {
    const filesToDownload = exportFiles.filter((file) =>
      selectedExportFiles.includes(file.name),
    );
    if (!filesToDownload.length) {
      showToast("Select at least one file to download");
      return;
    }
    filesToDownload.forEach((file) => {
      const blobUrl = URL.createObjectURL(
        new Blob([file.content], { type: file.type }),
      );
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    });
    showToast(
      `${filesToDownload.length} report ${filesToDownload.length === 1 ? "file" : "files"} downloaded`,
    );
  };

  const shareExportFiles = async () => {
    if (!navigator.share) {
      showToast("Sharing is not supported in this browser");
      return;
    }
    const files = exportFiles
      .filter((file) => selectedExportFiles.includes(file.name))
      .map((file) => new File([file.content], file.name, { type: file.type }));
    if (!files.length) {
      showToast("Select at least one file to share");
      return;
    }
    if (navigator.canShare && !navigator.canShare({ files })) {
      showToast("File sharing is not supported in this browser");
      return;
    }
    try {
      const exportTitle =
        exportMode === "customers"
          ? "customer"
          : exportMode === "dashboard"
            ? "dashboard"
            : exportMode;
      await navigator.share({
        title: `Muntazir ${exportTitle} report`,
        text: `${exportTitle} report files`,
        files,
      });
      showToast("Report shared successfully");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      showToast("Report sharing was not completed");
    }
  };

  const startDashboardExport = () => {
    const duration = Math.floor(5000 + Math.random() * 5001);
    setExportStatus("processing");
    setExportProgress(8);
    setExportDuration(duration);
    window.setTimeout(() => {
      if (exportMode === "customers") createCustomerExportFiles();
      else if (exportMode === "dashboard") exportDashboardReport();
      else exportOperationalFiles(exportMode);
    }, duration);
  };

  const exportOperationalFiles = (
    mode: "orders" | "inventory" | "promotions" | "reviews",
  ) => {
    const definitions = {
      orders: {
        title: "Orders",
        headers: ["Order", "Customer", "Amount", "Status", "Date"],
        rows: orderRows.map((row) => [
          row.id,
          row.customer,
          row.amount,
          row.status,
          row.date,
        ]),
      },
      inventory: {
        title: "Inventory",
        headers: ["Product", "SKU", "Available", "Reorder at", "Status"],
        rows: inventoryState.map((row) => [
          row.name,
          row.sku,
          row.available,
          row.reorder,
          row.status,
        ]),
      },
      promotions: {
        title: "Promotions",
        headers: ["Code", "Type", "Discount", "Status", "Usage"],
        rows: promoState.map((row) => [
          row.code,
          row.type,
          row.discount,
          row.status,
          row.usage,
        ]),
      },
      reviews: {
        title: "Reviews",
        headers: ["Customer", "Product", "Rating", "Comment", "Status", "Date"],
        rows: reviewState.map((row) => [
          row.customer,
          row.product,
          row.rating,
          row.comment,
          row.status,
          row.date,
        ]),
      },
    }[mode];
    const generatedAt = new Date().toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const csv = [definitions.headers, ...definitions.rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");
    const escapeHtml = (value: string | number) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const htmlRows = definitions.rows
      .map(
        (row) =>
          `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`,
      )
      .join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Muntazir ${definitions.title} Report</title><style>body{max-width:1100px;margin:0 auto;padding:48px;font-family:Georgia,'Times New Roman',serif;color:#20201e}header{border-bottom:2px solid #20201e;padding-bottom:18px}h1{font-weight:500;margin:8px 0}p{color:#6c6962;font-size:13px}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{text-align:left;padding:9px;border-bottom:1px solid #ddd8cf;font-size:13px}th{background:#f0ece4}@media print{@page{margin:16mm}body{padding:0}}</style></head><body><header><p>Muntazir Admin / Operations</p><h1>${definitions.title} report</h1><p>Generated ${escapeHtml(generatedAt)}</p></header><table><thead><tr>${definitions.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${htmlRows}</tbody></table></body></html>`;
    setExportFiles([
      {
        name: `muntazir-${mode}.html`,
        content: html,
        type: "text/html;charset=utf-8",
      },
      {
        name: `muntazir-${mode}.csv`,
        content: csv,
        type: "text/csv;charset=utf-8",
      },
      {
        name: `muntazir-${mode}.json`,
        content: JSON.stringify(
          { generatedAt, rows: definitions.rows },
          null,
          2,
        ),
        type: "application/json;charset=utf-8",
      },
    ]);
    setSelectedExportFiles([
      `muntazir-${mode}.html`,
      `muntazir-${mode}.csv`,
      `muntazir-${mode}.json`,
    ]);
    setExportProgress(100);
    setExportStatus("ready");
  };

  const addOrder = () => {
    const customer = orderDraft.customer.trim();
    const amount = orderDraft.amount.trim();
    if (!customer || !amount) {
      showToast("Customer and amount are required");
      return;
    }
    const nextId = `#A-${2049 + orderRows.length}`;
    setOrderRows((current) => [
      {
        id: nextId,
        customer,
        amount: amount.startsWith("PKR") ? amount : `PKR ${amount}`,
        status: orderDraft.status,
        date: "Just now",
      },
      ...current,
    ]);
    setOrderFormOpen(false);
    setOrderDraft({ customer: "", amount: "", status: "Pending" });
    showToast("Order created successfully");
  };

  const addPromotion = () => {
    const code = promoDraft.code.trim().toUpperCase();
    const discount = promoDraft.discount.trim();
    if (!code || !discount) {
      showToast("Code and discount are required");
      return;
    }
    if (promoState.some((promo) => promo.code === code)) {
      showToast("A promotion with this code already exists");
      return;
    }
    setPromoState((current) => [
      {
        code,
        type: promoDraft.type,
        discount,
        status: promoDraft.status,
        usage: "0 / 0",
      },
      ...current,
    ]);
    setPromoFormOpen(false);
    setPromoDraft({
      code: "",
      type: "Percentage",
      discount: "",
      status: "Active",
    });
    showToast("Promotion created successfully");
  };

  const exportDashboardReport = () => {
    const generatedAt = new Date().toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const escapeHtml = (value: string | number) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    const csvCell = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;
    const reportRows = dashboardStats
      .map(
        (stat) =>
          `<tr><th>${escapeHtml(stat.label)}</th><td>${escapeHtml(stat.value)}</td><td>${escapeHtml(stat.change)}</td></tr>`,
      )
      .join("");
    const revenueRows = revenueBars
      .map(
        (bar) =>
          `<tr><td>${escapeHtml(bar.label)}</td><td>${escapeHtml(bar.value)}</td><td>${bar.height}%</td></tr>`,
      )
      .join("");
    const orderTableRows = orderRows
      .map(
        (order) =>
          `<tr><td>${escapeHtml(order.id)}</td><td>${escapeHtml(order.customer)}</td><td>${escapeHtml(order.amount)}</td><td>${escapeHtml(order.status)}</td><td>${escapeHtml(order.date)}</td></tr>`,
      )
      .join("");
    const productRowsHtml = productRows
      .map(
        (product) =>
          `<tr><td>${escapeHtml(product.name)}</td><td>${escapeHtml(product.sku)}</td><td>${escapeHtml(product.category)}</td><td>${escapeHtml(product.price)}</td><td>${product.stock}</td><td>${escapeHtml(product.status)}</td></tr>`,
      )
      .join("");
    const reportHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Muntazir Admin Dashboard Report</title><style>:root{font-family:Georgia,'Times New Roman',serif;color:#20201e;background:#f4f1eb}body{max-width:1100px;margin:0 auto;padding:48px;background:#fffdf9}header{display:flex;justify-content:space-between;gap:24px;align-items:end;border-bottom:2px solid #20201e;padding-bottom:20px}h1{margin:0 0 8px;font-size:34px;font-weight:500}h2{margin:34px 0 12px;font-size:19px;font-weight:500}p,td,th{font-size:13px;line-height:1.45}.muted{color:#6c6962;margin:0}.print{border:0;background:#d85c2b;color:#fff;padding:10px 16px;cursor:pointer;border-radius:4px}.note{background:#f0ece4;padding:14px 16px;margin:22px 0}table{width:100%;border-collapse:collapse;margin-bottom:24px}th,td{text-align:left;padding:9px 10px;border-bottom:1px solid #ddd8cf}thead th{background:#f0ece4;font-weight:600}tbody th{font-weight:500;width:35%}.footer{border-top:1px solid #ddd8cf;padding-top:16px;margin-top:34px}@media print{@page{margin:16mm}body{padding:0;max-width:none}.print{display:none}h2{break-after:avoid}table{break-inside:avoid}}</style></head><body><header><div><p class="muted">Muntazir Admin / Performance</p><h1>Dashboard report</h1><p class="muted">Generated ${escapeHtml(generatedAt)}</p></div><button class="print" onclick="window.print()">Print report</button></header><div class="note"><strong>Revenue overview:</strong> Monthly revenue is PKR 607,000. This report reflects the dashboard data available at export time.</div><h2>Performance summary</h2><table><thead><tr><th>Metric</th><th>Value</th><th>Change</th></tr></thead><tbody>${reportRows}</tbody></table><h2>Revenue overview</h2><table><thead><tr><th>Day</th><th>Revenue</th><th>Chart value</th></tr></thead><tbody>${revenueRows}</tbody></table><h2>Recent orders</h2><table><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>${orderTableRows}</tbody></table><h2>Current catalog snapshot</h2><table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>${productRowsHtml}</tbody></table><p class="muted footer">Prepared from the current admin dashboard. Product data includes local changes saved in this browser.</p></body></html>`;
    const csvLines = [
      ["Muntazir Admin Dashboard Report"],
      ["Generated", generatedAt],
      [],
      ["Performance summary"],
      ["Metric", "Value", "Change"],
      ...dashboardStats.map((stat) => [stat.label, stat.value, stat.change]),
      [],
      ["Revenue overview"],
      ["Day", "Revenue", "Chart value"],
      ...revenueBars.map((bar) => [bar.label, bar.value, `${bar.height}%`]),
      [],
      ["Recent orders"],
      ["Order", "Customer", "Amount", "Status", "Date"],
      ...orderRows.map((order) => [
        order.id,
        order.customer,
        order.amount,
        order.status,
        order.date,
      ]),
      [],
      ["Current catalog snapshot"],
      ["Product", "SKU", "Category", "Price", "Stock", "Status"],
      ...productRows.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.price,
        product.stock,
        product.status,
      ]),
    ]
      .map((row) => row.map(csvCell).join(","))
      .join("\r\n");
    const reportData = JSON.stringify(
      {
        generatedAt,
        stats: dashboardStats,
        revenue: revenueBars,
        orders: orderRows,
        products: productRows,
      },
      null,
      2,
    );
    setExportFiles([
      {
        name: "muntazir-dashboard-report.html",
        content: reportHtml,
        type: "text/html;charset=utf-8",
      },
      {
        name: "muntazir-dashboard-report.csv",
        content: csvLines,
        type: "text/csv;charset=utf-8",
      },
      {
        name: "muntazir-dashboard-report.json",
        content: reportData,
        type: "application/json;charset=utf-8",
      },
    ]);
    setSelectedExportFiles([
      "muntazir-dashboard-report.html",
      "muntazir-dashboard-report.csv",
      "muntazir-dashboard-report.json",
    ]);
    setExportProgress(100);
    setExportStatus("ready");
  };

  const unreadNotifications = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const markNotificationRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification,
      ),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, unread: false })),
    );
    showToast("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
    showToast("Notification deleted");
  };

  const openProfileEditor = () => {
    setProfileDraft(profile);
    setProfileOpen(true);
  };

  const saveProfile = () => {
    if (!profileDraft.name.trim() || !profileDraft.email.trim()) {
      showToast("Name and email are required");
      return;
    }
    setProfile(profileDraft);
    setProfileOpen(false);
    setDiscardConfirmOpen(false);
    showToast("Profile updated successfully");
  };

  const saveProfileAndContinue = () => {
    if (!profileDraft.name.trim() || !profileDraft.email.trim()) {
      showToast("Name and email are required");
      return;
    }
    setProfile(profileDraft);
    setProfileOpen(false);
    setDiscardConfirmOpen(false);
    showToast("Profile updated successfully");
    const action = pendingProfileAction.current;
    pendingProfileAction.current = null;
    action?.();
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    void fetch("/api/auth/logout", { method: "POST" }).finally(() =>
      router.replace("/admin/login"),
    );
  };

  const requestCloseProfile = () => {
    if (profileDirty) {
      pendingProfileAction.current = null;
      setDiscardConfirmOpen(true);
      return;
    }
    setProfileOpen(false);
  };

  const discardProfileChanges = () => {
    setProfileDraft(profile);
    setProfileOpen(false);
    setDiscardConfirmOpen(false);
    const action = pendingProfileAction.current;
    pendingProfileAction.current = null;
    action?.();
  };

  const handleProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(String(reader.result));
      setCropSettings({ zoom: 1, x: 0, y: 0 });
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleCropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    cropDrag.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: cropSettings.x,
      originY: cropSettings.y,
    };
  };

  const handleCropPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cropDrag.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX =
      cropDrag.current.originX +
      ((event.clientX - cropDrag.current.startX) / bounds.width) * 200;
    const nextY =
      cropDrag.current.originY +
      ((event.clientY - cropDrag.current.startY) / bounds.height) * 200;
    setCropSettings((current) => ({
      ...current,
      x: Math.max(-100, Math.min(100, nextX)),
      y: Math.max(-100, Math.min(100, nextY)),
    }));
  };

  const handleCropPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    cropDrag.current = null;
  };

  const handleCropWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setCropSettings((current) => ({
      ...current,
      zoom: Math.max(
        1,
        Math.min(3, current.zoom + (event.deltaY < 0 ? 0.05 : -0.05)),
      ),
    }));
  };

  const applyProfileCrop = () => {
    const image = new Image();
    image.onload = () => {
      const size = 512;
      const sourceSize =
        Math.min(image.naturalWidth, image.naturalHeight) / cropSettings.zoom;
      const maxX = image.naturalWidth - sourceSize;
      const maxY = image.naturalHeight - sourceSize;
      const sourceX =
        (image.naturalWidth - sourceSize) / 2 + (maxX * cropSettings.x) / 200;
      const sourceY =
        (image.naturalHeight - sourceSize) / 2 + (maxY * cropSettings.y) / 200;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        size,
        size,
      );
      setProfileDraft((current) => ({
        ...current,
        avatar: canvas.toDataURL("image/jpeg", 0.9),
      }));
      setCropOpen(false);
      setCropSource("");
    };
    image.src = cropSource;
  };

  useEffect(() => {
    if (!profileDirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (allowProfileNavigation.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const currentUrl = window.location.href;
    const guardState = { profileGuard: true };
    window.history.pushState(guardState, "", currentUrl);
    const handlePopState = () => {
      if (allowProfileNavigation.current) return;
      const destination = window.location.href;
      window.history.pushState(guardState, "", currentUrl);
      pendingProfileAction.current = () => {
        allowProfileNavigation.current = true;
        window.location.assign(destination);
      };
      setDiscardConfirmOpen(true);
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [profileDirty]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return productRows;
    return productRows.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );
  }, [search]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customerRows.filter((customer) => {
      const matchesQuery =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query);
      const matchesStatus =
        customerStatusFilter === "All" ||
        customer.status === customerStatusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [customerRows, customerStatusFilter, search]);

  const renderDashboard = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
        <button className="button primary" onClick={() => openExportDialog()}>
          Export report
        </button>
      </div>

      <div className="kpi-grid">
        {dashboardStats.map((card) => (
          <div className="stat-card" key={card.label}>
            <div className="stat-topline">
              <span>{card.label}</span>
              <span className={badgeClass(card.tone)}>{card.change}</span>
            </div>
            <strong>{card.value}</strong>
          </div>
        ))}
      </div>

      <div className="two-col-layout">
        <div className="panel-card chart-panel">
          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">Performance</p>
              <h3>Revenue overview</h3>
            </div>
            <span className="ghost-pill">This month</span>
          </div>
          <div className="chart-bars" aria-label="Revenue overview chart">
            {revenueBars.map((bar) => (
              <div key={bar.label} className="bar-wrap">
                <span className="bar-value">{bar.value}</span>
                <span className="bar" style={{ height: `${bar.height}%` }} />
                <small>{bar.label}</small>
              </div>
            ))}
          </div>
          <div className="chart-summary">
            <span>Monthly revenue</span>
            <strong>PKR 607,000</strong>
          </div>
        </div>

        <div className="panel-card panel-list">
          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">Quick actions</p>
              <h3>Operations</h3>
            </div>
          </div>
          <div className="quick-actions">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="action-item"
                onClick={() => {
                  if (action.href) {
                    router.push(action.href);
                    return;
                  }
                  openExportDialog();
                }}
              >
                <i className={action.icon} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col-layout">
        <div className="panel-card">
          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">Sales</p>
              <h3>Recent orders</h3>
            </div>
            <button
              className="text-button"
              onClick={() => router.push("/admin/orders")}
            >
              View all
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orderRows.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={`${badgeClass(order.status === "Delivered" ? "success" : order.status === "Pending" ? "warning" : "info")}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel-card">
          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">Inventory</p>
              <h3>Recent products</h3>
            </div>
          </div>
          <div className="mini-product-list">
            {recentProducts.map((product) => (
              <div className="mini-product" key={product.name}>
                <div
                  className="mini-thumb"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                </div>
                <em>{product.stock}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Products</h2>
        </div>
        <div className="header-actions-group">
          <button
            className="button secondary"
            onClick={() => showToast("Select a product to duplicate")}
          >
            Duplicate
          </button>
          <button
            className="button primary"
            onClick={() => {
              setProductFormOpen(true);
              resetProductForm();
            }}
          >
            Add product
          </button>
        </div>
      </div>

      <div className="toolbar panel-card">
        <div className="search-panel">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
          />
        </div>
        <div className="toolbar-controls">
          <select defaultValue="all">
            <option value="all">All categories</option>
            <option value="living">Living Room</option>
            <option value="dining">Dining</option>
            <option value="bedroom">Bedroom</option>
          </select>
          <select defaultValue="all-status">
            <option value="all-status">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="low">Low stock</option>
          </select>
        </div>
      </div>

      <div className="panel-card">
        <table className="data-table product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.sku}>
                <td>
                  <div className="product-name-cell">
                    <div
                      className="mini-thumb"
                      style={{ backgroundImage: `url(${product.image})` }}
                    />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.sku}</span>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span
                    className={
                      product.status === "Active"
                        ? "status-badge success"
                        : product.status === "Low stock"
                          ? "status-badge warning"
                          : product.status === "Out of stock"
                            ? "status-badge danger"
                            : "status-badge neutral"
                    }
                  >
                    {product.status}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      aria-label={`View ${product.name}`}
                      onClick={() => showToast(`Viewing ${product.name}`)}
                    >
                      <i className="fa-solid fa-eye" />
                    </button>
                    <button
                      className="icon-button"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => showToast(`Editing ${product.name}`)}
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      className="icon-button danger"
                      aria-label={`Delete ${product.name}`}
                      onClick={() =>
                        showToast(`${product.name} was not deleted`)
                      }
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Categories</h2>
        </div>
        <button
          className="button primary"
          onClick={() => {
            setCategoryFormOpen(true);
            resetCategoryForm();
          }}
        >
          Add category
        </button>
      </div>
      <div className="card-grid three-up">
        {categoryRows.map((category) => (
          <div
            className="category-card"
            key={`${category.name}-${category.products}`}
          >
            <div
              className="category-thumb"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <div className="category-info">
              <div className="title-row">
                <strong>{category.name}</strong>
                <span
                  className={
                    category.status === "Active"
                      ? "status-badge success"
                      : "status-badge neutral"
                  }
                >
                  {category.status}
                </span>
              </div>
              <p className="category-copy">{category.copy}</p>
              <div className="meta-row">
                <span>{category.products} products</span>
                <button
                  className="text-button"
                  onClick={() => showToast(`Editing ${category.name}`)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCollections = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Design</p>
          <h2>Collections</h2>
        </div>
        <button
          className="button primary"
          onClick={() => {
            resetCollectionForm();
            setCollectionFormOpen(true);
          }}
        >
          Create collection
        </button>
      </div>
      <div className="card-grid three-up">
        {collectionRows.map((collection, index) => (
          <div className="collection-card" key={`${collection.name}-${index}`}>
            <div
              className="collection-banner"
              style={{ backgroundImage: `url(${collection.image})` }}
            >
              {collection.featured && (
                <span className="feature-tag">Featured</span>
              )}
            </div>
            <div className="collection-body">
              <div className="title-row">
                <strong>{collection.name}</strong>
                <span
                  className={
                    collection.status === "Active"
                      ? "status-badge success"
                      : "status-badge neutral"
                  }
                >
                  {collection.status}
                </span>
              </div>
              <p className="category-copy">{collection.description}</p>
              <span>{collection.products} associated products</span>
              <div className="meta-row right-align">
                <button
                  className="text-button"
                  onClick={() => openCollectionEditor(collection, index)}
                >
                  Edit
                </button>
                <button
                  className="text-button danger"
                  onClick={() => removeCollection(collection.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Fulfillment</p>
          <h2>Orders</h2>
        </div>
        <div className="header-actions">
          <button
            className="button secondary"
            onClick={() => openOperationalExport("orders")}
          >
            <i className="fa-solid fa-file-export" /> Export
          </button>
          <button
            className="button primary"
            onClick={() => setOrderFormOpen(true)}
          >
            <i className="fa-solid fa-plus" /> Create order
          </button>
        </div>
      </div>
      <div className="panel-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Delivery</th>
            </tr>
          </thead>
          <tbody>
            {orderRows.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.amount}</td>
                <td>Paid</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(event) =>
                      setOrderRows((current) =>
                        current.map((row) =>
                          row.id === order.id
                            ? {
                                ...row,
                                status: event.target
                                  .value as AdminOrderRow["status"],
                              }
                            : row,
                        ),
                      )
                    }
                    aria-label={`Change ${order.id} status`}
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
                <td>
                  {order.status === "Delivered" ? "Delivered" : "In transit"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomers = () => {
    const activeCustomers = customerRows.filter(
      (customer) => customer.status === "Active",
    ).length;
    const vipCustomers = customerRows.filter(
      (customer) => customer.status === "VIP",
    ).length;
    return (
      <div className="page-section">
        <div className="panel-header inline-header">
          <div>
            <p className="eyebrow">CRM</p>
            <h2>Customers</h2>
          </div>
          <div className="header-actions">
            <button className="button secondary" onClick={openCustomerExport}>
              <i className="fa-solid fa-file-export" /> Export
            </button>
            <button
              className="button primary"
              onClick={() => {
                resetCustomerForm();
                setCustomerFormOpen(true);
              }}
            >
              <i className="fa-solid fa-plus" /> Add customer
            </button>
          </div>
        </div>
        <div className="kpi-grid customer-kpi-grid">
          <div className="stat-card">
            <div className="stat-topline">
              <span>Total customers</span>
              <i className="fa-solid fa-users" />
            </div>
            <strong>{customerRows.length}</strong>
          </div>
          <div className="stat-card">
            <div className="stat-topline">
              <span>Active</span>
              <i className="fa-solid fa-user-check" />
            </div>
            <strong>{activeCustomers}</strong>
          </div>
          <div className="stat-card">
            <div className="stat-topline">
              <span>VIP customers</span>
              <i className="fa-solid fa-crown" />
            </div>
            <strong>{vipCustomers}</strong>
          </div>
        </div>
        <div className="panel-card">
          <div className="customer-toolbar">
            <div className="table-search">
              <i className="fa-solid fa-magnifying-glass" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, or phone"
              />
            </div>
            <select
              value={customerStatusFilter}
              onChange={(event) =>
                setCustomerStatusFilter(
                  event.target.value as "All" | AdminCustomerRow["status"],
                )
              }
              aria-label="Filter customers by status"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Total spend</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="empty-table-state">
                      No customers match your search.
                    </td>
                  </tr>
                )}
                {filteredCustomers.map((customer) => {
                  const customerIndex = customerRows.findIndex(
                    (row) => row.email === customer.email,
                  );
                  return (
                    <tr key={customer.email}>
                      <td>
                        <strong>{customer.name}</strong>
                      </td>
                      <td>
                        <span className="customer-contact">
                          {customer.email}
                          <small>{customer.phone}</small>
                        </span>
                      </td>
                      <td>{customer.orders}</td>
                      <td>{customer.spend}</td>
                      <td>
                        <select
                          className="status-select"
                          value={customer.status}
                          onChange={(event) =>
                            setCustomerRows((current) =>
                              current.map((row) =>
                                row.email === customer.email
                                  ? {
                                      ...row,
                                      status: event.target
                                        .value as AdminCustomerRow["status"],
                                    }
                                  : row,
                              ),
                            )
                          }
                          aria-label={`Change ${customer.name} status`}
                        >
                          <option value="Active">Active</option>
                          <option value="VIP">VIP</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td>{customer.joined}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            aria-label={`Edit ${customer.name}`}
                            onClick={() =>
                              openCustomerEditor(customer, customerIndex)
                            }
                          >
                            <i className="fa-solid fa-pen" />
                          </button>
                          <button
                            className="icon-button danger"
                            aria-label={`Delete ${customer.name}`}
                            onClick={() => removeCustomer(customer.email)}
                          >
                            <i className="fa-solid fa-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderInventory = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Stock</p>
          <h2>Inventory</h2>
        </div>
        <div className="header-actions">
          <button
            className="button secondary"
            onClick={() => openOperationalExport("inventory")}
          >
            <i className="fa-solid fa-file-export" /> Export
          </button>
          <button
            className="button primary"
            onClick={() =>
              showToast("Update stock directly in the Available column")
            }
          >
            <i className="fa-solid fa-boxes-stacked" /> Update stock
          </button>
        </div>
      </div>

      <div className="panel-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Available</th>
              <th>Reorder at</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryState.map((item) => (
              <tr key={item.sku}>
                <td>{item.name}</td>
                <td>{item.sku}</td>
                <td>
                  <input
                    className="table-number-input"
                    type="number"
                    min="0"
                    value={item.available}
                    onChange={(event) => {
                      const available = Math.max(0, Number(event.target.value));
                      setInventoryState((current) =>
                        current.map((row) =>
                          row.sku === item.sku
                            ? {
                                ...row,
                                available,
                                status:
                                  available === 0
                                    ? "Out of stock"
                                    : available <= row.reorder
                                      ? "Low stock"
                                      : "Healthy",
                              }
                            : row,
                        ),
                      );
                    }}
                    aria-label={`Available stock for ${item.name}`}
                  />
                </td>
                <td>{item.reorder}</td>
                <td>
                  <span
                    className={
                      item.status === "Low stock"
                        ? "status-badge warning"
                        : item.status === "Out of stock"
                          ? "status-badge danger"
                          : "status-badge success"
                    }
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDiscounts = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Marketing</p>
          <h2>Discounts & promotions</h2>
        </div>
        <div className="header-actions">
          <button
            className="button secondary"
            onClick={() => openOperationalExport("promotions")}
          >
            <i className="fa-solid fa-file-export" /> Export
          </button>
          <button
            className="button primary"
            onClick={() => setPromoFormOpen(true)}
          >
            <i className="fa-solid fa-plus" /> Create discount
          </button>
        </div>
      </div>

      <div className="panel-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Status</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {promoState.map((promo) => (
              <tr key={promo.code}>
                <td>{promo.code}</td>
                <td>{promo.type}</td>
                <td>{promo.discount}</td>
                <td>
                  <select
                    className="status-select"
                    value={promo.status}
                    onChange={(event) =>
                      setPromoState((current) =>
                        current.map((row) =>
                          row.code === promo.code
                            ? {
                                ...row,
                                status: event.target
                                  .value as AdminPromoRow["status"],
                              }
                            : row,
                        ),
                      )
                    }
                    aria-label={`Change ${promo.code} status`}
                  >
                    <option>Active</option>
                    <option>Scheduled</option>
                    <option>Paused</option>
                  </select>
                </td>
                <td>{promo.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Feedback</p>
          <h2>Reviews</h2>
        </div>
        <button
          className="button secondary"
          onClick={() => openOperationalExport("reviews")}
        >
          <i className="fa-solid fa-file-export" /> Export
        </button>
      </div>
      <div className="review-list">
        {reviewState.map((review, reviewIndex) => (
          <div
            className="review-card"
            key={`${review.customer}-${review.product}`}
          >
            <div className="review-heading">
              <div>
                <strong>{review.customer}</strong>
                <span>{review.product}</span>
              </div>
              <span
                className={
                  review.status === "Published"
                    ? "status-badge success"
                    : "status-badge warning"
                }
              >
                {review.status}
              </span>
            </div>
            <div className="stars">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <p>{review.comment}</p>
            <div className="review-footer">
              <small>{review.date}</small>
              <div className="row-actions">
                <button
                  className="text-button"
                  onClick={() => {
                    setReviewState((current) =>
                      current.map((row, index) =>
                        index === reviewIndex
                          ? { ...row, status: "Published" }
                          : row,
                      ),
                    );
                    showToast("Review approved");
                  }}
                >
                  {review.status === "Published" ? "Published" : "Approve"}
                </button>
                <button
                  className="text-button danger"
                  onClick={() => {
                    setReviewState((current) =>
                      current.filter((_, index) => index !== reviewIndex),
                    );
                    showToast("Review deleted");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const updateSettingFlag = (key: keyof SettingsFlags) => {
    setSettingsFlags((current) => ({ ...current, [key]: !current[key] }));
    setSettingsSaved(false);
  };

  const settingToggle = (
    key: keyof SettingsFlags,
    title: string,
    description: string,
  ) => (
    <button
      type="button"
      className="setting-toggle"
      onClick={() => updateSettingFlag(key)}
    >
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span
        className={settingsFlags[key] ? "switch checked" : "switch"}
        aria-hidden="true"
      >
        <span />
      </span>
    </button>
  );

  const renderSettingsContent = () => {
    switch (activeSettingsSection) {
      case "Admin Profile":
        return (
          <>
            <div className="settings-section-heading">
              <strong>Admin Profile</strong>
              <span>
                Manage your name, contact details, and account access.
              </span>
            </div>
            <div className="field-grid">
              <label>
                <span>Full name</span>
                <input
                  value={profile.name}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <span>Role</span>
                <input defaultValue="Store administrator" readOnly />
              </label>
              <label>
                <span>Email address</span>
                <input
                  value={profile.email}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  type="email"
                />
              </label>
              <label>
                <span>Phone number</span>
                <input
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>
            </div>
            {settingToggle(
              "twoFactorAuth",
              "Two-factor authentication",
              "Require a verification code when signing in from a new device.",
            )}
          </>
        );
      case "Notification Preferences":
        return (
          <>
            <div className="settings-section-heading">
              <strong>Notification Preferences</strong>
              <span>Choose which updates the admin team receives.</span>
            </div>
            <div className="setting-toggle-list">
              {settingToggle(
                "orderEmails",
                "New order emails",
                "Send an email when a customer places an order.",
              )}
              {settingToggle(
                "lowStockAlerts",
                "Low stock alerts",
                "Notify the team when inventory reaches its reorder level.",
              )}
              {settingToggle(
                "reviewAlerts",
                "Review moderation alerts",
                "Notify the team when a new review needs attention.",
              )}
            </div>
          </>
        );
      case "Order Settings":
        return (
          <>
            <div className="settings-section-heading">
              <strong>Order Settings</strong>
              <span>Control checkout and order processing rules.</span>
            </div>
            <div className="field-grid">
              <label>
                <span>Default order status</span>
                <select defaultValue="pending">
                  <option value="pending">Pending review</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </label>
              <label>
                <span>Payment review window</span>
                <select defaultValue="24">
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                </select>
              </label>
            </div>
            <div className="setting-toggle-list">
              {settingToggle(
                "guestCheckout",
                "Guest checkout",
                "Allow customers to place orders without creating an account.",
              )}
              {settingToggle(
                "autoConfirmOrders",
                "Automatically confirm paid orders",
                "Move successfully paid orders directly to fulfillment.",
              )}
            </div>
          </>
        );
      case "Delivery & Shipping":
        return (
          <>
            <div className="settings-section-heading">
              <strong>Delivery & Shipping</strong>
              <span>Set the delivery zones and default shipping rules.</span>
            </div>
            <div className="field-grid">
              <label>
                <span>Default delivery fee</span>
                <input defaultValue="PKR 1,500" />
              </label>
              <label>
                <span>Free delivery threshold</span>
                <input defaultValue="PKR 75,000" />
              </label>
              <label>
                <span>Dispatch time</span>
                <select defaultValue="3">
                  <option value="1">1-2 business days</option>
                  <option value="3">3-5 business days</option>
                  <option value="7">5-7 business days</option>
                </select>
              </label>
              <label>
                <span>Primary delivery region</span>
                <select defaultValue="pakistan">
                  <option value="pakistan">Pakistan</option>
                  <option value="kpk">Khyber Pakhtunkhwa only</option>
                </select>
              </label>
            </div>
            {settingToggle(
              "deliveryUpdates",
              "Customer delivery updates",
              "Send customers tracking and delivery status notifications.",
            )}
          </>
        );
      case "Security":
        return (
          <>
            <div className="settings-section-heading">
              <strong>Security</strong>
              <span>
                Keep administrator access protected and review active sessions.
              </span>
            </div>
            <div className="field-grid">
              <label>
                <span>Current password</span>
                <input type="password" placeholder="Enter current password" />
              </label>
              <label>
                <span>New password</span>
                <input type="password" placeholder="Enter new password" />
              </label>
            </div>
            <div className="security-note">
              <i className="fa-solid fa-shield-halved" />
              <span>
                Your last password update was 18 days ago. Use a unique password
                with at least 12 characters.
              </span>
            </div>
            {settingToggle(
              "twoFactorAuth",
              "Two-factor authentication",
              "Protect sign-ins with an authenticator code.",
            )}
            <div className="session-row">
              <span>
                <strong>Active sessions</strong>
                <small>2 devices currently signed in</small>
              </span>
              <button type="button" className="text-button danger">
                Sign out all
              </button>
            </div>
          </>
        );
      case "Appearance":
        return (
          <>
            <div className="settings-section-heading">
              <strong>Appearance</strong>
              <span>Adjust the admin workspace for your daily workflow.</span>
            </div>
            <div className="field-grid">
              <label>
                <span>Interface density</span>
                <select defaultValue="comfortable">
                  <option value="comfortable">Comfortable</option>
                  <option value="compact">Compact</option>
                </select>
              </label>
              <label>
                <span>Accent color</span>
                <select defaultValue="orange">
                  <option value="orange">Terracotta</option>
                  <option value="black">Charcoal</option>
                </select>
              </label>
            </div>
            {settingToggle(
              "compactMode",
              "Compact tables",
              "Show more rows in catalog and order tables.",
            )}
          </>
        );
      default:
        return (
          <>
            <div className="settings-section-heading">
              <strong>Store Information</strong>
              <span>
                Keep the public store contact and regional details up to date.
              </span>
            </div>
            <div className="field-grid">
              <label>
                <span>Store name</span>
                <input defaultValue="Muntazir & Sons Furniture" />
              </label>
              <label>
                <span>Phone</span>
                <input defaultValue="+92 91 527 3555" />
              </label>
              <label className="full-width">
                <span>Business address</span>
                <input defaultValue="Charsadda Road, Peshawar, Pakistan" />
              </label>
              <label>
                <span>Email</span>
                <input defaultValue="hello@muntazirandsons.com" type="email" />
              </label>
              <label>
                <span>Currency</span>
                <select defaultValue="pkr">
                  <option value="pkr">PKR</option>
                </select>
              </label>
            </div>
          </>
        );
    }
  };

  const renderSettings = () => (
    <div className="page-section">
      <div className="panel-header inline-header">
        <div>
          <p className="eyebrow">Configuration</p>
          <h2>Settings</h2>
        </div>
        {settingsSaved && (
          <span className="saved-message">
            <i className="fa-solid fa-check" /> Changes saved
          </span>
        )}
      </div>
      <div className="settings-layout">
        <div className="settings-menu panel-card">
          {settingsSections.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setActiveSettingsSection(item);
                setSettingsSaved(false);
              }}
              className={
                item === activeSettingsSection
                  ? "settings-item active"
                  : "settings-item"
              }
            >
              {item}
            </button>
          ))}
        </div>
        <div className="panel-card settings-form">
          {renderSettingsContent()}
          <div className="settings-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => setSettingsSaved(false)}
            >
              Discard
            </button>
            <button
              type="button"
              className="button primary"
              onClick={() => {
                setSettingsSaved(true);
                showToast("Settings saved successfully");
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogout = () => (
    <div className="page-section">
      <div className="panel-card logout-card">
        <div className="logout-icon">
          <i className="fa-solid fa-right-from-bracket" />
        </div>
        <h2>Logout</h2>
        <p>
          Are you sure you want to sign out of the furniture management
          dashboard?
        </p>
        <div className="settings-actions">
          <button className="button secondary">Cancel</button>
          <button className="button primary">Confirm logout</button>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "products":
        return renderProducts();
      case "categories":
        return renderCategories();
      case "collections":
        return renderCollections();
      case "orders":
        return renderOrders();
      case "customers":
        return renderCustomers();
      case "inventory":
        return renderInventory();
      case "discounts":
        return renderDiscounts();
      case "reviews":
        return renderReviews();
      case "settings":
        return renderSettings();
      case "logout":
        return renderLogout();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <div className="admin-shell">
        <aside
          className={
            sidebarCollapsed ? "admin-sidebar collapsed" : "admin-sidebar"
          }
        >
          <div className="brand-box">
            <div className="brand-mark-admin">M</div>
            {!sidebarCollapsed && (
              <div>
                <strong>Muntazir Admin</strong>
                <span>Furniture OS</span>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={
                  activeTab === item.key ? "nav-item active" : "nav-item"
                }
                onClick={() => navigateTo(item)}
              >
                <i className={item.icon} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          <button
            className="collapse-button"
            type="button"
            onClick={() => setSidebarCollapsed((value) => !value)}
          >
            <i
              className={
                sidebarCollapsed
                  ? "fa-solid fa-angle-right"
                  : "fa-solid fa-angle-left"
              }
            />
          </button>
        </aside>

        <div className="admin-main">
          <header className="admin-header">
            <div className="header-title-wrap">
              <button
                type="button"
                className="header-icon-button mobile-only"
                onClick={() => setSidebarCollapsed((value) => !value)}
              >
                <i className="fa-solid fa-bars" />
              </button>
              <div>
                <p className="eyebrow">Operations</p>
                <h1>
                  {navItems.find((item) => item.key === activeTab)?.label ??
                    "Dashboard"}
                </h1>
              </div>
            </div>
            <div className="header-tools">
              <div className="header-search-admin">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search"
                />
              </div>
              <button
                type="button"
                className="header-icon-button"
                aria-label="Open notifications"
                onClick={() => setNotificationsOpen((value) => !value)}
              >
                <i className="fa-solid fa-bell" />
                {unreadNotifications > 0 && <span className="dot" />}
              </button>
              <button
                type="button"
                className="profile-chip"
                onClick={openProfileEditor}
                aria-label="Edit admin profile"
              >
                {profile.avatar ? (
                  <img
                    className="avatar-mini avatar-image"
                    src={profile.avatar}
                    alt=""
                  />
                ) : (
                  <div className="avatar-mini">
                    {profile.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <strong>{profile.name}</strong>
                  <span>Admin</span>
                </div>
              </button>
            </div>
          </header>

          {notificationsOpen && (
            <div className="notification-panel panel-card">
              <div className="notification-panel-header">
                <div>
                  <strong>Notifications</strong>
                  <span>{unreadNotifications} unread</span>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={markAllNotificationsRead}
                >
                  Mark all read
                </button>
              </div>
              <div className="notification-list">
                {notifications.length === 0 && (
                  <div className="notification-empty">No notifications</div>
                )}
                {notifications.map((notification) => (
                  <div
                    className={
                      notification.unread
                        ? "notification-item unread"
                        : "notification-item"
                    }
                    key={notification.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => markNotificationRead(notification.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ")
                        markNotificationRead(notification.id);
                    }}
                  >
                    <span className="notification-dot" />
                    <span>
                      <strong>{notification.title}</strong>
                      <small>{notification.detail}</small>
                      <em>{notification.time}</em>
                    </span>
                    <button
                      type="button"
                      className="notification-delete"
                      aria-label={`Delete ${notification.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="content-shell">
            <div className="breadcrumbs">
              <span>Admin</span>
              <i className="fa-solid fa-chevron-right" />
              <span>
                {navItems.find((item) => item.key === activeTab)?.label ??
                  "Dashboard"}
              </span>
            </div>
            {renderCurrentView()}
          </div>
        </div>
      </div>

      {exportOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => {
            if (exportStatus !== "processing") setExportOpen(false);
          }}
        >
          <div
            className="admin-modal panel-card export-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">
                  {exportMode === "customers"
                    ? "CRM"
                    : exportMode === "dashboard"
                      ? "Dashboard"
                      : "Operations"}
                </p>
                <h3 id="export-dialog-title">
                  Export {exportMode === "dashboard" ? "report" : exportMode}
                </h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close export dialog"
                disabled={exportStatus === "processing"}
                onClick={() => setExportOpen(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {exportStatus === "idle" && (
              <>
                <p className="export-dialog-copy">
                  {exportMode === "dashboard"
                    ? "Create a print-ready dashboard report with performance metrics, revenue, recent orders, and your current local catalog data."
                    : `Create a print-ready ${exportMode} report from the current locally saved admin data.`}
                </p>
                <div className="export-file-list">
                  <span>
                    <i className="fa-solid fa-file-lines" /> Printable HTML{" "}
                    {exportMode === "dashboard"
                      ? "report"
                      : `${exportMode} report`}
                  </span>
                  <span>
                    <i className="fa-solid fa-table" /> CSV data export
                  </span>
                  <span>
                    <i className="fa-solid fa-code" /> JSON data snapshot
                  </span>
                </div>
                <div className="settings-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setExportOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={startDashboardExport}
                  >
                    <i className="fa-solid fa-file-export" /> Export{" "}
                    {exportMode === "dashboard" ? "report" : exportMode}
                  </button>
                </div>
              </>
            )}

            {exportStatus === "processing" && (
              <div
                className="export-progress-state"
                role="status"
                aria-live="polite"
              >
                <div className="export-spinner">
                  <i className="fa-solid fa-file-export" />
                </div>
                <h4>Preparing your report</h4>
                <p>
                  Collecting dashboard data and formatting print-ready files.
                </p>
                <div className="export-progress-track">
                  <span style={{ width: `${exportProgress}%` }} />
                </div>
                <strong>{exportProgress}% complete</strong>
              </div>
            )}

            {exportStatus === "ready" && (
              <div className="export-progress-state export-ready-state">
                <div className="export-success-icon">
                  <i className="fa-solid fa-check" />
                </div>
                <h4>
                  Your{" "}
                  {exportMode === "dashboard"
                    ? "report"
                    : `${exportMode} export`}{" "}
                  is ready
                </h4>
                <p>
                  Choose one, two, or all files to download or share from this
                  device.
                </p>
                <div className="export-file-list compact-file-list">
                  <label className="export-select-all">
                    <input
                      type="checkbox"
                      checked={
                        selectedExportFiles.length === exportFiles.length
                      }
                      onChange={(event) =>
                        setSelectedExportFiles(
                          event.target.checked
                            ? exportFiles.map((file) => file.name)
                            : [],
                        )
                      }
                    />
                    <span>Select all files</span>
                  </label>
                  {exportFiles.map((file) => (
                    <label className="export-file-option" key={file.name}>
                      <input
                        type="checkbox"
                        checked={selectedExportFiles.includes(file.name)}
                        onChange={(event) =>
                          setSelectedExportFiles((current) =>
                            event.target.checked
                              ? [...current, file.name]
                              : current.filter((name) => name !== file.name),
                          )
                        }
                      />
                      <i className="fa-solid fa-file-lines" />
                      <span>{file.name}</span>
                    </label>
                  ))}
                </div>
                <div className="settings-actions">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={shareExportFiles}
                  >
                    <i className="fa-solid fa-share-nodes" /> Share
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={downloadExportFiles}
                  >
                    <i className="fa-solid fa-download" /> Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {customerFormOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => {
            setCustomerFormOpen(false);
            resetCustomerForm();
          }}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">CRM</p>
                <h3 id="customer-dialog-title">
                  {customerEditIndex === null
                    ? "Add customer"
                    : "Edit customer"}
                </h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close customer form"
                onClick={() => {
                  setCustomerFormOpen(false);
                  resetCustomerForm();
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="field-grid">
              <label className="full-width">
                <span>Full name</span>
                <input
                  value={customerDraft.name}
                  onChange={(event) =>
                    setCustomerDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Ayesha Khan"
                />
              </label>
              <label>
                <span>Email address</span>
                <input
                  type="email"
                  value={customerDraft.email}
                  onChange={(event) =>
                    setCustomerDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="customer@example.com"
                />
              </label>
              <label>
                <span>Phone number</span>
                <input
                  value={customerDraft.phone}
                  onChange={(event) =>
                    setCustomerDraft((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="+92 300 1234567"
                />
              </label>
              <label>
                <span>Customer status</span>
                <select
                  value={customerDraft.status}
                  onChange={(event) =>
                    setCustomerDraft((current) => ({
                      ...current,
                      status: event.target.value as AdminCustomerRow["status"],
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="VIP">VIP</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>
            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setCustomerFormOpen(false);
                  resetCustomerForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={saveCustomer}
              >
                {customerEditIndex === null ? "Add customer" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {orderFormOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => setOrderFormOpen(false)}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Fulfillment</p>
                <h3 id="order-dialog-title">Create order</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close order form"
                onClick={() => setOrderFormOpen(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="field-grid">
              <label className="full-width">
                <span>Customer name</span>
                <input
                  value={orderDraft.customer}
                  onChange={(event) =>
                    setOrderDraft((current) => ({
                      ...current,
                      customer: event.target.value,
                    }))
                  }
                  placeholder="e.g. Ayesha Khan"
                />
              </label>
              <label>
                <span>Amount</span>
                <input
                  value={orderDraft.amount}
                  onChange={(event) =>
                    setOrderDraft((current) => ({
                      ...current,
                      amount: event.target.value,
                    }))
                  }
                  placeholder="92500"
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={orderDraft.status}
                  onChange={(event) =>
                    setOrderDraft((current) => ({
                      ...current,
                      status: event.target.value as AdminOrderRow["status"],
                    }))
                  }
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </label>
            </div>
            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setOrderFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={addOrder}
              >
                Create order
              </button>
            </div>
          </div>
        </div>
      )}

      {promoFormOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => setPromoFormOpen(false)}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Marketing</p>
                <h3 id="promo-dialog-title">Create discount</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close promotion form"
                onClick={() => setPromoFormOpen(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="field-grid">
              <label>
                <span>Promotion code</span>
                <input
                  value={promoDraft.code}
                  onChange={(event) =>
                    setPromoDraft((current) => ({
                      ...current,
                      code: event.target.value,
                    }))
                  }
                  placeholder="WELCOME10"
                />
              </label>
              <label>
                <span>Type</span>
                <select
                  value={promoDraft.type}
                  onChange={(event) =>
                    setPromoDraft((current) => ({
                      ...current,
                      type: event.target.value as AdminPromoRow["type"],
                    }))
                  }
                >
                  <option>Percentage</option>
                  <option>Fixed</option>
                </select>
              </label>
              <label>
                <span>Discount</span>
                <input
                  value={promoDraft.discount}
                  onChange={(event) =>
                    setPromoDraft((current) => ({
                      ...current,
                      discount: event.target.value,
                    }))
                  }
                  placeholder="10% or PKR 5000"
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={promoDraft.status}
                  onChange={(event) =>
                    setPromoDraft((current) => ({
                      ...current,
                      status: event.target.value as AdminPromoRow["status"],
                    }))
                  }
                >
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Paused</option>
                </select>
              </label>
            </div>
            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setPromoFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={addPromotion}
              >
                Create discount
              </button>
            </div>
          </div>
        </div>
      )}

      {productFormOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => setProductFormOpen(false)}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Catalog</p>
                <h3 id="product-dialog-title">Add product</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close add product form"
                onClick={() => {
                  setProductFormOpen(false);
                  resetProductForm();
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="field-grid">
              <label className="full-width">
                <span>Product name</span>
                <input
                  value={productFormDraft.name}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Mazi Upholstery Storage Double Bed"
                />
              </label>
              <label>
                <span>Category</span>
                <select
                  value={productFormDraft.category}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                >
                  {[
                    "Living Room",
                    "Dining",
                    "Bedroom",
                    "Office",
                    "Storage",
                    "Decor",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Status</span>
                <select
                  value={productFormDraft.status}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      status: event.target.value as AdminProductRow["status"],
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Low stock">Low stock</option>
                  <option value="Out of stock">Out of stock</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>
              <label>
                <span>Price (PKR)</span>
                <input
                  type="number"
                  min="0"
                  value={productFormDraft.price}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      price: event.target.value,
                    }))
                  }
                  placeholder="68000"
                />
              </label>
              <label>
                <span>Original price (PKR)</span>
                <input
                  type="number"
                  min="0"
                  value={productFormDraft.originalPrice}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      originalPrice: event.target.value,
                    }))
                  }
                  placeholder="76000"
                />
              </label>
              <label>
                <span>Stock</span>
                <input
                  type="number"
                  min="0"
                  value={productFormDraft.stock}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      stock: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="full-width">
                <span>Image URL</span>
                <input
                  value={productFormDraft.image}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                />
              </label>
              <label className="full-width">
                <span>Tag</span>
                <input
                  value={productFormDraft.tag}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      tag: event.target.value,
                    }))
                  }
                  placeholder="Bestseller / New / Sale"
                />
              </label>
              <label className="full-width">
                <span>Description</span>
                <textarea
                  value={productFormDraft.description}
                  onChange={(event) =>
                    setProductFormDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="Short product description"
                />
              </label>
            </div>

            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setProductFormOpen(false);
                  resetProductForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={addProduct}
              >
                Save product
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryFormOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => setCategoryFormOpen(false)}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Catalog</p>
                <h3 id="category-dialog-title">Add category</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close add category form"
                onClick={() => {
                  setCategoryFormOpen(false);
                  resetCategoryForm();
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="field-grid">
              <label className="full-width">
                <span>Category name</span>
                <input
                  value={categoryFormDraft.name}
                  onChange={(event) =>
                    setCategoryFormDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Office"
                />
              </label>
              <label className="full-width">
                <span>Short description</span>
                <input
                  value={categoryFormDraft.copy}
                  onChange={(event) =>
                    setCategoryFormDraft((current) => ({
                      ...current,
                      copy: event.target.value,
                    }))
                  }
                  placeholder="A little more focus, made comfortable."
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={categoryFormDraft.status}
                  onChange={(event) =>
                    setCategoryFormDraft((current) => ({
                      ...current,
                      status: event.target.value as AdminCategoryRow["status"],
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
              <label className="full-width">
                <span>Image URL</span>
                <input
                  value={categoryFormDraft.image}
                  onChange={(event) =>
                    setCategoryFormDraft((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                />
              </label>
            </div>

            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setCategoryFormOpen(false);
                  resetCategoryForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={addCategory}
              >
                Save category
              </button>
            </div>
          </div>
        </div>
      )}

      {collectionFormOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={() => {
            setCollectionFormOpen(false);
            resetCollectionForm();
          }}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="collection-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Design</p>
                <h3 id="collection-dialog-title">
                  {collectionEditIndex !== null
                    ? "Edit collection"
                    : "Create collection"}
                </h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close collection form"
                onClick={() => {
                  setCollectionFormOpen(false);
                  resetCollectionForm();
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="field-grid">
              <label className="full-width">
                <span>Collection name</span>
                <input
                  value={collectionDraft.name}
                  onChange={(event) =>
                    setCollectionDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Quiet Living"
                />
              </label>
              <label className="full-width">
                <span>Description</span>
                <input
                  value={collectionDraft.description}
                  onChange={(event) =>
                    setCollectionDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe the mood and styling direction."
                />
              </label>
              <label className="full-width">
                <span>Image URL</span>
                <input
                  value={collectionDraft.image}
                  onChange={(event) =>
                    setCollectionDraft((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  placeholder="https://images.unsplash.com/..."
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={collectionDraft.status}
                  onChange={(event) =>
                    setCollectionDraft((current) => ({
                      ...current,
                      status: event.target
                        .value as AdminCollectionRow["status"],
                    }))
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </label>
              <label className="inline-checkbox">
                <input
                  type="checkbox"
                  checked={collectionDraft.featured}
                  onChange={(event) =>
                    setCollectionDraft((current) => ({
                      ...current,
                      featured: event.target.checked,
                    }))
                  }
                />
                <span>Featured collection</span>
              </label>
            </div>

            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setCollectionFormOpen(false);
                  resetCollectionForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={saveCollection}
              >
                {collectionEditIndex !== null
                  ? "Save changes"
                  : "Create collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {profileOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onClick={requestCloseProfile}
        >
          <div
            className="admin-modal panel-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Account</p>
                <h3 id="profile-dialog-title">Edit profile</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close profile editor"
                onClick={requestCloseProfile}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="admin-profile-photo-editor">
              <div className="admin-profile-photo-preview">
                {profileDraft.avatar ? (
                  <img src={profileDraft.avatar} alt="Profile preview" />
                ) : (
                  <span>
                    {profileDraft.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <strong>Profile picture</strong>
                <span>
                  Upload an image and crop it to a square before saving.
                </span>
                <label className="button secondary admin-upload-button">
                  {profileDraft.avatar ? "Change photo" : "Upload photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhoto}
                  />
                </label>
              </div>
            </div>
            <div className="field-grid">
              <label>
                <span>Full name</span>
                <input
                  value={profileDraft.name}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <span>Phone number</span>
                <input
                  value={profileDraft.phone}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="full-width">
                <span>Email address</span>
                <input
                  value={profileDraft.email}
                  onChange={(event) =>
                    setProfileDraft((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  type="email"
                />
              </label>
            </div>
            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={requestCloseProfile}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={saveProfile}
              >
                Save profile
              </button>
            </div>
          </div>
        </div>
      )}

      {cropOpen && (
        <div className="admin-modal-backdrop crop-backdrop" role="presentation">
          <div
            className="admin-modal panel-card crop-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-dialog-title"
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Profile picture</p>
                <h3 id="crop-dialog-title">Crop to square</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close crop editor"
                onClick={() => {
                  setCropOpen(false);
                  setCropSource("");
                }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div
              className="crop-preview"
              role="application"
              aria-label="Drag image to position crop, or scroll to zoom"
              onPointerDown={handleCropPointerDown}
              onPointerMove={handleCropPointerMove}
              onPointerUp={handleCropPointerUp}
              onPointerCancel={handleCropPointerUp}
              onWheel={handleCropWheel}
            >
              <img
                src={cropSource}
                alt="Crop preview"
                style={{
                  transform: `translate(${cropSettings.x / 2}%, ${cropSettings.y / 2}%) scale(${cropSettings.zoom})`,
                }}
              />
              <span className="crop-frame" />
            </div>
            <label className="crop-control">
              <span>Zoom</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={cropSettings.zoom}
                onChange={(event) =>
                  setCropSettings((current) => ({
                    ...current,
                    zoom: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="crop-control">
              <span>Horizontal position</span>
              <input
                type="range"
                min="-100"
                max="100"
                value={cropSettings.x}
                onChange={(event) =>
                  setCropSettings((current) => ({
                    ...current,
                    x: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label className="crop-control">
              <span>Vertical position</span>
              <input
                type="range"
                min="-100"
                max="100"
                value={cropSettings.y}
                onChange={(event) =>
                  setCropSettings((current) => ({
                    ...current,
                    y: Number(event.target.value),
                  }))
                }
              />
            </label>
            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setCropOpen(false);
                  setCropSource("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={applyProfileCrop}
              >
                Use cropped photo
              </button>
            </div>
          </div>
        </div>
      )}

      {discardConfirmOpen && (
        <div
          className="admin-modal-backdrop confirm-backdrop"
          role="presentation"
        >
          <div
            className="admin-modal panel-card profile-discard-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="discard-profile-title"
          >
            <p className="eyebrow">Unsaved profile changes</p>
            <h3 id="discard-profile-title">Leave without saving?</h3>
            <p>
              Your profile edits have not been saved. Save them before leaving,
              or keep editing.
            </p>
            <div className="settings-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setDiscardConfirmOpen(false);
                  pendingProfileAction.current = null;
                }}
              >
                Keep editing
              </button>
              <button
                type="button"
                className="button primary"
                onClick={saveProfileAndContinue}
              >
                Save changes
              </button>
              <button
                type="button"
                className="button danger"
                onClick={discardProfileChanges}
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {logoutConfirmOpen && (
        <div
          className="admin-modal-backdrop confirm-backdrop"
          role="presentation"
        >
          <div
            className="admin-modal panel-card logout-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
          >
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Account security</p>
                <h3 id="logout-dialog-title">
                  Are you sure you want to log out?
                </h3>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close logout confirmation"
                onClick={() => setLogoutConfirmOpen(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="logout-profile-summary">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" />
              ) : (
                <span>
                  {profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
              <div>
                <strong>{profile.name}</strong>
                <span>{profile.email}</span>
              </div>
            </div>
            <p className="logout-confirm-copy">
              You will need to sign in again to access the admin dashboard.
            </p>
            <div className="settings-actions">
              <button
                type="button"
                className="button stay-signed-in"
                onClick={() => setLogoutConfirmOpen(false)}
              >
                Stay signed in
              </button>
              <button
                type="button"
                className="button danger logout-action"
                onClick={confirmLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="admin-toast" role="status">
          <span className="admin-toast-icon">
            <i className="fa-solid fa-check" />
          </span>
          <span>{toast}</span>
        </div>
      )}

      <style jsx global>{`
        :root {
          --admin-bg: #f5f2ee;
          --admin-panel: #ffffff;
          --admin-ink: #1b1a19;
          --admin-muted: #6f6b66;
          --admin-line: #e7e2dc;
          --admin-orange: #e95f2a;
          --admin-orange-soft: rgba(233, 95, 42, 0.12);
          --admin-success: #1f8f5f;
          --admin-warning: #d97706;
          --admin-danger: #d14343;
          --admin-info: #2958d9;
          --admin-shadow: none;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          background: var(--admin-bg);
          overflow: hidden;
        }

        .admin-shell {
          min-height: 100vh;
          display: flex;
          background: var(--admin-bg);
          color: var(--admin-ink);
          font-family: "DM Sans", sans-serif;
          overflow: hidden;
        }

        .admin-sidebar {
          width: 260px;
          background: #171614;
          color: #f5f2ee;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          transition: width 0.2s ease;
          height: 100vh;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .admin-sidebar.collapsed {
          width: 92px;
        }

        .brand-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .brand-mark-admin {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--admin-orange);
          color: white;
          font-family: "Playfair Display", serif;
          font-size: 22px;
          font-style: italic;
        }

        .brand-box strong {
          display: block;
          font-size: 15px;
          letter-spacing: -0.03em;
        }

        .brand-box span {
          color: rgba(245, 242, 238, 0.68);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px 14px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.26) transparent;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 999px;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          border: 0;
          border-bottom: none;
          border-radius: 12px;
          text-decoration: none !important;
          text-underline-offset: 0;
          text-decoration-line: none;
          color: rgba(245, 242, 238, 0.8);
          padding: 11px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
          min-height: 44px;
          box-shadow: none !important;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
        }

        .nav-item i {
          width: 16px;
          text-align: center;
          color: inherit;
        }

        .nav-item:hover,
        .nav-item:focus-visible,
        .nav-item:active,
        .nav-item:visited {
          background: rgba(255, 255, 255, 0.04);
          color: white;
          text-decoration: none !important;
          border-bottom: none !important;
          box-shadow: none !important;
          outline: none;
        }

        .nav-item.active {
          background: rgba(233, 95, 42, 0.14);
          color: white;
          border: 0;
          border-bottom: none;
          text-decoration: none !important;
          box-shadow: none !important;
          outline: none;
        }

        .collapse-button {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          color: rgba(245, 242, 238, 0.8);
          padding: 14px 0;
          flex-shrink: 0;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 28px 18px;
          border-bottom: 1px solid var(--admin-line);
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 5;
          box-shadow: none;
        }

        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-title-wrap h1 {
          margin: 4px 0 0;
          font-size: clamp(22px, 2vw, 32px);
          letter-spacing: -0.06em;
        }

        .header-tools {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .header-search-admin {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 1px solid var(--admin-line);
          border-radius: 999px;
          padding: 10px 14px;
          min-width: 260px;
          box-shadow: none;
        }

        .header-search-admin input {
          border: 0;
          outline: none;
          background: transparent;
          width: 100%;
          color: var(--admin-ink);
          font-size: 14px;
        }

        .header-icon-button {
          width: 42px;
          height: 42px;
          background: white;
          border: 1px solid var(--admin-line);
          border-radius: 12px;
          color: var(--admin-ink);
          position: relative;
          box-shadow: none;
        }

        .header-icon-button .dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--admin-orange);
          border-radius: 50%;
          right: 8px;
          top: 7px;
          border: 2px solid white;
        }

        .notification-panel {
          position: absolute;
          top: 78px;
          right: 28px;
          z-index: 10;
          width: min(360px, calc(100vw - 36px));
          padding: 0;
          box-shadow: 0 18px 45px rgba(24, 24, 24, 0.12);
        }

        .notification-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--admin-line);
        }

        .notification-panel-header div,
        .notification-item span:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .notification-panel-header span,
        .notification-item small,
        .notification-item em {
          color: var(--admin-muted);
          font-size: 11px;
          font-style: normal;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          width: 100%;
          padding: 14px 18px;
          background: white;
          color: var(--admin-ink);
          text-align: left;
          border-bottom: 1px solid var(--admin-line);
        }

        .notification-item:hover,
        .notification-item.unread {
          background: #faf8f5;
        }

        .notification-dot {
          width: 7px;
          height: 7px;
          margin-top: 5px;
          border-radius: 50%;
          background: transparent;
          flex: 0 0 auto;
        }

        .notification-item.unread .notification-dot {
          background: var(--admin-orange);
        }

        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 30;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(23, 22, 20, 0.35);
        }

        .admin-modal {
          width: min(560px, 100%);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          box-shadow: 0 24px 70px rgba(24, 24, 24, 0.2);
          scrollbar-width: thin;
          scrollbar-color: var(--admin-line) transparent;
        }

        .export-modal {
          width: min(520px, 100%);
        }

        .export-dialog-copy {
          margin: 4px 0 20px;
          color: var(--admin-muted);
          line-height: 1.6;
        }

        .export-file-list {
          display: grid;
          gap: 10px;
          margin-bottom: 24px;
          padding: 15px;
          background: var(--admin-bg);
          border: 1px solid var(--admin-line);
          border-radius: 12px;
        }

        .export-file-list span {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--admin-ink);
          font-size: 13px;
        }

        .export-file-list i {
          width: 18px;
          color: var(--admin-orange);
          text-align: center;
        }

        .export-progress-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px 8px 8px;
          text-align: center;
        }

        .export-spinner,
        .export-success-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin-bottom: 16px;
          border-radius: 50%;
          color: white;
          background: var(--admin-orange);
          font-size: 22px;
        }

        .export-spinner {
          animation: export-pulse 1.1s ease-in-out infinite;
        }

        .export-success-icon {
          background: var(--admin-success);
        }

        .export-progress-state h4 {
          margin: 0 0 6px;
          font-size: 18px;
        }

        .export-progress-state p {
          max-width: 360px;
          margin: 0 0 20px;
          color: var(--admin-muted);
          line-height: 1.55;
        }

        .export-progress-track {
          width: 100%;
          height: 9px;
          overflow: hidden;
          margin-bottom: 9px;
          border-radius: 99px;
          background: var(--admin-line);
        }

        .export-progress-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            var(--admin-orange),
            #f28a57,
            var(--admin-orange)
          );
          background-size: 200% 100%;
          transition: width 180ms ease;
          animation: export-progress-shimmer 1.4s linear infinite;
        }

        .export-progress-state > strong {
          color: var(--admin-orange);
          font-size: 12px;
        }

        .export-ready-state .settings-actions {
          width: 100%;
        }

        .compact-file-list {
          width: 100%;
          margin-bottom: 20px;
          text-align: left;
        }

        .export-file-option,
        .export-select-all {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .export-file-option input,
        .export-select-all input {
          width: 16px;
          height: 16px;
          accent-color: var(--admin-orange);
        }

        .export-file-option i {
          color: var(--admin-orange);
        }

        .export-select-all {
          padding-bottom: 10px;
          margin-bottom: 2px;
          border-bottom: 1px solid var(--admin-line);
          font-weight: 700;
        }

        @keyframes export-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(233, 95, 42, 0.2);
          }
          50% {
            transform: scale(1.06);
            box-shadow: 0 0 0 12px rgba(233, 95, 42, 0);
          }
        }

        @keyframes export-progress-shimmer {
          from {
            background-position: 100% 0;
          }
          to {
            background-position: -100% 0;
          }
        }

        .admin-modal::-webkit-scrollbar {
          width: 7px;
        }

        .admin-modal::-webkit-scrollbar-thumb {
          background: var(--admin-line);
          border-radius: 8px;
        }

        .admin-profile-photo-editor {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 4px 0 22px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--admin-line);
        }

        .admin-profile-photo-preview,
        .crop-preview {
          overflow: hidden;
          flex: 0 0 auto;
          background: var(--admin-orange-soft);
        }

        .admin-profile-photo-preview {
          width: 76px;
          height: 76px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: var(--admin-orange);
          font-size: 20px;
          font-weight: 800;
        }

        .admin-profile-photo-preview img,
        .avatar-image,
        .crop-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-profile-photo-editor strong,
        .admin-profile-photo-editor span {
          display: block;
        }

        .admin-profile-photo-editor span {
          margin: 4px 0 10px;
          color: var(--admin-muted);
          font-size: 12px;
        }

        .admin-upload-button {
          display: inline-flex;
          position: relative;
          cursor: pointer;
        }

        .admin-upload-button input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
        }

        .crop-backdrop,
        .confirm-backdrop {
          z-index: 35;
        }

        .crop-modal {
          width: min(520px, 100%);
        }

        .crop-preview {
          position: relative;
          width: min(360px, 100%);
          aspect-ratio: 1;
          margin: 0 auto 22px;
          border-radius: 10px;
          cursor: grab;
          touch-action: none;
          user-select: none;
        }

        .crop-preview:active {
          cursor: grabbing;
        }

        .crop-preview img {
          display: block;
          position: absolute;
          inset: 0;
          transform-origin: center;
        }

        .crop-frame {
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 6px;
          box-shadow: 0 0 0 999px rgba(20, 18, 16, 0.18);
          pointer-events: none;
        }

        .crop-control {
          display: grid;
          gap: 7px;
          margin: 14px 0;
          color: var(--admin-muted);
          font-size: 12px;
          font-weight: 700;
        }

        .crop-control input {
          width: 100%;
          accent-color: var(--admin-orange);
        }

        .profile-discard-modal {
          width: min(480px, 100%);
        }

        .profile-discard-modal > p:not(.eyebrow) {
          color: var(--admin-muted);
          line-height: 1.6;
        }

        .logout-confirm-modal {
          width: min(500px, 100%);
        }

        .logout-profile-summary {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 8px 0 18px;
          padding: 14px;
          background: #faf8f5;
          border: 1px solid var(--admin-line);
          border-radius: 12px;
        }

        .logout-profile-summary img,
        .logout-profile-summary > span {
          width: 48px;
          height: 48px;
          flex: 0 0 auto;
          border-radius: 50%;
        }

        .logout-profile-summary img {
          object-fit: cover;
        }

        .logout-profile-summary > span {
          display: grid;
          place-items: center;
          background: var(--admin-orange-soft);
          color: var(--admin-orange);
          font-weight: 800;
        }

        .logout-profile-summary strong,
        .logout-profile-summary span {
          display: block;
        }

        .logout-profile-summary div span {
          margin-top: 4px;
          color: var(--admin-muted);
          font-size: 12px;
        }

        .logout-confirm-copy {
          color: var(--admin-muted);
          line-height: 1.6;
        }

        .logout-confirm-modal .button.stay-signed-in {
          background: var(--admin-success);
          border-color: var(--admin-success);
          color: white;
        }

        .logout-confirm-modal .button.stay-signed-in:hover,
        .logout-confirm-modal .button.stay-signed-in:focus-visible {
          background: #167348;
          border-color: #167348;
          box-shadow: 0 6px 16px rgba(31, 143, 95, 0.24);
          transform: translateY(-1px);
        }

        .logout-confirm-modal .button.logout-action {
          background: var(--admin-danger);
          border-color: var(--admin-danger);
          color: white;
        }

        .logout-confirm-modal .button.logout-action:hover,
        .logout-confirm-modal .button.logout-action:focus-visible {
          background: #ad3333;
          border-color: #ad3333;
          box-shadow: 0 6px 16px rgba(209, 67, 67, 0.24);
          transform: translateY(-1px);
        }

        .admin-toast {
          align-items: center;
          animation: admin-toast-in 0.25s ease-out;
          border: 1px solid #3d3b38;
          display: flex;
          gap: 10px;
          left: 50%;
          max-width: calc(100% - 32px);
          position: fixed;
          bottom: 28px;
          z-index: 40;
          padding: 12px 13px;
          border-radius: 8px;
          background: var(--admin-ink);
          color: white;
          font-size: 13px;
          transform: translateX(-50%);
          box-shadow: 0 12px 32px rgba(24, 24, 24, 0.2);
        }

        .admin-toast-icon {
          align-items: center;
          background: var(--admin-orange);
          border-radius: 50%;
          display: flex;
          flex: 0 0 auto;
          height: 23px;
          justify-content: center;
          width: 23px;
        }

        @keyframes admin-toast-in {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .profile-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          background: white;
          border: 1px solid var(--admin-line);
          border-radius: 14px;
          padding: 8px 12px;
          box-shadow: none;
          cursor: pointer;
          text-align: left;
        }

        .notification-item:focus-visible {
          outline: 2px solid var(--admin-orange);
          outline-offset: -2px;
        }

        .notification-delete {
          margin-left: auto;
          padding: 4px 2px;
          background: transparent;
          color: var(--admin-muted);
          opacity: 0;
        }

        .notification-item:hover .notification-delete,
        .notification-item:focus-within .notification-delete {
          opacity: 1;
        }

        .notification-delete:hover,
        .notification-delete:focus-visible {
          color: var(--admin-danger);
          opacity: 1;
        }

        .notification-empty {
          padding: 22px 18px;
          color: var(--admin-muted);
          font-size: 13px;
          text-align: center;
        }

        .avatar-mini {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(233, 95, 42, 0.12);
          color: var(--admin-orange);
          font-weight: 800;
          font-size: 12px;
        }

        .profile-chip strong,
        .profile-chip span {
          display: block;
        }

        .profile-chip strong {
          font-size: 13px;
          white-space: nowrap;
        }

        .profile-chip span {
          color: var(--admin-muted);
          font-size: 11px;
        }

        .content-shell {
          padding: 26px 28px 32px;
          overflow-y: auto;
          height: calc(100vh - 90px);
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--admin-muted);
          font-size: 12px;
          margin-bottom: 18px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .page-section {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .inline-header {
          padding-top: 4px;
        }

        .eyebrow {
          margin: 0 0 6px;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--admin-orange);
          font-weight: 700;
        }

        .panel-header h2,
        .panel-header h3 {
          margin: 0;
          letter-spacing: -0.05em;
        }

        .panel-header h2 {
          font-size: clamp(24px, 1.7vw, 32px);
        }

        .panel-header h3 {
          font-size: clamp(18px, 1.2vw, 22px);
        }

        .button,
        .action-item,
        .text-button,
        .icon-button,
        .settings-item {
          transition: all 0.2s ease;
        }

        .button {
          border-radius: 12px;
          font-weight: 700;
          font-size: 13px;
          padding: 11px 16px;
          border: 1px solid transparent;
          box-shadow: none;
        }

        .button.primary {
          background: var(--admin-orange);
          color: white;
          box-shadow: none;
        }

        .button.secondary {
          background: white;
          color: var(--admin-ink);
          border-color: var(--admin-line);
        }

        .header-actions-group {
          display: flex;
          gap: 10px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 16px;
        }

        .stat-card,
        .panel-card,
        .category-card,
        .collection-card,
        .review-card {
          background: var(--admin-panel);
          border: 1px solid var(--admin-line);
          border-radius: 18px;
          box-shadow: var(--admin-shadow);
        }

        .stat-card {
          padding: 18px 18px 16px;
        }

        .customer-kpi-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .customer-kpi-grid .stat-topline i {
          color: var(--admin-orange);
        }

        .customer-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 16px 18px;
          border-bottom: 1px solid var(--admin-line);
        }

        .table-search {
          display: flex;
          align-items: center;
          gap: 9px;
          width: min(360px, 100%);
          min-height: 36px;
          padding: 0 12px;
          border: 1px solid var(--admin-line);
          border-radius: 999px;
          color: var(--admin-muted);
        }

        .table-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--admin-ink);
          font-size: 13px;
        }

        .customer-toolbar select,
        .status-select {
          border: 1px solid var(--admin-line);
          border-radius: 999px;
          background: white;
          color: var(--admin-ink);
          padding: 8px 11px;
          outline: 0;
          font-size: 12px;
        }

        .table-number-input {
          width: 76px;
          border: 1px solid var(--admin-line);
          border-radius: 999px;
          padding: 8px 10px;
          background: white;
          color: var(--admin-ink);
          outline: 0;
        }

        .customer-contact {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .customer-contact small {
          color: var(--admin-muted);
          font-size: 11px;
        }

        .empty-table-state {
          padding: 30px !important;
          color: var(--admin-muted);
          text-align: center;
        }

        .stat-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: var(--admin-muted);
          font-size: 12px;
          margin-bottom: 18px;
        }

        .stat-card strong {
          font-size: clamp(22px, 1.8vw, 30px);
          letter-spacing: -0.06em;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-badge.success {
          background: rgba(31, 143, 95, 0.12);
          color: var(--admin-success);
        }
        .status-badge.warning {
          background: rgba(217, 119, 6, 0.12);
          color: var(--admin-warning);
        }
        .status-badge.danger {
          background: rgba(209, 67, 67, 0.12);
          color: var(--admin-danger);
        }
        .status-badge.info {
          background: rgba(41, 88, 217, 0.12);
          color: var(--admin-info);
        }
        .status-badge.neutral {
          background: rgba(111, 107, 102, 0.12);
          color: var(--admin-muted);
        }

        .two-col-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 18px;
        }

        .chart-panel,
        .panel-card,
        .category-card,
        .collection-card,
        .review-card {
          padding: 18px 18px 16px;
        }

        .chart-panel {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.9),
            rgba(255, 248, 244, 0.96)
          );
          border: 1px solid rgba(233, 95, 42, 0.12);
        }

        .compact-header {
          margin-bottom: 14px;
        }

        .ghost-pill {
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(233, 95, 42, 0.08);
          color: var(--admin-orange);
          font-weight: 700;
          font-size: 11px;
        }

        .chart-bars {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 12px;
          min-height: 220px;
          padding: 8px 8px 0;
          border-radius: 16px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.5),
            rgba(245, 247, 250, 0.82)
          );
        }

        .bar-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: end;
          gap: 8px;
          flex: 1;
          padding: 6px 2px 0;
          position: relative;
        }

        .bar-wrap::after {
          content: "";
          position: absolute;
          inset: auto 50% 0;
          width: 36px;
          height: calc(100% - 28px);
          transform: translateX(-50%);
          background: linear-gradient(
            180deg,
            rgba(233, 95, 42, 0.04),
            rgba(233, 95, 42, 0)
          );
          border-radius: 12px;
          z-index: 0;
        }

        .bar-value {
          color: var(--admin-ink);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: -0.03em;
          position: relative;
          z-index: 1;
        }

        .bar {
          width: 100%;
          max-width: 36px;
          background: linear-gradient(
            180deg,
            #ffb38a 0%,
            #f77d3b 35%,
            #e45d29 100%
          );
          border-radius: 12px 12px 6px 6px;
          display: block;
          position: relative;
          z-index: 1;
          box-shadow: 0 12px 22px rgba(233, 95, 42, 0.18);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .bar-wrap:hover .bar {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(233, 95, 42, 0.22);
        }

        .bar-wrap small {
          color: var(--admin-ink);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        .chart-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(17, 24, 39, 0.08);
          color: var(--admin-muted);
          font-size: 12px;
        }

        .chart-summary strong {
          color: var(--admin-ink);
          font-size: 18px;
          letter-spacing: -0.04em;
        }

        .panel-list {
          display: flex;
          flex-direction: column;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
          background: linear-gradient(180deg, #fffaf7 0%, #fff 100%);
          border: 1px solid rgba(233, 95, 42, 0.12);
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 600;
          color: var(--admin-ink);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .action-item:hover,
        .action-item:focus-visible {
          transform: translateY(-1px);
          border-color: rgba(233, 95, 42, 0.3);
          box-shadow: 0 10px 18px rgba(233, 95, 42, 0.08);
          outline: none;
        }

        .action-item i {
          width: 18px;
          text-align: center;
          color: var(--admin-orange);
          font-size: 14px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .data-table thead th {
          text-align: left;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--admin-muted);
          padding: 12px 10px;
          border-bottom: 1px solid var(--admin-line);
        }

        .data-table tbody td {
          padding: 14px 10px;
          border-bottom: 1px solid var(--admin-line);
          vertical-align: middle;
        }

        .product-name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .product-name-cell strong {
          display: block;
          font-size: 14px;
        }

        .product-name-cell span {
          display: block;
          color: var(--admin-muted);
          font-size: 11px;
          margin-top: 3px;
        }

        .mini-thumb {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f1efec;
          background-size: cover;
          background-position: center;
          border: 1px solid var(--admin-line);
        }

        .mini-product-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mini-product {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
        }

        .mini-product .mini-thumb {
          width: 52px;
          height: 52px;
        }

        .mini-product div {
          flex: 1;
        }

        .mini-product strong,
        .mini-product span {
          display: block;
        }

        .mini-product span {
          color: var(--admin-muted);
          font-size: 12px;
        }

        .mini-product em {
          font-style: normal;
          font-size: 12px;
          color: var(--admin-muted);
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px 16px;
        }

        .search-panel {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--admin-line);
          border-radius: 999px;
          background: #faf8f5;
          padding: 8px 12px;
          min-height: 42px;
        }

        .search-panel input,
        .toolbar-controls select,
        .field-grid input,
        .field-grid select {
          border: 1px solid var(--admin-line);
          border-radius: 999px;
          background: white;
          padding: 9px 12px;
          color: var(--admin-ink);
          outline: none;
        }

        .search-panel input {
          border: 0;
          background: transparent;
          width: 100%;
          height: 28px;
          padding: 0;
        }

        .toolbar-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .row-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-button {
          width: 34px;
          height: 34px;
          padding: 0;
          border-radius: 10px;
          border: 1px solid var(--admin-line);
          background: #fcfaf7;
          color: var(--admin-ink);
        }

        .icon-button.danger {
          color: var(--admin-danger);
        }

        .card-grid {
          display: grid;
          gap: 18px;
        }

        .three-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .category-card,
        .collection-card {
          overflow: hidden;
          padding: 0;
        }

        .category-thumb,
        .collection-banner {
          height: 170px;
          background-size: cover;
          background-position: center;
        }

        .category-info,
        .collection-body {
          padding: 16px;
        }

        .title-row,
        .meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .meta-row {
          margin-top: 14px;
          color: var(--admin-muted);
          font-size: 12px;
        }

        .right-align {
          justify-content: flex-end;
        }

        .collection-banner {
          position: relative;
        }

        .feature-tag {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(255, 255, 255, 0.9);
          color: var(--admin-ink);
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .text-button {
          background: transparent;
          border: 0;
          padding: 0;
          color: var(--admin-orange);
          font-weight: 700;
          cursor: pointer;
        }

        .text-button.danger {
          color: var(--admin-danger);
        }

        .review-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .review-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .review-heading strong,
        .review-heading span {
          display: block;
        }

        .review-heading span {
          color: var(--admin-muted);
          font-size: 12px;
        }

        .stars {
          color: #f4b740;
          letter-spacing: 2px;
        }

        .review-card p {
          margin: 0;
          color: var(--admin-muted);
          line-height: 1.7;
        }

        .review-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          color: var(--admin-muted);
          font-size: 12px;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 18px;
        }

        .settings-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: fit-content;
        }

        .settings-item {
          text-align: left;
          padding: 11px 12px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: var(--admin-muted);
          font-weight: 600;
        }

        .settings-item.active {
          background: rgba(233, 95, 42, 0.08);
          color: var(--admin-orange);
          border-color: rgba(233, 95, 42, 0.15);
        }

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .settings-section-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--admin-line);
        }

        .settings-section-heading strong {
          font-size: 18px;
          letter-spacing: -0.04em;
        }

        .settings-section-heading span,
        .setting-toggle small,
        .session-row small {
          color: var(--admin-muted);
          font-size: 12px;
          line-height: 1.5;
        }

        .setting-toggle-list {
          display: flex;
          flex-direction: column;
        }

        .setting-toggle,
        .session-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          width: 100%;
          padding: 14px 0;
          border: 0;
          border-bottom: 1px solid var(--admin-line);
          background: transparent;
          color: var(--admin-ink);
          text-align: left;
        }

        .setting-toggle strong,
        .setting-toggle small,
        .session-row strong,
        .session-row small {
          display: block;
        }

        .switch {
          width: 38px;
          height: 22px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: #d9d5d0;
          padding: 3px;
          transition: background-color 0.15s ease;
        }

        .switch span {
          display: block;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          transition: transform 0.15s ease;
        }

        .switch.checked {
          background: var(--admin-orange);
        }

        .switch.checked span {
          transform: translateX(16px);
        }

        .security-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background: #f6f4f1;
          border: 1px solid var(--admin-line);
          color: var(--admin-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .security-note i {
          color: var(--admin-success);
          margin-top: 2px;
        }

        .saved-message {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--admin-success);
          font-size: 12px;
          font-weight: 700;
        }

        .field-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field-grid label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
          color: var(--admin-muted);
          font-weight: 600;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .settings-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
        }

        .logout-card {
          max-width: 620px;
          margin: 40px auto 0;
          text-align: center;
          padding: 42px 30px;
        }

        .logout-icon {
          width: 68px;
          height: 68px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: rgba(233, 95, 42, 0.1);
          color: var(--admin-orange);
          display: grid;
          place-items: center;
          font-size: 28px;
        }

        .logout-card h2 {
          margin: 0 0 10px;
          font-size: clamp(28px, 2vw, 34px);
          letter-spacing: -0.06em;
        }

        .logout-card p {
          margin: 0 0 22px;
          color: var(--admin-muted);
          line-height: 1.7;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 1100px) {
          .kpi-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
          .two-col-layout {
            grid-template-columns: 1fr;
          }
          .three-up {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .admin-shell {
            display: block;
          }
          .admin-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 20;
            transform: translateX(-100%);
            width: 260px;
          }
          .admin-sidebar.collapsed {
            width: 260px;
            transform: translateX(0);
          }
          .admin-header {
            padding: 18px 18px 14px;
          }
          .content-shell {
            padding: 18px;
          }
          .header-tools {
            gap: 10px;
          }
          .header-search-admin {
            min-width: 0;
            width: 140px;
          }
          .profile-chip {
            display: none;
          }
          .mobile-only {
            display: inline-flex;
          }
          .three-up,
          .review-list,
          .settings-layout,
          .field-grid {
            grid-template-columns: 1fr;
          }
          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
