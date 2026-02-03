"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building,
  Mail as MailIcon,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Copy,
  Share2,
} from "lucide-react";

// Mock invoice data - In a real app, this would come from an API
const MOCK_INVOICE = {
  id: "INV-2024-0123",
  customer: {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+880 1712 345678",
    address: "123 Business Street, Dhaka 1212, Bangladesh",
    company: "TechCorp Inc.",
  },
  status: "paid",
  invoiceDate: "2024-03-15",
  dueDate: "2024-04-14",
  issueDate: "2024-03-15",
  items: [
    {
      id: 1,
      description: "Website Design & Development",
      quantity: 1,
      price: 25000,
      amount: 25000,
    },
    {
      id: 2,
      description: "SEO Optimization Package",
      quantity: 1,
      price: 15000,
      amount: 15000,
    },
    {
      id: 3,
      description: "Monthly Maintenance",
      quantity: 3,
      price: 5000,
      amount: 15000,
    },
    {
      id: 4,
      description: "Domain Registration (1 year)",
      quantity: 1,
      price: 1200,
      amount: 1200,
    },
  ],
  subtotal: 56200,
  tax: 8430, // 15% VAT
  total: 64630,
  paid: 64630,
  balance: 0,
  notes: "Thank you for your business! We appreciate your prompt payment.",
  terms:
    "Payment due within 30 days. Late payments subject to 2% monthly interest.",
  paymentMethod: "bKash",
  paymentDate: "2024-03-18",
  createdAt: "2024-03-15T10:30:00Z",
};

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  pending: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    icon: FileText,
    bgColor: "bg-gray-50 dark:bg-gray-900/20",
  },
};

export default function ViewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState(MOCK_INVOICE);
  const [copied, setCopied] = useState(false);

  const statusConfig = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.draft;
  const StatusIcon = statusConfig.icon;

  // Handlers
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert("Downloading PDF...");
    // In a real app, generate and download PDF
  };

  const handleSendEmail = () => {
    alert(`Sending invoice to ${invoice.customer.email}...`);
    // In a real app, send email
  };

  const handleEdit = () => {
    router.push(`/dashboard/invoices/edit/${params.id}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsPaid = () => {
    if (confirm("Mark this invoice as paid?")) {
      setInvoice({ ...invoice, status: "paid" });
      alert("Invoice marked as paid!");
    }
  };

  const handleSendReminder = () => {
    alert(`Sending payment reminder to ${invoice.customer.name}...`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳ ${amount.toLocaleString()}`;
  };

  // Calculate days until due
  const getDaysUntilDue = () => {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = getDaysUntilDue();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </button>
          <div>
            <h1 className="text-3xl font-bold">Invoice {invoice.id}</h1>
            <p className="text-sm text-(--muted) mt-1">
              View and manage invoice details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-3xl border p-6 ${statusConfig.bgColor} border-(--border)`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${statusConfig.color}`}>
              <StatusIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Invoice Status: {statusConfig.label}
              </h2>
              <p className="text-sm text-(--muted) mt-1">
                {invoice.status === "paid"
                  ? `Paid on ${new Date(invoice.paymentDate).toLocaleDateString()} via ${invoice.paymentMethod}`
                  : invoice.status === "pending"
                    ? `Due in ${daysUntilDue} days • Due date: ${new Date(invoice.dueDate).toLocaleDateString()}`
                    : invoice.status === "overdue"
                      ? `Overdue by ${Math.abs(daysUntilDue)} days • Please pay immediately`
                      : "This is a draft invoice"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Invoice Header */}
          <div className="rounded-3xl border p-8 bg-(--card) shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold">Your Company</h2>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">ABC Solutions Ltd.</p>
                  <p className="text-sm text-(--muted)">123 Business Avenue</p>
                  <p className="text-sm text-(--muted)">
                    Dhaka 1212, Bangladesh
                  </p>
                  <p className="text-sm text-(--muted)">
                    contact@abcsolutions.com
                  </p>
                  <p className="text-sm text-(--muted)">+880 1711 223344</p>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-(--muted)">Invoice #</span>
                    <span className="font-bold">{invoice.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--muted)">Issue Date</span>
                    <span>
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--muted)">Due Date</span>
                    <span className="font-semibold">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Bill To */}
          <div className="rounded-3xl border p-8 bg-(--card) shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Bill To
                </h3>
                <div className="space-y-2">
                  <p className="font-semibold">{invoice.customer.name}</p>
                  <p className="text-sm">{invoice.customer.company}</p>
                  <p className="text-sm text-(--muted)">
                    {invoice.customer.address}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <MailIcon className="h-4 w-4 text-(--muted)" />
                    <span className="text-sm">{invoice.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-(--muted)" />
                    <span className="text-sm">{invoice.customer.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-(--muted)">Payment Method</span>
                    <span className="font-medium">{invoice.paymentMethod}</span>
                  </div>
                  {invoice.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-(--muted)">Payment Date</span>
                      <span>
                        {new Date(invoice.paymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-(--muted)">Amount Paid</span>
                    <span className="font-semibold">
                      {formatCurrency(invoice.paid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-(--muted)">Balance Due</span>
                    <span
                      className={`font-bold ${invoice.balance > 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {formatCurrency(invoice.balance)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-3xl border overflow-hidden bg-(--card) shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-(--muted/10) border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Description</th>
                    <th className="text-left p-4 font-semibold">Quantity</th>
                    <th className="text-left p-4 font-semibold">Unit Price</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-(--border/50)">
                      <td className="p-4">
                        <p className="font-medium">{item.description}</p>
                      </td>
                      <td className="p-4">{item.quantity}</td>
                      <td className="p-4">{formatCurrency(item.price)}</td>
                      <td className="p-4 font-semibold">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-8 border-t">
              <div className="max-w-md ml-auto space-y-4">
                <div className="flex justify-between">
                  <span className="text-(--muted)">Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--muted)">Tax (VAT 15%)</span>
                  <span>{formatCurrency(invoice.tax)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t text-lg font-bold">
                  <span>Total</span>
                  <span className="text-2xl">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
              <h3 className="font-bold mb-4">Notes</h3>
              <p className="text-sm text-(--muted) whitespace-pre-line">
                {invoice.notes}
              </p>
            </div>

            <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
              <h3 className="font-bold mb-4">Terms & Conditions</h3>
              <p className="text-sm text-(--muted) whitespace-pre-line">
                {invoice.terms}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-8">
          {/* Invoice Actions */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h3 className="font-bold mb-6">Invoice Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition flex items-center justify-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Invoice
              </button>

              <button
                onClick={handleDownloadPDF}
                className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>

              <button
                onClick={handleSendEmail}
                className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Send via Email
              </button>

              {invoice.status === "pending" && (
                <>
                  <button
                    onClick={handleMarkAsPaid}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                  >
                    Mark as Paid
                  </button>

                  <button
                    onClick={handleSendReminder}
                    className="w-full px-4 py-3 border border-yellow-300 text-yellow-700 rounded-xl hover:bg-yellow-50 transition"
                  >
                    Send Payment Reminder
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Invoice Timeline */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h3 className="font-bold mb-6">Invoice Timeline</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Invoice Created</p>
                  <p className="text-sm text-(--muted)">
                    {new Date(invoice.createdAt).toLocaleDateString()} at{" "}
                    {new Date(invoice.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {invoice.status === "paid" && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-(--muted)">
                      {new Date(invoice.paymentDate).toLocaleDateString()} via{" "}
                      {invoice.paymentMethod}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Due Date</p>
                  <p className="text-sm text-(--muted)">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                    {daysUntilDue > 0 && ` (in ${daysUntilDue} days)`}
                    {daysUntilDue < 0 &&
                      ` (${Math.abs(daysUntilDue)} days ago)`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Information */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h3 className="font-bold mb-6">Invoice Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-(--muted)">Invoice ID</p>
                <p className="font-medium">{invoice.id}</p>
              </div>
              <div>
                <p className="text-sm text-(--muted)">Reference Number</p>
                <p className="font-medium">
                  {invoice.id.replace("INV-", "REF-")}
                </p>
              </div>
              <div>
                <p className="text-sm text-(--muted)">Created By</p>
                <p className="font-medium">Admin User</p>
              </div>
              <div>
                <p className="text-sm text-(--muted)">Last Updated</p>
                <p className="font-medium">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h3 className="font-bold mb-6">Share Invoice</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition flex items-center justify-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Public Link
              </button>
              <p className="text-xs text-(--muted) text-center">
                Generates a secure link for client viewing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
