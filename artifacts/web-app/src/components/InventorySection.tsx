import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: number;
  stock: number;
  image?: string;
  createdAt: string;
}

interface InventorySectionProps {
  adminToken: string;
}

export default function InventorySection({ adminToken }: InventorySectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    weight: 0,
    stock: 0,
    image: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const handleAddClick = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({ name: "", category: "", price: 0, weight: 0, stock: 0, image: "" });
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setIsAddingNew(false);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      weight: product.weight,
      stock: product.stock,
      image: product.image || "",
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "weight" || name === "stock"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSave = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const url = editingId
        ? `/api/products/${editingId}`
        : "/api/products";
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save product");

      setSuccessMessage(
        editingId ? "Product updated successfully!" : "Product added successfully!"
      );
      setIsAddingNew(false);
      setEditingId(null);
      refetch();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save product"
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setSuccessMessage("Product deleted successfully!");
      refetch();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to delete product"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-amber-200 p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-amber-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}

      {/* Add New Product Button */}
      <button
        onClick={handleAddClick}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add New Product
      </button>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-amber-300">
          <h3 className="text-xl font-bold text-amber-900 mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Gold Bracelet"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                placeholder="e.g., Bracelets, Rings, Necklaces"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                placeholder="0"
                step="100"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Weight (grams)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleFormChange}
                placeholder="0"
                step="0.1"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleFormChange}
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Save Product
            </button>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="space-y-3">
        {products && products.length > 0 ? (
          products.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border-2 border-amber-200 overflow-hidden hover:shadow-lg transition"
            >
              {/* Header (Always Visible) */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === product.id ? null : product.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-amber-50 transition"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-amber-900">{product.name}</h4>
                    <p className="text-sm text-amber-700">{product.category}</p>
                    <p className="text-xs text-amber-600">
                      ₹{product.price.toLocaleString()} • {product.weight}g
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`text-center ${
                      product.stock < 3 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    <span className="font-bold">{product.stock}</span>
                    <p className="text-xs">in stock</p>
                  </div>
                  {expandedId === product.id ? (
                    <ChevronUp className="text-amber-600" />
                  ) : (
                    <ChevronDown className="text-amber-600" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === product.id && (
                <div className="border-t-2 border-amber-200 p-4 bg-amber-50 flex gap-3">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border-2 border-amber-200 p-8 text-center">
            <p className="text-amber-700 font-semibold">No products yet</p>
            <p className="text-amber-600 text-sm">Click "Add New Product" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
