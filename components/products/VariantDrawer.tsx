"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";

interface VariantDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd: (variant: { id: string; name: string; type: string; sku: string; price: number }) => void;
}

export default function VariantDrawer({ open, onClose, onAdd }: VariantDrawerProps) {
  const [variant, setVariant] = useState({
    name: "",
    type: "",
    sku: "",
    price: 0,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-full max-w-md bg-(--card) p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add Variant</h3>

        <input
          placeholder="Variant Name (e.g. Red)"
          className="w-full input"
          onChange={(e) =>
            setVariant({ ...variant, name: e.target.value })
          }
        />

        <input
          placeholder="Variant Type (Color, Size)"
          className="w-full input"
          onChange={(e) =>
            setVariant({ ...variant, type: e.target.value })
          }
        />

        <input
          placeholder="Variant SKU"
          className="w-full input"
          onChange={(e) =>
            setVariant({ ...variant, sku: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full input"
          onChange={(e) =>
            setVariant({ ...variant, price: Number(e.target.value) })
          }
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAdd({ id: uuid(), ...variant });
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
          >
            Add Variant
          </button>
        </div>
      </div>
    </div>
  );
}
