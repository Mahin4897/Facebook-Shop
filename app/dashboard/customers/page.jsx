"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Search,
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Building,
  Tag,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

// Use deterministic data to avoid hydration errors
const generateDeterministicData = () => {
  const customers = [];
  for (let i = 0; i < 48; i++) {
    const names = [
      "John Doe",
      "Jane Smith",
      "Bob Johnson",
      "Alice Williams",
      "Charlie Brown",
      "Eva Davis",
    ];
    const name = names[i % 6];

    // Use deterministic calculation instead of Math.random()
    const totalOrders = (i % 20) + 1; // 1-20 based on index
    const totalSpent = ((i * 12345) % 50000) + 1000; // Deterministic calculation
    const status = i % 4 === 3 ? "inactive" : "active"; // Every 4th is inactive
    const customerType = i % 3 === 0 ? "business" : "individual";
    const tags = i % 2 === 0 ? ["VIP", "Regular"] : ["Regular"];

    customers.push({
      id: i + 1,
      name,
      email: `customer${i + 1}@example.com`,
      phone: `017${String(10000000 + i).slice(1)}`,
      address: `${i + 1} Main Street, Dhaka`,
      joinDate: `2024-${String(Math.floor(i / 4) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      totalOrders,
      totalSpent,
      status,
      customerType,
      tags,
      lastOrder:
        i % 5 === 0
          ? null
          : `2024-${String(Math.floor(i / 5) + 1).padStart(2, "0")}-${String((i % 20) + 1).padStart(2, "0")}`,
    });
  }
  return customers;
};

const MOCK_CUSTOMERS = generateDeterministicData();

const PAGE_SIZE = 10;
const TAGS = ["VIP", "Regular", "Wholesale", "New", "Inactive"];

export default function CustomersPage() {
  const router = useRouter();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Calculate totals using useMemo to avoid state updates in effect
  const { totalCustomers, activeCustomers, totalRevenue, avgOrders } =
    useMemo(() => {
      const total = MOCK_CUSTOMERS.length;
      const active = MOCK_CUSTOMERS.filter((c) => c.status === "active").length;
      const revenue = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.totalSpent, 0);
      const totalOrders = MOCK_CUSTOMERS.reduce(
        (sum, c) => sum + c.totalOrders,
        0,
      );
      return {
        totalCustomers: total,
        activeCustomers: active,
        totalRevenue: revenue,
        avgOrders: totalOrders / total,
      };
    }, []);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = MOCK_CUSTOMERS.filter((customer) => {
      // Search filter
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || customer.status === selectedStatus;

      // Type filter
      const matchesType =
        selectedType === "all" || customer.customerType === selectedType;

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => customer.tags.includes(tag));

      return matchesSearch && matchesStatus && matchesType && matchesTags;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "joinDate" || sortField === "lastOrder") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    searchTerm,
    selectedStatus,
    selectedType,
    selectedTags,
    sortField,
    sortDirection,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / PAGE_SIZE);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedCustomers, currentPage]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle tag selection
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle row click
  const handleCustomerClick = (customerId) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  // Handle view details click
  const handleViewDetails = (e, customerId) => {
    e.stopPropagation();
    router.push(`/dashboard/customers/${customerId}`);
  };

  // Handle edit click
  const handleEditClick = (e, customerId) => {
    e.stopPropagation();
    router.push(`/dashboard/customers/${customerId}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Status badge component
  const StatusBadge = ({ status }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        status === "active"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }`}
    >
      {status === "active" ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </>
      )}
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-sm text-(--muted) mt-1">
            Manage your customer database
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/customers/add")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl border p-6 bg-(--card)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">Total Customers</p>
              <p className="text-2xl font-bold">{totalCustomers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 bg-(--card)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">Active Customers</p>
              <p className="text-2xl font-bold">{activeCustomers}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 bg-(--card)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">Total Revenue</p>
              <p className="text-2xl font-bold">
                ৳ {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 bg-(--card)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-(--muted)">Avg. Orders</p>
              <p className="text-2xl font-bold">{avgOrders.toFixed(1)}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border p-6 bg-(--card) mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>

          <div className="flex items-center gap-4">
            {(searchTerm ||
              selectedStatus !== "all" ||
              selectedType !== "all" ||
              selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
            <span className="text-sm text-(--muted)">
              {filteredAndSortedCustomers.length} customers found
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border border-(--border) rounded-xl bg-(--card) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-(--border) rounded-xl bg-(--card) focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-(--border) rounded-xl bg-(--card) focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>

          {/* Tags Filter */}
          <select
            value=""
            onChange={(e) => toggleTag(e.target.value)}
            className="px-4 py-2 border border-(--border) rounded-xl bg-(--card) focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Filter by Tags</option>
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
              >
                <Tag className="h-3 w-3" />
                <span className="text-sm">{tag}</span>
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="rounded-2xl border overflow-hidden bg-(--card)">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-(--muted/5) border-b">
              <tr>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Customer
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("totalOrders")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Orders
                    {sortField === "totalOrders" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("totalSpent")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Total Spent
                    {sortField === "totalSpent" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">
                  <button
                    onClick={() => handleSort("joinDate")}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    Joined
                    {sortField === "joinDate" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      ))}
                  </button>
                </th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <User className="h-12 w-12 text-(--muted)" />
                      <p className="text-(--muted)">No customers found</p>
                      <button
                        onClick={clearFilters}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => handleCustomerClick(customer.id)}
                    className="border-b border-(--border/50) hover:bg-(--muted/5) transition cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold shrink-0">
                          {customer.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{customer.name}</p>
                            {customer.customerType === "business" && (
                              <Building className="h-4 w-4 text-(--muted)" />
                            )}
                          </div>
                          <p className="text-sm text-(--muted) flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </p>
                          <p className="text-sm text-(--muted) flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{customer.totalOrders}</p>
                        {customer.lastOrder && (
                          <p className="text-sm text-(--muted)">
                            Last: {customer.lastOrder}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">
                        ৳ {customer.totalSpent.toLocaleString()}
                      </p>
                      <p className="text-sm text-(--muted)">
                        Avg: ৳{" "}
                        {Math.round(
                          customer.totalSpent / customer.totalOrders,
                        ).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-(--muted)" />
                        <p>{customer.joinDate}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={customer.status} />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {customer.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-800 text-(--muted)"
                          >
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleViewDetails(e, customer.id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleEditClick(e, customer.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-(--muted) hover:text-(--text) hover:bg-(--muted/10) rounded-lg transition">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-t">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-(--muted)">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredAndSortedCustomers.length,
                )}{" "}
                of {filteredAndSortedCustomers.length} customers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
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
                      className={`px-3 py-2 min-w-10 rounded-lg transition ${
                        currentPage === pageNum
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
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
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

// X icon component
const X = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
