import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart, Menu, X, User, LogOut,
  Settings, ChevronDown, Laptop, Tv,
  Smartphone, Package,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
];

const CATEGORY_LINKS = [
  { name: "Phones", href: "/shop?category=phones", icon: Smartphone },
  { name: "Laptops", href: "/shop?category=laptops", icon: Laptop },
  { name: "TVs", href: "/shop?category=tvs", icon: Tv },
  { name: "Accessories", href: "/shop?category=accessories", icon: Package },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShopOpen(false);
  }, [location]);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Account";

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b nav-blur h-16 flex items-center bg-white/80 backdrop-blur-md",
        scrolled ? "border-gray-100 shadow-sm" : "border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary uppercase">
              VILLA GADGETS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                location.pathname === "/" ? "text-accent" : "text-primary/60"
              )}
            >
              Home
            </Link>

            {/* Shop dropdown */}
            <div className="relative" ref={shopRef}>
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent",
                  location.pathname === "/shop" ? "text-accent" : "text-primary/60"
                )}
              >
                Shop
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200",
                    shopOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              <AnimatePresence>
                {shopOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-3 w-52 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                  >
                    <Link
                      to="/shop"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-50"
                    >
                      All Products
                    </Link>
                    {CATEGORY_LINKS.map((cat) => (
                      <Link
                        key={cat.href}
                        to={cat.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <cat.icon size={16} className="text-gray-400" />
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center space-x-4 pl-4 border-l border-gray-100">
              {/* Cart */}
              <Link to="/cart" className="relative group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                  <path d="M3 6h18"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Account */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-primary/60 hover:text-accent transition-colors"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt={displayName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0A2540] flex items-center justify-center text-white text-xs font-black">
                        {displayName[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden lg:block">{displayName}</span>
                    <ChevronDown size={14} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                      >
                        <Link
                          to="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User size={16} /> My Account
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-50"
                          >
                            <Settings size={16} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary/60 hover:text-accent transition-colors flex items-center gap-1"
                >
                  <User size={18} />
                  <span className="hidden lg:block">Sign In</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-[#0A2540]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#0A2540]">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden absolute top-16 left-0 right-0"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-900 border-b border-gray-50 pb-2"
              >
                Home
              </Link>

              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-gray-900 pb-1"
              >
                Shop
              </Link>

              {/* Mobile category links */}
              <div className="pl-4 space-y-3 border-l border-gray-100">
                {CATEGORY_LINKS.map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <cat.icon size={15} className="text-gray-400" />
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 text-sm font-medium text-gray-700"
                    >
                      <User size={18} /> My Account
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-sm font-medium text-gray-700"
                      >
                        <Settings size={18} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 text-sm font-medium text-red-500"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-sm font-medium text-gray-700"
                  >
                    <User size={18} /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}