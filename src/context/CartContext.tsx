import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Product } from "../types";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  storage: string;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  syncing: boolean;
}

const CART_KEY = "villa-gadgets-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- Local storage helpers ---
function getLocalCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function setLocalCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearLocalCart() {
  localStorage.removeItem(CART_KEY);
}

// --- Merge logic ---
function mergeCarts(localCart: CartItem[], dbCart: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Add all DB items first
  for (const item of dbCart) {
    merged.set(item.id, { ...item });
  }

  // Merge local items on top — sum quantities if product exists in both
  for (const item of localCart) {
    if (merged.has(item.id)) {
      merged.get(item.id)!.quantity += item.quantity;
    } else {
      merged.set(item.id, { ...item });
    }
  }

  return Array.from(merged.values());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(getLocalCart);
  const [syncing, setSyncing] = useState(false);
  const prevUserIdRef = useRef<string | null>(null);

  // --- DB helpers ---
  const fetchDbCart = async (userId: string): Promise<CartItem[]> => {
    const { data, error } = await supabase
      .from("carts")
      .select(
        `
      product_id,
      quantity,
      products (
        id,
        name,
        brand,
        price,
        product_attributes (name, value),
        product_images (image_url, position)
      )
    `,
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to fetch DB cart:", error.message);
      return [];
    }

    return (data || [])
      .filter((row: any) => row.products)
      .map((row: any) => {
        const p = row.products;
        const storageAttr = p.product_attributes?.find(
          (a: any) => a.name.toLowerCase() === "storage",
        );
        const sortedImages = (p.product_images || []).sort(
          (a: any, b: any) => a.position - b.position,
        );
        return {
          id: String(p.id),
          name: p.name,
          brand: p.brand,
          price: p.price,
          storage: storageAttr?.value || "",
          quantity: row.quantity,
          image_url: sortedImages[0]?.image_url || "",
        };
      });
  };

  const pushCartToDb = async (userId: string, cartItems: CartItem[]) => {
    if (cartItems.length === 0) return;

    const rows = cartItems.map((item) => ({
      user_id: userId,
      product_id: item.id,
      quantity: item.quantity,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from("carts")
      .upsert(rows, { onConflict: "user_id,product_id" });

    if (error) console.error("Failed to push cart to DB:", error.message);
  };

  const deleteFromDb = async (userId: string, productId: string) => {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) console.error("Failed to delete cart item:", error.message);
  };

  const clearDbCart = async (userId: string) => {
    const { error } = await supabase
      .from("carts")
      .delete()
      .eq("user_id", userId);

    if (error) console.error("Failed to clear DB cart:", error.message);
  };

  // --- Auth state change handler ---
  useEffect(() => {
    const currentUserId = user?.id || null;
    const previousUserId = prevUserIdRef.current;

    const handleLogin = async (userId: string) => {
      setSyncing(true);
      const localCart = getLocalCart();
      const dbCart = await fetchDbCart(userId);
      const merged = mergeCarts(localCart, dbCart);

      // Push merged cart to DB
      await pushCartToDb(userId, merged);

      // Clear local storage — DB is now source of truth
      clearLocalCart();

      setCart(merged);
      setSyncing(false);
    };

    const handleLogout = () => {
      // Clear everything on logout
      clearLocalCart();
      setCart([]);
    };

    const handleAccountSwitch = async (userId: string) => {
      // Different user logged in — start fresh from their DB cart
      setSyncing(true);
      clearLocalCart();
      const dbCart = await fetchDbCart(userId);
      setCart(dbCart);
      setSyncing(false);
    };

    if (currentUserId && !previousUserId) {
      // Guest → Logged in: merge
      handleLogin(currentUserId);
    } else if (!currentUserId && previousUserId) {
      // Logged in → Logged out: clear
      handleLogout();
    } else if (
      currentUserId &&
      previousUserId &&
      currentUserId !== previousUserId
    ) {
      // Account A → Account B: load new account's cart
      handleAccountSwitch(currentUserId);
    }

    prevUserIdRef.current = currentUserId;
  }, [user]);

  // --- Sync local cart to localStorage when no user ---
  useEffect(() => {
    if (!user) {
      setLocalCart(cart);
    }
  }, [cart, user]);

  const addToCart = useCallback(
    async (product: Product) => {
      // 1. Calculate the NEW state array first (Pure logic)
      setCart((current) => {
        const existing = current.find((item) => item.id === product.id);
        // Get storage from attributes
        const storageAttr = product.product_attributes?.find(
          (a) => a.name.toLowerCase() === "storage",
        );

        let newCart;
        if (existing) {
          newCart = current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            storage: storageAttr?.value || "",
            quantity: 1,
            image_url: product.product_images?.[0]?.image_url || "",
          };
          newCart = [...current, newItem];
        }

        // 2. Perform the Side Effect (Database Sync)
        // We do this here or immediately after set state
        if (user) {
          // NOTE: You might want to push the specific change
          // or the entire newCart depending on your DB schema
          pushCartToDb(user.id, newCart);
        }

        return newCart;
      });
    },
    [user],
  ); // Only re-runs if 'user' changes
  const removeFromCart = useCallback(
    async (productId: string) => {
      setCart((current) => current.filter((item) => item.id !== productId));
      if (user) await deleteFromDb(user.id, productId);
    },
    [user],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart((current) =>
        current.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );

      if (user) {
        await supabase
          .from("carts")
          .update({ quantity, updated_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("product_id", productId);
      }
    },
    [user],
  );

  const clearCart = useCallback(async () => {
    setCart([]);
    clearLocalCart();
    if (user) await clearDbCart(user.id);
  }, [user]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        syncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
