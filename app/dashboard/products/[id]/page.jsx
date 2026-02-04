"use client";

import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Package,
  Hash,
  DollarSign,
  Layers,
  Camera,
  Image as ImageIcon,
  Tag,
  ArrowLeft,
  Save,
  X,
  Check,
  Box,
  Ruler,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Image from "next/image";

const INITIAL_IMAGES = ["/globe.svg", "/fil.svg"];

export default function ProductPage() {
  const fileRef = useRef(null);
  const [showVariantDrawer, setShowVariantDrawer] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const [product, setProduct] = useState({
    name: "Premium Cotton T-Shirt",
    sku: "TSHIRT-001",
    base_price: 1200,
    cost_price: 650,
    stock: 50,
    category: "Clothing",
    brand: "Premium Apparel",
    description:
      "High-quality cotton t-shirt with premium finish. Perfect for everyday wear with comfortable fit and durable fabric.",
    weight: "0.3 kg",
    dimensions: "30 × 40 × 5 cm",
    tags: ["Cotton", "Premium", "Summer", "Casual"],
    images: INITIAL_IMAGES,
    rating: 4.5,
    reviews: 128,
  });

  const [variants, setVariants] = useState([
    {
      id: 1,
      name: "Color",
      type: "Red",
      price: 1200,
      sku: "TSHIRT-RED",
      stock: 25,
    },
    {
      id: 2,
      name: "Size",
      type: "Medium",
      price: 1200,
      sku: "TSHIRT-M",
      stock: 20,
    },
  ]);

  /* ================= IMAGE HANDLERS ================= */

  const addImage = (file) => {
    const url = URL.createObjectURL(file);
    setProduct((p) => ({ ...p, images: [...p.images, url] }));
  };

  const removeImage = (index) => {
    const updated = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updated });
    if (imageIndex >= updated.length) {
      setImageIndex(Math.max(0, updated.length - 1));
    }
  };

  /* ================= VARIANT HANDLERS ================= */

  const handleAddVariant = (variantData) => {
    if (editingVariant) {
      // Update existing variant
      setVariants((prev) =>
        prev.map((v) =>
          v.id === editingVariant.id ? { ...v, ...variantData } : v,
        ),
      );
    } else {
      // Add new variant
      const newVariant = {
        ...variantData,
        id: Date.now(),
      };
      setVariants((prev) => [...prev, newVariant]);
    }
    setShowVariantDrawer(false);
    setEditingVariant(null);
  };

  const handleDeleteVariant = (variantId) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setShowVariantDrawer(true);
  };

  // Field styling

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-(--muted)">{product.sku}</span>
              <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {product.category}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="rounded-2xl border p-6 bg-(--card) border-theme">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Product Images
              </h2>
              <div className="text-sm text-(--muted)">
                {imageIndex + 1} of {product.images.length}
              </div>
            </div>

            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-(--muted/10) mb-6">
              {product.images.length > 0 ? (
                <>
                  <Image
                    src={product.images[imageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setImageIndex((i) =>
                            i === 0 ? product.images.length - 1 : i - 1,
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-(--card) backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setImageIndex((i) =>
                            i === product.images.length - 1 ? 0 : i + 1,
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-(--card) backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => removeImage(imageIndex)}
                    className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-(--muted) mb-4" />
                  <p className="text-(--muted)">No images uploaded</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    imageIndex === i
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-(--border) hover:border-blue-300"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}

              {/* Add Image Button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-(--border) flex flex-col items-center justify-center hover:bg-(--muted/5) transition"
              >
                <Plus className="h-6 w-6 text-(--muted) mb-2" />
                <span className="text-xs text-(--muted)">Add Image</span>
              </button>

              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => e.target.files && addImage(e.target.files[0])}
              />
            </div>
          </div>

          {/* Product Description */}
          <div className="rounded-2xl border p-6 bg-(--card) border-theme">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <EditableTextArea
              value={product.description}
              onSave={(value) => setProduct({ ...product, description: value })}
              placeholder="Enter product description..."
              rows={4}
            />
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-8">
          {/* Product Information */}
          <div className="rounded-2xl border p-6 bg-(--card) border-theme">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Information
            </h2>

            <div className="space-y-6">
              <EditableField
                label="Product Name"
                value={product.name}
                icon={Package}
                onSave={(value) => setProduct({ ...product, name: value })}
              />

              <EditableField
                label="SKU"
                value={product.sku}
                icon={Hash}
                onSave={(value) => setProduct({ ...product, sku: value })}
              />
              <div className="grid grid-cols-1 gap-4">
                <div className="w-full">
                  <EditableField
                    label="Base Price"
                    value={product.base_price}
                    prefix="৳ "
                    icon={DollarSign}
                    type="number"
                    onSave={(value) =>
                      setProduct({ ...product, base_price: Number(value) })
                    }
                  />
                </div>

                <div className="w-full">
                  <EditableField
                    label="Cost Price"
                    value={product.cost_price}
                    prefix="৳ "
                    icon={DollarSign}
                    type="number"
                    onSave={(value) =>
                      setProduct({ ...product, cost_price: Number(value) })
                    }
                  />
                </div>
              </div>

              <EditableField
                label="Stock"
                value={product.stock}
                icon={Layers}
                type="number"
                onSave={(value) =>
                  setProduct({ ...product, stock: Number(value) })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <EditableField
                  label="Category"
                  value={product.category}
                  type="select"
                  options={[
                    "Clothing",
                    "Electronics",
                    "Home",
                    "Beauty",
                    "Sports",
                  ]}
                  onSave={(value) =>
                    setProduct({ ...product, category: value })
                  }
                />

                <EditableField
                  label="Brand"
                  value={product.brand}
                  onSave={(value) => setProduct({ ...product, brand: value })}
                />
              </div>
            </div>
          </div>

          {/* Product Tags */}
          <div className="rounded-2xl border p-6 bg-(--card) border-theme">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Product Tags
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    onClick={() => {
                      const newTags = product.tags.filter(
                        (_, i) => i !== index,
                      );
                      setProduct({ ...product, tags: newTags });
                    }}
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
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    setProduct({
                      ...product,
                      tags: [...product.tags, e.target.value.trim()],
                    });
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border bg-(--card) border-(--border)"
              />
              <button className="px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10)">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Variants Section */}
          <div className="rounded-2xl border p-6 bg-(--card) border-theme">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Product Variants
              </h2>
              <button
                onClick={() => setShowVariantDrawer(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center py-6">
                <Layers className="h-12 w-12 mx-auto text-(--muted) mb-3" />
                <p className="text-(--muted)">No variants added</p>
                <p className="text-sm text-(--muted)">
                  Add sizes, colors, or other variants
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between p-4 rounded-xl border  border-theme hover:bg-(--muted/5) transition group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {variant.name} - {variant.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-(--muted)">
                          ৳ {variant.price}
                        </p>
                        <p className="text-sm text-(--muted)">
                          SKU: {variant.sku}
                        </p>
                        <p className="text-sm text-(--muted)">
                          Stock: {variant.stock || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEditVariant(variant)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info Section - Moved up to reduce empty space */}
      <div className="rounded-2xl border p-6 bg-(--card) border-theme mt-8">
        <h2 className="text-xl font-semibold mb-6">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label="Weight"
            value={product.weight}
            icon={Box}
            onSave={(value) => setProduct({ ...product, weight: value })}
          />

          <EditableField
            label="Dimensions"
            value={product.dimensions}
            icon={Ruler}
            onSave={(value) => setProduct({ ...product, dimensions: value })}
          />
        </div>
      </div>

      {/* Variant Drawer */}
      <Drawer
        open={showVariantDrawer}
        onClose={() => {
          setShowVariantDrawer(false);
          setEditingVariant(null);
        }}
        editingVariant={editingVariant}
      >
        <VariantForm variant={editingVariant} onSave={handleAddVariant} />
      </Drawer>
    </div>
  );
}

// Drawer Component
function Drawer({ open, onClose, children, editingVariant }) {
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
          <h3 className="text-lg font-semibold">
            {editingVariant ? "Edit Variant" : "Add Variant"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-(--muted/10) rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}

// Simplified VariantForm Component
function VariantForm({ variant, onSave }) {
  const [formData, setFormData] = useState({
    name: variant?.name || "",
    type: variant?.type || "",
    sku: variant?.sku || "",
    stock: variant?.stock || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add a default price from the main product if needed
    const variantData = {
      ...formData,
      price: 1200, // You can make this editable too if needed
    };
    onSave(variantData);
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Variant Name */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          Variant Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className={fieldClass}
          placeholder="e.g., Color, Size, Material"
        />
      </div>

      {/* Variant Type */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          Variant Type/Value *
        </label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
          className={fieldClass}
          placeholder="e.g., Red, Large, Cotton"
        />
      </div>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          SKU *
        </label>
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
            className={`${fieldClass} pl-10`}
            placeholder="e.g., TSHIRT-RED-L"
          />
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          Stock
        </label>
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
            }
            className={`${fieldClass} pl-10`}
            placeholder="0"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl border border-theme space-y-2">
        <h4 className="font-medium">Preview</h4>
        <div className="flex items-center justify-between">
          <span className="text-(--muted)">Variant:</span>
          <span className="font-medium">
            {formData.name} - {formData.type}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-(--muted)">SKU:</span>
          <span className="font-medium">{formData.sku || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-(--muted)">Stock:</span>
          <span className="font-medium">{formData.stock}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formData.name || !formData.type || !formData.sku}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        {variant ? "Update Variant" : "Add Variant"}
      </button>
    </form>
  );
}
function EditableField({
  label,
  value,
  icon: Icon,
  prefix = "",
  type = "text",
  options = [],
  onSave,
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-(--muted)">
        {label}
      </label>

      {editing ? (
        <div className="flex items-center gap-2 w-full min-w-0">
          {Icon && <Icon className="h-5 w-5 text-(--muted)" />}
          {type === "select" ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2 rounded-xl border bg-(--card) border-theme focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) =>
                setTempValue(
                  type === "number" ? Number(e.target.value) : e.target.value,
                )
              }
              className="flex-1 min-w-0 px-4 py-2 rounded-xl border bg-(--card) border-theme focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-between p-3 rounded-xl border border-theme hover:bg-(--muted/5) transition cursor-pointer group w-full min-w-0"
          onClick={() => setEditing(true)}
        >
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            {Icon && <Icon className="h-5 w-5 text-(--muted)" />}
            <span className="font-medium truncate">
              {prefix}
              {value}
            </span>
          </div>
          <Pencil className="h-4 w-4 text-(--muted) opacity-0 group-hover:opacity-100 transition" />
        </div>
      )}
    </div>
  );
}
function EditableTextArea({ value, onSave, placeholder, rows = 3 }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <div className="relative group w-full min-w-0">
      {editing ? (
        <div className="space-y-3 w-full min-w-0">
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            rows={rows}
            className="w-full min-w-0 px-4 py-3 rounded-xl border bg-(--card) border-theme focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={placeholder}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Check className="h-4 w-4" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-theme rounded-xl hover:bg-(--muted/10) transition"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded-xl border border-theme hover:bg-(--muted/5) transition cursor-pointer w-full min-w-0"
          onClick={() => setEditing(true)}
        >
          <p className="text-(--text) whitespace-pre-line wrap-break-word">
            {value}
          </p>
        </div>
      )}
    </div>
  );
}
