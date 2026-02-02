"use client";

import { useState } from "react";

interface Variant {
  name: string;
  price: number;
  type: string;
}

interface VariantFormProps {
  variant?: Variant;
  onSave: (variant: Variant) => void;
}

export default function VariantForm({ variant, onSave }: VariantFormProps) {
  const [name, setName] = useState(variant ? variant.name : "");
  const [price, setPrice] = useState(variant ? String(variant.price) : "");
  const [type, setType] = useState(variant ? variant.type : "");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">
        {variant ? "Edit Variant" : "Add Variant"}
      </h2>

      <input
        placeholder="Variant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border rounded-xl"
      />
      <input
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full px-4 py-2 border rounded-xl"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full px-4 py-2 border rounded-xl"
      />

      <button
        onClick={() =>
          onSave({
            name,
            type,
            price: Number(price),
          })
        }
        className="w-full py-3 bg-blue-600 text-white rounded-xl"
      >
        {variant ? "Update Variant" : "Create Variant"}
      </button>
    </div>
  );
}
