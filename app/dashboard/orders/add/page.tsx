"use client";

import { useState, useMemo } from "react";
import { v4 as uuid } from "uuid";

const MOCK_VARIANTS = [
  { id: 1, name: "Red / Large", price: 1200 , product_id:1, sku: "RED-L" },
  { id: 2, name: "Blue / Medium", price: 1100, product_id:1, sku: "BLUE-M" },
];
const Mockproducts = [
  { id: 1, name: "T-Shirt" },
  { id: 2, name: "Hoodie" },
]



type Customer = {
  id: number;
  name: string;
  phone: string;
  address: string;
};


export default function AddOrderPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState("Pending");

  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [showItemDrawer, setShowItemDrawer] = useState(false);

  /** Total calculation */
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const addItem = (item: any) => {
    setItems([...items, { ...item, id: uuid() }]);
    setShowItemDrawer(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Order</h1>

      {/* Customer section */}
      <div className="rounded-2xl border p-6 bg-(--card)">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Customer</h2>
          <button
            onClick={() => setShowCustomerDrawer(true)}
            className="btn-primary"
          >
            {customer ? "Change" : "+ Add"} Customer
          </button>
        </div>

        {customer && (
          <div className="mt-4 text-sm">
            <p><b>{customer.name}</b></p>
            <p>{customer.phone}</p>
            <p>{customer.address}</p>
          </div>
        )}
      </div>

{/* Order items */}
<div className="rounded-2xl border p-6 bg-(--card)">
  <div className="flex justify-between items-center mb-3">
    <h2 className="font-semibold">Order Items</h2>
    <button
      onClick={() => setShowItemDrawer(true)}
      className="btn-primary"
    >
      + Add Item
    </button>
  </div>

  {items.length === 0 && (
    <p className="text-sm text-(--muted)">No items added</p>
  )}

  {items.map((item) => (
    <div
      key={item.id}
      className="flex justify-between items-center text-sm border-b py-2"
    >
      {/* Item info */}
      <span>
        {item!.product_name} ({item!.variant_name}) × {item.quantity}
      </span>

      {/* Price and remove button */}
      <div className="flex items-center gap-3">
        <span>৳ {item.price * item.quantity}</span>
        <button
          onClick={() =>
            setItems(items.filter((i) => i.id !== item.id))
          }
          className="text-red-600 hover:text-red-800 font-bold text-lg"
          title="Remove item"
        >
          &times; {/* This is a simple red cross */}
        </button>
      </div>
    </div>
  ))}
</div>


      {/* Total */}
      <div className="text-right text-lg font-bold">
        Total: ৳ {totalAmount}
      </div>

      <button className="w-full py-3 bg-green-600 text-white rounded-xl">
        Save Order
      </button>

      {/* ================= DRAWERS ================= */}

      {/* Customer Drawer */}
      <Drawer
        open={showCustomerDrawer}
        onClose={() => setShowCustomerDrawer(false)}
      >
        <CustomerForm
          onSave={(data: Customer) => {
            setCustomer(data);
            setShowCustomerDrawer(false);
          }}
        />
      </Drawer>

      {/* Item Drawer */}
      <Drawer
        open={showItemDrawer}
        onClose={() => setShowItemDrawer(false)}
      >
        <OrderItemForm onAdd={addItem} 
        products={Mockproducts}
        variants={MOCK_VARIANTS}/>
      </Drawer>
    </div>
  );
}
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Drawer({ open, onClose, children }: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-100 bg-(--card) p-6 shadow-xl overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

interface CustomerFormProps {
  onSave: (customer: Customer) => void;
}

function CustomerForm({ onSave }: CustomerFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Add Customer</h2>

      <input
        className="input"
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="input"
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <textarea
        className="input"
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <button
        onClick={() => onSave({ ...form, id: Date.now() })}
        className="w-full btn-primary"
      >
        Save Customer
      </button>
    </div>
  );
}
type Product = {
  id: number | string;
  name: string;
};

type Variant = {
  id: number | string;
  product_id: number | string;
  name: string;
  sku: string;
  price: number;
};

function OrderItemForm({
  products = [],
  variants = [],
  onAdd,
}: {
  products: Product[];
  variants: Variant[];
  onAdd: (item: any) => void;
}) {
  const [productId, setProductId] = useState< number | "">("");
  const [variant, setVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);

const filteredVariants = variants.filter(
  (v) => v.product_id === Number(productId)
);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Add Order Item</h2>

      {/* Product */}
      <div className="space-y-1">
        <label className="text-sm text-(--muted)">Product</label>
        <select
          className="
            w-full px-4 py-2.5 pr-10
            rounded-xl border border-(--border)
            bg-(--card) text-(--text)
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          value={productId}
          onChange={(e) => {
            setProductId(Number(e.target.value));
            setVariant(null);
          }}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Variant */}
      <div className="space-y-1">
        <label className="text-sm text-(--muted)">Variant</label>
        <select
          disabled={!productId}
          className="
            w-full px-4 py-2.5 pr-10
            rounded-xl border border-(--border)
            bg-(--card) text-(--text)
            disabled:opacity-50
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          value={variant?.id ?? ""}
          onChange={(e) => {
            const v = filteredVariants.find(
              (x) => x.id.toString() === e.target.value
            );
            setVariant(v || null);
          }}
        >
          <option value="">Select Variant</option>
          {filteredVariants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — ৳ {v.price}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div className="space-y-1">
        <label className="text-sm text-(--muted)">Quantity</label>
        <input
          type="number"
          min={1}
          className="
            w-full px-4 py-2.5
            rounded-xl border border-(--border)
            bg-(--card)
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      {/* Subtotal */}
      {variant && (
        <div className="text-sm font-medium">
          Subtotal: ৳ {variant.price * quantity}
        </div>
      )}

      {/* Add */}
   <button
  disabled={!variant || !productId}
  onClick={() => {
    const selectedProduct = products.find((p) => p.id === productId);

    onAdd({
      product_id: productId,
      product_name: selectedProduct?.name || "",
      variant_id: variant!.id,
      variant_name: variant!.name,
      price: variant!.price,
      quantity,
    });
  }}
  className="
    w-full py-2.5 rounded-xl
    bg-blue-600 text-white font-medium
    disabled:opacity-50
    hover:bg-blue-700 transition
  "
>
  Add Item
</button>
    </div>
  );
}
