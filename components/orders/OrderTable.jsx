"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Badge for delivery status
function DeliveryBadge({ status }) {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function OrderTable({
  orders,
  search,
  sort,
  loading,
  r1,
  r2,
  r3,
  r4,
}) {
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => o.customer.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sort === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date),
      );
  }, [orders, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Reset page when filter/search changes
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--card)">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr className="text-left text-(--muted)">
              <th className="px-4 py-3">{r1}</th>
              <th className="px-4 py-3">{r2}</th>
              <th className="px-4 py-3 text-right">{r3}</th>
              <th className="px-4 py-3 text-center">{r4}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border)">
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-(--muted)"
                >
                  Loading orders…
                </td>
              </tr>
            )}

            {!loading && paginatedOrders.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-(--muted)"
                >
                  No orders found
                </td>
              </tr>
            )}

            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="group hover:bg-blue-500/10 transition"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-3"
                  >
                    <div className="relative h-9 w-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={order.productImage || "globe.svg"}
                        alt={order.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-(--text) group-hover:underline">
                      {order.productName}
                    </span>
                  </Link>
                </td>

                <td className="px-4 py-3 text-(--muted)">{order.customer}</td>

                <td className="px-4 py-3 text-right font-semibold text-(--text)">
                  ৳ {order.total.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <DeliveryBadge status={order.deliveryStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-(--muted)">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="
                px-3 py-1.5 rounded-lg text-sm
                border border-(--border)
                bg-(--card)
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-blue-500/10
              "
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`
                    h-9 w-9 rounded-lg text-sm font-medium
                    transition
                    ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "border border-(--border) hover:bg-blue-500/10"
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="
                px-3 py-1.5 rounded-lg text-sm
                border border-(--border)
                bg-(--card)
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:bg-blue-500/10
              "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
