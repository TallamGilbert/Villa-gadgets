import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useSettings } from "../../context/SettingsContext";
import {
  MessageCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import { Order, OrderItem } from "../../types";
import { formatCurrency } from "../../lib/utils";

const STATUS_OPTIONS: Order["status"][] = [
  "pending",
  "paid",
  "delivered",
  "cancelled",
];

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
};

export default function Orders() {
  const { whatsapp_number } = useSettings();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loadingItems, setLoadingItems] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrderItems(orderId: number) {
    if (orderItems[orderId]) return; // already loaded
    setLoadingItems(orderId);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      if (error) throw error;
      setOrderItems((prev) => ({ ...prev, [orderId]: data || [] }));
    } catch (err: any) {
      console.error("Failed to fetch order items:", err.message);
    } finally {
      setLoadingItems(null);
    }
  }

  const handleExpand = (orderId: number) => {
    if (expandedId === orderId) {
      setExpandedId(null);
    } else {
      setExpandedId(orderId);
      fetchOrderItems(orderId);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      fetchOrders();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const contactCustomer = (phone: string, name: string, orderId: number) => {
    const message = `Hi ${name}, your order VG-${orderId} from Villa Gadgets is being processed. Thank you for shopping with us!`;
    window.open(
      `https://wa.me/${phone.replace(/\s/g, "").replace(/^0/, "254")}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <p className="text-red-500 font-bold mb-2">Failed to load orders</p>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <button
          onClick={fetchOrders}
          className="text-xs font-bold uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0A2540]">Customer Orders</h2>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          {orders.length} total
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-gray-400">
            <ShoppingBag size={32} strokeWidth={1} className="mb-4" />
            <p className="text-sm">No orders yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs uppercase text-gray-500 tracking-wider">
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <>
                  <tr
                    key={o.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleExpand(o.id)}
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-gray-500">
                        VG-{o.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#0A2540] text-sm">
                        {o.customer_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {o.phone_number}
                      </div>
                      <div className="text-xs text-gray-400">{o.location}</div>
                    </td>
                    <td className="p-4 font-mono text-sm font-bold">
                      {formatCurrency(o.total_amount)}
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${statusStyles[o.status as Order["status"]]}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td
                      className="p-4 text-right flex justify-end items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          contactCustomer(o.phone_number, o.customer_name, o.id)
                        }
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                        title="Contact via WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button className="p-2 text-gray-400">
                        {expandedId === o.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded order items */}
                  {expandedId === o.id && (
                    <tr key={`${o.id}-items`} className="bg-blue-50/30">
                      <td colSpan={6} className="px-6 py-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                          Items Ordered
                        </p>
                        {loadingItems === o.id ? (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Loader2 size={14} className="animate-spin" />
                            Loading items...
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {(orderItems[o.id] || []).length > 0 ? (
                              (orderItems[o.id] || []).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 text-sm"
                                >
                                  <div className="flex items-center gap-3">
                                    {item.image_url && (
                                      <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded-lg bg-gray-100"
                                      />
                                    )}
                                    <span className="font-bold text-[#0A2540]">
                                      {item.name}
                                    </span>
                                    <span className="text-gray-400">
                                      x{item.quantity}
                                    </span>
                                  </div>
                                  <span className="font-mono font-bold">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400 text-sm">
                                No item details available.
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
