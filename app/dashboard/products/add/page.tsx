"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import VariantDrawer from "@/components/products/VariantDrawer";

export type ProductVariant = {
  id: string;
  name: string;
  type: string;
  sku: string;
  price: number;
};

export type ProductFormData = {
  name: string;
  sku: string;
  base_price: number;
  images: File[];
  variants: ProductVariant[];
};

export default function AddProductPage() {
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    sku: "",
    base_price: 0,
    images: [] as File[],
    variants: [],
  });

  const [openVariantDrawer, setOpenVariantDrawer] = useState(false);

  const addVariant = (variant: ProductVariant) => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, variant],
    }));
  };

  return (
    <div className="space-y-6 px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <ThemeToggle />
      </div>

      {/* Product Form */}
      <div className="rounded-2xl border border-(--border) bg-(--card) p-6 space-y-4">
        <input
          placeholder="Product Name"
          className="w-full input"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="SKU"
          className="w-full input"
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />

        <input
          type="number"
          placeholder="Base Price"
          className="w-full input"
          onChange={(e) =>
            setForm({ ...form, base_price: Number(e.target.value) })
          }
        />

        <input
          type="file"
          multiple
          onChange={(e) =>
            setForm({ ...form, images: Array.from(e.target.files || []) })
          }
        />
      </div>

      {/* Variants Section */}
      <div className="rounded-2xl border border-(--border) bg-(--card) p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Variants</h2>
          <button
            onClick={() => setOpenVariantDrawer(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm"
          >
            + Add Variant
          </button>
        </div>

        {form.variants.length === 0 && (
          <p className="text-sm text-(--muted)">No variants added</p>
        )}

        <div className="space-y-2">
          {form.variants.map((v: ProductVariant, i) => (
            <div
              key={i}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div>
                <p className="font-medium">
                  {v.name} ({v.type})
                </p>
                <p className="text-sm text-(--muted)">
                  SKU: {v.sku} • ৳ {v.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button className="w-full py-3 rounded-xl bg-green-600 text-white font-medium">
        Save Product
      </button>

      {/* Variant Drawer */}
      <VariantDrawer
        open={openVariantDrawer}
        onClose={() => setOpenVariantDrawer(false)}
        onAdd={addVariant}
      />
    </div>
  );
}
