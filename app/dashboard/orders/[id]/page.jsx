"use client";

import { useMemo, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
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
  Package,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";

const PAGE_SIZE = 5;

const MOCK_VARIANTS = [
  { id: 1, name: "Red / Large", price: 1200, product_id: 1 },
  { id: 2, name: "Blue / Medium", price: 1100, product_id: 1 },
  { id: 3, name: "Black / Small", price: 1000, product_id: 1 },
];

const Mockproducts = [
  { id: 1, name: "T-Shirt", category: "Clothing" },
  { id: 2, name: "Wireless Mouse", category: "Electronics" },
  { id: 3, name: "Bluetooth Headphones", category: "Electronics" },
];

// Mock customers data
const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "01700000000",
    address: "123 Main Street, Dhaka, Bangladesh",
    totalOrders: 42,
    totalSpent: 125800,
    joinDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "01711111111",
    address: "456 Park Avenue, Chittagong, Bangladesh",
    totalOrders: 28,
    totalSpent: 84500,
    joinDate: "2024-02-20",
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "01722222222",
    address: "789 Market Road, Sylhet, Bangladesh",
    totalOrders: 15,
    totalSpent: 36500,
    joinDate: "2024-03-10",
    status: "active",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    phone: "01733333333",
    address: "321 Garden Lane, Rajshahi, Bangladesh",
    totalOrders: 8,
    totalSpent: 19200,
    joinDate: "2024-04-05",
    status: "inactive",
  },
];

// Order status options with colors
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
    icon: Clock,
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
    icon: XCircle,
  },
  {
    value: "refunded",
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    icon: XCircle,
  },
];

// Payment methods
const PAYMENT_METHODS = [
  { value: "cash", label: "Cash on Delivery" },
  { value: "card", label: "Credit/Debit Card" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "bank", label: "Bank Transfer" },
];

export default function OrderDetailPage() {
  const [customerId, setCustomerId] = useState("1");
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
  const [showItemDrawer, setShowItemDrawer] = useState(false);

  // Order info state
  const [orderStatus, setOrderStatus] = useState("pending");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState("pending");

  const [isEditingOrderInfo, setIsEditingOrderInfo] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-18",
    shippingAddress: "",
    paymentMethod: "cash",
    notes: "",
    shippingFee: 100,
    taxRate: 15,
  });

  // Get selected customer
  const selectedCustomer =
    MOCK_CUSTOMERS.find((c) => c.id === customerId) || MOCK_CUSTOMERS[0];

  // Calculate totals
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
  const StatusIcon = currentStatus.icon;

  // Get payment method label
  const paymentMethodLabel =
    PAYMENT_METHODS.find((p) => p.value === orderInfo.paymentMethod)?.label ||
    "Cash on Delivery";

  // Calculate order totals
  const subtotal = totalAmount;
  const shipping = orderInfo.shippingFee;
  const tax = subtotal * (orderInfo.taxRate / 100);
  const grandTotal = subtotal + shipping + tax;

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
  };

  const handleStatusCancel = () => {
    setIsEditingStatus(false);
  };

  const handleOrderInfoEdit = () => {
    setIsEditingOrderInfo(true);
  };

  const handleOrderInfoSave = () => {
    setIsEditingOrderInfo(false);
  };

  const handleOrderInfoCancel = () => {
    setIsEditingOrderInfo(false);
  };

  const handleCustomerChange = (customerId) => {
    setCustomerId(customerId);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (customer) {
      setOrderInfo((prev) => ({
        ...prev,
        shippingAddress: customer.address,
      }));
    }
  };

  // Field styling
  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

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
                  className="px-3 py-2 border rounded-lg bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleStatusSave}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition"
                  title="Save Status"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleStatusCancel}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                  title="Cancel"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus.color}`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {currentStatus.label}
                </span>
                <button
                  onClick={handleStatusEdit}
                  className="p-1.5 text-(--muted) hover:text-(--text) hover:bg-(--muted/10) rounded-lg transition"
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

      {/* ================= CUSTOMER CARD WITH SELECT ================= */}
      <div className="rounded-2xl border p-8 bg-(--card) shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Basic Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <User className="h-6 w-6" />
                  Customer
                </h2>
              </div>
            </div>

            {/* Customer Select Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2 text-(--muted)">
                Select Customer
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                <select
                  value={customerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className={`${fieldClass} pl-10`}
                >
                  {MOCK_CUSTOMERS.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} • {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-(--muted)" />
                <div>
                  <p className="text-sm text-(--muted)">Name</p>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-(--muted)" />
                <div>
                  <p className="text-sm text-(--muted)">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-(--muted)" />
                <div>
                  <p className="text-sm text-(--muted)">Phone</p>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-(--muted) mt-1" />
                <div>
                  <p className="text-sm text-(--muted)">Address</p>
                  <p className="font-medium">{selectedCustomer.address}</p>
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
                    {selectedCustomer.totalOrders}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-(--muted/5)">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Total Spent</p>
                  </div>
                  <p className="text-2xl font-bold">
                    ৳ {selectedCustomer.totalSpent.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-(--muted/5) col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Customer Since</p>
                  </div>
                  <p className="text-xl font-medium">
                    {selectedCustomer.joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Status */}
            <div className="rounded-xl border p-4 bg-(--muted/5)">
              <p className="text-sm text-(--muted) mb-2">Customer Status</p>
              <div
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedCustomer.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedCustomer.status === "active" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active Customer
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Inactive Customer
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDITABLE ORDER INFO CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Details Card - Now Editable */}
        <div className="rounded-2xl border p-6 bg-(--card) md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Information
            </h2>

            {isEditingOrderInfo ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOrderInfoSave}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Check className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleOrderInfoCancel}
                  className="flex items-center gap-1 px-3 py-2 border border-(--border) rounded-lg hover:bg-(--muted/10) transition"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleOrderInfoEdit}
                className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
              >
                <Edit className="h-4 w-4" />
                Edit Info
              </button>
            )}
          </div>

          {isEditingOrderInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Order Date
                  </label>
                  <input
                    type="date"
                    value={orderInfo.orderDate}
                    onChange={(e) =>
                      setOrderInfo({ ...orderInfo, orderDate: e.target.value })
                    }
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Expected Delivery
                  </label>
                  <input
                    type="date"
                    value={orderInfo.expectedDelivery}
                    onChange={(e) =>
                      setOrderInfo({
                        ...orderInfo,
                        expectedDelivery: e.target.value,
                      })
                    }
                    className={fieldClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Delivery Address
                  </label>
                  <textarea
                    value={
                      orderInfo.shippingAddress || selectedCustomer.address
                    }
                    onChange={(e) =>
                      setOrderInfo({
                        ...orderInfo,
                        shippingAddress: e.target.value,
                      })
                    }
                    rows="2"
                    className={fieldClass}
                    placeholder="Enter delivery address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() =>
                          setOrderInfo({
                            ...orderInfo,
                            paymentMethod: method.value,
                          })
                        }
                        className={`p-3 rounded-xl border text-center transition ${
                          orderInfo.paymentMethod === method.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-(--border) hover:bg-(--muted/5)"
                        }`}
                      >
                        <span className="text-sm">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Notes
                  </label>
                  <textarea
                    value={orderInfo.notes}
                    onChange={(e) =>
                      setOrderInfo({ ...orderInfo, notes: e.target.value })
                    }
                    rows="2"
                    className={fieldClass}
                    placeholder="Add any special instructions or notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Shipping Fee (৳)
                  </label>
                  <input
                    type="number"
                    value={orderInfo.shippingFee}
                    onChange={(e) =>
                      setOrderInfo({
                        ...orderInfo,
                        shippingFee: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={fieldClass}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={orderInfo.taxRate}
                    onChange={(e) =>
                      setOrderInfo({
                        ...orderInfo,
                        taxRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className={fieldClass}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-(--muted)">Order Date</p>
                  <p className="font-medium">{orderInfo.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-(--muted)">Expected Delivery</p>
                  <p className="font-medium">{orderInfo.expectedDelivery}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-(--muted)">Delivery Address</p>
                  <p className="font-medium">
                    {orderInfo.shippingAddress || selectedCustomer.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-(--muted)">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-(--muted)" />
                    <p className="font-medium">{paymentMethodLabel}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-(--muted)">Shipping Fee</p>
                  <p className="font-medium">
                    ৳ {orderInfo.shippingFee.toFixed(2)}
                  </p>
                </div>
              </div>
              {orderInfo.notes && (
                <div>
                  <p className="text-sm text-(--muted)">Notes</p>
                  <p className="font-medium">{orderInfo.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="rounded-2xl border p-6 bg-(--card)">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-(--muted)">Items</span>
              <span className="font-medium">{items.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--muted)">Subtotal</span>
              <span className="font-medium">৳ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--muted)">Shipping</span>
              <span className="font-medium">৳ {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--muted)">Tax ({orderInfo.taxRate}%)</span>
              <span className="font-medium">৳ {tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>৳ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          {(isEditingOrderInfo || isEditingStatus) && (
            <button className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              Save All Changes
            </button>
          )}
        </div>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="rounded-2xl border p-6 bg-(--card)">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Order Items</h2>
          <button
            onClick={() => setShowItemDrawer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Edit className="h-4 w-4" />+ Add Item
          </button>
        </div>

        {paginatedItems.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-(--muted) mb-4" />
            <p className="text-(--muted)">No items added</p>
            <p className="text-sm text-(--muted) mt-1">
              Click <b>+ Add Item</b> to add products to this order
            </p>
          </div>
        )}

        <div className="space-y-3">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 rounded-xl border hover:bg-(--muted/5) transition"
            >
              <div>
                <p className="font-medium">
                  {item.product_name} ({item.variant_name})
                </p>
                <p className="text-sm text-(--muted)">
                  ৳ {item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold">
                  ৳ {(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                >
                  <X className="h-4 w-4" />
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
                className="px-3 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= DRAWER ================= */}
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

// Drawer Component
function Drawer({ open, onClose, children }) {
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
          <h3 className="text-lg font-semibold">Add Order Item</h3>
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
