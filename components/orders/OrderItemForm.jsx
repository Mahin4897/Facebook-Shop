"use client";

import { useState } from "react";

export default function OrderItemForm({ onAdd, products, variants }) {
  const [productId, setProductId] = useState(null);
  const [variantId, setVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-background text-foreground border-border focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50";

  const selectedProduct = products.find((p) => p.id === productId);

  const filteredVariants = variants.filter((v) => v.product_id === productId);

  const selectedVariant = filteredVariants.find((v) => v.id === variantId);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Add Order Item</h2>

      {/* Product */}
      <select
        value={productId ?? ""}
        onChange={(e) => {
          setProductId(Number(e.target.value));
          setVariantId(null);
        }}
        className="w-full border rounded-md p-2 bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-(--primary) transition"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Variant */}
      <select
        value={variantId ?? ""}
        onChange={(e) => {
          const newVariantId = Number(e.target.value);
          setVariantId(newVariantId);
          const variant = filteredVariants.find((v) => v.id === newVariantId);
          if (variant) {
            setPrice(variant.price);
          }
        }}
        disabled={!productId}
        className="w-full border rounded-md p-2 bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-(--primary) transition"
      >
        <option value="">Select Variant</option>
        {filteredVariants.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      {/* Quantity */}
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className={fieldClass}
      />

      {/* Price */}
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className={fieldClass}
      />

      <button
        disabled={!productId || !variantId}
        onClick={() => {
          if (productId !== null && variantId !== null) {
            onAdd({
              product_id: productId,
              variant_id: variantId,
              product_name: selectedProduct?.name,
              variant_name: selectedVariant?.name,
              quantity,
              price,
            });
          }
        }}
        className="w-full py-3 bg-green-600 text-white rounded-xl disabled:opacity-50"
      >
        Add Item
      </button>
    </div>
  );
}
