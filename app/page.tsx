"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "./components/site-header";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number | null;
  image: string;
  tag?: string;
};

type CartItem = Product & { quantity: number };

type Profile = {
  name: string;
  phone: string;
  email: string;
  city: string;
  avatar: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Mazi Upholstery Storage Double Bed",
    category: "Bedroom",
    price: 68000,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
    tag: "Bestseller",
  },
  {
    id: 2,
    name: "Zort 6 Seater Sofa Set",
    category: "Living Room",
    price: 255000,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    tag: "New",
  },
  {
    id: 3,
    name: "Stace Center Table",
    category: "Living Room",
    price: 38000,
    image:
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Felicity Eight Seater Dining Table Set",
    category: "Dining Room",
    price: 115000,
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Almond Cane Accent Chair",
    category: "Living Room",
    price: 42000,
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Haven Six Drawer Dresser",
    category: "Bedroom",
    price: 74000,
    image:
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Nora Walnut Work Desk",
    category: "Office",
    price: 56000,
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Oriel Open Shelf Unit",
    category: "Storage",
    price: 31000,
    image:
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = [
  [
    "Bedroom",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80",
  ],
  [
    "Living Room",
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
  ],
  [
    "Dining Room",
    "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=600&q=80",
  ],
  [
    "Office",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80",
  ],
  [
    "Storage",
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80",
  ],
  [
    "Decor",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
  ],
];

const rooms = [
  [
    "01",
    "Bedroom Collection",
    "Quiet forms for better rest.",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
  ],
  [
    "02",
    "Living Room Collection",
    "Make room for good company.",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85",
  ],
  [
    "03",
    "Dining Collection",
    "Gather around something beautiful.",
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=85",
  ],
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const icons: Record<string, string> = {
    home: "fa-solid fa-house",
    shop: "fa-solid fa-store",
    search: "fa-solid fa-magnifying-glass",
    bag: "fa-solid fa-bag-shopping",
    heart: "fa-solid fa-heart",
    menu: "fa-solid fa-bars",
    arrow: "fa-solid fa-arrow-right",
    close: "fa-solid fa-xmark",
    plus: "fa-solid fa-plus",
    minus: "fa-solid fa-minus",
    trash: "fa-solid fa-trash-can",
    check: "fa-solid fa-check",
    filter: "fa-solid fa-sliders",
    tag: "fa-solid fa-tag",
    instagram: "fa-brands fa-instagram",
    facebook: "fa-brands fa-facebook-f",
    pinterest: "fa-brands fa-pinterest-p",
    user: "fa-solid fa-user",
    map: "fa-solid fa-map-location-dot",
    headset: "fa-solid fa-headset",
    logout: "fa-solid fa-right-from-bracket",
  };
  return (
    <i
      aria-hidden="true"
      className={`icon ${icons[name] ?? "fa-solid fa-circle"}`}
      style={{ fontSize: size }}
    />
  );
}

const money = (price: number | null) =>
  price === null ? "Price on Request" : `Rs. ${price.toLocaleString("en-PK")}`;

const defaultProfile: Profile = {
  name: "Muntazir Bukhari",
  phone: "+92 300 1234567",
  email: "hello@muntazirandsons.com",
  city: "Peshawar, Pakistan",
  avatar: "",
};

const reviews = [
  {
    name: "Areeba Khan",
    role: "Homeowner, Peshawar",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    text: "The sofa is even more beautiful in person. Delivery was smooth, thoughtful, and right on time.",
    rating: 5,
  },
  {
    name: "Hamza Mir",
    role: "Architect, Islamabad",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    text: "Beautifully made pieces with proportions that work in real homes. The team understood our brief immediately.",
    rating: 5,
  },
  {
    name: "Sana Rauf",
    role: "Muntazir customer",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80",
    text: "Our dining set has become the heart of the house. Warm, sturdy, and made for long evenings together.",
    rating: 5,
  },
];

const partners = [
  {
    name: "Aizaz Khan",
    role: "Creative Director",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    copy: "Leads the visual language behind every collection.",
  },
  {
    name: "Abdullah",
    role: "Workshop Lead",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80",
    copy: "Keeps our materials, makers, and details in good hands.",
  },
  {
    name: "Fawad Khan",
    role: "Client Experience",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    copy: "Makes every order feel personal, from first call to delivery.",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [profileDraft, setProfileDraft] = useState<Profile>(defaultProfile);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [dealTime, setDealTime] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
    milliseconds: 99,
  });
  const [mobileNav, setMobileNav] = useState("home");

  const openMobileSearch = () => {
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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const savedCart = window.localStorage.getItem("muntazir-cart");
        const savedWishlist = window.localStorage.getItem("muntazir-wishlist");
        const savedProfile = window.localStorage.getItem("muntazir-profile");
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedProfile)
          setProfile({ ...defaultProfile, ...JSON.parse(savedProfile) });
      } catch {
        window.localStorage.removeItem("muntazir-cart");
        window.localStorage.removeItem("muntazir-wishlist");
      } finally {
        setStorageReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("muntazir-cart", JSON.stringify(cart));
  }, [cart, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("muntazir-wishlist", JSON.stringify(wishlist));
  }, [wishlist, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("muntazir-profile", JSON.stringify(profile));
  }, [profile, storageReady]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setCartOpen(false);
      setSelectedProduct(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDealTime((current) => {
        const total = Math.max(
          0,
          ((current.hours * 60 + current.minutes) * 60 + current.seconds) *
            1000 +
            current.milliseconds -
            10,
        );
        return {
          hours: Math.floor(total / 3600000),
          minutes: Math.floor((total % 3600000) / 60000),
          seconds: Math.floor((total % 60000) / 1000),
          milliseconds: Math.floor((total % 1000) / 10),
        };
      });
    }, 10);
    return () => window.clearInterval(timer);
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        (activeCategory === "All" || product.category === activeCategory) &&
        product.name.toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) =>
      sort === "low"
        ? (a.price ?? Infinity) - (b.price ?? Infinity)
        : sort === "high"
          ? (b.price ?? 0) - (a.price ?? 0)
          : a.id - b.id,
    );
  }, [activeCategory, query, sort]);

  const addToCart = (product: Product) => {
    setCart((current) =>
      current.some((item) => item.id === product.id)
        ? current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }],
    );
      window.dispatchEvent(new Event("muntazir-cart-updated"));
    setToast(`${product.name} added to your bag`);
    setCartOpen(true);
  };
  const toggleWishlist = (product: Product) => {
    const isSaved = wishlist.includes(product.id);
    setWishlist((current) =>
      isSaved
        ? current.filter((id) => id !== product.id)
        : [...current, product.id],
    );
    setToast(
      isSaved
        ? `${product.name} removed from wishlist`
        : `${product.name} saved to wishlist`,
    );
  };
  const updateQuantity = (id: number, amount: number) =>
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const cartTotal = cart.reduce(
    (total, item) => total + (item.price ?? 0) * item.quantity,
    0,
  );
  const wishlistCount = wishlist.length;
  const profileInitials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openProfileEditor = () => {
    setProfileDraft(profile);
    setProfileEditorOpen(true);
  };

  const handleProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setProfileDraft((current) => ({
        ...current,
        avatar: String(reader.result),
      }));
    reader.readAsDataURL(file);
  };

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !subscriptionEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscriptionEmail)
    ) {
      setSubscriptionMessage("Please enter a valid email address.");
      return;
    }
    window.localStorage.setItem("muntazir-subscriber", subscriptionEmail);
    setSubscriptionMessage("You are on the list. Welcome to the edit.");
    setSubscriptionEmail("");
  };

  return (
    <main>
      <SiteHeader
        query={query}
        onQueryChange={setQuery}
        wishlistCount={wishlistCount}
        onCartOpen={() => setCartOpen(true)}
        onToast={setToast}
        onProfileEdit={openProfileEditor}
      />

      <section className="hero" id="top">
        <div className="hero-image" />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-content">
          <span className="hero-badge">
            The new season edit · up to 20% off
          </span>
          <p className="eyebrow">EST. 1987 · PESHAWAR</p>
          <h1>
            Furniture that
            <br />
            <i>defines</i> your space.
          </h1>
          <p className="hero-copy">
            Discover modern comfort and timeless furniture, thoughtfully made
            for the way you live.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#collection">
              Explore collection <Icon name="arrow" size={17} />
            </a>
            <a className="text-link" href="#rooms">
              Shop by room <Icon name="arrow" size={16} />
            </a>
          </div>
          <div className="hero-benefits">
            <span>
              <Icon name="check" size={14} /> Secure payments
            </span>
            <span>
              <Icon name="check" size={14} /> Best prices
            </span>
            <span>
              <Icon name="check" size={14} /> Fast delivery
            </span>
          </div>
        </div>
        <div className="hero-note">
          MADE FOR LIVING
          <br />
          <span>01 / 03</span>
        </div>
      </section>

      <section className="category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BROWSE BY SPACE</p>
            <h2>Find your feeling.</h2>
          </div>
          <a className="text-link desktop-only" href="#collection">
            View all <Icon name="arrow" size={16} />
          </a>
        </div>
        <div className="category-scroll">
          {categories.map(([name, image]) => (
            <button
              className="category-card"
              key={name}
              onClick={() => {
                setActiveCategory(name);
                document.getElementById("collection")?.scrollIntoView();
              }}
            >
              <span
                className="category-image"
                style={{ backgroundImage: `url(${image})` }}
              />
              <span>{name}</span>
              <Icon name="arrow" size={15} />
            </button>
          ))}
        </div>
      </section>

      <section className="deal-section" id="deals">
        <div className="deal-copy">
          <p className="eyebrow">DEAL OF THE DAY</p>
          <h2>
            A softer seat
            <br />
            <i>for slower days.</i>
          </h2>
          <p>
            Bring home the Almond Cane Accent Chair and give your favourite
            corner a little more character.
          </p>
          <div className="deal-price">
            <span>Rs. 48,000</span>
            <strong>Rs. 42,000</strong>
          </div>
          <span className="stock-note">Only 6 pieces left in this edit</span>
          <a
            className="button button-primary"
            href="#collection"
            onClick={() => {
              setQuery("Almond");
              setActiveCategory("Living Room");
            }}
          >
            Shop the deal <Icon name="arrow" size={17} />
          </a>
        </div>
        <div
          className="deal-image"
          style={{ backgroundImage: `url(${products[4].image})` }}
        >
          <span className="deal-sticker">
            20%<small>OFF</small>
          </span>
        </div>
        <div className="deal-countdown">
          <span>ENDS IN</span>
          <div>
            <strong>{String(dealTime.hours).padStart(2, "0")}</strong>
            <small>hrs</small>
          </div>
          <b>:</b>
          <div>
            <strong>{String(dealTime.minutes).padStart(2, "0")}</strong>
            <small>min</small>
          </div>
          <b>:</b>
          <div>
            <strong>{String(dealTime.seconds).padStart(2, "0")}</strong>
            <small>sec</small>
          </div>
          <b>:</b>
          <div>
            <strong>{String(dealTime.milliseconds).padStart(2, "0")}</strong>
            <small>ms</small>
          </div>
        </div>
      </section>

      <section className="collection-section" id="collection">
        <div className="section-heading collection-heading">
          <div>
            <p className="eyebrow">THE EDIT</p>
            <h2>Featured collection</h2>
            <p className="section-intro">
              Thoughtful pieces for rooms that feel like you.
            </p>
          </div>
          <div className="collection-tools">
            <label className="search-field">
              <Icon name="search" size={17} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pieces"
                aria-label="Search furniture"
              />
            </label>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </div>
        <div className="filter-row">
          <span className="filter-label">
            <Icon name="filter" size={15} /> Filter
          </span>
          <button
            className={activeCategory === "All" ? "active" : ""}
            onClick={() => setActiveCategory("All")}
          >
            All pieces
          </button>
          {categories.slice(0, 5).map(([name]) => (
            <button
              className={activeCategory === name ? "active" : ""}
              onClick={() => setActiveCategory(name)}
              key={name}
            >
              {name}
            </button>
          ))}
          <span className="product-count">{visibleProducts.length} pieces</span>
        </div>
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div
                className="product-image"
                style={{ backgroundImage: `url(${product.image})` }}
              >
                <button
                  className={
                    wishlist.includes(product.id)
                      ? "wishlist selected"
                      : "wishlist"
                  }
                  onClick={() => toggleWishlist(product)}
                  aria-label={`${wishlist.includes(product.id) ? "Remove" : "Add"} ${product.name} ${wishlist.includes(product.id) ? "from" : "to"} wishlist`}
                  aria-pressed={wishlist.includes(product.id)}
                >
                  <Icon name="heart" size={19} />
                </button>
                {product.tag && (
                  <span className="product-tag">{product.tag}</span>
                )}
                <button
                  className="quick-view"
                  onClick={() => setSelectedProduct(product)}
                >
                  Quick view
                </button>
              </div>
              <button
                className="product-info"
                onClick={() => setSelectedProduct(product)}
              >
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <strong>{money(product.price)}</strong>
              </button>
              <div className="product-actions">
                <button
                  className="view-button"
                  onClick={() => setSelectedProduct(product)}
                >
                  View details
                </button>
                <button
                  className="add-button"
                  onClick={() => addToCart(product)}
                >
                  Add to cart <Icon name="plus" size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
        {visibleProducts.length === 0 && (
          <div className="empty-state">
            <span>⌕</span>
            <h3>No pieces found</h3>
            <p>Try another search or browse all our pieces.</p>
            <button
              className="button button-dark"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
            >
              Reset collection
            </button>
          </div>
        )}
      </section>

      <section className="rooms-section" id="rooms">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2>Shop by room</h2>
          </div>
        </div>
        <div className="rooms-grid">
          {rooms.map(([number, name, copy, image]) => (
            <a
              className="room-card"
              href="#collection"
              key={name}
              onClick={() =>
                setActiveCategory(
                  name.replace(" Collection", "") === "Dining"
                    ? "Dining Room"
                    : name.replace(" Collection", ""),
                )
              }
            >
              <div
                className="room-image"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div className="room-overlay">
                <span>{number}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{copy}</p>
                  <span className="room-link">
                    Explore room <Icon name="arrow" size={16} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="values-section" id="story">
        <div className="value-intro">
          <p className="eyebrow">THE MUNTAZIR WAY</p>
          <h2>
            Pieces with a point
            <br />
            of <i>view.</i>
          </h2>
          <p>
            From our workshop in Peshawar to your home, every piece is chosen
            for its character, comfort, and staying power.
          </p>
          <div className="value-signature">
            <span className="signature-mark">M</span>
            <span>
              Considered furniture
              <br />
              <em>since 1987</em>
            </span>
          </div>
        </div>
        <div className="values-content">
          <div className="values-image">
            <div className="values-image-label">
              <span>01</span>
              <strong>
                Made for
                <br />
                <i>living well.</i>
              </strong>
            </div>
          </div>
          <div className="values-grid">
            {[
              [
                "01",
                "Quality furniture",
                "Materials that age beautifully and a finish you can feel.",
              ],
              [
                "02",
                "Modern designs",
                "Considered silhouettes made for contemporary living.",
              ],
              [
                "03",
                "Custom furniture",
                "Your space is unique. We make room for your ideas.",
              ],
              [
                "04",
                "Peshawar-based service",
                "Local knowledge, personal care, from first look to delivery.",
              ],
            ].map(([number, title, copy]) => (
              <div className="value-item" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FROM OUR HOMES</p>
            <h2>Lived in. Loved more.</h2>
          </div>
          <span className="section-kicker">4.9 / 5 average rating</span>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="review-top">
                <img src={review.image} alt={review.name} />
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.role}</span>
                </div>
                <span className="stars">{"★".repeat(review.rating)}</span>
              </div>
              <p>“{review.text}”</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partners-section" id="partners">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE PEOPLE BEHIND THE PIECES</p>
            <h2>Made personal.</h2>
          </div>
          <p className="section-intro">
            A small, thoughtful team making room for better living.
          </p>
        </div>
        <div className="partners-grid">
          {partners.map((partner) => (
            <article className="partner-card" key={partner.name}>
              <img src={partner.image} alt={partner.name} />
              <div>
                <p className="eyebrow">{partner.role}</p>
                <h3>{partner.name}</h3>
                <p>{partner.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="subscribe-section" id="subscribe">
        <div>
          <p className="eyebrow">THE WEEKEND EDIT</p>
          <h2>
            Good rooms start
            <br />
            <i>with an idea.</i>
          </h2>
        </div>
        <div>
          <p>
            New collections, room notes, and considered pieces, delivered
            occasionally.
          </p>
          <form className="subscribe-form" onSubmit={subscribe}>
            <label className="sr-only" htmlFor="subscribe-email">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              value={subscriptionEmail}
              onChange={(event) => setSubscriptionEmail(event.target.value)}
              placeholder="Your email address"
              aria-describedby="subscribe-message"
            />
            <button className="button button-primary" type="submit">
              Subscribe <Icon name="arrow" size={16} />
            </button>
          </form>
          <span
            className={
              subscriptionMessage.includes("valid")
                ? "form-message error"
                : "form-message"
            }
            id="subscribe-message"
            role="status"
          >
            {subscriptionMessage}
          </span>
        </div>
      </section>

      <footer id="footer">
        <div className="footer-main">
          <div>
            <a href="#top" className="brand footer-brand">
              <span className="brand-mark">M</span>
              <span>
                Muntazir <em>&</em> Sons <small>FURNITURE</small>
              </span>
            </a>
            <p>
              Furniture with a point of view.
              <br />
              Peshawar, Pakistan.
            </p>
            <a
              className="footer-contact"
              href="mailto:hello@muntazirandsons.com"
            >
              hello@muntazirandsons.com
            </a>
          </div>
          <div className="footer-links">
            <div>
              <strong>Explore</strong>
              <a href="#collection">All pieces</a>
              <a href="#rooms">Shop by room</a>
              <a href="#reviews">Client reviews</a>
              <a href="#story">Our story</a>
            </div>
            <div>
              <strong>Visit us</strong>
              <span>University Road</span>
              <span>Peshawar, KPK</span>
              <a href="tel:+92915273555">+92 91 527 3555</a>
            </div>
            <div>
              <strong>Follow along</strong>
              <div className="socials">
                <a href="#top" aria-label="Instagram">
                  <Icon name="instagram" size={19} />
                </a>
                <a href="#top" aria-label="Facebook">
                  <Icon name="facebook" size={17} />
                </a>
                <a href="#top" aria-label="Pinterest">
                  <Icon name="pinterest" size={17} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Muntazir & Sons Furniture</span>
          <span>Designed for living well · Privacy · Terms</span>
        </div>
      </footer>

      {profileEditorOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setProfileEditorOpen(false)}
        >
          <div
            className="profile-editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-editor-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="editor-heading">
              <div>
                <p className="eyebrow">YOUR DETAILS</p>
                <h2 id="profile-editor-title">Edit profile</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setProfileEditorOpen(false)}
                aria-label="Close profile editor"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="editor-avatar">
              <div className="editor-avatar-image">
                {profileDraft.avatar ? (
                  <img src={profileDraft.avatar} alt="Profile preview" />
                ) : (
                  profileInitials
                )}
              </div>
              <label className="upload-button">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhoto}
                />
              </label>
            </div>
            <div className="profile-form">
              <label>
                Full name
                <input
                  value={profileDraft.name}
                  onChange={(event) =>
                    setProfileDraft({
                      ...profileDraft,
                      name: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Mobile number
                <input
                  type="tel"
                  value={profileDraft.phone}
                  onChange={(event) =>
                    setProfileDraft({
                      ...profileDraft,
                      phone: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Email address
                <input
                  type="email"
                  value={profileDraft.email}
                  onChange={(event) =>
                    setProfileDraft({
                      ...profileDraft,
                      email: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                City / country
                <input
                  value={profileDraft.city}
                  onChange={(event) =>
                    setProfileDraft({
                      ...profileDraft,
                      city: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <div className="editor-actions">
              <button
                className="button button-dark"
                onClick={() => setProfileEditorOpen(false)}
              >
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  if (!profileDraft.name.trim() || !profileDraft.email.trim()) {
                    setToast("Name and email are required");
                    return;
                  }
                  setProfile(profileDraft);
                  setProfileEditorOpen(false);
                  setToast("Profile updated successfully");
                }}
              >
                Save changes <Icon name="check" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              <Icon name="close" />
            </button>
            <div
              className="detail-image"
              role="img"
              aria-label={selectedProduct.name}
              style={{ backgroundImage: `url(${selectedProduct.image})` }}
            />
            <div className="detail-content">
              <p className="eyebrow">{selectedProduct.category}</p>
              <h2 id="product-detail-title">{selectedProduct.name}</h2>
              <strong>{money(selectedProduct.price)}</strong>
              <p>
                Thoughtfully selected for homes that value comfort, form, and
                everyday rituals.
              </p>
              <div className="detail-actions">
                <button
                  className="button button-primary"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Add to cart <Icon name="plus" size={17} />
                </button>
                <button
                  className={
                    wishlist.includes(selectedProduct.id)
                      ? "detail-wishlist selected"
                      : "detail-wishlist"
                  }
                  onClick={() => toggleWishlist(selectedProduct)}
                >
                  <Icon name="heart" size={17} />{" "}
                  {wishlist.includes(selectedProduct.id)
                    ? "Saved"
                    : "Save for later"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {cartOpen && (
        <div
          className="drawer-backdrop"
          role="presentation"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-heading">
              <div>
                <p className="eyebrow">YOUR SELECTION</p>
                <h2 id="cart-title">Shopping bag</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <Icon name="close" />
              </button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <Icon name="bag" size={34} />
                <p>Your bag is waiting for something special.</p>
                <a
                  className="button button-dark"
                  href="#collection"
                  onClick={() => setCartOpen(false)}
                >
                  Explore collection
                </a>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div
                        className="cart-thumb"
                        role="img"
                        aria-label={item.name}
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <strong>{money(item.price)}</strong>
                        <div className="quantity">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Icon name="minus" size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Icon name="plus" size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove-item"
                        onClick={() => updateQuantity(item.id, -item.quantity)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{money(cartTotal)}</strong>
                  </div>
                  <p>Delivery calculated at checkout.</p>
                  <button
                    className="button button-primary checkout-button"
                    onClick={() =>
                      setToast(
                        "Order request received. We will contact you shortly.",
                      )
                    }
                  >
                    Proceed to checkout <Icon name="arrow" size={17} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <a
          className={
            mobileNav === "home" ? "mobile-nav-item active" : "mobile-nav-item"
          }
          href="#top"
          onClick={() => {
            setMobileNav("home");
          }}
        >
          <Icon name="home" size={18} />
          <span>Home</span>
        </a>
        <a
          className={
            mobileNav === "shop" ? "mobile-nav-item active" : "mobile-nav-item"
          }
          href="#collection"
          onClick={() => {
            setMobileNav("shop");
          }}
        >
          <Icon name="shop" size={18} />
          <span>Shop</span>
        </a>
        <button
          className={
            mobileNav === "search"
              ? "mobile-nav-item active"
              : "mobile-nav-item"
          }
          type="button"
          onClick={() => {
            setMobileNav("search");
            openMobileSearch();
          }}
        >
          <Icon name="search" size={18} />
          <span>Search</span>
        </button>
        <button
          className={
            mobileNav === "profile"
              ? "mobile-nav-item active"
              : "mobile-nav-item"
          }
          type="button"
          onClick={() => {
            setMobileNav("profile");
          }}
        >
          <Icon name="user" size={18} />
          <span>Profile</span>
        </button>
      </nav>
      {toast && (
        <div className="toast" role="status">
          <span className="toast-icon">
            <Icon name="check" size={16} />
          </span>
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      )}
    </main>
  );
}
