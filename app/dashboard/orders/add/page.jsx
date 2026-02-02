"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  UserPlus,
  ShoppingBag,
  Package,
  DollarSign,
  Hash,
  X,
  Plus,
  Save,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  CreditCard,
  Edit,
  Check,
} from "lucide-react";

// Mock data
const MOCK_VARIANTS = [
  { id: 1, name: "Red / Large", price: 1200, product_id: 1, sku: "RED-L" },
  { id: 2, name: "Blue / Medium", price: 1100, product_id: 1, sku: "BLUE-M" },
  { id: 3, name: "Black / Small", price: 1000, product_id: 1, sku: "BLACK-S" },
  { id: 4, name: "White / Large", price: 1300, product_id: 2, sku: "WHITE-L" },
  { id: 5, name: "Gray / Medium", price: 1150, product_id: 2, sku: "GRAY-M" },
];

const Mockproducts = [
  { id: 1, name: "T-Shirt", category: "Clothing" },
  { id: 2, name: "Hoodie", category: "Clothing" },
  { id: 3, name: "Wireless Mouse", category: "Electronics" },
  { id: 4, name: "Keyboard", category: "Electronics" },
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
  {
    id: "3",
    name: "Bob Johnson",
    phone: "01755556666",
    address: "789 Market Road, Sylhet",
    email: "bob@example.com",
  },
  {
    id: "4",
    name: "Alice Williams",
    phone: "01788889999",
    address: "321 Garden Lane, Rajshahi",
    email: "alice@example.com",
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
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "bank", label: "Bank Transfer" },
];

export default function AddOrderPage() {
  const router = useRouter();

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("pending");
  const [showItemDrawer, setShowItemDrawer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  // Order info state
  const [isEditingOrderInfo, setIsEditingOrderInfo] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    orderDate: new Date().toISOString().split("T")[0], // Today's date
    expectedDelivery: "",
    shippingAddress: "",
    shippingFee: 100,
    taxRate: 15,
  });

  /** Total calculation */
  const totalAmount = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const subtotal = totalAmount;
  const shipping = orderInfo.shippingFee;
  const tax = subtotal * (orderInfo.taxRate / 100);
  const grandTotal = subtotal + shipping + tax;

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setItems([...items, newItem]);
    setShowItemDrawer(false);
  };

  const removeItem = (itemId) => {
    setItems(items.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const selectedCustomer =
    MOCK_CUSTOMERS.find((c) => c.id === customerId) || null;
  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  const StatusIcon = currentStatus.icon;

  // Handle customer change
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

  // Calculate expected delivery (3 days from order date by default)
  const calculateExpectedDelivery = (date) => {
    if (!date) return "";
    const deliveryDate = new Date(date);
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    return deliveryDate.toISOString().split("T")[0];
  };

  // Update expected delivery when order date changes
  const handleOrderDateChange = (date) => {
    setOrderInfo((prev) => ({
      ...prev,
      orderDate: date,
      expectedDelivery: date ? calculateExpectedDelivery(date) : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real app, you would submit to your API here
    const orderData = {
      customerId,
      customer: selectedCustomer,
      items,
      status,
      paymentMethod,
      notes,
      orderInfo,
      totals: {
        subtotal,
        shipping,
        tax,
        grandTotal,
      },
    };

    console.log("Order data:", orderData);

    // Redirect to orders page after successful creation
    router.push("/orders?success=true");
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  const handleOrderInfoEdit = () => {
    setIsEditingOrderInfo(true);
  };

  const handleOrderInfoSave = () => {
    setIsEditingOrderInfo(false);
  };

  const handleOrderInfoCancel = () => {
    setIsEditingOrderInfo(false);
  };

  // Get payment method label
  const paymentMethodLabel =
    PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.label ||
    "Cash on Delivery";

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Create New Order</h1>
          <p className="text-sm text-(--muted) mt-1">
            Add products and customer details
          </p>
        </div>
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer & Order Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Card */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Customer Information
                </h2>
                <button
                  type="button"
                  onClick={() => router.push("/customers/add")}
                  className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
                >
                  <Plus className="h-4 w-4" />
                  New Customer
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-(--muted)">
                    Select Customer *
                  </label>
                  <select
                    value={customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    required
                    className={fieldClass}
                  >
                    <option value="">Choose a customer...</option>
                    {MOCK_CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} • {c.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCustomer && (
                  <div className="p-4 rounded-xl border bg-(--muted/5) space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {selectedCustomer.name}
                        </h3>
                        <p className="text-sm text-(--muted)">
                          {selectedCustomer.email}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Regular Customer
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-(--muted)">Phone</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="text-(--muted)">Orders</p>
                        <p className="font-medium">12 orders</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-(--muted)">Address</p>
                      <p className="font-medium">{selectedCustomer.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Information Card */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Order Information
                </h2>

                {isEditingOrderInfo ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOrderInfoSave}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Check className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleOrderInfoCancel}
                      className="flex items-center gap-1 px-3 py-2 border border-(--border) rounded-lg hover:bg-(--muted/10) transition"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
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
                    {/* Order Date */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-(--muted)">
                        Order Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                        <input
                          type="date"
                          value={orderInfo.orderDate}
                          onChange={(e) =>
                            handleOrderDateChange(e.target.value)
                          }
                          required
                          className={`${fieldClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Expected Delivery */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-(--muted)">
                        Expected Delivery
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                        <input
                          type="date"
                          value={orderInfo.expectedDelivery}
                          onChange={(e) =>
                            setOrderInfo({
                              ...orderInfo,
                              expectedDelivery: e.target.value,
                            })
                          }
                          className={`${fieldClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-(--muted)">
                        Shipping Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-4 h-5 w-5 text-(--muted)" />
                        <textarea
                          value={
                            orderInfo.shippingAddress ||
                            selectedCustomer?.address ||
                            ""
                          }
                          onChange={(e) =>
                            setOrderInfo({
                              ...orderInfo,
                              shippingAddress: e.target.value,
                            })
                          }
                          rows="2"
                          className={`${fieldClass} pl-10`}
                          placeholder="Enter shipping address"
                        />
                      </div>
                    </div>

                    {/* Shipping Fee */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-(--muted)">
                        Shipping Fee (৳)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={orderInfo.shippingFee}
                          onChange={(e) =>
                            setOrderInfo({
                              ...orderInfo,
                              shippingFee: parseFloat(e.target.value) || 0,
                            })
                          }
                          className={`${fieldClass} pl-10`}
                        />
                      </div>
                    </div>

                    {/* Tax Rate */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-(--muted)">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={orderInfo.taxRate}
                        onChange={(e) =>
                          setOrderInfo({
                            ...orderInfo,
                            taxRate: parseFloat(e.target.value) || 0,
                          })
                        }
                        className={fieldClass}
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
                      <p className="text-sm text-(--muted)">
                        Expected Delivery
                      </p>
                      <p className="font-medium">
                        {orderInfo.expectedDelivery || "Not set"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-(--muted)">Shipping Address</p>
                      <p className="font-medium">
                        {orderInfo.shippingAddress ||
                          selectedCustomer?.address ||
                          "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-(--muted)">Shipping Fee</p>
                      <p className="font-medium">
                        ৳ {orderInfo.shippingFee.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-(--muted)">Tax Rate</p>
                      <p className="font-medium">{orderInfo.taxRate}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Card */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items
                </h2>
                <button
                  type="button"
                  onClick={() => setShowItemDrawer(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-(--muted) mb-4" />
                  <p className="text-(--muted)">No items added yet</p>
                  <p className="text-sm text-(--muted) mt-1">
                    Click <b>Add Item</b> to start building your order
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl border hover:bg-(--muted/5) transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-(--muted)">
                            {item.variant_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium">
                              ৳ {item.price}
                            </span>
                            <Hash className="h-3 w-3 text-(--muted)" />
                            <span className="text-sm text-(--muted)">
                              SKU: {item.sku || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-(--muted/10)"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-(--muted/10)"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            ৳ {item.price * item.quantity}
                          </p>
                          <p className="text-sm text-(--muted)">
                            ৳ {item.price} × {item.quantity}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className={fieldClass}
                placeholder="Add any special instructions or notes for this order..."
              />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-8">
            {/* Order Status */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <StatusIcon className="h-5 w-5" />
                Order Status
              </h2>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={fieldClass}
              >
                {STATUS_OPTIONS.map((status) => {
                  return (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  );
                })}
              </select>
              <div
                className={`mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg ${currentStatus.color}`}
              >
                <StatusIcon className="h-4 w-4" />
                <span className="font-medium">{currentStatus.label}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-xl border text-center transition ${
                      paymentMethod === method.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-(--border) hover:bg-(--muted/5)"
                    }`}
                  >
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-(--muted) mt-3">
                Selected:{" "}
                <span className="font-medium">{paymentMethodLabel}</span>
              </p>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border p-6 bg-(--card)">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-(--muted)">Subtotal</span>
                  <span>৳ {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-(--muted)">Shipping</span>
                  <span>৳ {shipping.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-(--muted)">
                    Tax ({orderInfo.taxRate}%)
                  </span>
                  <span>৳ {tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>৳ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary Stats */}
              <div className="mt-6 p-4 rounded-xl border bg-(--muted/5) space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-(--muted)">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-(--muted)">Total Quantity</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-(--muted)">
                    Avg. Price per Item
                  </span>
                  <span className="font-medium">
                    ৳{" "}
                    {items.length > 0
                      ? (
                          subtotal /
                          items.reduce((sum, item) => sum + item.quantity, 0)
                        ).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="submit"
                  disabled={items.length === 0 || !customerId}
                  className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Create Order
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Item Drawer */}
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
          <h3 className="text-lg font-semibold">Add Product</h3>
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

// OrderItemForm Component
function OrderItemForm({ products = [], variants = [], onAdd }) {
  const [productId, setProductId] = useState("");
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const filteredVariants = variants.filter(
    (v) => v.product_id.toString() === productId.toString(),
  );

  const selectedProduct = products.find(
    (p) => p.id.toString() === productId.toString(),
  );

  const handleAdd = () => {
    if (!variant || !productId) return;

    onAdd({
      product_id: productId,
      product_name: selectedProduct?.name || "",
      variant_id: variant.id,
      variant_name: variant.name,
      sku: variant.sku,
      price: variant.price,
      quantity: quantity,
    });

    // Reset form
    setProductId("");
    setVariant(null);
    setQuantity(1);
  };

  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="space-y-6">
      {/* Product Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          Product *
        </label>
        <select
          className={fieldClass}
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setVariant(null);
          }}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} {p.category ? `(${p.category})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Variant Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          Variant *
        </label>
        <select
          disabled={!productId}
          className={`${fieldClass} ${!productId ? "opacity-50 cursor-not-allowed" : ""}`}
          value={variant?.id || ""}
          onChange={(e) => {
            const selectedVariant = filteredVariants.find(
              (v) => v.id.toString() === e.target.value,
            );
            setVariant(selectedVariant || null);
          }}
        >
          <option value="">Select Variant</option>
          {filteredVariants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} • ৳ {v.price} • SKU: {v.sku}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium mb-2 text-(--muted)">
          Quantity *
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-(--muted/10)"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="flex-1 px-4 py-2 rounded-xl border text-center"
          />
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-10 w-10 rounded-xl border flex items-center justify-center hover:bg-(--muted/10)"
          >
            +
          </button>
        </div>
      </div>

      {/* Price Summary */}
      {variant && (
        <div className="p-4 rounded-xl border space-y-2">
          <div className="flex justify-between">
            <span className="text-(--muted)">Unit Price</span>
            <span className="font-medium">
              ৳ {variant.price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--muted)">Quantity</span>
            <span className="font-medium">{quantity}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span className="text-lg">
                ৳ {(variant.price * quantity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        disabled={!variant || !productId}
        onClick={handleAdd}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add to Order
      </button>
    </div>
  );
}
