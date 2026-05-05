export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  position: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  position: number;
  created_at: string;
}

export interface ProductAttribute {
  id: number;
  product_id: number;
  name: string;
  value: string;
}

export type ProductCategory =
  | "phones"
  | "laptops"
  | "monitors"
  | "tvs"
  | "accessories"
  | "storage"
  | "other";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category?: Category;
  description: string | null;
  featured: boolean;
  created_at: string;
  product_images: ProductImage[];
  product_attributes: ProductAttribute[];
  product_tags?: { tags: { id: number; name: string } }[];
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  phone_number: string;
  location: string;
  total_amount: number;
  status: "pending" | "paid" | "delivered" | "cancelled";
  payment_reference: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface CartItem {
  id: string;
  quantity: number;
  product_id: string;
}

export interface Tag {
  id: number;
  name: string;
}
