"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Search,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

/* -------------------- MOCK DATA -------------------- */
const generateDeterministicData = () => {
  const customers = [];
  const names = [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Williams",
    "Charlie Brown",
    "Eva Davis",
  ];

  for (let i = 0; i < 48; i++) {
    customers.push({
      id: i + 1,
      name: names[i % 6],
      email: `customer${i + 1}@example.com`,
      phone: `017${String(10000000 + i).slice(1)}`,
      joinDate: `2024-${String(Math.floor(i / 4) + 1).padStart(2, "0")}-${String(
        (i % 28) + 1,
      ).padStart(2, "0")}`,
      totalOrders: (i % 20) + 1,
      totalSpent: ((i * 12345) % 50000) + 1000,
      status: i % 4 === 3 ? "inactive" : "active",
      customerType: i % 3 === 0 ? "business" : "individual",
      tags: i % 2 === 0 ? ["VIP", "Regular"] : ["Regular"],
    });
  }
  return customers;
};

const CUSTOMERS = generateDeterministicData();
const PAGE_SIZE = 10;

/* -------------------- BADGES -------------------- */
const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      status === "active"
        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
    }`}
  >
    {status === "active" ? (
      <>
        <CheckCircle className="h-3 w-3 mr-1" /> Active
      </>
    ) : (
      <>
        <XCircle className="h-3 w-3 mr-1" /> Inactive
      </>
    )}
  </span>
);

/* -------------------- PAGE -------------------- */
export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Removed setPage(1) from effect to avoid cascading renders

  /* -------------------- FILTER + SORT -------------------- */
  const filtered = useMemo(() => {
    let data = CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search),
    );

    data.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

    return data;
  }, [search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleSort = (f) => {
    if (f === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(f);
      setSortDir("asc");
    }
  };

  return (
    <div className="w-full px-4  py-4 lg:px-6">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-sm text-(--muted)">Manage your customer base</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/customers/add")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* ---------------- SEARCH ---------------- */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--muted)" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-(--card) focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block rounded-2xl bg-(--card) shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="sticky top-0 bg-(--muted/20) z-10">
            <tr>
              {["Customer", "Orders", "Spent", "Joined", "Status", ""].map(
                (h, i) => (
                  <th key={i} className="p-4 text-left text-sm text-(--muted)">
                    {h === "Customer" ? (
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 hover:text-(--text)"
                      >
                        Customer
                        {sortField === "name" &&
                          (sortDir === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          ))}
                      </button>
                    ) : (
                      h
                    )}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-(--border/10)">
            {paginated.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/dashboard/customers/${c.id}`)}
                className="cursor-pointer transition hover:shadow-sm hover:-translate-y-px"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-(--muted)">{c.email}</p>
                  </div>
                </td>
                <td className="p-4">{c.totalOrders}</td>
                <td className="p-4 font-semibold">
                  ৳ {c.totalSpent.toLocaleString()}
                </td>
                <td className="p-4 text-sm">{c.joinDate}</td>
                <td className="p-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button className="p-2 rounded-full hover:bg-(--muted/30)">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-(--muted/30)">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-(--muted/30)">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-(--muted)">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-2 rounded-lg hover:bg-(--muted/20)"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 rounded-lg hover:bg-(--muted/20)"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="md:hidden space-y-3">
        {paginated.map((c) => (
          <div
            key={c.id}
            onClick={() => router.push(`/dashboard/customers/${c.id}`)}
            className="rounded-2xl bg-(--card) p-4 shadow-sm hover:scale-[1.01] transition"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                {c.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-(--muted)">
                  ৳ {c.totalSpent.toLocaleString()}
                </p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
