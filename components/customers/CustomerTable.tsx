"use client";

import { useMemo, useState } from "react";

const PAGE_SIZE = 10;

type Customer = {
  id: number;
  name: string;
  totalOrders: number;
  totalSpent: number;
};

interface CustomerTableProps {
  customers: Customer[];
  search: string;
  loading: boolean;
  c1: string;
  c2: string;
  c3: string;
}

export default function CustomerTable({
  customers,
  search,
  loading,
  c1,
  c2,
  c3,
}: CustomerTableProps) {
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return customers
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.totalSpent - a.totalSpent); // Sort by total spent descending
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // Reset page if filter changes
  if (page > totalPages && totalPages > 0) {
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--card)">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/5">
            <tr className="text-left text-(--muted)">
              <th className="px-4 py-3">{c1}</th>
              <th className="px-4 py-3 text-right">{c2}</th>
              <th className="px-4 py-3 text-right">{c3}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border)">
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-(--muted)">
                  Loading customers…
                </td>
              </tr>
            )}

            {!loading && paginatedCustomers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-(--muted)">
                  No customers found
                </td>
              </tr>
            )}

            {paginatedCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-blue-500/10 transition">
                <td className="px-4 py-3 font-medium text-(--text)">
                  {customer.name}
                </td>
                <td className="px-4 py-3 text-right text-(--text)">
                  {customer.totalOrders}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-(--text)">
                  ৳ {customer.totalSpent.toLocaleString()}
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
              className="px-3 py-1.5 rounded-lg text-sm border border-(--border) bg-(--card) disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500/10"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-(--border) hover:bg-blue-500/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg text-sm border border-(--border) bg-(--card) disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500/10"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
