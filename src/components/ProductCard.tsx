import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Product } from "../types";
import { formatCurrency } from "../lib/utils";
import { Button } from "./ui/Button";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

// Wrapped in memo to prevent unnecessary re-renders in large lists
export default memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isOutOfStock = product.stock_quantity === 0;

  const getAttr = (product: Product, name: string) =>
    product.product_attributes?.find(
      (a) => a.name.toLowerCase() === name.toLowerCase(),
    )?.value || "";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-card transition-all duration-300 flex flex-col justify-between"
    >
      <Link
        to={`/product/${product.id}`}
        className="block relative aspect-square bg-gray-50/50 overflow-hidden"
        aria-label={`View details for ${product.name}`}
      >
        <img
          src={
            product.product_images?.[0]?.image_url ||
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop"
          }
          alt={product.name}
          className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="bg-gray-50 px-2 py-1 rounded text-[10px] font-bold uppercase text-primary/60 tracking-wider">
            {product.brand}
          </div>
          <div className="text-accent font-bold text-sm">
            {formatCurrency(product.price)}
          </div>
        </div>

        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">
            {getAttr(product, "storage")}{" "}
            {getAttr(product, "ram") ? `• ${getAttr(product, "ram")} RAM` : ""}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Button updated to reflect actual action */}
          <Button
            variant="secondary"
            className="flex-1 py-2.5 bg-gray-50 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all border-none"
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </Button>

          <Button
            variant="outline"
            className="py-2.5 rounded-xl text-xs font-bold"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
});
