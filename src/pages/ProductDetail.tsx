import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Truck,
  Smartphone,
  Camera,
  Battery,
  Cpu,
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { productService } from "../services/productService";
import { Button } from "../components/ui/Button";
import { formatCurrency } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const productResult = await productService.getById(id);
        if (!productResult) {
          setLoading(false);
          return;
        }
        setProduct(productResult);
        const recResult = await productService.getRecommended(id, 4);
        setRecommended(recResult || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading)
    return <div className="pt-32 pb-24 text-center">Loading product...</div>;

  if (!product)
    return <div className="pt-32 pb-24 text-center">Product not found.</div>;

  // Single getAttr definition — after early returns so product is guaranteed
  const getAttr = (name: string) =>
    product.product_attributes?.find(
      (a) => a.name.toLowerCase() === name.toLowerCase(),
    )?.value || "";

  const isOutOfStock = product.stock_quantity <= 0;
  const warranty = getAttr("Warranty");
  const delivery = getAttr("Delivery");
  const condition = getAttr("Condition");

  const images =
    product.product_images
      ?.sort((a, b) => (a.position || 0) - (b.position || 0))
      .map((img) => img.image_url) || [];

  const specs = [
    { icon: Camera, label: "Camera", value: getAttr("Camera") },
    { icon: Battery, label: "Battery", value: getAttr("Battery") },
    { icon: Smartphone, label: "Storage", value: getAttr("Storage") },
    { icon: Cpu, label: "RAM", value: getAttr("RAM") },
  ];

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in buying ${product.name} priced at ${formatCurrency(product.price)}. Is it available?`;
    window.open(
      `https://wa.me/254700000000?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A2540] mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden p-12">
              <img
                src={images[selectedImage] || "https://placehold.co/400x400"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </motion.div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 h-24 rounded-2xl p-2 border-2 transition-all shrink-0 bg-gray-50 ${
                    selectedImage === i
                      ? "border-blue-600 ring-2 ring-blue-600/10"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
              {product.brand}
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-[#0A2540] mt-2 mb-4 tracking-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-black text-gray-900 mb-6">
              {formatCurrency(product.price)}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* Tags */}
            {product.product_tags && product.product_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {product.product_tags.map((item) => (
                  <span
                    key={item.tags.id}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium"
                  >
                    #{item.tags.name}
                  </span>
                ))}
              </div>
            )}

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {specs
                .filter((spec) => spec.value !== "")
                .map((spec, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-100 rounded-2xl flex items-center space-x-4"
                  >
                    <spec.icon className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        {spec.label}
                      </p>
                      <p className="text-sm font-bold text-[#0A2540]">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="flex-1"
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle className="w-5 h-5 mr-2 fill-current" />
                Order via WhatsApp
              </Button>
            </div>

            {/* Trust Indicators */}
            {(warranty || delivery || condition) && (
              <div className="space-y-4 pt-8 border-t border-gray-100">
                {warranty && (
                  <div className="flex items-center text-sm text-gray-500">
                    <ShieldCheck className="w-5 h-5 mr-3" />
                    <span>{warranty}</span>
                  </div>
                )}
                {delivery && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Truck className="w-5 h-5 mr-3" />
                    <span>{delivery}</span>
                  </div>
                )}
                {condition && (
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle2 className="w-5 h-5 mr-3" />
                    <span>{condition}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <div className="mt-32">
            <h2 className="text-2xl font-black text-[#0A2540] mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map((p) => (
                <div
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="aspect-square bg-gray-50 rounded-3xl p-8 mb-4 overflow-hidden">
                    <img
                      src={
                        p.product_images?.[0]?.image_url ||
                        "https://placehold.co/400x400"
                      }
                      alt={p.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600">
                    {p.name}
                  </h3>
                  <p className="text-[#0A2540] font-black">
                    {formatCurrency(p.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
