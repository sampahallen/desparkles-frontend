import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronRight,
  Star, Phone, Mail, MapPin, Instagram, Facebook, Twitter,
  Plus, Minus, Trash2, Gift, Sparkles, ArrowRight,
  ChevronDown, Check, MessageCircle, ZoomIn, SlidersHorizontal,
  Tag, Repeat2, Clock, Shield, Truck, Award,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page =
  | "home" | "shop" | "product" | "style-match" | "gift-box"
  | "custom-orders" | "cart" | "checkout" | "wishlist"
  | "about" | "faq" | "contact" | "login" | "register" | "forgot-password";

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  badge?: string;
  inStock: number;
  rating: number;
  reviews: number;
  description: string;
  materials?: string;
  care?: string;
  colors?: string[];
  occasions?: string[];
}

interface CartItem {
  product: Product;
  qty: number;
  color?: string;
}

interface MockUser {
  firstName: string;
  email: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WHATSAPP_BASE = "https://wa.me/233550000000";
const formatPrice = (p: number) => `GHS ${p.toLocaleString()}`;
function cls(...args: (string | undefined | false | null)[]) {
  return args.filter(Boolean).join(" ");
}

const products: Product[] = [
  {
    id: 1,
    name: "Adinkra Gold Cuff",
    category: "jewelry",
    subcategory: "Women's Jewelry",
    price: 380,
    originalPrice: 480,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&h=800&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop&auto=format",
    ],
    badge: "Best Seller",
    inStock: 3,
    rating: 4.9,
    reviews: 124,
    description: "Inspired by the Adinkra symbols of Ghana, this 18K gold-plated cuff features intricate hand-etched patterns representing love and unity. A statement piece that bridges heritage and contemporary style.",
    materials: "18K Gold-plated brass, hypoallergenic lining",
    care: "Avoid water and perfume. Store in the provided velvet pouch. Polish with a dry microfiber cloth.",
    colors: ["Gold", "Rose Gold"],
    occasions: ["Wedding", "Dinner", "Office", "Birthday"],
  },
  {
    id: 2,
    name: "Kente Bead Necklace",
    category: "jewelry",
    subcategory: "Women's Jewelry",
    price: 220,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&auto=format",
    badge: "New",
    inStock: 12,
    rating: 4.7,
    reviews: 67,
    description: "Handcrafted glass beads in traditional Kente colours with a 14K gold-filled toggle clasp. Each bead is individually selected for colour harmony and weight. A conversation piece at every occasion.",
    materials: "Venetian glass beads, 14K gold-filled clasp",
    care: "Keep away from chlorine. Wipe gently with a soft cloth after wear.",
    colors: ["Multicolor"],
    occasions: ["Outing", "Birthday", "Wedding"],
  },
  {
    id: 3,
    name: "Accra Ring Set",
    category: "jewelry",
    subcategory: "Men's Jewelry",
    price: 165,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop&auto=format",
    inStock: 8,
    rating: 4.8,
    reviews: 45,
    description: "A curated set of three stackable rings in brushed gold and polished silver, designed for the modern Ghanaian man. Wear one, two, or all three — the look is effortlessly elevated.",
    materials: "Sterling silver, 18K gold plate, nickel-free",
    care: "Polish with a soft jewellery cloth. Store separately to prevent scratching.",
    colors: ["Gold", "Silver", "Mixed"],
    occasions: ["Office", "Outing", "Dinner"],
  },
  {
    id: 4,
    name: "Sahel Oud Pencil Perfume",
    category: "perfumes",
    subcategory: "Pencil Perfumes",
    price: 95,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&h=600&fit=crop&auto=format",
    badge: "Only 3 Left",
    inStock: 3,
    rating: 4.6,
    reviews: 88,
    description: "A warm, woody fragrance in our signature pencil format — pocket-sized luxury. Notes of aged oud, amber, and sandalwood that last 8+ hours. TSA-friendly and perfect for on-the-go.",
    materials: "Perfume oil concentrate, twist-up applicator",
    care: "Store below 25°C. Keep cap on when not in use.",
    occasions: ["Office", "Dinner", "Wedding", "Outing"],
  },
  {
    id: 5,
    name: "Lagos Leather Sandal",
    category: "footwear",
    subcategory: "Sandals",
    price: 310,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=600&fit=crop&auto=format",
    inStock: 15,
    rating: 4.5,
    reviews: 39,
    description: "Hand-stitched full-grain leather sandals with a cushioned memory-foam insole and adjustable ankle strap. Transitions effortlessly from workday to weekend.",
    materials: "Full-grain leather upper, memory foam insole, rubber outsole",
    care: "Apply leather conditioner monthly. Avoid prolonged exposure to water.",
    colors: ["Tan", "Black", "Cognac"],
    occasions: ["Office", "Outing", "Birthday"],
  },
  {
    id: 6,
    name: "Volta Crystal Earrings",
    category: "jewelry",
    subcategory: "Women's Jewelry",
    price: 145,
    image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&h=600&fit=crop&auto=format",
    inStock: 20,
    rating: 4.9,
    reviews: 156,
    badge: "Best Seller",
    description: "Faceted crystal drops set in recycled gold vermeil. These catch the light beautifully and pair with everything from denim to evening gowns. A wardrobe essential.",
    materials: "Swarovski crystal, recycled gold vermeil sterling silver",
    care: "Avoid moisture and perfume. Store separately in the provided pouch.",
    colors: ["Clear", "Rose", "Champagne"],
    occasions: ["Dinner", "Wedding", "Birthday", "Outing"],
  },
  {
    id: 7,
    name: "Kumasi Comfort Slipper",
    category: "footwear",
    subcategory: "Slippers",
    price: 185,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&auto=format",
    inStock: 30,
    rating: 4.4,
    reviews: 28,
    description: "Cloud-soft memory foam slippers with a hand-woven Kente accent strap. Elevated loungewear that doubles as a thoughtful gift. Premium comfort, unmistakable local flair.",
    materials: "Memory foam cushion, woven textile strap, anti-slip EVA sole",
    care: "Spot clean only. Air-dry away from direct sunlight.",
    colors: ["Black/Gold", "Cream/Brown"],
    occasions: ["Outing"],
  },
  {
    id: 8,
    name: "Celebration Gift Package",
    category: "gifts",
    subcategory: "Gift Packages",
    price: 550,
    originalPrice: 680,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&auto=format",
    badge: "Gift",
    inStock: 10,
    rating: 5.0,
    reviews: 34,
    description: "The perfect gift for graduations, birthdays, and promotions. Curated set includes the Volta Crystal Earrings, a Sahel Oud pencil perfume, and a hand-written greeting card — all presented in our signature gift box.",
    materials: "Assorted premium pieces (see inclusions)",
    care: "Per individual item enclosed.",
    occasions: ["Birthday", "Wedding"],
  },
];

const categories = [
  { id: "all", label: "All" },
  { id: "jewelry", label: "Jewelry" },
  { id: "perfumes", label: "Pencil Perfumes" },
  { id: "footwear", label: "Footwear" },
  { id: "gifts", label: "Gift Packages" },
];

const testimonials = [
  {
    id: 1,
    name: "Akosua Mensah",
    role: "Interior Designer, Accra",
    text: "The Adinkra cuff is absolutely stunning. I wore it to a wedding and received so many compliments. The packaging alone felt like a luxury experience — DeSparkles truly delivers.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Kwame Otieno",
    role: "Software Engineer, Kumasi",
    text: "Ordered the Accra Ring Set as a birthday gift for myself. Delivery was fast, and the quality exceeded what I expected at this price point. DeSparkles is my new go-to.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "Efua Darko",
    role: "Medical Student, Legon",
    text: "The gift box builder made it so easy to put together a thoughtful present for my roommate. She loved every single piece and couldn't believe it came from a Ghanaian brand!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&h=100&fit=crop&auto=format",
  },
];

const navLinks: { label: string; page: Page }[] = [
  { label: "Shop", page: "shop" },
  { label: "Style Match", page: "style-match" },
  { label: "Gift Box", page: "gift-box" },
  { label: "Custom Orders", page: "custom-orders" },
  { label: "About", page: "about" },
];

const pagePaths: Record<Exclude<Page, "product">, string> = {
  home: "/",
  shop: "/shop",
  "style-match": "/style-match",
  "gift-box": "/gift-box",
  "custom-orders": "/custom-orders",
  cart: "/cart",
  checkout: "/checkout",
  wishlist: "/wishlist",
  about: "/about",
  faq: "/faq",
  contact: "/contact",
  login: "/login",
  register: "/register",
  "forgot-password": "/forgot-password",
};

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const productPath = (product: Product) => `/products/${product.id}-${slugify(product.name)}`;

const pageFromPath = (pathname: string): Page => {
  if (pathname.startsWith("/products/")) return "product";
  const entry = Object.entries(pagePaths).find(([, path]) => path === pathname);
  return (entry?.[0] as Page | undefined) ?? "home";
};

const productFromPath = (pathname: string) => {
  const id = Number(pathname.match(/^\/products\/(\d+)/)?.[1]);
  return products.find((product) => product.id === id) ?? products[0];
};

// ─── Base Components ──────────────────────────────────────────────────────────

function Btn({
  children, variant = "primary", className = "", onClick, type = "button", disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "gold";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";
  const variants = {
    primary: "bg-[#2C2C2C] text-white hover:bg-[#1a1a1a] active:scale-95",
    outline: "border border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-white active:scale-95",
    ghost: "text-[#2C2C2C] hover:bg-[#2C2C2C]/5 active:scale-95",
    gold: "bg-[#C9A227] text-white hover:bg-[#b08f1e] active:scale-95 shadow-sm shadow-[#C9A227]/30",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={cls(base, variants[variant], className)}>
      {children}
    </button>
  );
}

function BadgePill({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "gold" | "red" | "green" | "dark" }) {
  const variants = {
    default: "bg-[#2C2C2C] text-white",
    gold: "bg-[#C9A227] text-white",
    red: "bg-red-500 text-white",
    green: "bg-emerald-500 text-white",
    dark: "bg-[#2C2C2C]/80 text-white",
  };
  return (
    <span className={cls("text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full", variants[variant])}>
      {children}
    </span>
  );
}

function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={11} className={i <= Math.round(rating) ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-200 fill-gray-100"} />
        ))}
      </div>
      <span className="text-xs text-[#6B6B6B]">
        {rating.toFixed(1)}{count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product, onView, onAddCart, onToggleWishlist, isWishlisted,
}: {
  product: Product;
  onView: (p: Product) => void;
  onAddCart: (p: Product) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const badgeVar =
    product.badge === "Best Seller" ? "gold" :
    product.badge === "Only 3 Left" ? "red" :
    product.badge === "New" ? "green" :
    product.badge === "Gift" ? "dark" : "default";

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#C9A227]/5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]" onClick={() => onView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <BadgePill variant={badgeVar as any}>{product.badge}</BadgePill>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart size={14} className={isWishlisted ? "fill-red-500 text-red-500" : "text-[#2C2C2C]"} />
        </button>
        {hovered && (
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={(e) => { e.stopPropagation(); onAddCart(product); }}
              className="w-full py-2 bg-white text-[#2C2C2C] text-xs font-semibold rounded-full hover:bg-[#C9A227] hover:text-white transition-colors"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <div className="p-4" onClick={() => onView(product)}>
        <p className="text-[10px] text-[#C9A227] font-semibold uppercase tracking-widest mb-1">{product.subcategory}</p>
        <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2 leading-tight">{product.name}</h3>
        <StarRating rating={product.rating} count={product.reviews} />
        <div className="flex items-center gap-2 mt-2.5">
          <span className="font-bold text-[#2C2C2C]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-[#6B6B6B] line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {product.inStock <= 5 && (
          <p className="text-[10px] text-orange-500 font-medium mt-1">Only {product.inStock} left</p>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#C9A227]/5 animate-pulse">
      <div className="aspect-square bg-[#F5F0E8]" />
      <div className="p-4 space-y-2">
        <div className="h-2.5 bg-[#F5F0E8] rounded-full w-1/3" />
        <div className="h-3 bg-[#F5F0E8] rounded-full w-3/4" />
        <div className="h-2.5 bg-[#F5F0E8] rounded-full w-1/2" />
        <div className="h-4 bg-[#F5F0E8] rounded-full w-1/3 mt-2" />
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ currentPage, setPage, cartCount, wishlistCount }: {
  currentPage: Page;
  setPage: (p: Page) => void;
  cartCount: number;
  wishlistCount: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header className={cls(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/97 backdrop-blur-md shadow-sm shadow-[#C9A227]/5" : "bg-white/90 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setPage("home")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-['Playfair_Display'] font-bold text-[#2C2C2C] text-lg tracking-tight">DeSparkles</span>
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  onClick={() => setPage(l.page)}
                  className={cls(
                    "text-sm transition-colors duration-200",
                    currentPage === l.page
                      ? "text-[#C9A227] font-semibold"
                      : "text-[#2C2C2C] hover:text-[#C9A227] font-medium"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 hover:bg-[#C9A227]/8 rounded-full transition-colors"
              >
                <Search size={18} className="text-[#2C2C2C]" />
              </button>
              <button
                onClick={() => setPage("wishlist")}
                className="relative p-2.5 hover:bg-[#C9A227]/8 rounded-full transition-colors"
              >
                <Heart size={18} className="text-[#2C2C2C]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A227] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPage("cart")}
                className="relative p-2.5 hover:bg-[#C9A227]/8 rounded-full transition-colors"
              >
                <ShoppingBag size={18} className="text-[#2C2C2C]" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A227] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setPage("login")}
                className="hidden sm:flex p-2.5 hover:bg-[#C9A227]/8 rounded-full transition-colors"
              >
                <User size={18} className="text-[#2C2C2C]" />
              </button>
              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2.5">
                <Menu size={20} className="text-[#2C2C2C]" />
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-3 px-0">
              <div className="relative">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  autoFocus
                  placeholder="Search jewelry, perfumes, sandals..."
                  className="w-full pl-10 pr-4 py-3 bg-[#F5F0E8] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 text-[#2C2C2C] placeholder:text-[#6B6B6B]"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col p-7">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-['Playfair_Display'] font-bold text-xl">DeSparkles</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-7 flex-1">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => { setPage(l.page); setMenuOpen(false); }}
                className="text-left text-2xl font-['Playfair_Display'] font-semibold text-[#2C2C2C] hover:text-[#C9A227] transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div className="border-t border-[#C9A227]/10 pt-6 flex gap-6">
            <button onClick={() => { setPage("login"); setMenuOpen(false); }} className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
              <User size={16} /> Account
            </button>
            <button onClick={() => { setPage("wishlist"); setMenuOpen(false); }} className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
              <Heart size={16} /> Wishlist ({wishlistCount})
            </button>
            <button onClick={() => { setPage("cart"); setMenuOpen(false); }} className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
              <ShoppingBag size={16} /> Cart ({cartCount})
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#2C2C2C] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#C9A227] flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-['Playfair_Display'] font-bold text-xl">DeSparkles</span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              Jewelry & Footwear that completes your glow. Premium, ethically crafted, proudly Ghanaian.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/8 hover:bg-[#C9A227] rounded-full flex items-center justify-center transition-colors duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Shop</h4>
            <div className="flex flex-col gap-3">
              {["Women's Jewelry", "Men's Jewelry", "Custom Orders", "Pencil Perfumes", "Sandals & Slippers", "Gift Packages"].map((l) => (
                <button key={l} onClick={() => setPage("shop")} className="text-sm text-white/60 hover:text-[#C9A227] text-left transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Company</h4>
            <div className="flex flex-col gap-3">
              {([["About Us", "about"], ["FAQ", "faq"], ["Contact", "contact"]] as [string, Page][]).map(([l, p]) => (
                <button key={l} onClick={() => setPage(p)} className="text-sm text-white/60 hover:text-[#C9A227] text-left transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Contact</h4>
            <div className="flex flex-col gap-4">
              {[
                { Icon: MapPin, value: "123 Ring Road West, Accra, Ghana" },
                { Icon: Phone, value: "+233 (0) 55 000 0000" },
                { Icon: Mail, value: "hello@desparkles.com" },
              ].map(({ Icon, value }) => (
                <div key={value} className="flex items-start gap-2.5 text-sm text-white/55">
                  <Icon size={14} className="text-[#C9A227] mt-0.5 shrink-0" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">© 2024 DeSparkles & Assets. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating WhatsApp ────────────────────────────────────────────────────────

function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_BASE}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ setPage, products, onAddCart, wishlist, onToggleWishlist, onViewProduct }: {
  setPage: (p: Page) => void;
  products: Product[];
  onAddCart: (p: Product) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onViewProduct: (p: Product) => void;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const trending = products.slice(0, 4);
  const newArrivals = products.filter((p) => !p.originalPrice || p.badge === "New").slice(0, 3);

  return (
    <div className="bg-[#FAFAFA]">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&h=900&fit=crop&auto=format"
            alt="Lifestyle editorial — woman wearing jewelry"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2C2C]/85 via-[#2C2C2C]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32 w-full">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-7">
              <Sparkles size={13} className="text-[#C9A227]" />
              <span className="text-white text-xs font-medium tracking-wide">Proudly Ghanaian · Est. 2020</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-7">
              Jewelry & Footwear That Completes Your{" "}
              <em className="text-[#C9A227] not-italic">Glow</em>
            </h1>
            <p className="text-white/75 text-lg mb-10 leading-relaxed max-w-md">
              Handcrafted pieces for every occasion. From everyday elegance to
              life&apos;s milestones — DeSparkles has you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Btn variant="gold" onClick={() => setPage("shop")} className="px-9 py-4 text-base rounded-full">
                Shop Collection <ArrowRight size={16} />
              </Btn>
              <button
                onClick={() => setPage("gift-box")}
                className="inline-flex items-center justify-center gap-2 px-9 py-4 text-base font-medium border-2 border-white/60 text-white rounded-full hover:bg-white hover:text-[#2C2C2C] transition-all duration-200"
              >
                <Gift size={16} /> Build Gift Box
              </button>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-[#C9A227]/10">
            <div className="w-12 h-12 bg-[#F5F0E8] rounded-xl overflow-hidden shrink-0">
              <img src={products[0].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="mr-1">
              <p className="text-xs font-bold text-[#2C2C2C]">🔥 Best Seller</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Adinkra Gold Cuff</p>
              <p className="text-xs font-semibold text-[#C9A227] mt-0.5">GHS 380</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-2.5 border border-red-100">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
            <p className="text-xs text-[#2C2C2C] font-medium">Only 3 Left — Sahel Oud Perfume</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-3.5 flex items-center gap-2.5 border border-emerald-100">
            <span className="text-base">✨</span>
            <p className="text-xs text-[#2C2C2C] font-medium">New: Kente Bead Necklace</p>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-y border-[#C9A227]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: Truck, label: "Free Delivery", sub: "On orders over GHS 500" },
              { Icon: Shield, label: "Secure Payment", sub: "MoMo, Card & Cash" },
              { Icon: Award, label: "Quality Guaranteed", sub: "Premium materials only" },
              { Icon: Repeat2, label: "Easy Returns", sub: "Within 7 days" },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#C9A227]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-[#C9A227]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2C2C]">{label}</p>
                  <p className="text-xs text-[#6B6B6B]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Browse By</p>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C]">Featured Categories</h2>
          </div>
          <Btn variant="ghost" onClick={() => setPage("shop")} className="hidden sm:flex text-[#6B6B6B]">
            View All <ChevronRight size={16} />
          </Btn>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Women's Jewelry", count: "42 pieces", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop&auto=format" },
            { label: "Men's Jewelry", count: "18 pieces", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&h=600&fit=crop&auto=format" },
            { label: "Pencil Perfumes", count: "12 scents", img: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&h=600&fit=crop&auto=format" },
            { label: "Sandals & Slippers", count: "24 styles", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=600&fit=crop&auto=format" },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => setPage("shop")}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#F5F0E8]"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/80 via-[#2C2C2C]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <h3 className="font-['Playfair_Display'] font-bold text-white text-lg leading-tight">{cat.label}</h3>
                <p className="text-white/65 text-xs mt-1">{cat.count}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Curated For You</p>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C]">Trending Now</h2>
            </div>
            <Btn variant="ghost" onClick={() => setPage("shop")} className="text-[#6B6B6B]">
              See All <ChevronRight size={16} />
            </Btn>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {loading
              ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
              : trending.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onView={onViewProduct}
                    onAddCart={onAddCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Editorial Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-5">
          <button
            onClick={() => setPage("style-match")}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#F5F0E8] text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&auto=format"
              alt="Style Match"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/85 to-[#2C2C2C]/60 flex items-end p-8">
              <div>
                <p className="text-white/75 text-xs font-semibold uppercase tracking-widest mb-2">New Feature</p>
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-white mb-3">Find Your Style Match</h3>
                <p className="text-white/75 text-sm mb-5 max-w-xs">Tell us your outfit & occasion — we recommend the perfect accessories.</p>
                <div className="inline-flex items-center gap-2 border border-white/50 text-white text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-white group-hover:text-[#2C2C2C] transition-all">
                  Try Style Match <Sparkles size={14} />
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setPage("gift-box")}
            className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#2C2C2C] text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&h=600&fit=crop&auto=format"
              alt="Gift Box Builder"
              className="w-full h-full object-cover opacity-55 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-end p-8">
              <div>
                <p className="text-[#C9A227] text-xs font-semibold uppercase tracking-widest mb-2">Thoughtful Gifting</p>
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-white mb-3">Build a Custom Gift Box</h3>
                <p className="text-white/65 text-sm mb-5 max-w-xs">
                  Pick products, choose ribbon & packaging, add a greeting note. We handle the rest.
                </p>
                <div className="inline-flex items-center gap-2 bg-[#C9A227] text-white text-sm font-medium px-5 py-2.5 rounded-full group-hover:bg-[#b08f1e] transition-colors">
                  Start Building <Gift size={14} />
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-[#F5F0E8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Just In</p>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C]">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading
              ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
              : newArrivals.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onView={onViewProduct}
                    onAddCart={onAddCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlist.includes(p.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">@desparkles_gh</p>
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C]">Tag Us on Instagram</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {[
            "photo-1515562141207-7a88fb7ce338",
            "photo-1611591437281-460bfbe1220a",
            "photo-1602173574767-37ac01994b2a",
            "photo-1541643600914-78b084683702",
            "photo-1543163521-1bf539c55dd2",
            "photo-1589128777073-263566ae5e4d",
          ].map((id, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square rounded-xl overflow-hidden bg-[#F5F0E8]"
            >
              <img
                src={`https://images.unsplash.com/${id}?w=300&h=300&fit=crop&auto=format`}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#C9A227]/0 group-hover:bg-[#C9A227]/35 transition-colors flex items-center justify-center">
                <Instagram size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#2C2C2C] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-white">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-7">
                <div className="flex mb-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-[#C9A227] text-[#C9A227]" />
                  ))}
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-7 font-['Playfair_Display'] italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover bg-[#F5F0E8]"
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#C9A227]/12 via-[#F5F0E8] to-[#FAFAFA] rounded-3xl p-12 text-center border border-[#C9A227]/15">
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Stay in the Loop</p>
          <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-4">
            Get 10% Off Your First Order
          </h2>
          <p className="text-[#6B6B6B] mb-9 max-w-sm mx-auto">
            Subscribe for new arrivals, exclusive deals, and styling tips straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-full border border-[#C9A227]/25 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40 text-sm text-[#2C2C2C] placeholder:text-gray-400"
            />
            <Btn variant="gold" className="px-7 py-3.5 rounded-full whitespace-nowrap">
              Subscribe
            </Btn>
          </div>
          <p className="text-xs text-[#6B6B6B] mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────

function ShopPage({ products, onAddCart, wishlist, onToggleWishlist, onViewProduct }: {
  products: Product[];
  onAddCart: (p: Product) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onViewProduct: (p: Product) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-12 border-b border-[#C9A227]/10">
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">All Products</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C]">Shop Everything</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#6B6B6B] bg-white border border-[#C9A227]/15 rounded-full px-3 py-2">
                <SlidersHorizontal size={13} /> Filter
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-[#C9A227]/15 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 text-[#2C2C2C] font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="py-6 flex gap-3 overflow-x-auto pb-6" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cls(
                "shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                activeCategory === cat.id
                  ? "bg-[#C9A227] text-white shadow-sm shadow-[#C9A227]/30"
                  : "bg-white border border-[#C9A227]/15 text-[#2C2C2C] hover:border-[#C9A227]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p className="text-sm text-[#6B6B6B] mb-6 font-medium">{filtered.length} products</p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-24">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={onViewProduct}
                onAddCart={onAddCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="text-6xl mb-5">🔍</div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#2C2C2C] mb-2">No products found</h3>
            <p className="text-[#6B6B6B] text-sm">Try a different category or check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────

function ProductDetailPage({ product, onAddCart, onToggleWishlist, isWishlisted, setPage }: {
  product: Product;
  onAddCart: (p: Product, qty: number, color?: string) => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
  setPage: (p: Page) => void;
}) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [tab, setTab] = useState<"description" | "materials" | "care">("description");

  const images = product.images || [product.image];
  const badgeVar = product.badge === "Best Seller" ? "gold" : product.badge === "Only 3 Left" ? "red" : "green";

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-8">
          <button onClick={() => setPage("home")} className="hover:text-[#C9A227] transition-colors">Home</button>
          <ChevronRight size={11} />
          <button onClick={() => setPage("shop")} className="hover:text-[#C9A227] transition-colors">Shop</button>
          <ChevronRight size={11} />
          <span className="text-[#2C2C2C] font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F0E8] mb-4 group">
              <img
                src={images[selectedImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <BadgePill variant={badgeVar as any}>{product.badge}</BadgePill>
                </div>
              )}
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                <ZoomIn size={15} className="text-[#2C2C2C]" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={cls(
                      "w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0",
                      selectedImg === i ? "border-[#C9A227]" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">{product.subcategory}</p>
            <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-3 leading-tight">
              {product.name}
            </h1>
            <StarRating rating={product.rating} count={product.reviews} />

            <div className="flex items-center gap-3 mt-5 mb-7">
              <span className="text-2xl font-bold text-[#2C2C2C]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-base text-[#6B6B6B] line-through">{formatPrice(product.originalPrice)}</span>
                  <BadgePill variant="green">
                    Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </BadgePill>
                </>
              )}
            </div>

            {product.colors && (
              <div className="mb-7">
                <p className="text-sm font-semibold text-[#2C2C2C] mb-3">
                  Colour: <span className="text-[#C9A227] font-medium">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cls(
                        "px-4 py-1.5 rounded-full text-xs border transition-all font-medium",
                        selectedColor === color
                          ? "border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]"
                          : "border-gray-200 text-[#6B6B6B] hover:border-[#C9A227]"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-7">
              <p className="text-sm font-semibold text-[#2C2C2C]">Qty</p>
              <div className="flex items-center gap-3 border border-[#C9A227]/20 rounded-full px-4 py-2.5 bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="disabled:opacity-30"
                >
                  <Minus size={13} className="text-[#2C2C2C]" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#2C2C2C]">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.inStock, qty + 1))}
                  disabled={qty >= product.inStock}
                  className="disabled:opacity-30"
                >
                  <Plus size={13} className="text-[#2C2C2C]" />
                </button>
              </div>
              {product.inStock <= 5 && (
                <p className="text-xs text-orange-500 font-medium">Only {product.inStock} left</p>
              )}
            </div>

            <div className="flex flex-col gap-3 mb-9">
              <Btn
                variant="gold"
                onClick={() => onAddCart(product, qty, selectedColor)}
                className="w-full py-4 text-base"
              >
                <ShoppingBag size={18} /> Add to Cart — {formatPrice(product.price * qty)}
              </Btn>
              <div className="grid grid-cols-2 gap-3">
                <Btn
                  variant="outline"
                  onClick={() => onToggleWishlist(product.id)}
                  className="py-3.5"
                >
                  <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Btn>
                <a
                  href={`${WHATSAPP_BASE}?text=Hi! I'm interested in ${product.name} (${formatPrice(product.price)}). Is this price final?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] rounded-full py-3.5 text-sm font-medium hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageCircle size={15} /> Ask for Last Price
                </a>
              </div>
            </div>

            <div className="border-t border-[#C9A227]/10 pt-6">
              <div className="flex gap-7 mb-5 border-b border-[#C9A227]/10">
                {(["description", "materials", "care"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cls(
                      "pb-3.5 text-sm font-semibold capitalize transition-all border-b-2 -mb-px",
                      tab === t
                        ? "border-[#C9A227] text-[#C9A227]"
                        : "border-transparent text-[#6B6B6B] hover:text-[#2C2C2C]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {tab === "description" && product.description}
                {tab === "materials" && (product.materials || "Premium quality materials.")}
                {tab === "care" && (product.care || "Handle with care.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 md:hidden bg-white/97 backdrop-blur-md border-t border-[#C9A227]/10 p-4 flex gap-3 z-40 shadow-xl">
        <button
          onClick={() => onToggleWishlist(product.id)}
          className="w-12 h-12 border border-[#C9A227]/20 rounded-full flex items-center justify-center shrink-0 hover:border-[#C9A227] transition-colors"
        >
          <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-[#2C2C2C]"} />
        </button>
        <Btn variant="gold" onClick={() => onAddCart(product, qty, selectedColor)} className="flex-1 py-3.5">
          <ShoppingBag size={16} /> Add to Cart
        </Btn>
      </div>
    </div>
  );
}

// ─── Style Match ──────────────────────────────────────────────────────────────

function StyleMatchPage({ products, onAddCart, wishlist, onToggleWishlist, onViewProduct }: {
  products: Product[];
  onAddCart: (p: Product) => void;
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onViewProduct: (p: Product) => void;
}) {
  const [outfitColor, setOutfitColor] = useState("");
  const [occasion, setOccasion] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);

  const colors = ["Black", "White", "Navy", "Beige", "Red", "Green", "Pink", "Brown", "Grey", "Gold"];
  const occasions = ["Dinner", "Outing", "Wedding", "Office", "Birthday"];

  const handleMatch = () => {
    const matched = products
      .filter((p) => !occasion || p.occasions?.includes(occasion))
      .slice(0, 4);
    setResults(matched.length > 0 ? matched : products.slice(0, 4));
    setSearched(true);
  };

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-14">
          <div className="w-16 h-16 bg-[#C9A227]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Sparkles size={28} className="text-[#C9A227]" />
          </div>
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Personalized Styling</p>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">Style Match</h1>
          <p className="text-[#6B6B6B] max-w-sm mx-auto">
            Tell us your outfit colour and occasion — we'll recommend the perfect jewelry & accessories.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-[#C9A227]/10 p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="block text-sm font-bold text-[#2C2C2C] mb-4">
                Outfit Colour
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setOutfitColor(c)}
                    className={cls(
                      "px-4 py-2 rounded-full text-sm border transition-all duration-200 font-medium",
                      outfitColor === c
                        ? "bg-[#C9A227] text-white border-[#C9A227] shadow-sm shadow-[#C9A227]/30"
                        : "border-gray-200 text-[#6B6B6B] hover:border-[#C9A227]"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#2C2C2C] mb-4">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={cls(
                      "px-4 py-2 rounded-full text-sm border transition-all duration-200 font-medium",
                      occasion === o
                        ? "bg-[#2C2C2C] text-white border-[#2C2C2C]"
                        : "border-gray-200 text-[#6B6B6B] hover:border-[#2C2C2C]"
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Btn
              variant="gold"
              onClick={handleMatch}
              disabled={!outfitColor || !occasion}
              className="px-12 py-4 text-base"
            >
              <Sparkles size={18} /> Find My Style Match
            </Btn>
          </div>
        </div>

        {searched ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C]">
                Perfect picks for a <span className="text-[#C9A227]">{outfitColor}</span> outfit at a <span className="text-[#C9A227]">{occasion}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onView={onViewProduct}
                  onAddCart={onAddCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(p.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-5">✨</div>
            <p className="text-[#6B6B6B]">Select your outfit colour and occasion above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gift Box Builder ─────────────────────────────────────────────────────────

function GiftBoxPage({ products }: { products: Product[] }) {
  type BoxSize = "small" | "medium" | "large";
  const [boxSize, setBoxSize] = useState<BoxSize>("medium");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [ribbon, setRibbon] = useState("Gold");
  const [note, setNote] = useState("");

  const boxPrices: Record<BoxSize, number> = { small: 50, medium: 80, large: 120 };
  const boxLimits: Record<BoxSize, number> = { small: 2, medium: 4, large: 6 };
  const ribbonColors = ["Gold", "Burgundy", "Ivory", "Blush", "Black"];
  const boxEmoji: Record<BoxSize, string> = { small: "🎁", medium: "📦", large: "🎀" };

  const selectedProductData = products.filter((p) => selectedProducts.includes(p.id));
  const totalPrice = boxPrices[boxSize] + selectedProductData.reduce((s, p) => s + p.price, 0);

  const toggle = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((x) => x !== id));
    } else if (selectedProducts.length < boxLimits[boxSize]) {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-14">
          <div className="w-16 h-16 bg-[#C9A227]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Gift size={28} className="text-[#C9A227]" />
          </div>
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Thoughtful Gifting</p>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-3">Gift Box Builder</h1>
          <p className="text-[#6B6B6B] max-w-sm mx-auto">
            Curate a personalised gift box. We handle packaging, ribbon & delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Box size */}
            <div className="bg-white rounded-2xl p-6 border border-[#C9A227]/10">
              <h2 className="font-semibold text-[#2C2C2C] mb-5">1. Choose Box Size</h2>
              <div className="grid grid-cols-3 gap-3">
                {(["small", "medium", "large"] as BoxSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => { setBoxSize(size); setSelectedProducts([]); }}
                    className={cls(
                      "p-5 rounded-xl border-2 text-center transition-all",
                      boxSize === size
                        ? "border-[#C9A227] bg-[#C9A227]/5"
                        : "border-gray-100 hover:border-[#C9A227]/40"
                    )}
                  >
                    <div className="text-3xl mb-2">{boxEmoji[size]}</div>
                    <p className="text-sm font-bold capitalize text-[#2C2C2C]">{size}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">Up to {boxLimits[size]} items</p>
                    <p className="text-xs font-semibold text-[#C9A227] mt-1.5">+{formatPrice(boxPrices[size])}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl p-6 border border-[#C9A227]/10">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-[#2C2C2C]">2. Add Products</h2>
                <span className="text-xs text-[#6B6B6B] bg-[#F5F0E8] px-3 py-1 rounded-full font-medium">
                  {selectedProducts.length}/{boxLimits[boxSize]} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.filter((p) => p.category !== "gifts").map((p) => {
                  const isSelected = selectedProducts.includes(p.id);
                  const isFull = !isSelected && selectedProducts.length >= boxLimits[boxSize];
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(p.id)}
                      disabled={isFull}
                      className={cls(
                        "relative p-3 rounded-xl border-2 text-left transition-all",
                        isSelected
                          ? "border-[#C9A227] bg-[#C9A227]/5"
                          : "border-gray-100 hover:border-[#C9A227]/40",
                        isFull && "opacity-35 cursor-not-allowed"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#C9A227] rounded-full flex items-center justify-center shadow-sm">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                      <div className="aspect-square rounded-lg overflow-hidden bg-[#F5F0E8] mb-2.5">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-semibold text-[#2C2C2C] leading-tight">{p.name}</p>
                      <p className="text-xs text-[#C9A227] font-medium mt-0.5">{formatPrice(p.price)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ribbon */}
            <div className="bg-white rounded-2xl p-6 border border-[#C9A227]/10">
              <h2 className="font-semibold text-[#2C2C2C] mb-4">3. Ribbon Colour</h2>
              <div className="flex flex-wrap gap-2">
                {ribbonColors.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRibbon(r)}
                    className={cls(
                      "px-4 py-2 rounded-full text-sm border font-medium transition-all",
                      ribbon === r
                        ? "bg-[#C9A227] text-white border-[#C9A227]"
                        : "border-gray-200 text-[#6B6B6B] hover:border-[#C9A227]"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-white rounded-2xl p-6 border border-[#C9A227]/10">
              <h2 className="font-semibold text-[#2C2C2C] mb-4">4. Greeting Note</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write a personal message... (e.g. 'Happy Birthday Ama! Wishing you all the sparkle!')"
                maxLength={200}
                rows={4}
                className="w-full p-4 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 resize-none text-[#2C2C2C] placeholder:text-gray-400 bg-[#FAFAFA]"
              />
              <p className="text-right text-xs text-[#6B6B6B] mt-1">{note.length}/200</p>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <div className="sticky top-20 bg-white rounded-2xl p-6 border border-[#C9A227]/10 shadow-sm">
              <h2 className="font-['Playfair_Display'] font-bold text-[#2C2C2C] text-xl mb-6">Box Preview</h2>

              <div className="bg-[#F5F0E8] rounded-2xl p-6 mb-6 min-h-[200px] flex flex-col items-center justify-center text-center">
                <div className="text-5xl mb-2">{boxEmoji[boxSize]}</div>
                <p className="text-xs font-semibold text-[#C9A227] capitalize">{boxSize} Box · {ribbon} Ribbon</p>
                {selectedProductData.length > 0 && (
                  <div className="flex gap-1 mt-3 flex-wrap justify-center">
                    {selectedProductData.map((p) => (
                      <div key={p.id} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {note && (
                  <div className="mt-3 bg-white rounded-xl p-3 text-xs text-[#6B6B6B] italic">
                    &ldquo;{note.slice(0, 60)}{note.length > 60 ? "…" : ""}&rdquo;
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Box ({boxSize})</span>
                  <span>{formatPrice(boxPrices[boxSize])}</span>
                </div>
                {selectedProductData.map((p) => (
                  <div key={p.id} className="flex justify-between text-[#6B6B6B]">
                    <span className="truncate max-w-[60%]">{p.name}</span>
                    <span>{formatPrice(p.price)}</span>
                  </div>
                ))}
                <div className="border-t border-[#C9A227]/10 pt-3 flex justify-between font-bold text-[#2C2C2C]">
                  <span>Total</span>
                  <span className="text-[#C9A227] text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <Btn variant="gold" className="w-full py-3.5" disabled={selectedProducts.length === 0} onClick={() => {}}>
                <Gift size={17} /> Add Gift Box to Cart
              </Btn>
              <p className="text-center text-xs text-[#6B6B6B] mt-3">🎀 Free gift wrapping included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

function CartPage({ cart, onUpdateQty, onRemove, setPage }: {
  cart: CartItem[];
  onUpdateQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  setPage: (p: Page) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAFAFA] pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-7">
            <ShoppingBag size={36} className="text-[#C9A227]" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mb-2">Your cart is empty</h2>
          <p className="text-[#6B6B6B] text-sm mb-9">Looks like you haven't added anything yet. Let's change that!</p>
          <Btn variant="gold" onClick={() => setPage("shop")} className="px-9 py-3.5">
            Start Shopping <ArrowRight size={16} />
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C] mb-10">
          Your Cart <span className="text-[#6B6B6B] font-normal text-2xl">({cart.length})</span>
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white rounded-2xl p-5 flex gap-5 border border-[#C9A227]/8 shadow-sm">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-[#C9A227] font-semibold uppercase tracking-widest mb-0.5">{item.product.subcategory}</p>
                      <h3 className="font-semibold text-[#2C2C2C] text-sm leading-tight">{item.product.name}</h3>
                      {item.color && <p className="text-xs text-[#6B6B6B] mt-0.5">Colour: {item.color}</p>}
                    </div>
                    <button
                      onClick={() => onRemove(item.product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors ml-3 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 border border-[#C9A227]/20 rounded-full px-3.5 py-2 bg-[#FAFAFA]">
                      <button onClick={() => onUpdateQty(item.product.id, Math.max(1, item.qty - 1))}>
                        <Minus size={12} className="text-[#2C2C2C]" />
                      </button>
                      <span className="text-sm font-bold w-5 text-center text-[#2C2C2C]">{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.product.id, item.qty + 1)}>
                        <Plus size={12} className="text-[#2C2C2C]" />
                      </button>
                    </div>
                    <span className="font-bold text-[#2C2C2C]">{formatPrice(item.product.price * item.qty)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="sticky top-20 bg-white rounded-2xl p-6 border border-[#C9A227]/10 shadow-sm">
              <h2 className="font-semibold text-[#2C2C2C] mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#2C2C2C]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-500 font-semibold" : "font-medium text-[#2C2C2C]"}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal < 500 && (
                  <div className="text-xs text-[#C9A227] bg-[#C9A227]/10 p-3 rounded-xl">
                    Add {formatPrice(500 - subtotal)} more for free shipping!
                  </div>
                )}
                <div className="border-t border-[#C9A227]/10 pt-3 flex justify-between font-bold text-[#2C2C2C]">
                  <span>Total</span>
                  <span className="text-[#C9A227] text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              <Btn variant="gold" onClick={() => setPage("checkout")} className="w-full py-4 text-base mb-3">
                Checkout <ArrowRight size={16} />
              </Btn>
              <a
                href={WHATSAPP_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 border border-[#25D366] text-[#25D366] rounded-full text-sm font-medium hover:bg-[#25D366] hover:text-white transition-colors"
              >
                <MessageCircle size={15} /> Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

function CheckoutPage({ cart, setPage }: { cart: CartItem[]; setPage: (p: Page) => void }) {
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("momo");
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + (subtotal > 500 ? 0 : 50);
  const [ordered, setOrdered] = useState(false);

  const Field = ({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 text-[#2C2C2C] placeholder:text-gray-400 bg-[#FAFAFA]"
      />
    </div>
  );

  if (ordered) {
    return (
      <div className="bg-[#FAFAFA] pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center py-16 max-w-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-emerald-500" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mb-3">Order Placed!</h2>
          <p className="text-[#6B6B6B] text-sm mb-8">
            Thank you for your order. You'll receive a confirmation via email and WhatsApp shortly.
          </p>
          <Btn variant="gold" onClick={() => setPage("home")} className="px-9 py-3.5">
            Continue Shopping
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C] mb-10">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {["Delivery", "Payment", "Confirm"].map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div className={cls(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step > i + 1 ? "bg-[#C9A227] text-white" :
                step === i + 1 ? "bg-[#2C2C2C] text-white" : "bg-gray-200 text-[#6B6B6B]"
              )}>
                {step > i + 1 ? <Check size={13} /> : i + 1}
              </div>
              <span className={cls("text-sm font-semibold", step === i + 1 ? "text-[#2C2C2C]" : "text-[#6B6B6B]")}>{s}</span>
              {i < 2 && <ChevronRight size={13} className="text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-7 border border-[#C9A227]/10 space-y-5">
                <h2 className="font-semibold text-[#2C2C2C] text-lg mb-2">Delivery Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" placeholder="Akosua Mensah" />
                  <Field label="Email Address" type="email" placeholder="akosua@example.com" />
                </div>
                <Field label="Phone / WhatsApp" type="tel" placeholder="+233 55 000 0000" />
                <Field label="Street Address" placeholder="House No, Street Name" />
                <Field label="City" placeholder="Accra" />
                <Btn variant="gold" onClick={() => setStep(2)} className="w-full py-4 text-base mt-2">
                  Continue to Payment <ArrowRight size={16} />
                </Btn>
              </div>
            )}
            {step === 2 && (
              <div className="bg-white rounded-2xl p-7 border border-[#C9A227]/10 space-y-4">
                <h2 className="font-semibold text-[#2C2C2C] text-lg mb-2">Payment Method</h2>
                {[
                  { id: "momo", label: "Mobile Money (MoMo)", sub: "MTN, Vodafone, AirtelTigo" },
                  { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard" },
                  { id: "cash", label: "Cash on Delivery", sub: "Pay when you receive" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={cls(
                      "w-full p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all",
                      payment === m.id ? "border-[#C9A227] bg-[#C9A227]/5" : "border-gray-100 hover:border-[#C9A227]/40"
                    )}
                  >
                    <div className={cls(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                      payment === m.id ? "border-[#C9A227]" : "border-gray-300"
                    )}>
                      {payment === m.id && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C2C2C]">{m.label}</p>
                      <p className="text-xs text-[#6B6B6B]">{m.sub}</p>
                    </div>
                  </button>
                ))}
                <div className="flex gap-3 pt-2">
                  <Btn variant="outline" onClick={() => setStep(1)} className="flex-1 py-3.5">Back</Btn>
                  <Btn variant="gold" onClick={() => setStep(3)} className="flex-1 py-3.5">Review Order</Btn>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="bg-white rounded-2xl p-7 border border-[#C9A227]/10">
                <h2 className="font-semibold text-[#2C2C2C] text-lg mb-7">Confirm Your Order</h2>
                <div className="space-y-4 mb-7">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F5F0E8] shrink-0">
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#2C2C2C] truncate">{item.product.name} × {item.qty}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">{formatPrice(item.product.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#C9A227]/10 pt-5 flex justify-between font-bold text-[#2C2C2C] mb-7">
                  <span>Total</span>
                  <span className="text-[#C9A227] text-lg">{formatPrice(total)}</span>
                </div>
                <div className="flex gap-3">
                  <Btn variant="outline" onClick={() => setStep(2)} className="flex-1 py-3.5">Back</Btn>
                  <Btn variant="gold" onClick={() => setOrdered(true)} className="flex-1 py-3.5">
                    <Check size={16} /> Place Order
                  </Btn>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-20 bg-white rounded-2xl p-6 border border-[#C9A227]/10">
              <h3 className="font-semibold text-[#2C2C2C] mb-4">Order ({cart.length} items)</h3>
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-[#6B6B6B] mb-2.5">
                  <span className="truncate max-w-[55%]">{item.product.name} ×{item.qty}</span>
                  <span className="font-medium text-[#2C2C2C]">{formatPrice(item.product.price * item.qty)}</span>
                </div>
              ))}
              <div className="border-t border-[#C9A227]/10 pt-3 mt-3 flex justify-between font-bold text-[#2C2C2C]">
                <span>Total</span>
                <span className="text-[#C9A227] text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

function WishlistPage({ wishlist, products, onAddCart, onToggleWishlist, onViewProduct, setPage }: {
  wishlist: number[];
  products: Product[];
  onAddCart: (p: Product) => void;
  onToggleWishlist: (id: number) => void;
  onViewProduct: (p: Product) => void;
  setPage: (p: Page) => void;
}) {
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="bg-[#FAFAFA] pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-7">
            <Heart size={36} className="text-red-400" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mb-2">Your wishlist is empty</h2>
          <p className="text-[#6B6B6B] text-sm mb-9">Tap the heart on any product to save it here.</p>
          <Btn variant="gold" onClick={() => setPage("shop")}>Browse Collection</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C] mb-10">
          My Wishlist <span className="text-[#6B6B6B] font-normal text-2xl">({items.length})</span>
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={onViewProduct}
              onAddCart={onAddCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Custom Orders ────────────────────────────────────────────────────────────

function CustomOrdersPage() {
  const [type, setType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-[#FAFAFA] pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="text-center py-16 max-w-sm">
          <div className="w-20 h-20 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[#C9A227]" />
          </div>
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mb-3">Request Received!</h2>
          <p className="text-[#6B6B6B] text-sm">
            We'll review your custom order request and get back to you within 24–48 hours via email or WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const IF = ({ label, type: t = "text", placeholder }: { label: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">{label}</label>
      <input
        type={t}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 text-[#2C2C2C] placeholder:text-gray-400 bg-[#FAFAFA]"
      />
    </div>
  );

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-14">
          <div className="w-16 h-16 bg-[#C9A227]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Tag size={28} className="text-[#C9A227]" />
          </div>
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Made Just For You</p>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">Custom Orders</h1>
          <p className="text-[#6B6B6B] max-w-sm mx-auto">
            Commission a unique piece designed exclusively for you. We work with artisans across Ghana to bring your vision to life.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-[#C9A227]/10 shadow-sm space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <IF label="Full Name" placeholder="Your full name" />
            <IF label="Email Address" type="email" placeholder="you@example.com" />
          </div>
          <IF label="Phone / WhatsApp Number" placeholder="+233 55 000 0000" />
          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Product Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 text-[#2C2C2C] bg-[#FAFAFA]"
            >
              <option value="">Select type...</option>
              <option>Custom Jewelry (Women)</option>
              <option>Custom Jewelry (Men)</option>
              <option>Custom Footwear</option>
              <option>Custom Gift Package</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Describe Your Vision</label>
            <textarea
              rows={5}
              placeholder="Describe the piece you want — style, size, materials, occasion, references or inspiration..."
              className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 resize-none text-[#2C2C2C] placeholder:text-gray-400 bg-[#FAFAFA]"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <IF label="Budget (GHS)" placeholder="e.g. GHS 500 – GHS 1,000" />
            <IF label="Timeline" placeholder="e.g. 2 weeks, urgent" />
          </div>
          <Btn variant="gold" onClick={() => setSubmitted(true)} className="w-full py-4 text-base mt-2">
            Submit Custom Request <ArrowRight size={16} />
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden mb-20 h-72 sm:h-96 bg-[#F5F0E8]">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&h=500&fit=crop&auto=format"
            alt="About DeSparkles"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2C2C]/80 to-[#2C2C2C]/20 flex items-end p-10 sm:p-14">
            <div>
              <p className="text-[#C9A227] text-xs font-semibold uppercase tracking-widest mb-2">Our Story</p>
              <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-white mb-3">About DeSparkles</h1>
              <p className="text-white/70 max-w-sm text-sm">Born in Accra. Built for every Ghanaian who believes elegance is a birthright.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-7 leading-tight">
              Crafting Stories, One Piece at a Time
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              DeSparkles & Assets was founded in 2020 by a young designer from Accra who believed that premium jewelry and footwear shouldn't require a trip to London or Paris.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              We collaborate with Ghanaian artisans and ethical manufacturers to produce pieces that honor local heritage while speaking a global design language. Every cuff, every sandal, every perfume pencil carries a piece of our culture forward.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              Today, we serve thousands of customers across Ghana — from students celebrating milestones to young professionals making their mark. Your glow is our business.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F0E8]">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=533&fit=crop&auto=format" alt="DeSparkles team" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#F5F0E8] mt-8">
              <img src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=533&fit=crop&auto=format" alt="DeSparkles jewelry" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
          {[
            { value: "5,000+", label: "Happy Customers" },
            { value: "200+", label: "Products" },
            { value: "4 Years", label: "In Business" },
            { value: "4.9★", label: "Average Rating" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl p-7 text-center border border-[#C9A227]/10 shadow-sm">
              <p className="font-['Playfair_Display'] text-3xl font-bold text-[#C9A227] mb-1">{value}</p>
              <p className="text-sm text-[#6B6B6B] font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "How long does delivery take?", a: "Standard delivery within Accra takes 1–3 business days. Nationwide delivery is 3–7 business days. You'll receive a tracking link once your order is dispatched." },
    { q: "What payment methods do you accept?", a: "We accept Mobile Money (MTN MoMo, Vodafone Cash, AirtelTigo Money), debit/credit cards (Visa & Mastercard), and cash on delivery within Accra." },
    { q: "Can I return or exchange a product?", a: "Yes! We offer hassle-free returns within 7 days of delivery for unused, unworn items in original packaging. Custom orders are non-refundable once production begins." },
    { q: "How do I care for my jewelry?", a: "Store in the provided velvet pouch, avoid contact with water, perfume, and lotions. Polish occasionally with a soft microfiber cloth. Keep away from direct sunlight for extended periods." },
    { q: "What is a pencil perfume?", a: "A pencil perfume is a twist-up solid perfume applicator — like a lip balm for fragrance. Highly portable, TSA-friendly, and lasts 6–10 hours on skin." },
    { q: "How do custom orders work?", a: "Submit your brief via our Custom Orders form. Our team reviews it within 24 hours, provides a quote and timeline, and begins crafting once approved. Most custom pieces take 2–4 weeks." },
    { q: "Do you ship internationally?", a: "Currently, we ship within Ghana only. International shipping is planned for Q1 2025 — join our newsletter to be notified first!" },
  ];

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Help Centre</p>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#6B6B6B]">Everything you need to know about DeSparkles.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#C9A227]/10 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center gap-4"
              >
                <span className="font-semibold text-[#2C2C2C] text-sm leading-relaxed">{faq.q}</span>
                <ChevronDown
                  size={17}
                  className={cls("text-[#C9A227] shrink-0 transition-transform duration-200", open === i && "rotate-180")}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-[#C9A227] uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">Contact Us</h1>
          <p className="text-[#6B6B6B]">We're here for orders, questions, or just a chat.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-7 mb-10">
              {[
                { Icon: Phone, label: "Phone / WhatsApp", value: "+233 (0) 55 000 0000" },
                { Icon: Mail, label: "Email", value: "hello@desparkles.com" },
                { Icon: MapPin, label: "Location", value: "123 Ring Road West, Accra, Ghana" },
                { Icon: Clock, label: "Business Hours", value: "Mon – Sat, 9am – 6pm" },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#C9A227]/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-[#2C2C2C]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={WHATSAPP_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366] text-white rounded-full text-sm font-semibold hover:bg-[#1eb85a] transition-colors shadow-sm shadow-[#25D366]/25"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          {sent ? (
            <div className="bg-white rounded-3xl p-10 border border-[#C9A227]/10 flex items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check size={28} className="text-[#C9A227]" />
                </div>
                <h3 className="font-['Playfair_Display'] font-bold text-xl text-[#2C2C2C] mb-2">Message Sent!</h3>
                <p className="text-sm text-[#6B6B6B]">We'll get back to you within 24 hours.</p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="bg-white rounded-3xl p-8 border border-[#C9A227]/10 space-y-5 shadow-sm"
            >
              {[
                { label: "Name", placeholder: "Your name" },
                { label: "Email", placeholder: "your@email.com" },
                { label: "Subject", placeholder: "What can we help with?" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">{label}</label>
                  <input
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 text-[#2C2C2C] placeholder:text-gray-400 bg-[#FAFAFA]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Message</label>
                <textarea
                  placeholder="Tell us more..."
                  rows={5}
                  className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 resize-none text-[#2C2C2C] placeholder:text-gray-400 bg-[#FAFAFA]"
                />
              </div>
              <Btn variant="gold" type="submit" className="w-full py-4">Send Message</Btn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function AuthCard({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode;
}) {
  return (
    <div className="bg-[#FAFAFA] pt-16 min-h-screen flex items-center justify-center px-4 pb-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-13 h-13 bg-[#C9A227] rounded-full flex items-center justify-center mx-auto mb-5 w-12 h-12">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C] mb-1">{title}</h1>
          <p className="text-[#6B6B6B] text-sm">{subtitle}</p>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-[#C9A227]/10 shadow-sm space-y-4">
          {children}
        </div>
        <div className="text-center mt-6 text-sm text-[#6B6B6B]">{footer}</div>
      </div>
    </div>
  );
}

function LoginPage({ setPage, onLogin }: { setPage: (p: Page) => void; onLogin: () => void }) {
  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your DeSparkles account"
      footer={
        <>Don't have an account?{" "}<button onClick={() => setPage("register")} className="text-[#C9A227] font-semibold hover:underline">Register</button></>
      }
    >
      <div>
        <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Email Address</label>
        <input placeholder="you@example.com" className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold text-[#2C2C2C]">Password</label>
          <button onClick={() => setPage("forgot-password")} className="text-xs text-[#C9A227] font-semibold hover:underline">Forgot password?</button>
        </div>
        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
      </div>
      <Btn variant="gold" onClick={onLogin} className="w-full py-4 mt-1">Sign In</Btn>
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative text-center">
          <span className="bg-white px-3 text-xs text-[#6B6B6B]">or continue with</span>
        </div>
      </div>
      <button className="w-full py-3 border border-gray-200 rounded-xl text-sm font-semibold text-[#2C2C2C] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <span className="text-base">G</span> Google
      </button>
    </AuthCard>
  );
}

function RegisterPage({ setPage, onRegister }: { setPage: (p: Page) => void; onRegister: () => void }) {
  return (
    <AuthCard
      title="Create Account"
      subtitle="Join DeSparkles and start glowing"
      footer={
        <>Already have an account?{" "}<button onClick={() => setPage("login")} className="text-[#C9A227] font-semibold hover:underline">Sign In</button></>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {[{ l: "First Name", ph: "Akosua" }, { l: "Last Name", ph: "Mensah" }].map(({ l, ph }) => (
          <div key={l}>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">{l}</label>
            <input placeholder={ph} className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Email Address</label>
        <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
      </div>
      <div>
        <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Phone / WhatsApp</label>
        <input type="tel" placeholder="+233 55 000 0000" className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
      </div>
      <div>
        <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Password</label>
        <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
      </div>
      <p className="text-xs text-[#6B6B6B]">
        By registering, you agree to our{" "}
        <a href="#" className="text-[#C9A227] font-semibold">Terms of Service</a> and{" "}
        <a href="#" className="text-[#C9A227] font-semibold">Privacy Policy</a>.
      </p>
      <Btn variant="gold" onClick={onRegister} className="w-full py-4">Create Account</Btn>
    </AuthCard>
  );
}

function ForgotPasswordPage({ setPage }: { setPage: (p: Page) => void }) {
  const [sent, setSent] = useState(false);

  return (
    <AuthCard
      title={sent ? "Check Your Email" : "Forgot Password"}
      subtitle={sent ? "A reset link is on its way to your inbox." : "Enter your email and we'll send a reset link."}
      footer={
        <button onClick={() => setPage("login")} className="text-[#C9A227] font-semibold hover:underline">
          ← Back to Sign In
        </button>
      }
    >
      {!sent ? (
        <>
          <div>
            <label className="block text-xs font-bold text-[#2C2C2C] mb-1.5">Email Address</label>
            <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 border border-[#C9A227]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 bg-[#FAFAFA] placeholder:text-gray-400" />
          </div>
          <Btn variant="gold" onClick={() => setSent(true)} className="w-full py-4">Send Reset Link</Btn>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-[#C9A227]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail size={28} className="text-[#C9A227]" />
          </div>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Check your inbox and spam folder. The link expires in 24 hours.
          </p>
        </div>
      )}
    </AuthCard>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = pageFromPath(location.pathname);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<MockUser | null>(null);
  const selectedProduct = productFromPath(location.pathname);

  useEffect(() => {
    if (!user && ["checkout", "wishlist"].includes(page)) {
      navigate(pagePaths.login, { replace: true });
    }
  }, [navigate, page, user]);

  const navigateTo = (p: Page) => {
    if (!user && ["checkout", "wishlist"].includes(p)) {
      navigate(pagePaths.login);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(p === "product" ? productPath(selectedProduct) : pagePaths[p]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product, qty = 1, color?: string) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product, qty, color }];
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const viewProduct = (p: Product) => {
    navigate(productPath(p));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeMockAuth = () => {
    setUser({ firstName: "Akosua", email: "akosua@example.com" });
    navigate(pagePaths.shop);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const sharedProps = {
    setPage: navigateTo,
    products,
    onAddCart: addToCart,
    wishlist,
    onToggleWishlist: toggleWishlist,
    onViewProduct: viewProduct,
  };

  const showFooter = !["cart", "checkout", "login", "register", "forgot-password"].includes(page);

  return (
    <div className="min-h-screen font-['DM_Sans'] bg-[#FAFAFA] text-[#2C2C2C]">
      <Nav currentPage={page} setPage={navigateTo} cartCount={cartCount} wishlistCount={wishlist.length} />

      {page === "home" && <HomePage {...sharedProps} />}
      {page === "shop" && <ShopPage {...sharedProps} />}
      {page === "product" && (
        <ProductDetailPage
          product={selectedProduct}
          onAddCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          setPage={navigateTo}
        />
      )}
      {page === "style-match" && <StyleMatchPage {...sharedProps} />}
      {page === "gift-box" && <GiftBoxPage products={products} />}
      {page === "custom-orders" && <CustomOrdersPage />}
      {page === "cart" && (
        <CartPage
          cart={cart}
          onUpdateQty={(id, qty) => setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, qty } : i))}
          onRemove={(id) => setCart((prev) => prev.filter((i) => i.product.id !== id))}
          setPage={navigateTo}
        />
      )}
      {page === "checkout" && <CheckoutPage cart={cart} setPage={navigateTo} />}
      {page === "wishlist" && <WishlistPage wishlist={wishlist} products={products} onAddCart={addToCart} onToggleWishlist={toggleWishlist} onViewProduct={viewProduct} setPage={navigateTo} />}
      {page === "about" && <AboutPage />}
      {page === "faq" && <FAQPage />}
      {page === "contact" && <ContactPage />}
      {page === "login" && <LoginPage setPage={navigateTo} onLogin={completeMockAuth} />}
      {page === "register" && <RegisterPage setPage={navigateTo} onRegister={completeMockAuth} />}
      {page === "forgot-password" && <ForgotPasswordPage setPage={navigateTo} />}

      {showFooter && <Footer setPage={navigateTo} />}
      <FloatingWhatsApp />
    </div>
  );
}
