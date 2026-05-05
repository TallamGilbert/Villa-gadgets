import { useState, useEffect } from "react";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Plus,
  Trash2,
  X,
  Save,
  Edit2,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/Button";
import { formatCurrency } from "../lib/utils";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders"
  >("overview");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stock_quantity: 0,
    storage: "",
    ram: "",
    battery: "",
    camera: "",
    description: "",
    image_urls: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: pData } = await supabase.from("products").select("*");
    const { data: oData } = await supabase.from("orders").select("*");
    setProducts(pData || []);
    setOrders(oData || []);
    setLoading(false);
  }

  const startEditing = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity,
      storage: product.storage || "",
      ram: product.ram || "",
      battery: product.battery || "",
      camera: product.camera || "",
      description: product.description || "",
      image_urls: product.image_urls ? product.image_urls.join(", ") : "",
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      image_urls: formData.image_urls.split(",").map((s: string) => s.trim()),
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from("products").insert([payload]);
      if (error) alert(error.message);
    }

    setIsAdding(false);
    setEditingId(null);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation */}
        <div className="flex gap-4 mb-8">
          {(["overview", "products", "orders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${activeTab === tab ? "bg-black text-white" : "bg-white border"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="bg-white rounded-[2rem] p-8 border">
            <div className="flex justify-between mb-8">
              <h2 className="text-xl font-black">Manage Inventory</h2>
              <Button
                onClick={() => {
                  setIsAdding(!isAdding);
                  setEditingId(null);
                }}
              >
                {isAdding ? (
                  <X className="w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {isAdding ? "Cancel" : "New Product"}
              </Button>
            </div>

            {isAdding && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl mb-8 border">
                <input
                  placeholder="Product Name"
                  className="p-3 border rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  placeholder="Price"
                  type="number"
                  className="p-3 border rounded"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                <input
                  placeholder="Brand"
                  className="p-3 border rounded"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
                <input
                  placeholder="Stock Qty"
                  type="number"
                  className="p-3 border rounded"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_quantity: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  placeholder="Storage (e.g. 256GB)"
                  className="p-3 border rounded"
                  value={formData.storage}
                  onChange={(e) =>
                    setFormData({ ...formData, storage: e.target.value })
                  }
                />
                <input
                  placeholder="RAM"
                  className="p-3 border rounded"
                  value={formData.ram}
                  onChange={(e) =>
                    setFormData({ ...formData, ram: e.target.value })
                  }
                />
                <input
                  placeholder="Battery"
                  className="p-3 border rounded"
                  value={formData.battery}
                  onChange={(e) =>
                    setFormData({ ...formData, battery: e.target.value })
                  }
                />
                <input
                  placeholder="Camera"
                  className="p-3 border rounded"
                  value={formData.camera}
                  onChange={(e) =>
                    setFormData({ ...formData, camera: e.target.value })
                  }
                />
                <input
                  placeholder="Image URLs (comma separated)"
                  className="col-span-full p-3 border rounded"
                  value={formData.image_urls}
                  onChange={(e) =>
                    setFormData({ ...formData, image_urls: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  className="col-span-full p-3 border rounded h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <Button onClick={handleSave} className="col-span-full">
                  {editingId ? "Update Product" : "Save Product"}
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase">
                      <th className="py-4">Product</th>
                      <th className="py-4">Stock</th>
                      <th className="py-4">Price</th>
                      <th className="py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="py-4 font-bold">{p.name}</td>
                        <td className="py-4">{p.stock_quantity}</td>
                        <td className="py-4">{formatCurrency(p.price)}</td>
                        <td className="py-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => startEditing(p)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-[2rem] p-8 border">
            <h2 className="text-xl font-black mb-6">Recent Orders</h2>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th className="py-4">Customer</th>
                  <th className="py-4">Total</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-4 font-bold">{o.customer_name}</td>
                    <td className="py-4">{formatCurrency(o.total_amount)}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
