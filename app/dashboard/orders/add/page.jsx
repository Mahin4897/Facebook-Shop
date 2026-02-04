"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  UserPlus,
  ShoppingBag,
  Package,
  DollarSign,
  X,
  Plus,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
  Edit,
  Check,
  ChevronDown,
} from "lucide-react";

/* -------------------- MOCK DATA -------------------- */
const MOCK_VARIANTS = [
  { id: 1, name: "Red / Large", price: 1200, product_id: 1, sku: "RED-L" },
  { id: 2, name: "Blue / Medium", price: 1100, product_id: 1, sku: "BLUE-M" },
  { id: 3, name: "Black / Small", price: 1000, product_id: 1, sku: "BLACK-S" },
  { id: 4, name: "White / Large", price: 1300, product_id: 2, sku: "WHITE-L" },
  { id: 5, name: "Gray / Medium", price: 1150, product_id: 2, sku: "GRAY-M" },
];

const MOCK_PRODUCTS = [
  { id: 1, name: "T-Shirt" },
  { id: 2, name: "Hoodie" },
];

const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "John Doe",
    phone: "01712345678",
    address: "123 Main Street, Dhaka",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "01798765432",
    address: "456 Park Avenue, Chittagong",
    email: "jane@example.com",
  },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", icon: Clock },
  { value: "processing", label: "Processing", icon: AlertCircle },
  { value: "shipped", label: "Shipped", icon: Truck },
  { value: "delivered", label: "Delivered", icon: CheckCircle },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash on Delivery" },
  { value: "card", label: "Card" },
  { value: "bkash", label: "bKash" },
];

/* -------------------- COMPONENT -------------------- */
export default function AddOrderPage() {
  const router = useRouter();

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("pending");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [showItemDrawer, setShowItemDrawer] = useState(false);

  const [orderInfo, setOrderInfo] = useState({
    orderDate: new Date().toISOString().split("T")[0],
    expectedDelivery: "",
    shippingAddress: "",
    shippingFee: 100,
    taxRate: 15,
  });

  /* -------------------- STYLES -------------------- */
  const inputBase =
    "w-full px-4 py-3 rounded-xl border bg-card text-[color:var(--text)] " +
    "border-[color:var(--border)] focus:outline-none focus:ring-2 " +
    "focus:ring-blue-500 transition";

  const selectWrap = "relative";
  const selectClass = `${inputBase} appearance-none pr-10`;

  const dateClass = `${inputBase} dark:[color-scheme:dark]`;

  /* -------------------- LOGIC -------------------- */
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const tax = subtotal * (orderInfo.taxRate / 100);
  const total = subtotal + tax + orderInfo.shippingFee;

  const selectedCustomer =
    MOCK_CUSTOMERS.find((c) => c.id === customerId) || null;

  const addItem = (data) => {
    setItems([...items, { ...data, id: crypto.randomUUID(), quantity: 1 }]);
    setShowItemDrawer(false);
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Order</h1>
        <ThemeToggle />
      </div>

      {/* CUSTOMER */}
      <div className="bg-card rounded-2xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Customer
        </h2>

        <div className={selectWrap}>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className={selectClass}
          >
            <option value="">Select customer</option>
            {MOCK_CUSTOMERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} • {c.phone}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>

        {selectedCustomer && (
          <div className="bg-muted/10 p-4 rounded-xl text-sm">
            <p className="font-medium">{selectedCustomer.name}</p>
            <p>{selectedCustomer.email}</p>
            <p>{selectedCustomer.address}</p>
          </div>
        )}
      </div>

      {/* ORDER INFO */}
      <div className="bg-card rounded-2xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Order Info
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted">Order Date</label>
            <input
              type="date"
              className={dateClass}
              value={orderInfo.orderDate}
              onChange={(e) =>
                setOrderInfo({ ...orderInfo, orderDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm text-muted">Expected Delivery</label>
            <input
              type="date"
              className={dateClass}
              value={orderInfo.expectedDelivery}
              onChange={(e) =>
                setOrderInfo({
                  ...orderInfo,
                  expectedDelivery: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-card rounded-2xl p-6 shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> Items
          </h2>
          <button
            onClick={() => setShowItemDrawer(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Add Item
          </button>
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="
          flex justify-between items-center
          p-3 rounded-xl
          bg-muted/5
          border border-theme
        "
              >
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-sm text-muted">{item.variant_name}</p>
                  <p className="text-sm text-muted">৳ {item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                            : i,
                        ),
                      )
                    }
                    className="px-2 py-1 border rounded-lg"
                  >
                    −
                  </button>

                  <span className="min-w-[24px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) =>
                        prev.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: i.quantity + 1 }
                            : i,
                        ),
                      )
                    }
                    className="px-2 py-1 border rounded-lg"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setItems((prev) => prev.filter((i) => i.id !== item.id))
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="bg-card rounded-2xl p-6 shadow space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5" /> Summary
        </h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>৳ {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>৳ {tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Total</span>
          <span>৳ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* ITEM DRAWER */}
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
