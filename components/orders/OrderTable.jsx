"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Status badge component
function DeliveryBadge({ status }) {
  const statusConfig = {
    pending: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      icon: Clock,
    },
    processing: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      icon: Clock,
    },
    shipped: {
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      icon: Truck,
    },
    delivered: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: CheckCircle,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      icon: XCircle,
    },
  };

  const config = statusConfig[status.toLowerCase()] || {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    icon: Clock,
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function OrderTable({
  orders,
  search,

  loading,
  r1 = "Product",
  r2 = "Customer",
  r3 = "Total",
  r4 = "Status",
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Filter and sort orders
  const filteredAndSorted = useMemo(() => {
    let filtered = orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.productName.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()),
    );

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  // Reset page when filter/search changes
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle order click
  const handleOrderClick = (orderId) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  return (
    <div className="space-y-6">
      {/* Table Container */}
      <div className="rounded-2xl border overflow-hidden bg-(--card)">
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-(--muted/5) border-b">
              <tr>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("productName")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Package className="h-4 w-4" />
                    {r1}
                    {sortField === "productName" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("customer")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <User className="h-4 w-4" />
                    {r2}
                    {sortField === "customer" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Calendar className="h-4 w-4" />
                    Date
                    {sortField === "date" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("total")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <DollarSign className="h-4 w-4" />
                    {r3}
                    {sortField === "total" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">{r4}</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading State */}
              {loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-(--muted)">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State */}
              {!loading && paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-(--muted)" />
                      <p className="text-(--muted)">No orders found</p>
                      {search && (
                        <p className="text-sm text-(--muted)">
                          Try adjusting your search
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Orders */}
              {!loading &&
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleOrderClick(order.id)}
                    className="border-b border-(--border/50) hover:bg-(--muted/5) transition cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Product Image/Avatar */}
                        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold shrink-0">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{order.productName}</p>
                          <p className="text-sm text-(--muted)">
                            ID: {order.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-(--muted)" />
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          {order.customerEmail && (
                            <p className="text-sm text-(--muted)">
                              {order.customerEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-(--muted)" />
                        <p>{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      {order.items && (
                        <p className="text-sm text-(--muted) mt-1">
                          {order.items} items
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-(--muted)" />
                        <p className="font-semibold">
                          ৳ {order.total.toLocaleString()}
                        </p>
                      </div>
                      {order.paymentMethod && (
                        <p className="text-sm text-(--muted) mt-1">
                          {order.paymentMethod}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <DeliveryBadge status={order.deliveryStatus} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-t">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-(--muted)">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, filteredAndSorted.length)} of{" "}
                {filteredAndSorted.length} orders
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 min-w-10 rounded-lg transition ${
                        page === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border border-(--border) hover:bg-(--muted/10)"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
