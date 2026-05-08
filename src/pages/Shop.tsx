import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { productService } from "../services/productService";
import { Product } from "../types";
import { cn } from "../lib/utils";
import { ChevronDown, Package, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Phones", value: "phones" },
  { label: "Laptops", value: "laptops" },
  { label: "Monitors", value: "monitors" },
  { label: "TVs", value: "tvs" },
  { label: "Accessories", value: "accessories" },
  { label: "Storage", value: "storage" },
  { label: "Other", value: "other" },
];

const BRANDS = [
  "All",
  "Apple",
  "Samsung",
  "Xiaomi",
  "Tecno",
  "Infinix",
  "Oppo",
  "HP",
  "Dell",
  "Lenovo",
  "LG",
  "Sony",
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get("category") || "all";
  const activeBrand = searchParams.get("brand") || "All";
  const activePriceRange = searchParams.get("price") || "All";
  const sortBy = searchParams.get("sort") || "newest";
  const currentPage = Number(searchParams.get("page") || "1");

  // Fetch whenever any filter or page changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const result = await productService.getPaginated({
          page: currentPage,
          category: activeCategory,
          brand: activeBrand,
          priceRange: activePriceRange,
          sort: sortBy,
          search: searchQuery,
        });
        setProducts(result.products);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (err: any) {
        console.error("Error fetching:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [
    activeCategory,
    activeBrand,
    activePriceRange,
    sortBy,
    currentPage,
    searchQuery,
  ]);

  const setParam = (key: string, value: string, deleteIfDefault?: string) => {
    const next = new URLSearchParams(searchParams);
    if (deleteIfDefault && value === deleteIfDefault) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    // Reset to page 1 whenever a filter changes
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    if (page === 1) {
      next.delete("page");
    } else {
      next.set("page", String(page));
    }
    setSearchParams(next);
    // Scroll to top of product grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeBrand !== "All" ||
    activePriceRange !== "All" ||
    searchQuery;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-slate-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <header className="mb-16 border-b border-slate-100 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter mb-4 italic font-serif">
              The Collection
            </h1>
            <p className="text-slate-400 uppercase tracking-widest text-sm">
              Curated hardware for the modern professional.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
            <span>Sort By</span>
            <div className="relative border-b border-slate-900 pb-1">
              <select
                value={sortBy}
                onChange={(e) => setParam("sort", e.target.value)}
                className="appearance-none bg-transparent pr-8 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low</option>
                <option value="price-high">Price: High</option>
              </select>
              <ChevronDown className="absolute right-0 top-0 w-3 h-3 pointer-events-none" />
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar */}
          <aside className="w-full lg:w-48 shrink-0 space-y-10">
            {/* Search */}
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 bg-transparent border-b border-slate-200 focus:border-black outline-none transition-colors placeholder:text-slate-300 text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setParam("search", e.target.value);
              }}
            />

            {/* Categories */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                Category
              </h3>
              <ul className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => setParam("category", cat.value, "all")}
                      className={cn(
                        "text-sm transition-all hover:pl-2 w-full text-left",
                        activeCategory === cat.value
                          ? "font-bold text-black border-l-2 border-black pl-3"
                          : "text-slate-400 hover:text-black",
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                Brand
              </h3>
              <ul className="space-y-3">
                {BRANDS.map((brand) => (
                  <li key={brand}>
                    <button
                      onClick={() => setParam("brand", brand, "All")}
                      className={cn(
                        "text-sm transition-all hover:pl-2 w-full text-left",
                        activeBrand === brand
                          ? "font-bold text-black border-l-2 border-black pl-3"
                          : "text-slate-400 hover:text-black",
                      )}
                    >
                      {brand}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                Price
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Below 20k", id: "p1" },
                  { label: "20k — 50k", id: "p2" },
                  { label: "Above 50k", id: "p3" },
                ].map((range) => (
                  <div
                    key={range.id}
                    className="flex items-center group cursor-pointer"
                    onClick={() => setParam("price", range.id)}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 border border-slate-300 rounded-none flex items-center justify-center transition-colors",
                        activePriceRange === range.id
                          ? "border-black"
                          : "group-hover:border-black",
                      )}
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 bg-black transition-transform",
                          activePriceRange === range.id
                            ? "scale-100"
                            : "scale-0",
                        )}
                      />
                    </div>
                    <label className="ml-3 text-sm text-slate-500 group-hover:text-black cursor-pointer">
                      {range.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchParams({});
                  setSearchQuery("");
                }}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
              >
                ✕ Clear Filters
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            {/* Active filter pills */}
            {(activeCategory !== "all" || activeBrand !== "All") && (
              <div className="flex flex-wrap gap-2 mb-8">
                {activeCategory !== "all" && (
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-black text-white rounded-full">
                    {activeCategory}
                    <button onClick={() => setParam("category", "all", "all")}>
                      ✕
                    </button>
                  </span>
                )}
                {activeBrand !== "All" && (
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 bg-black text-white rounded-full">
                    {activeBrand}
                    <button onClick={() => setParam("brand", "All", "All")}>
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Result count */}
            {!loading && (
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">
                {total} item{total !== 1 ? "s" : ""}
                {totalPages > 1 && ` — page ${currentPage} of ${totalPages}`}
              </p>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-slate-100 rounded-2xl mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 border border-slate-100">
                <Package
                  className="w-8 h-8 text-slate-200 mb-6"
                  strokeWidth={1}
                />
                <h3 className="text-lg font-medium mb-2">No items match</h3>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold uppercase tracking-widest border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                {/* Previous */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Always show first, last, current, and pages adjacent to current
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                    // Insert ellipsis where pages are skipped
                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-slate-400 text-sm"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => goToPage(item as number)}
                        className={cn(
                          "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                          currentPage === item
                            ? "bg-black text-white"
                            : "border border-slate-200 hover:border-black text-slate-600",
                        )}
                      >
                        {item}
                      </button>
                    ),
                  )}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 hover:border-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
