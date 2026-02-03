"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Printer,
  Mail,
  MoreVertical,
  Plus,
  Calendar,
  User,
  Building,
  DollarSign,
  ArrowUpDown,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

// Mock invoices data
const MOCK_INVOICES = Array.from({ length: 45 }).map((_, i) => {
  const statuses = ["paid", "pending", "overdue", "draft", "cancelled"];
  const status = statuses[i % 5];
  const amount = 15000 + (i % 10) * 2500;
  const date = new Date(2024, i % 12, (i % 28) + 1);

  return {
    id: `INV-${(2024 + Math.floor(i / 12)).toString().slice(-2)}${String(i + 1000).padStart(4, "0")}`,
    customer: [
      "John Smith",
      "Sarah Johnson",
      "Michael Chen",
      "Emma Wilson",
      "David Brown",
      "Lisa Anderson",
      "Robert Taylor",
      "Maria Garcia",
    ][i % 8],
    company: [
      "TechCorp Inc.",
      "Global Solutions",
      "Innovate Labs",
      "Digital Dynamics",
      "Future Systems",
      "Cloud Nexus",
      "Data Works",
      "Smart Solutions",
    ][i % 8],
    amount: amount,
    date: date.toISOString().split("T")[0],
    dueDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30)
      .toISOString()
      .split("T")[0],
    status: status,
    tax: amount * 0.15,
    items: 3 + (i % 5),
  };
});

const PAGE_SIZE = 10;
const STATUS_COLORS = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};
const STATUS_ICONS = {
  paid: CheckCircle,
  pending: Clock,
  overdue: AlertCircle,
  draft: FileText,
  cancelled: XCircle,
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices] = useState(MOCK_INVOICES);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(term) ||
          invoice.customer.toLowerCase().includes(term) ||
          invoice.company.toLowerCase().includes(term),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "dueDate":
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case "customer":
          aValue = a.customer.toLowerCase();
          bValue = b.customer.toLowerCase();
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [invoices, searchTerm, statusFilter, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedInvoices.length / PAGE_SIZE);
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedInvoices.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedInvoices, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAndSortedInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0,
    );
    const paid = filteredAndSortedInvoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);
    const pending = filteredAndSortedInvoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = filteredAndSortedInvoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      total,
      paid,
      pending,
      overdue,
      count: filteredAndSortedInvoices.length,
      paidCount: filteredAndSortedInvoices.filter(
        (inv) => inv.status === "paid",
      ).length,
      pendingCount: filteredAndSortedInvoices.filter(
        (inv) => inv.status === "pending",
      ).length,
      overdueCount: filteredAndSortedInvoices.filter(
        (inv) => inv.status === "overdue",
      ).length,
    };
  }, [filteredAndSortedInvoices]);

  // Handlers
  const handleViewInvoice = (invoiceId) => {
    router.push(`/dashboard/invoices/${invoiceId}`);
  };

  const handlePrintInvoice = (invoiceId) => {
    alert(`Printing invoice: ${invoiceId}`);
    // Implement print functionality
  };

  const handleDownloadInvoice = (invoiceId) => {
    alert(`Downloading invoice: ${invoiceId}`);
    // Implement download functionality
  };

  const handleSendInvoice = (invoiceId) => {
    alert(`Sending invoice: ${invoiceId} to customer`);
    // Implement email sending
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const toggleSelectInvoice = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId],
    );
  };

  const selectAllInvoices = () => {
    if (selectedInvoices.length === paginatedInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(paginatedInvoices.map((inv) => inv.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedInvoices.length === 0) return;

    switch (action) {
      case "download":
        alert(`Downloading ${selectedInvoices.length} invoices`);
        break;
      case "send":
        alert(`Sending ${selectedInvoices.length} invoices`);
        break;
      case "markAsPaid":
        alert(`Marking ${selectedInvoices.length} invoices as paid`);
        break;
      case "delete":
        if (confirm(`Delete ${selectedInvoices.length} selected invoices?`)) {
          alert(`Deleting ${selectedInvoices.length} invoices`);
        }
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-sm text-(--muted) mt-1">
            Manage and track all your invoices
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => router.push("/dashboard/invoices/add")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <Plus className="h-5 w-5" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards - Updated with proper dark mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Card */}
        <div className="rounded-3xl border p-6 bg-(--card) shadow-sm border-(--border)">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-(--muted) mb-2">Total Revenue</p>
              <p className="text-3xl font-bold">
                ৳ {stats.total.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                From {stats.count} invoices
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Paid Card */}
        <div className="rounded-3xl border p-6 bg-(--card) shadow-sm border-(--border)">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-(--muted) mb-2">Paid</p>
              <p className="text-3xl font-bold">
                ৳ {stats.paid.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                {stats.paidCount} invoices paid
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Pending Card */}
        <div className="rounded-3xl border p-6 bg-(--card) shadow-sm border-(--border)">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-(--muted) mb-2">Pending</p>
              <p className="text-3xl font-bold">
                ৳ {stats.pending.toLocaleString()}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                {stats.pendingCount} pending
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Overdue Card */}
        <div className="rounded-3xl border p-6 bg-(--card) shadow-sm border-(--border)">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-(--muted) mb-2">Overdue</p>
              <p className="text-3xl font-bold">
                ৳ {stats.overdue.toLocaleString()}
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                {stats.overdueCount} overdue
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the code remains exactly the same as your original */}
      {/* Filters and Search */}
      <div className="rounded-2xl border p-6 bg-(--card) space-y-6 border-(--border)">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-(--muted)" />
            <input
              type="text"
              placeholder="Search invoices by ID, customer, or company..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card) text-(--foreground)"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-(--muted)" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card) text-(--foreground)"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {selectedInvoices.length > 0 && (
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card) text-(--foreground)"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Bulk Actions
                  </option>
                  <option value="download">Download Selected</option>
                  <option value="send">Send Selected</option>
                  <option value="markAsPaid">Mark as Paid</option>
                  <option value="delete">Delete Selected</option>
                </select>
                <span className="text-sm text-(--muted)">
                  {selectedInvoices.length} selected
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "all"
                ? "bg-blue-600 text-white border-blue-600"
                : "border-(--border) text-(--foreground) hover:bg-(--muted/10)"
            }`}
          >
            All ({invoices.length})
          </button>
          <button
            onClick={() => setStatusFilter("paid")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "paid"
                ? "bg-green-600 text-white border-green-600"
                : "border-(--border) text-(--foreground) hover:bg-(--muted/10)"
            }`}
          >
            Paid ({stats.paidCount})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "pending"
                ? "bg-yellow-600 text-white border-yellow-600"
                : "border-(--border) text-(--foreground) hover:bg-(--muted/10)"
            }`}
          >
            Pending ({stats.pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("overdue")}
            className={`px-4 py-2 rounded-lg border ${
              statusFilter === "overdue"
                ? "bg-red-600 text-white border-red-600"
                : "border-(--border) text-(--foreground) hover:bg-(--muted/10)"
            }`}
          >
            Overdue ({stats.overdueCount})
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border overflow-hidden bg-(--card) border-(--border)">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-(--muted/10) border-b border-(--border)">
              <tr>
                <th className="text-left p-4 font-semibold">
                  <input
                    type="checkbox"
                    checked={
                      selectedInvoices.length === paginatedInvoices.length &&
                      paginatedInvoices.length > 0
                    }
                    onChange={selectAllInvoices}
                    className="rounded border-(--border)"
                  />
                </th>
                <th
                  className="text-left p-4 font-semibold cursor-pointer hover:bg-(--muted/20)"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    Invoice ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left p-4 font-semibold cursor-pointer hover:bg-(--muted/20)"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center gap-2">
                    Customer
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left p-4 font-semibold cursor-pointer hover:bg-(--muted/20)"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-2">
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left p-4 font-semibold cursor-pointer hover:bg-(--muted/20)"
                  onClick={() => handleSort("dueDate")}
                >
                  <div className="flex items-center gap-2">
                    Due Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  className="text-left p-4 font-semibold cursor-pointer hover:bg-(--muted/20)"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <FileText className="h-12 w-12 text-(--muted)" />
                      <p className="text-(--muted)">No invoices found</p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                          setCurrentPage(1);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => {
                  const StatusIcon = STATUS_ICONS[invoice.status] || FileText;
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-(--border/50) hover:bg-(--muted/5) transition"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => toggleSelectInvoice(invoice.id)}
                          className="rounded border-(--border)"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          {invoice.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{invoice.customer}</p>
                          <p className="text-sm text-(--muted)">
                            {invoice.company}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-(--muted)" />
                          {new Date(invoice.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-(--muted)" />
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-lg">
                          ৳ {invoice.amount.toLocaleString()}
                        </div>
                        <div className="text-sm text-(--muted)">
                          {invoice.items} items • Tax: ৳{" "}
                          {invoice.tax.toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[invoice.status]}`}
                          >
                            {invoice.status.charAt(0).toUpperCase() +
                              invoice.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="p-2 hover:bg-(--muted/10) rounded-lg transition"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(invoice.id)}
                            className="p-2 hover:bg-(--muted/10) rounded-lg transition"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(invoice.id)}
                            className="p-2 hover:bg-(--muted/10) rounded-lg transition"
                            title="Print"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleSendInvoice(invoice.id)}
                            className="p-2 hover:bg-(--muted/10) rounded-lg transition"
                            title="Send"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-(--muted/10) rounded-lg transition">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center p-4 border-t border-(--border) gap-4">
            <div className="text-sm text-(--muted)">
              Showing {paginatedInvoices.length} of{" "}
              {filteredAndSortedInvoices.length} invoices
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                <ChevronLeft className="h-4 w-4" />
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
                      className={`px-3 py-2 border rounded-lg min-w-10 ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-(--border) hover:bg-(--muted/10)"
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
                className="p-2 border border-(--border) rounded-lg disabled:opacity-50 hover:bg-(--muted/10) transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-(--muted)">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <select
                value={PAGE_SIZE}
                onChange={(e) => {
                  setCurrentPage(1);
                  // In a real app, you would update the page size here
                }}
                className="px-2 py-1 border border-(--border) rounded bg-(--card) text-(--foreground)"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="rounded-2xl border p-6 bg-(--card) border-(--border)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold">Generate Reports</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 border border-(--border) rounded-lg hover:bg-(--muted/10) transition">
                Monthly Report
              </button>
              <button className="px-4 py-2 border border-(--border) rounded-lg hover:bg-(--muted/10) transition">
                Tax Summary
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Export Data</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 border border-(--border) rounded-lg hover:bg-(--muted/10) transition">
                Export as CSV
              </button>
              <button className="px-4 py-2 border border-(--border) rounded-lg hover:bg-(--muted/10) transition">
                Export as PDF
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-(--muted)">
              Learn about invoice management in our documentation
            </p>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              View Documentation <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
