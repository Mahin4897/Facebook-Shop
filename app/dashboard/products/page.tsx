"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import ProductTable from "@/components/products/ProductTable";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("/api/products");
      return res.data;
    },
    initialData: [
      { id: "p-001", name: "Wireless Mouse", sku: "WM-1001", price: 950, stock: 42 },
      { id: "p-002", name: "Mechanical Keyboard", sku: "MK-2048", price: 5200, stock: 8 },
      { id: "p-003", name: "USB-C Fast Charger", sku: "UC-330W", price: 1800, stock: 0 },
      { id: "p-004", name: "Bluetooth Headphones", sku: "BH-7788", price: 3400, stock: 15 },
      { id: "p-005", name: "Laptop Stand (Aluminum)", sku: "LS-ALU-01", price: 2600, stock: 27 },
      { id: "p-006", name: "Webcam 1080p", sku: "WC-1080", price: 4100, stock: 6 },
      { id: "p-007", name: "Portable SSD 1TB", sku: "SSD-1TB-P", price: 12500, stock: 12 },
      { id: "p-008", name: "HDMI Cable 2m", sku: "HDMI-2M", price: 650, stock: 58 },
      { id: "p-009", name: "Noise Cancelling Earbuds", sku: "NC-EB-22", price: 6900, stock: 3 },
      { id: "p-010", name: "Smart Power Strip", sku: "SPS-06", price: 2300, stock: 19 },
      { id: "p-011", name: "Smart Speaker", sku: "SS-01", price: 4500, stock: 10 },
    ],
  });

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header: Title + Theme Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-(--text)">Products</h1>
        <ThemeToggle />
      </div>

      {/* Controls: Search + Stock Select + Add Product */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Search + Stock */}
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              flex-1 px-4 py-2 rounded-xl border border-(--border)
              bg-(--card) text-(--text) placeholder-(--muted)
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            "
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="
              px-3 py-2 rounded-xl border border-(--border)
              bg-(--card) text-(--text)
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition
            "
          >
            <option value="asc">Stock ↑</option>
            <option value="desc">Stock ↓</option>
          </select>
        </div>

        {/* Right: Add Product Button */}
        <Link
          href="/dashboard/products/add"
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
          Add Product
        </Link>
      </div>

      {/* Product Table */}
      <ProductTable
        products={products}
        search={search}
        sort={sort}
        loading={isLoading}
        r1="Product"
        r2="SKU"
        r3="Price"
        r4="Stock"
      />
    </div>
  );
}
