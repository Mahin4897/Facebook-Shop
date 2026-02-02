"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import OrderTable from "@/components/orders/OrderTable";
export type Order = {
  id: number;
  productName: string;
  productImage: string;
  customer: string;
  total: number;
  deliveryStatus: string;
  date: string;
};
export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // new filter state

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get("/api/orders");
      return res.data;
    },
    initialData: [
      {
        id: 1,
        productName: "Wireless Earbuds",
        productImage: "/products/earbuds.jpg",
        customer: "John Doe",
        total: 2999,
        deliveryStatus: "Pending",
        date: "2026-01-28",
      },
      {
        id: 2,
        productName: "Smart Watch",
        productImage: "/products/smartwatch.jpg",
        customer: "Jane Smith",
        total: 5999,
        deliveryStatus: "Shipped",
        date: "2026-01-27",
      },
      {
        id: 3,
        productName: "Gaming Mouse",
        productImage: "/products/mouse.jpg",
        customer: "Alice Johnson",
        total: 1499,
        deliveryStatus: "Delivered",
        date: "2026-01-25",
      },
      // ... rest of the dummy orders
    ],
  });

  // Filter orders by delivery status
  const filteredOrders = orders.filter(
    (o: Order) =>
      o.customer.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "" || o.deliveryStatus === statusFilter),
  );

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header: Title + Theme Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text)">Orders</h1>
        <ThemeToggle />
      </div>

      {/* Controls: Search + Delivery Status Filter + Add Order */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Search + Delivery Status */}
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            placeholder="Search Orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1 px-4 py-2 rounded-xl border border-(--border)
              bg-(--card) text-(--text) placeholder-(--muted)
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            "
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              px-3 py-2 rounded-xl border border-(--border)
              bg-(--card) text-(--text)
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            "
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Right: Add Order Button */}
        <Link
          href="/dashboard/orders/add"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Order
        </Link>
      </div>

      {/* Order Table */}
      <OrderTable
        orders={filteredOrders}
        search={search}
        // or implement date sorting if needed
        loading={isLoading}
        r1="Product"
        r2="Customer"
        r3="Total"
        r4="Status"
      />
    </div>
  );
}
