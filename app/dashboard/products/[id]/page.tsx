"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Drawer from "@/components/ui/Drawer";
import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import Image from "next/image";
import VariantForm from "@/components/products/VariantForm";
const INITIAL_IMAGES = ["/globe.svg", "/fil.svg"];

type Variant = {
  id: number;
  name: string;
  price: number;
  type: string;
  stock?: number;
};

export default function ProductPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showVariantDrawer, setShowVariantDrawer] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const [product, setProduct] = useState({
    name: "Premium T-Shirt",
    sku: "TSHIRT-001",
    base_price: 1000,
    stock: 50,
    images: INITIAL_IMAGES,
  });

  const [variants, setVariants] = useState<Variant[]>([
    { id: 1, name: "Color", price: 1200, type: "Red" },
    { id: 2, name: "Size", price: 1100, type: "S" },
  ]);

  /* ================= IMAGE HANDLERS ================= */

  const addImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setProduct((p) => ({ ...p, images: [...p.images, url] }));
  };

  const removeImage = (index: number) => {
    const updated = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updated });
    setImageIndex(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button className="px-3 py-2 rounded-xl border hover:bg-(--muted)">
            ← Back
          </button>

          <h1 className="text-3xl font-bold">{product.name}</h1>
        </div>

        {/* Right side */}
        <ThemeToggle />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* ================= IMAGE GALLERY ================= */}
        <div>
          <div className="relative">
            <Image
              src={product.images[imageIndex]}
              alt={product.name + " image"}
              width={800}
              height={520}
              className="w-full h-130 object-cover rounded-3xl border"
              style={{ objectFit: "cover" }}
            />

            {/* Slide controls */}
            <button
              onClick={() =>
                setImageIndex((i) =>
                  i === 0 ? product.images.length - 1 : i - 1,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() =>
                setImageIndex((i) =>
                  i === product.images.length - 1 ? 0 : i + 1,
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow"
            >
              <ChevronRight />
            </button>

            {/* Delete image */}
            <button
              onClick={() => removeImage(imageIndex)}
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Thumbnails + Add */}
          <div className="flex gap-4 mt-6 flex-wrap">
            {product.images.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${product.name} thumbnail ${i + 1}`}
                onClick={() => setImageIndex(i)}
                width={96}
                height={96}
                className={`w-24 h-24 object-cover rounded-xl cursor-pointer border
                  ${imageIndex === i ? "ring-2 ring-blue-500" : ""}
                `}
              />
            ))}

            {/* Add Image */}
            <button
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-xl border-2 border-dashed flex items-center justify-center hover:bg-(--muted)"
            >
              <Plus />
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

        {/* ================= PRODUCT INFO ================= */}
        <div className="space-y-8">
          <EditableField
            label="Product Name"
            value={product.name}
            onSave={(v) => setProduct({ ...product, name: String(v) })}
          />

          <EditableField
            label="SKU"
            value={product.sku}
            onSave={(v) => setProduct({ ...product, sku: String(v) })}
          />

          <EditableField
            label="Base Price"
            value={product.base_price}
            prefix="৳ "
            onSave={(v) => setProduct({ ...product, base_price: Number(v) })}
          />

          <EditableField
            label="Stock"
            value={product.stock}
            onSave={(v) => setProduct({ ...product, stock: Number(v) })}
          />

          {/* ================= VARIANTS ================= */}
          <div className="rounded-2xl border p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Variants</h2>
              <button
                onClick={() => setShowVariantDrawer(true)}
                className="btn-primary"
              >
                + Add Variant
              </button>
            </div>

            {variants.map((v) => (
              <div
                key={v.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-medium text-lg">
                    {v.name}-{v.type}
                  </p>
                  <p className="text-sm text-(--muted)">৳ {v.price}</p>
                </div>

                <button
                  onClick={() => {
                    setEditingVariant(v);
                    setShowVariantDrawer(true);
                  }}
                  className="p-2 rounded-lg hover:bg-(--muted)"
                >
                  <Pencil size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variant Drawer */}
      <Drawer
        open={showVariantDrawer}
        onClose={() => {
          setShowVariantDrawer(false);
          setEditingVariant(null);
        }}
      >
        <VariantForm
          variant={editingVariant ?? undefined}
          onSave={(data: Omit<Variant, "id">) => {
            if (editingVariant) {
              // UPDATE
              setVariants((prev) =>
                prev.map((v) =>
                  v.id === editingVariant.id ? { ...v, ...data } : v,
                ),
              );
            } else {
              // CREATE
              setVariants((prev) => [...prev, { ...data, id: Date.now() }]);
            }

            setShowVariantDrawer(false);
            setEditingVariant(null);
          }}
        />
      </Drawer>
    </div>
  );
}
type EditableFieldProps = {
  label: string;
  value: string | number;
  prefix?: string;
  onSave: (value: string | number) => void;
};

function EditableField({
  label,
  value,
  prefix = "",
  onSave,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  return (
    <div>
      <label className="text-sm text-(--muted)">{label}</label>

      {editing ? (
        <div className="flex gap-3 mt-2">
          <input
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border"
          />
          <button
            onClick={() => {
              onSave(temp);
              setEditing(false);
            }}
            className="btn-primary"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mt-2">
          <p className="text-2xl font-medium">
            {prefix}
            {value}
          </p>
          <button onClick={() => setEditing(true)}>
            <Pencil />
          </button>
        </div>
      )}
    </div>
  );
}
