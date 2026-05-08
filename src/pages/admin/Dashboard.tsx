import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Clock,
  PackageX,
  Loader2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Product, Order } from "../../types";
import { formatCurrency } from "../../lib/utils";

const LOW_STOCK_THRESHOLD = 5;

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    pendingOrders: 0,
    outOfStock: 0,
    totalStock: 0,
  });
  const [lowStock, setLowStock] = useState<
    Pick<Product, "id" | "name" | "stock_quantity">[]
  >([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);

    try {
      const [{ data: orders, error: oErr }, { data: products, error: pErr }] =
        await Promise.all([
          supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("products").select("id, name, stock_quantity"),
        ]);

      if (oErr) throw oErr;
      if (pErr) throw pErr;

      if (orders) {
        const revenue = orders
          .filter((o) => o.status === "paid" || o.status === "delivered")
          .reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
        const pending = orders.filter((o) => o.status === "pending").length;
        setStats((prev) => ({
          ...prev,
          totalRevenue: revenue,
          orderCount: orders.length,
          pendingOrders: pending,
        }));
        setRecentOrders(orders.slice(0, 5));
      }

      if (products) {
        const outOfStock = products.filter(
          (p) => p.stock_quantity === 0,
        ).length;

        // Calculate the total sum of all stock
        const totalStockCount = products.reduce(
          (acc, p) => acc + (p.stock_quantity || 0),
          0,
        );

        const urgent = products.filter(
          (p) => p.stock_quantity > 0 && p.stock_quantity < LOW_STOCK_THRESHOLD,
        );
        setStats((prev) => ({
          ...prev,
          outOfStock,
          totalStock: totalStockCount,
        }));
        setLowStock(urgent);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

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
        <p className="text-red-500 font-bold mb-2">Something went wrong</p>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="text-xs font-bold uppercase tracking-widest border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0A2540]">Dashboard</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          All-time stats
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Revenue (Paid)"
          value={formatCurrency(stats.totalRevenue)}
          icon={TrendingUp}
          accent="blue"
        />
        <StatCard
          title="Total Orders"
          value={stats.orderCount.toString()}
          icon={ShoppingBag}
          accent="blue"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          accent={stats.pendingOrders > 0 ? "yellow" : "blue"}
        />
        <StatCard
          title="Total Stock"
          value={stats.totalStock.toLocaleString()}
          icon={PackageX}
          accent="blue"
        />
        <StatCard
          title="Out of Stock"
          value={stats.outOfStock.toString()}
          icon={PackageX}
          accent={stats.outOfStock > 0 ? "red" : "blue"}
          onClick={
            stats.outOfStock > 0
              ? () => navigate("/admin/products?stock=0")
              : undefined
          }
        />
      </div>

      {/* Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
          <h3 className="flex items-center gap-2 text-amber-800 font-bold mb-4">
            <AlertTriangle size={18} />
            Low Stock — {lowStock.length} product
            {lowStock.length !== 1 ? "s" : ""} below {LOW_STOCK_THRESHOLD} units
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lowStock.map((p) => (
              <div
                key={p.id}
                className="bg-white p-3 rounded-lg border border-amber-100 text-sm"
              >
                <p className="font-bold text-[#0A2540] truncate">{p.name}</p>
                <p className="text-amber-600 font-mono text-xs mt-1">
                  {p.stock_quantity} left
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-[#0A2540]">Recent Orders</h3>
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Last 5
          </span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No orders yet.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs uppercase text-gray-400 tracking-widest">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold text-[#0A2540] text-sm">
                    {o.customer_name}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">
                    {formatCurrency(o.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(o.created_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- Sub-components ---

type Accent = "blue" | "red" | "yellow";

function StatCard({
  title,
  value,
  icon: Icon,
  accent = "blue",
  onClick,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  accent?: Accent;
  onClick?: () => void;
}) {
  const accentClasses: Record<Accent, string> = {
    blue: "text-blue-600",
    red: "text-red-500",
    yellow: "text-amber-500",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${
        onClick
          ? "cursor-pointer hover:border-gray-400 hover:shadow-md transition-all"
          : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <Icon className={accentClasses[accent]} size={20} />
      </div>
      <p className="text-2xl font-black text-[#0A2540]">{value}</p>
      {onClick && (
        <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">
          View all →
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    pending: "bg-amber-100 text-amber-700",
    paid: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-500",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
