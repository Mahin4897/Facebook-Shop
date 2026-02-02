"use client";

import { useMemo, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CustomerForm from "@/components/customers/CustomerForm";
import OrderItemForm from "@/components/orders/OrderItemForm";
import {
  X,
  Edit,
  Check,
  User,
  Phone,
  MapPin,
  Mail,
  ShoppingBag,
  DollarSign,
  Calendar,
} from "lucide-react";

const PAGE_SIZE = 5;

const MOCK_VARIANTS = [
  { id: 1, name: "Red / Large", price: 1200, product_id: 1 },
  { id: 2, name: "Blue / Medium", price: 1100, product_id: 1 },
  { id: 3, name: "Black / Small", price: 1000, product_id: 1 },
];
const Mockproducts = [
  {
    id: 1,
    name: "Wireless Mouse",
    sku: "WM-1001",
    price: 950,
    stock: 42,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    sku: "MK-2048",
    price: 5200,
    stock: 8,
  },
  {
    id: 3,
    name: "USB-C Fast Charger",
    sku: "UC-330W",
    price: 1800,
    stock: 0,
  },
  {
    id: 4,
    name: "Bluetooth Headphones",
    sku: "BH-7788",
    price: 3400,
    stock: 15,
  },
  {
    id: 5,
    name: "Laptop Stand (Aluminum)",
    sku: "LS-ALU-01",
    price: 2600,
    stock: 27,
  },
  { id: 6, name: "Webcam 1080p", sku: "WC-1080", price: 4100, stock: 6 },
  {
    id: 7,
    name: "Portable SSD 1TB",
    sku: "SSD-1TB-P",
    price: 12500,
    stock: 12,
  },
  { id: 8, name: "HDMI Cable 2m", sku: "HDMI-2M", price: 650, stock: 58 },
  {
    id: 9,
    name: "Noise Cancelling Earbuds",
    sku: "NC-EB-22",
    price: 6900,
    stock: 3,
  },
  {
    id: 10,
    name: "Smart Power Strip",
    sku: "SPS-06",
    price: 2300,
    stock: 19,
  },
  { id: 11, name: "Smart Speaker", sku: "SS-01", price: 4500, stock: 10 },
];

// Order status options with colors
const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
];

// Mock customer stats for the order page
const CUSTOMER_STATS = {
  totalOrders: 42,
  totalSpent: 125800,
  joinDate: "2024-01-15",
  status: "active",
};

export default function OrderDetailPage() {
  const [customer, setCustomer] = useState({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "01700000000",
    address: "Dhaka, Bangladesh",
  });

  const [items, setItems] = useState(
    Array.from({ length: 13 }).map((_, i) => ({
      id: 1 + i,
      product_name: "T-Shirt",
      variant_name: "Red / L",
      quantity: 1,
      price: 1200,
    })),
  );

  const [page, setPage] = useState(1);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [showItemDrawer, setShowItemDrawer] = useState(false);

  // Add order status state
  const [orderStatus, setOrderStatus] = useState("pending");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState("pending");

  /* ================= CALCULATIONS ================= */

  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  // Get current status details
  const currentStatus =
    STATUS_OPTIONS.find((opt) => opt.value === orderStatus) ||
    STATUS_OPTIONS[0];

  /* ================= ACTIONS ================= */

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addItem = (item) => {
    setItems((prev) => [
      ...prev,
      { ...item, id: Math.max(...prev.map((i) => i.id), 0) + 1 },
    ]);
    setShowItemDrawer(false);
  };

  const handleStatusEdit = () => {
    setTempStatus(orderStatus);
    setIsEditingStatus(true);
  };

  const handleStatusSave = () => {
    setOrderStatus(tempStatus);
    setIsEditingStatus(false);
    // In a real app, you would also save this to your backend
  };

  const handleStatusCancel = () => {
    setIsEditingStatus(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-(--muted)">Order #ORD-2024-001</span>

            {isEditingStatus ? (
              <div className="flex items-center gap-2">
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value)}
                  className="px-3 py-1 border rounded-md bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-(--primary)"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusSave}
                  className="p-1 text-green-600 hover:text-green-800"
                  title="Save Status"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleStatusCancel}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}
                >
                  {currentStatus.label}
                </span>
                <button
                  onClick={handleStatusEdit}
                  className="p-1 text-(--muted) hover:text-(--text)"
                  title="Edit Status"
                >
                  <Edit size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* ================= UPDATED CUSTOMER CARD ================= */}
      <div className="rounded-3xl border p-8 bg-(--card) shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Basic Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <User className="h-6 w-6" />
                  {customer.name}
                </h2>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    CUSTOMER_STATS.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {CUSTOMER_STATS.status.charAt(0).toUpperCase() +
                    CUSTOMER_STATS.status.slice(1)}
                </div>
              </div>
              <button
                onClick={() => setShowCustomerDrawer(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <Edit className="h-4 w-4" />
                Change Customer
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-(--muted)" />
                <div>
                  <p className="text-sm text-(--muted)">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-(--muted)" />
                <div>
                  <p className="text-sm text-(--muted)">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-(--muted) mt-1" />
                <div>
                  <p className="text-sm text-(--muted)">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Customer Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border p-4 bg-(--muted/5)">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Total Orders</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {CUSTOMER_STATS.totalOrders}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-(--muted/5)">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Total Spent</p>
                  </div>
                  <p className="text-2xl font-bold">
                    ৳ {CUSTOMER_STATS.totalSpent.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-(--muted/5) col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Customer Since</p>
                  </div>
                  <p className="text-xl font-medium">
                    {CUSTOMER_STATS.joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
                  View Profile
                </button>
                <button className="px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
                  Message
                </button>
                <button className="px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
                  History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER INFO CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Details Card */}
        <div className="rounded-3xl border p-6 bg-(--card) md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-(--muted)">Order Date</p>
              <p className="font-medium">Jan 15, 2024</p>
            </div>
            <div>
              <p className="text-sm text-(--muted)">Payment Method</p>
              <p className="font-medium">Cash on Delivery</p>
            </div>
            <div>
              <p className="text-sm text-(--muted)">Delivery Address</p>
              <p className="font-medium">{customer.address}</p>
            </div>
            <div>
              <p className="text-sm text-(--muted)">Expected Delivery</p>
              <p className="font-medium">Jan 18, 2024</p>
            </div>
          </div>
        </div>

        {/* Order Stats Card */}
        <div className="rounded-3xl border p-6 bg-(--card)">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-(--muted)">Items</span>
              <span>{items.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--muted)">Subtotal</span>
              <span>৳ {totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--muted)">Shipping</span>
              <span>৳ 100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--muted)">Tax</span>
              <span>৳ {(totalAmount * 0.15).toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>
                  ৳ {(totalAmount + 100 + totalAmount * 0.15).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="rounded-3xl border p-6 bg-(--card)">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Items</h2>
          <button
            onClick={() => setShowItemDrawer(true)}
            className="btn-primary"
          >
            + Add Item
          </button>
        </div>

        {paginatedItems.length === 0 && (
          <p className="text-sm text-(--muted)">No items added</p>
        )}

        <div className="space-y-3">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium">
                  {item.product_name} ({item.variant_name})
                </p>
                <p className="text-sm text-(--muted)">
                  ৳ {item.price} × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold">৳ {item.price * item.quantity}</p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-(--muted)">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= DRAWERS ================= */}

      <Drawer
        open={showCustomerDrawer}
        onClose={() => setShowCustomerDrawer(false)}
      >
        <CustomerForm
          onSave={(data) => {
            setCustomer(data);
            setShowCustomerDrawer(false);
          }}
        />
      </Drawer>

      <Drawer open={showItemDrawer} onClose={() => setShowItemDrawer(false)}>
        <OrderItemForm
          onAdd={addItem}
          products={Mockproducts}
          variants={MOCK_VARIANTS}
        />
      </Drawer>
    </div>
  );
}
