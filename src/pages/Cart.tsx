import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { Button } from "../components/ui/Button";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalAmount, totalItems } =
    useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-screen container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-black text-[#0A2540] mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-10">
            Looks like you haven't added anything to your cart yet. Browse our
            gadgets to find something you love.
          </p>
          <Link to="/shop">
            <Button size="lg" className="w-full">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-[#0A2540] mb-12">
          My Shopping Cart ({totalItems})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 p-4"
                >
                  <img
                    src={item.image_url || "https://placehold.co/400x400"}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                <div className="flex-grow text-center sm:text-left">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">
                    {item.storage} • {item.brand}
                  </p>
                  <p className="font-black text-[#0A2540]">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-xl px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-blue-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#0A2540] text-white p-8 rounded-[0.5rem] sticky top-32">
              <h3 className="text-xl font-bold mb-8">Order Summary</h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-blue-100/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-blue-100/70">
                  <span>Delivery fee</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                size="lg"
                className="w-full bg-white text-[#0A2540] hover:bg-gray-100 font-black tracking-tight"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="mt-6 text-center text-blue-200/50 text-xs">
                Safe and secure payments powered by M-Pesa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
