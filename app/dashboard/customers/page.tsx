"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import CustomerTable from "@/components/customers/CustomerTable";

export type Customer = {
  id: number;
  name: string;
  totalOrders: number;
  totalSpent: number;
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await axios.get("/api/customers");
      return res.data;
    },
    initialData: [
      { id: 1, name: "John Doe", totalOrders: 5, totalSpent: 14500 },
      { id: 2, name: "Jane Smith", totalOrders: 3, totalSpent: 12000 },
      { id: 3, name: "Alice Johnson", totalOrders: 7, totalSpent: 21000 },
      { id: 4, name: "Bob Brown", totalOrders: 2, totalSpent: 8000 },
      { id: 5, name: "Charlie Davis", totalOrders: 4, totalSpent: 13500 },
      { id: 6, name: "Eva Wilson", totalOrders: 6, totalSpent: 19500 },
      { id: 7, name: "Frank Lee", totalOrders: 1, totalSpent: 2500 },
      { id: 8, name: "Grace Kim", totalOrders: 8, totalSpent: 24500 },
      { id: 9, name: "Henry Clark", totalOrders: 3, totalSpent: 10200 },
      { id: 10, name: "Ivy Martinez", totalOrders: 5, totalSpent: 17500 },
    ],
  });

  // Filter customers by search term
  const filteredCustomers = customers.filter((c: Customer) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header: Title + Theme Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text)">Customers</h1>
        <ThemeToggle />
      </div>

      {/* Controls: Search + Add Customer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            placeholder="Search Customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1 px-4 py-2 rounded-xl border border-(--border)
              bg-(--card) text-(--text) placeholder-(--muted)
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            "
          />
        </div>

        {/* Add Customer Button */}
        <Link
          href="/dashboard/customers/add"
          className="
            flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
            bg-blue-600 text-white hover:bg-blue-700 transition-shadow
            shadow-md
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </Link>
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        search={search}
        loading={isLoading}
        c1="Customer Name"
        c2="Total Orders"
        c3="Total Spent"
      />
    </div>
  );
}
