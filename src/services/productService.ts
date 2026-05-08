import { supabase } from "../lib/supabase";
import { Product, Category } from "../types";

const PAGE_SIZE = 12;

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  product_images(id, image_url, position),
  product_attributes(id, name, value),
  product_tags(tags(id, name))
`;

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizeProduct);
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ? normalizeProduct(data) : null;
  },

  async getByCategorySlug(slug: string): Promise<Product[]> {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!category) return [];

    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(normalizeProduct);
  },

  async getRecommended(excludeId: string, limit = 4): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .neq("id", excludeId)
      .limit(limit);
    if (error) throw error;
    return (data || []).map(normalizeProduct);
  },

  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("position");
    if (error) throw error;
    return data || [];
  },

  async create(
    payload: {
      name: string;
      brand: string;
      price: number;
      stock_quantity: number;
      category_id: number;
      description: string;
      featured: boolean;
    },
    imageUrls: string[],
    attributes: { name: string; value: string }[],
    tags: string[],
  ): Promise<void> {
    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;

    const productId = data.id;

    // Insert images
    if (imageUrls.length > 0) {
      const { error: imgError } = await supabase.from("product_images").insert(
        imageUrls.map((url, i) => ({
          product_id: productId,
          image_url: url,
          position: i,
        })),
      );
      if (imgError) throw imgError;
    }

    // Insert attributes
    if (attributes.length > 0) {
      const { error: attrError } = await supabase
        .from("product_attributes")
        .insert(
          attributes.map((a) => ({
            product_id: productId,
            name: a.name,
            value: a.value,
          })),
        );
      if (attrError) throw attrError;
    }

    // Insert tags
    if (tags.length > 0) {
      await upsertTags(productId, tags);
    }
  },

  async update(
    id: string,
    payload: {
      name: string;
      brand: string;
      price: number;
      stock_quantity: number;
      category_id: number;
      description: string;
      featured: boolean;
    },
    imageUrls: string[],
    attributes: { name: string; value: string }[],
    tags: string[],
  ): Promise<void> {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id);
    if (error) throw error;

    // Replace images
    await supabase.from("product_images").delete().eq("product_id", id);
    if (imageUrls.length > 0) {
      await supabase.from("product_images").insert(
        imageUrls.map((url, i) => ({
          product_id: id,
          image_url: url,
          position: i,
        })),
      );
    }

    // Replace attributes
    await supabase.from("product_attributes").delete().eq("product_id", id);
    if (attributes.length > 0) {
      await supabase.from("product_attributes").insert(
        attributes.map((a) => ({
          product_id: id,
          name: a.name,
          value: a.value,
        })),
      );
    }

    // Replace tags
    await supabase.from("product_tags").delete().eq("product_id", id);
    if (tags.length > 0) {
      await upsertTags(id, tags);
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },

  async getPaginated({
    page = 1,
    category,
    brand,
    priceRange,
    sort,
    search,
  }: {
    page: number;
    category?: string;
    brand?: string;
    priceRange?: string;
    sort?: string;
    search?: string;
  }): Promise<{ products: Product[]; total: number; totalPages: number }> {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT, { count: "exact" });

    // Category filter
    if (category && category !== "all") {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();
      if (cat) query = query.eq("category_id", cat.id);
    }

    // Brand filter
    if (brand && brand !== "All") {
      query = query.eq("brand", brand);
    }

    // Price filter
    if (priceRange === "p1") query = query.lt("price", 20000);
    if (priceRange === "p2")
      query = query.gte("price", 20000).lte("price", 50000);
    if (priceRange === "p3") query = query.gt("price", 50000);

    // Search
    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    // Sort
    if (sort === "price-low") query = query.order("price", { ascending: true });
    else if (sort === "price-high")
      query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    // Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return {
      products: (data || []).map(normalizeProduct),
      total,
      totalPages,
    };
  },
};

// --- Helpers ---

function normalizeProduct(data: any): Product {
  return {
    ...data,
    product_images: (data.product_images || []).sort(
      (a: any, b: any) => a.position - b.position,
    ),
  };
}

async function upsertTags(productId: string, tagNames: string[]) {
  for (const name of tagNames) {
    // Upsert tag
    const { data: tag } = await supabase
      .from("tags")
      .upsert({ name }, { onConflict: "name" })
      .select()
      .single();

    if (tag) {
      await supabase
        .from("product_tags")
        .upsert({ product_id: productId, tag_id: tag.id });
    }
  }
}
