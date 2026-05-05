import { Link } from "react-router-dom";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/Button";
import ProductCard from "../components/ProductCard";
import { Product } from "../types";

const CATEGORY_CARDS = [
  {
    label: "Phones",
    sub: "iPhone, Samsung & more",
    href: "/shop?category=phones",
    image:
      "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    label: "Laptops & PCs",
    sub: "Work & Gaming",
    href: "/shop?category=laptops",
    image:
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    label: "TVs",
    sub: "Home Entertainment",
    href: "/shop?category=tvs",
    image:
      "https://images.unsplash.com/photo-1646861039459-fd9e3aabf3fb?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    label: "Monitors",
    sub: "Home & Office",
    href: "/shop?category=monitors",
    image:
      "https://images.unsplash.com/photo-1665095111931-fc4fa813e21c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    label: "Accessories",
    sub: "Cases, cables & more",
    href: "/shop?category=accessories",
    image:
      "https://images.unsplash.com/photo-1632037876903-a5ffe207cdd0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
  },
  {
    label: "Storage",
    sub: "SSDs, drives & more",
    href: "/shop?category=storage",
    image:
      "https://images.unsplash.com/photo-1676554565711-1557916003e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGRkfGVufDB8fDB8fHww",
  },
  {
    label: "Other",
    sub: "Everything else",
    href: "/shop?category=other",
    image:
      "https://images.unsplash.com/photo-1547489401-fcada4966052?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGVsZWN0cm9uaWNzfGVufDB8fDB8fHww",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("products")
        .select(
          "*, category:categories(name, slug), product_images(image_url, position)",
        )
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(4);
      setProducts(data || []);
    }
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col w-full bg-white text-slate-950">
      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <span className="text-xs tracking-[0.2em] uppercase text-slate-400 mb-4 block font-semibold">
              Premium Hardware
            </span>
            <h1 className="text-6xl md:text-8xl font-medium leading-[0.9] tracking-tighter mb-8">
              The Future <br />
              <span className="italic font-serif">of Smart.</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-sm mb-10 leading-relaxed">
              Premium devices, local reliability. Lightning-fast delivery and
              secure M-Pesa payments.
            </p>
            <div className="flex gap-4">
              <Link to="/shop">
                <Button className="bg-black hover:bg-slate-800 text-white px-8 h-12 rounded-none">
                  Shop Now
                </Button>
              </Link>
              <Link to="/shop?price=p1">
                <Button
                  variant="outline"
                  className="px-8 h-12 border-slate-200 rounded-none hover:bg-slate-50"
                >
                  Budget Picks
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="md:w-1/2 flex justify-center">
            <div className="w-[280px] h-[540px] bg-slate-100 border border-slate-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold tracking-widest">
                VG
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {[
            { icon: ShieldCheck, text: "Genuine Products" },
            { icon: RotateCcw, text: "12 Month Warranty" },
            { icon: Truck, text: "Same-day Delivery" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-8 px-6">
              <item.icon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              <p className="text-sm font-medium uppercase tracking-wider">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-3xl font-medium tracking-tight">
              Featured Products
            </h2>
            <Link
              to="/shop"
              className="text-sm underline underline-offset-4 font-medium hover:text-slate-500"
            >
              View All
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-slate-400 text-sm">No featured products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <h2 className="text-2xl font-medium tracking-tight mb-8">
            Shop by Category
          </h2>
          {/* Set height to match the large card + gaps if needed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-auto md:h-[400px]">
            {/* Large card — Phones */}
            <Link
              to={CATEGORY_CARDS[0].href}
              className="group relative h-[400px] overflow-hidden bg-slate-100"
            >
              <img
                src={CATEGORY_CARDS[0].image}
                alt={CATEGORY_CARDS[0].label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 z-10 text-white">
                <h3 className="text-3xl font-medium mb-1">
                  {CATEGORY_CARDS[0].label}
                </h3>
                <span className="text-sm font-medium tracking-widest uppercase opacity-70">
                  {CATEGORY_CARDS[0].sub}
                </span>
              </div>
            </Link>

            {/* Right column — 3 rows */}
            <div className="grid grid-rows-3 gap-4 h-[400px]">
              {/* Top row — Laptops + TVs side by side */}
              <div className="grid grid-cols-2 gap-4 h-full">
                {CATEGORY_CARDS.slice(1, 3).map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    className="group relative overflow-hidden bg-slate-100 h-full"
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 z-10 text-white">
                      <h3 className="text-base font-medium">{cat.label}</h3>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                        {cat.sub}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Middle row — Monitors */}
              <Link
                to={CATEGORY_CARDS[3].href}
                className="group relative overflow-hidden bg-slate-100 h-full"
              >
                <img
                  src={CATEGORY_CARDS[3].image}
                  alt={CATEGORY_CARDS[3].label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6 z-10 text-white">
                  <h3 className="text-lg font-medium">
                    {CATEGORY_CARDS[3].label}
                  </h3>
                  <span className="text-xs text-slate-600 uppercase tracking-wider">
                    {CATEGORY_CARDS[3].sub}
                  </span>
                </div>
              </Link>

              {/* Bottom row — Accessories + Storage side by side */}
              <div className="grid grid-cols-2 gap-4 h-full">
                {CATEGORY_CARDS.slice(4, 6).map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    className="group relative overflow-hidden bg-slate-100 h-full"
                  >
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 z-10 text-white">
                      <h3 className="text-base font-medium">{cat.label}</h3>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">
                        {cat.sub}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-medium mb-6">Stay Updated</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Join our newsletter for exclusive drops and tech news.
          </p>
          <form className="relative">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-0 py-4 bg-transparent border-b border-slate-300 focus:border-black outline-none transition-colors placeholder:text-slate-400"
            />
            <button className="absolute right-0 top-4 text-xs font-bold uppercase tracking-widest hover:text-slate-500">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
