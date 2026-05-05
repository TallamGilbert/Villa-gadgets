import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { formatCurrency } from "../lib/utils";
import { Loader2, ShoppingBag, LogOut, Settings } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
};

export default function Account() {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  async function fetchOrders() {
    setLoadingOrders(true);
    const { data } = await supabase
      .from("orders")
      .select("id, created_at, total_amount, status")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoadingOrders(false);
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Customer";

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="pt-28 pb-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#0A2540] flex items-center justify-center text-white font-black text-xl">
                {displayName[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="font-black text-[#0A2540] text-lg">{displayName}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-[#0A2540] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors"
              >
                <Settings size={14} />
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-[#0A2540]">Order History</h3>
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loadingOrders ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <ShoppingBag size={32} strokeWidth={1} className="mb-4" />
              <p className="text-sm mb-4">No orders yet.</p>
              <Link
                to="/shop"
                className="text-xs font-bold uppercase tracking-widest border border-black text-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-xs uppercase text-gray-400 tracking-widest">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-[#0A2540]">
                      VG-{o.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(o.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold">
                      {formatCurrency(o.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[o.status] || "bg-gray-100 text-gray-600"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}