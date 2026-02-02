"use client";

import { useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Package,
  Hash,
  DollarSign,
  Image as ImageIcon,
  Tag,
  Layers,
  Plus,
  X,
  Save,
  Trash2,
  Upload,
  Info,
} from "lucide-react";

export default function AddProductPage() {
  // Form state
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    base_price: 0,
    cost_price: 0,
    description: "",
    weight: "",
    dimensions: "",
    tags: [],
    images: [],
    variants: [],
  });

  const [showVariantDrawer, setShowVariantDrawer] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Field styling
  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const labelClass = "block text-sm font-medium mb-2 text-(--text)";

  // Handle file upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to cloud storage
    const newImages = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  // Remove image
  const removeImage = (id) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== id),
    }));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Add variant
  const addVariant = (variant) => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));
    setShowVariantDrawer(false);
  };

  // Remove variant
  const removeVariant = (variantId) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== variantId),
    }));
  };

  // Calculate derived values
  const profitMargin =
    form.base_price > 0
      ? (((form.base_price - form.cost_price) / form.base_price) * 100).toFixed(
          2,
        )
      : 0;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you would submit to your API here
      console.log("Product data:", form);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Product created successfully!");
      // Reset form or redirect
      // router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-sm text-(--muted) mt-1">
            Create a new product with variants and images
          </p>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information Card */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className={labelClass}>Product Name *</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                      className={`${fieldClass} pl-10`}
                      placeholder="e.g., Wireless Mouse"
                    />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <label className={labelClass}>
                    SKU (Stock Keeping Unit) *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) =>
                        setForm({ ...form, sku: e.target.value })
                      }
                      required
                      className={`${fieldClass} pl-10`}
                      placeholder="e.g., WM-1001"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className={fieldClass}
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="beauty">Beauty</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                  </select>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                      >
                        <Tag className="h-3 w-3" />
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className={`${fieldClass} flex-1`}
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/5) transition"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows="4"
                    className={fieldClass}
                    placeholder="Describe your product features, benefits, and specifications..."
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images
              </h2>

              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-(--border) rounded-2xl p-8 text-center hover:border-blue-500 transition">
                <ImageIcon className="h-12 w-12 mx-auto text-(--muted) mb-4" />
                <p className="font-medium mb-2">Drag & drop images here</p>
                <p className="text-sm text-(--muted) mb-4">or</p>
                <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Browse Files
                  </span>
                </label>
                <p className="text-xs text-(--muted) mt-4">
                  Supports JPG, PNG up to 5MB each
                </p>
              </div>

              {/* Image Previews */}
              {form.images.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">
                    {form.images.length} image
                    {form.images.length !== 1 ? "s" : ""} uploaded
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {form.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-(--muted/10)">
                          <Image
                            src={image.preview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Pricing & Variants */}
          <div className="space-y-8">
            {/* Pricing Card */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing
              </h2>

              <div className="space-y-4">
                {/* Base Price */}
                <div>
                  <label className={labelClass}>Selling Price *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.base_price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          base_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className={`${fieldClass} pl-10`}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Cost Price */}
                <div>
                  <label className={labelClass}>Cost Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.cost_price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cost_price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={`${fieldClass} pl-10`}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Profit Margin */}
                <div className="p-3 rounded-xl bg-(--muted/5) border">
                  <p className="text-sm text-(--muted) mb-1">Profit Margin</p>
                  <p
                    className={`text-lg font-bold ${profitMargin > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {profitMargin}%
                  </p>
                  <p className="text-xs text-(--muted) mt-1">
                    Profit: ৳ {(form.base_price - form.cost_price).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Variants Card */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Variants
                </h2>
                <button
                  type="button"
                  onClick={() => setShowVariantDrawer(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add Variant
                </button>
              </div>

              {form.variants.length === 0 ? (
                <div className="text-center py-6">
                  <Layers className="h-12 w-12 mx-auto text-(--muted) mb-3" />
                  <p className="text-(--muted)">No variants added yet</p>
                  <p className="text-sm text-(--muted) mt-1">
                    Add variants like sizes, colors, etc.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {form.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-4 rounded-xl border hover:bg-(--muted/5) transition group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{variant.name}</p>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            {variant.type}
                          </span>
                        </div>
                        <p className="text-sm text-(--muted) mt-1">
                          SKU: {variant.sku} • ৳ {variant.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Variant Summary */}
                  <div className="p-4 rounded-xl border bg-(--muted/5) mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-(--muted)">Total Variants</span>
                      <span className="font-medium">
                        {form.variants.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-(--muted)">Price Range</span>
                      <span className="font-medium">
                        ৳{" "}
                        {Math.min(...form.variants.map((v) => v.price)).toFixed(
                          2,
                        )}{" "}
                        - ৳{" "}
                        {Math.max(...form.variants.map((v) => v.price)).toFixed(
                          2,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Additional Information
              </h2>

              <div className="space-y-4">
                {/* Weight */}
                <div>
                  <label className={labelClass}>Weight</label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: e.target.value })
                    }
                    className={fieldClass}
                    placeholder="e.g., 0.5 kg"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className={labelClass}>Dimensions (L×W×H)</label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) =>
                      setForm({ ...form, dimensions: e.target.value })
                    }
                    className={fieldClass}
                    placeholder="e.g., 10×5×2 cm"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !form.name || !form.sku}
              className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Variant Drawer */}
      <VariantDrawer
        open={showVariantDrawer}
        onClose={() => setShowVariantDrawer(false)}
        onAdd={addVariant}
      />
    </div>
  );
}

// Variant Drawer Component
function VariantDrawer({ open, onClose, onAdd }) {
  const [variant, setVariant] = useState({
    id: "",
    name: "",
    type: "size", // size, color, material, etc.
    sku: "",
    price: 0,
  });

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVariant = {
      ...variant,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    onAdd(newVariant);

    // Reset form
    setVariant({
      id: "",
      name: "",
      type: "size",
      sku: "",
      price: 0,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-50 w-full max-w-md bg-(--card) rounded-t-2xl md:rounded-2xl shadow-xl md:mx-4 overflow-hidden">
        <div className="sticky top-0 bg-(--card) border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Variant</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-(--muted/10) rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Variant Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-(--muted)">
                Variant Name *
              </label>
              <input
                type="text"
                value={variant.name}
                onChange={(e) =>
                  setVariant({ ...variant, name: e.target.value })
                }
                required
                className={fieldClass}
                placeholder="e.g., Red, Large, Premium"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-(--muted)">
                Type *
              </label>
              <select
                value={variant.type}
                onChange={(e) =>
                  setVariant({ ...variant, type: e.target.value })
                }
                required
                className={fieldClass}
              >
                <option value="size">Size</option>
                <option value="color">Color</option>
                <option value="material">Material</option>
                <option value="style">Style</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium mb-2 text-(--muted)">
                SKU *
              </label>
              <input
                type="text"
                value={variant.sku}
                onChange={(e) =>
                  setVariant({ ...variant, sku: e.target.value })
                }
                required
                className={fieldClass}
                placeholder="e.g., TEE-RED-L"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2 text-(--muted)">
                Price *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={variant.price}
                onChange={(e) =>
                  setVariant({
                    ...variant,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
                className={fieldClass}
                placeholder="0.00"
              />
            </div>

            {/* Preview */}
            {variant.name && (
              <div className="p-4 rounded-xl border space-y-2">
                <h4 className="font-medium">Preview</h4>
                <div className="flex items-center justify-between">
                  <span className="text-(--muted)">Variant:</span>
                  <span className="font-medium">
                    {variant.name} ({variant.type})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--muted)">SKU:</span>
                  <span className="font-medium">{variant.sku || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-(--muted)">Price:</span>
                  <span className="font-semibold">
                    ৳ {variant.price.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!variant.name || !variant.sku || variant.price <= 0}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
