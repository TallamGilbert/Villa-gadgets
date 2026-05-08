import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { productService } from "../../services/productService";
import { Product, Category } from "../../types";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  Image as ImageIcon,
  AlertTriangle,
  Star,
  ChevronRight,
} from "lucide-react";

const getFirstImage = (product: Product) =>
  product.product_images?.[0]?.image_url || null;

const getAttribute = (product: Product, name: string) =>
  product.product_attributes?.find(
    (a) => a.name.toLowerCase() === name.toLowerCase(),
  )?.value || "";

const getTags = (product: Product): string[] =>
  product.product_tags?.map((pt) => pt.tags?.name).filter(Boolean) || [];

// Spec definitions per category slug
const CATEGORY_SPECS: Record<string, { name: string; placeholder: string }[]> =
  {
    phones: [
      { name: "RAM", placeholder: "e.g. 8GB" },
      { name: "Storage", placeholder: "e.g. 256GB" },
      { name: "Camera", placeholder: "e.g. 108MP" },
      { name: "Battery", placeholder: "e.g. 5000mAh" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
    laptops: [
      { name: "Processor", placeholder: "e.g. Intel i7" },
      { name: "RAM", placeholder: "e.g. 16GB" },
      { name: "Storage", placeholder: "e.g. 512GB SSD" },
      { name: "Display", placeholder: "e.g. 15.6 inch FHD" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
    monitors: [
      { name: "Screen Size", placeholder: "e.g. 27 inch" },
      { name: "Resolution", placeholder: "e.g. 4K UHD" },
      { name: "Refresh Rate", placeholder: "e.g. 144Hz" },
      { name: "Panel", placeholder: "e.g. IPS" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
    tvs: [
      { name: "Screen Size", placeholder: "e.g. 55 inch" },
      { name: "Resolution", placeholder: "e.g. 4K" },
      { name: "Smart TV", placeholder: "e.g. Yes" },
      { name: "HDMI Ports", placeholder: "e.g. 3" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
    accessories: [
      { name: "Compatibility", placeholder: "e.g. Universal" },
      { name: "Material", placeholder: "e.g. Silicone" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
    storage: [
      { name: "Capacity", placeholder: "e.g. 1TB" },
      { name: "Type", placeholder: "e.g. SSD / HDD" },
      { name: "Interface", placeholder: "e.g. USB 3.0" },
      { name: "Read Speed", placeholder: "e.g. 550MB/s" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
    other: [
      { name: "Specification", placeholder: "Key spec" },
      { name: "Details", placeholder: "Additional info" },
      { name: "Warranty", placeholder: "e.g. 1 Year Official" },
      { name: "Delivery", placeholder: "e.g. Same-day Nairobi" },
      { name: "Condition", placeholder: "e.g. Brand New in Box" },
    ],
  };

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stock_quantity: "" as string | number,
    category_id: 0,
    description: "",
    featured: false,
    tags: [] as string[],
  });

  // Dynamic attributes based on selected category
  const [attributes, setAttributes] = useState<
    { name: string; value: string }[]
  >([]);

  const stockFilter = searchParams.get("stock");
  const displayedProducts =
    stockFilter === "0"
      ? products.filter((p) => p.stock_quantity === 0)
      : products;

  // Get selected category slug for spec definitions
  const selectedCategory = categories.find(
    (c) => c.id === formData.category_id,
  );
  const specDefs = CATEGORY_SPECS[selectedCategory?.slug || "other"] || [];

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        productService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      // Set default category_id to first category
      if (categoriesData.length > 0 && formData.category_id === 0) {
        setFormData((prev) => ({ ...prev, category_id: categoriesData[0].id }));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Reset attributes when category changes
  useEffect(() => {
    setAttributes(specDefs.map((s) => ({ name: s.name, value: "" })));
  }, [formData.category_id]);

  const resetForm = () => {
    setEditingId(null);
    setImageUrls([""]);
    setTagInput("");
    setFormData({
      name: "",
      brand: "",
      price: "",
      stock_quantity: "",
      category_id: categories[0]?.id || 0,
      description: "",
      featured: false,
      tags: [],
    });
    setAttributes(specDefs.map((s) => ({ name: s.name, value: "" })));
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);
    setTagInput("");
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
      description: product.description || "",
      featured: product.featured || false,
      tags: getTags(product),
    });

    const existingUrls =
      product.product_images?.map((img) => img.image_url) || [];
    setImageUrls(existingUrls.length > 0 ? existingUrls : [""]);

    // Load existing attributes
    const catSlug = product.category?.slug || "other";
    const defs = CATEGORY_SPECS[catSlug] || [];
    setAttributes(
      defs.map((def) => ({
        name: def.name,
        value: getAttribute(product, def.name),
      })),
    );

    setIsFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const validUrls = imageUrls.map((u) => u.trim()).filter(Boolean);
    const validAttributes = attributes.filter((a) => a.value.trim() !== "");
    const payload = {
      name: formData.name,
      brand: formData.brand,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity) || 0,
      category_id: formData.category_id,
      description: formData.description,
      featured: formData.featured,
    };

    try {
      if (editingId) {
        await productService.update(
          editingId,
          payload,
          validUrls,
          validAttributes,
          formData.tags,
        );
      } else {
        await productService.create(
          payload,
          validUrls,
          validAttributes,
          formData.tags,
        );
      }
      setIsFormOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await productService.delete(id);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addImageUrl = () => setImageUrls([...imageUrls, ""]);
  const removeImageUrl = (index: number) =>
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  const updateImageUrl = (index: number, value: string) =>
    setImageUrls(imageUrls.map((url, i) => (i === index ? value : url)));

  const updateAttribute = (index: number, value: string) =>
    setAttributes(
      attributes.map((a, i) => (i === index ? { ...a, value } : a)),
    );

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData({ ...formData, tags: [...formData.tags, tag] });
    setTagInput("");
  };
  const removeTag = (tag: string) =>
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#0A2540]">Inventory</h2>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-[#0A2540] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-black transition-colors"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {stockFilter === "0" && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-3 rounded-lg text-sm">
          <span className="text-red-700 font-medium flex items-center gap-2">
            <AlertTriangle size={16} />
            Showing out of stock products only
          </span>
          <button
            onClick={() => setSearchParams({})}
            className="text-red-500 font-bold hover:underline text-xs uppercase tracking-widest"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Form Drawer */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex justify-end"
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg h-full p-8 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">
                {editingId ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setIsFormOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Images */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Product Images
                  </label>
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Image
                  </button>
                </div>
                {imageUrls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        placeholder={`Image URL ${index + 1}`}
                        className="flex-1 p-2 border rounded-lg text-sm"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                      />
                      {imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    {url && (
                      <img
                        src={url}
                        className="h-16 w-16 object-cover rounded shadow"
                        alt={`Preview ${index + 1}`}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Basic Info
                </label>

                {/* Category */}
                <select
                  className="w-full p-3 border rounded-lg bg-white text-sm"
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: Number(e.target.value),
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  required
                  placeholder="Product Name"
                  className="w-full p-3 border rounded-lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Brand"
                    className="p-3 border rounded-lg"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                  />
                  <input
                    required
                    type="number"
                    placeholder="Price (KES)"
                    className="p-3 border rounded-lg"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  className="w-full p-3 border rounded-lg"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg h-24 resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Specifications — dynamic per category */}
              {specDefs.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Specifications
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specDefs.map((spec, index) => (
                      <input
                        key={spec.name}
                        placeholder={spec.placeholder}
                        className="p-2 border rounded-lg text-sm"
                        value={attributes[index]?.value || ""}
                        onChange={(e) => updateAttribute(index, e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    placeholder="e.g. 5g, flagship, gaming"
                    className="flex-1 p-2 border rounded-lg text-sm"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-[#0A2540]/10 text-[#0A2540] rounded-full text-xs font-medium"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-500 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-sm text-[#0A2540] flex items-center gap-2">
                    <Star size={16} className="text-amber-400" />
                    Featured Product
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Show this product in featured sections on the homepage
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, featured: !formData.featured })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    formData.featured ? "bg-[#0A2540]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      formData.featured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#0A2540] text-white p-3 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="p-20 text-center text-gray-400 text-sm">
            {stockFilter === "0"
              ? "No out of stock products."
              : "No products yet."}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-xs uppercase text-gray-500">
                <th className="p-4">Image</th>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {getFirstImage(p) ? (
                      <img
                        src={getFirstImage(p)!}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded bg-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon size={20} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#0A2540]">{p.name}</p>
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                        <Star
                          size={10}
                          className="fill-amber-400 text-amber-400"
                        />
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium capitalize px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {p.category?.name || "—"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        p.stock_quantity === 0
                          ? "text-red-500 font-bold text-sm"
                          : "text-gray-700 text-sm"
                      }
                    >
                      {p.stock_quantity === 0
                        ? "Out of stock"
                        : p.stock_quantity}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-sm">
                    KES {Number(p.price).toLocaleString()}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openEditForm(p)}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 p-2 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
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
