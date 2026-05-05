import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-[#0A2540] text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="font-black text-xl tracking-tight">VILLA GADGETS</h1>
          <p className="text-blue-300 text-xs mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-blue-100 hover:bg-[#1a3a5d]"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1a3a5d]">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 text-blue-200 hover:text-white px-4 py-2 w-full rounded-xl hover:bg-[#1a3a5d] transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}