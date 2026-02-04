"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const expensesData = [
  {
    id: 1,
    name: "Facebook Ads",
    category: "Marketing",
    amount: 5000,
    payment_method: "Bkash",
    date: "2026-02-01",
  },
  {
    id: 2,
    name: "Office Rent",
    category: "Office",
    amount: 20000,
    payment_method: "Bank",
    date: "2026-02-03",
  },
];

export default function ExpenseListPage() {
  const [search, setSearch] = useState("");

  const expenses = expensesData.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Expenses</h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/expenses/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-theme bg-(--card)"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== Desktop Table ===== */}
      <div className="hidden md:block rounded-2xl border border-theme bg-(--card) overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((e) => (
              <tr
                key={e.id}
                className="border-t border-theme hover:transform hover:scale-101 transition cursor-pointer"
                onClick={() => (window.location.href = `/expenses/${e.id}`)}
              >
                <td className="px-4 py-3 font-medium">{e.name}</td>
                <td className="px-4 py-3">{e.category}</td>
                <td className="px-4 py-3">{e.payment_method}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  ৳ {e.amount}
                </td>
                <td className="px-4 py-3">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Mobile Cards ===== */}
      <div className="md:hidden space-y-4">
        {expenses.map((e) => (
          <Link
            key={e.id}
            href={`/expenses/${e.id}`}
            className="block rounded-2xl border border-theme bg-(--card) p-4 space-y-2 hover:shadow-md hover:border-blue-500 transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{e.name}</h3>
              <span className="font-bold">৳ {e.amount}</span>
            </div>

            <div className="text-sm text-muted-foreground">
              {e.category} • {e.payment_method}
            </div>

            <div className="text-xs text-muted-foreground">{e.date}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
