"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  ShoppingBag,
  X,
  Plus,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock Data
const MOCK_VARIANTS = [
  { id: 1, name: "Red / Large", price: 1200, product_id: 1, sku: "RED-L" },
  { id: 2, name: "Blue / Medium", price: 1100, product_id: 1, sku: "BLUE-M" },
  { id: 3, name: "Black / Small", price: 1000, product_id: 1, sku: "BLACK-S" },
  { id: 4, name: "White / Large", price: 1300, product_id: 2, sku: "WHITE-L" },
  { id: 5, name: "Gray / Medium", price: 1150, product_id: 2, sku: "GRAY-M" },
];

const MOCK_PRODUCTS = [
  { id: 1, name: "T-Shirt", category: "Clothing" },
  { id: 2, name: "Hoodie", category: "Clothing" },
];

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: "John Doe",
    phone: "01712345678",
    email: "john@example.com",
    address: "123 Main Street, Dhaka",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "01798765432",
    email: "jane@example.com",
    address: "456 Park Avenue, Chittagong",
  },
];

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: X,
  },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash on Delivery" },
  { value: "card", label: "Credit/Debit Card" },
];

export default function AddOrderPage() {
  const router = useRouter();

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("pending");
  const [showItemDrawer, setShowItemDrawer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [itemIdCounter, setItemIdCounter] = useState(0);

  const selectedCustomer =
    MOCK_CUSTOMERS.find((c) => c.id.toString() === customerId) || null;
  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  const StatusIcon = currentStatus.icon;

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );
  const shippingFee = 100;
  const taxRate = 15;
  const tax = totalAmount * (taxRate / 100);
  const grandTotal = totalAmount + shippingFee + tax;

  const addItem = (item) => {
    const newItem = { ...item, id: itemIdCounter, quantity: 1 };
    setItems([...items, newItem]);
    setItemIdCounter(itemIdCounter + 1);
    setShowItemDrawer(false);
  };
  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setItems(items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ customerId, items, status, paymentMethod, notes });
    router.push("/orders");
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-card dark:bg-gray-800 text-foreground dark:text-(--muted) border-border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary transition";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Create New Order</h1>
          <p className="text-sm text-muted mt-1">
            Add products and customer details
          </p>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-(--muted)">
              Select Customer
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className={fieldClass}
            >
              <option value="">Choose Customer</option>
              {MOCK_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} • {c.phone}
                </option>
              ))}
            </select>
            {selectedCustomer && (
              <div className="p-3 rounded-xl border dark:border-gray-700 bg-muted/5 space-y-1">
                <p className="font-semibold">{selectedCustomer.name}</p>
                <p className="text-sm">{selectedCustomer.email}</p>
                <p className="text-sm">{selectedCustomer.address}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-(--muted)">
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={fieldClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${currentStatus.color}`}
            >
              <StatusIcon className="h-4 w-4" />
              <span>{currentStatus.label}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Order Items
            </h2>
            <button
              type="button"
              onClick={() => setShowItemDrawer(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" /> Add Item
            </button>
          </div>
          {items.length === 0 ? (
            <p className="text-center text-muted py-4">No items added yet</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 border rounded-xl dark:border-gray-700 bg-card dark:bg-gray-800"
                >
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted">{item.variant_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border rounded hover:bg-muted/5"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded hover:bg-muted/5"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={fieldClass}
            placeholder="Add notes or instructions..."
          />
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => setPaymentMethod(p.value)}
                className={`p-2 border rounded-xl ${paymentMethod === p.value ? "bg-blue-600 text-white border-blue-600" : "bg-card dark:bg-gray-800 border-border dark:border-gray-700 hover:bg-muted/5"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4 border rounded-xl dark:border-gray-700 bg-card dark:bg-gray-800 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳ {totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>৳ {shippingFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>৳ {tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>৳ {grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
          >
            Create Order
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 border rounded-xl hover:bg-muted/5"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Drawer */}
      {showItemDrawer && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-full max-w-md bg-card p-6 h-full overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Product</h2>
              <button onClick={() => setShowItemDrawer(false)}>
                <X />
              </button>
            </div>

            {MOCK_PRODUCTS.map((product) => (
              <div key={product.id} className="space-y-2 mb-4">
                <p className="font-medium">{product.name}</p>
                {MOCK_VARIANTS.filter((v) => v.product_id === product.id).map(
                  (v) => (
                    <div
                      key={v.id}
                      className="flex justify-between items-center p-2 bg-muted/5 rounded-lg"
                    >
                      <div>
                        <p className="text-sm">{v.name}</p>
                        <p className="text-xs text-muted">৳ {v.price}</p>
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            product_name: product.name,
                            variant_name: v.name,
                            price: v.price,
                          })
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
