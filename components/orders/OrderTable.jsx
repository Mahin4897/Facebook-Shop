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

/* -------------------- Status Badge -------------------- */
function DeliveryBadge({ status }) {
  const statusConfig = {
    pending: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
      icon: Clock,
    },
    processing: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
      icon: Clock,
    },
    shipped: {
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
      icon: Truck,
    },
    delivered: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
      icon: CheckCircle,
    },
    cancelled: {
      color: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
      icon: XCircle,
    },
  };

  const config = statusConfig[status.toLowerCase()] || {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
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

  /* -------------------- Filter + Sort -------------------- */
  const filteredAndSorted = useMemo(() => {
    let filtered = orders.filter(
      (order) =>
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.productName.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()),
    );

    filtered.sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];

      if (sortField === "date") {
        av = new Date(av);
        bv = new Date(bv);
      }

      if (sortDirection === "asc") return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });

    return filtered;
  }, [orders, search, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  if (page > totalPages && totalPages > 0) setPage(1);

  /* -------------------- Handlers -------------------- */
  const handleSort = (field) => {
    if (sortField === field)
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (id) => router.push(`/dashboard/orders/${id}`);

  /* -------------------- Skeleton Loading -------------------- */
  const renderSkeleton = () =>
    Array.from({ length: PAGE_SIZE }).map((_, idx) => (
      <tr key={idx} className="animate-pulse">
        <td className="p-4">
          <div className="h-10 w-32 bg-(--muted/10) rounded-lg" />
        </td>
        <td className="p-4">
          <div className="h-6 w-24 bg-(--muted/10) rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-16 bg-(--muted/10) rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-16 bg-(--muted/10) rounded" />
        </td>
        <td className="p-4">
          <div className="h-6 w-20 bg-(--muted/10) rounded" />
        </td>
      </tr>
    ));

  return (
    <div className="space-y-4">
      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block rounded-2xl border border-theme shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-(--muted/20) sticky top-0 z-10">
            <tr>
              {[r1, r2, "Date", r3, r4].map((title, idx) => (
                <th key={idx} className="p-4 text-left text-sm text-(--muted)">
                  {title === r1 && (
                    <button
                      onClick={() => handleSort("productName")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <Package className="h-4 w-4" /> {r1}
                      {sortField === "productName" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === r2 && (
                    <button
                      onClick={() => handleSort("customer")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <User className="h-4 w-4" /> {r2}
                      {sortField === "customer" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === "Date" && (
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <Calendar className="h-4 w-4" /> Date
                      {sortField === "date" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === r3 && (
                    <button
                      onClick={() => handleSort("total")}
                      className="flex items-center gap-1 font-medium hover:text-(--text) transition"
                    >
                      <DollarSign className="h-4 w-4" /> {r3}
                      {sortField === "total" &&
                        (sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        ))}
                    </button>
                  )}
                  {title === r4 && r4}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border/10)">
            {loading && renderSkeleton()}

            {!loading &&
              paginatedOrders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => handleRowClick(o.id)}
                  className="transition-transform duration-150 hover:scale-[1.01] hover:shadow-sm cursor-pointer"
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white overflow-hidden">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{o.productName}</p>
                      <p className="text-xs text-(--muted)">ID: {o.id}</p>
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-(--muted)" />
                    <div>
                      <p className="font-medium">{o.customer}</p>
                      {o.customerEmail && (
                        <p className="text-xs text-(--muted)">
                          {o.customerEmail}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(o.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold">
                    ৳ {o.total.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <DeliveryBadge status={o.deliveryStatus} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Desktop Pagination */}
        {totalPages > 1 && (
          <div className="hidden md:flex items-center justify-between px-4 py-3 bg-(--card)">
            <p className="text-sm text-(--muted)">
              Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(page * PAGE_SIZE, filteredAndSorted.length)} of{" "}
              {filteredAndSorted.length} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-(--muted/20)"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "hover:bg-(--muted/20)"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm disabled:opacity-50 hover:bg-(--muted/20)"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="md:hidden space-y-3">
        {!loading &&
          paginatedOrders.map((o) => (
            <div
              key={o.id}
              onClick={() => handleRowClick(o.id)}
              className="rounded-2xl  border border-theme  p-4 shadow-sm transition-transform duration-150 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white overflow-hidden">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{o.productName}</p>
                  <p className="text-xs text-(--muted)">ID: {o.id}</p>
                </div>
                <DeliveryBadge status={o.deliveryStatus} />
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <p>{o.customer}</p>
                <p>৳ {o.total.toLocaleString()}</p>
              </div>
            </div>
          ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex-1 py-2 rounded-lg text-sm disabled:opacity-50 bg-(--muted/10)"
            >
              Previous
            </button>
            <p className="text-sm text-(--muted)">
              Page {page} / {totalPages}
            </p>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 py-2 rounded-lg text-sm disabled:opacity-50 bg-(--muted/10)"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
