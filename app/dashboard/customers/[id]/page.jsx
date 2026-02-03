"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Package,
  ArrowRight,
  Edit,
  Save,
  X,
  Mail,
  ShoppingBag,
  DollarSign,
} from "lucide-react";

// Mock customer data
const MOCK_CUSTOMER = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "01700000000",
  address: "123 Main Street, Dhaka 1212, Bangladesh",
  joinDate: "2024-01-15",
  totalOrders: 42,
  totalSpent: 125800,
  status: "active",
};

// Mock orders data
const MOCK_ORDERS = Array.from({ length: 35 }).map((_, i) => ({
  id: `ORD-2024-${String(1000 + i).padStart(4, "0")}`,
  date: `2024-${String(Math.floor(i / 10) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  total: 1200 + i * 250,
  items: 1 + (i % 5),
  status: ["pending", "processing", "shipped", "delivered", "cancelled"][i % 5],
  paymentMethod: ["Cash", "Card", "bKash", "Nagad"][i % 4],
}));

// Status colors
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAGE_SIZE = 8;

export default function CustomerPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState(MOCK_CUSTOMER);
  const [orders] = useState(MOCK_ORDERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState({ ...MOCK_CUSTOMER });

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, currentPage]);

  const handleOrderClick = (orderId) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedCustomer({ ...customer });
  };

  const handleSaveClick = () => {
    setCustomer({ ...editedCustomer });
    setIsEditing(false);
    // In a real app, you would also send an API request to update the customer data
    console.log("Saving customer data:", editedCustomer);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedCustomer({ ...customer });
  };

  const handleInputChange = (field, value) => {
    setEditedCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusChange = (status) => {
    setEditedCustomer((prev) => ({
      ...prev,
      status,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Details</h1>
          <p className="text-sm text-(--muted) mt-1">
            View and manage customer information
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Customer Info Card - Wide */}
      <div className="rounded-3xl border p-8 bg-(--card) shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Basic Info */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-(--muted) mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={editedCustomer.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full max-w-md px-4 py-2 border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-(--muted) mb-1">
                        Status
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange("active")}
                          className={`px-4 py-2 rounded-xl border ${
                            editedCustomer.status === "active"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "border-(--border) hover:bg-(--muted/10)"
                          }`}
                        >
                          Active
                        </button>
                        <button
                          onClick={() => handleStatusChange("inactive")}
                          className={`px-4 py-2 rounded-xl border ${
                            editedCustomer.status === "inactive"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "border-(--border) hover:bg-(--muted/10)"
                          }`}
                        >
                          Inactive
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <User className="h-6 w-6" />
                      {customer.name}
                    </h2>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveClick}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-(--muted)" />
                <div className="flex-1">
                  <p className="text-sm text-(--muted)">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedCustomer.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-1 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="font-medium">{customer.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-(--muted)" />
                <div className="flex-1">
                  <p className="text-sm text-(--muted)">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedCustomer.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-1 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="font-medium">{customer.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-(--muted) mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-(--muted)">Address</p>
                  {isEditing ? (
                    <textarea
                      value={editedCustomer.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter address"
                      rows="2"
                    />
                  ) : (
                    <p className="font-medium">{customer.address}</p>
                  )}
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
                  <p className="text-2xl font-bold">{customer.totalOrders}</p>
                </div>

                <div className="rounded-xl border p-4 bg-(--muted/5)">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Total Spent</p>
                  </div>
                  <p className="text-2xl font-bold">
                    ৳ {customer.totalSpent.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border p-4 bg-(--muted/5) col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-(--muted)" />
                    <p className="text-sm text-(--muted)">Customer Since</p>
                  </div>
                  <p className="text-xl font-medium">{customer.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                  New Order
                </button>
                <button className="px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
                  Send Email
                </button>
                <button className="px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Package className="h-6 w-6" />
            Recent Orders
          </h2>
          <p className="text-sm text-(--muted)">
            Showing {paginatedOrders.length} of {orders.length} orders
          </p>
        </div>

        {/* Orders Table */}
        <div className="rounded-3xl border overflow-hidden bg-(--card)">
          {paginatedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-(--muted)">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-(--muted/10) border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Order ID</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Items</th>
                      <th className="text-left p-4 font-semibold">Total</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Payment</th>
                      <th className="text-left p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-(--border/50) hover:bg-(--muted/5) transition cursor-pointer"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        <td className="p-4 font-medium">{order.id}</td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4">{order.items}</td>
                        <td className="p-4 font-semibold">
                          ৳ {order.total.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              STATUS_COLORS[order.status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">{order.paymentMethod}</td>
                        <td className="p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderClick(order.id);
                            }}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            View <ArrowRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 border-t">
                  <p className="text-sm text-(--muted)">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }).map(
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-2 border rounded-lg min-w-10 ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "border-(--border) hover:bg-(--muted/10)"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
