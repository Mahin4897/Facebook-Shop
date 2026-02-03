"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Download,
  Send,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Tag,
  DollarSign,
  Percent,
  Hash,
} from "lucide-react";

const CUSTOMERS = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    company: "TechCorp Inc.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "Global Solutions",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@example.com",
    company: "Innovate Labs",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    company: "Digital Dynamics",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    company: "Future Systems",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Website Design",
    price: 12000,
    description: "Custom website design and development",
  },
  {
    id: 2,
    name: "SEO Package",
    price: 8000,
    description: "Search engine optimization services",
  },
  {
    id: 3,
    name: "Mobile App",
    price: 25000,
    description: "iOS and Android app development",
  },
  {
    id: 4,
    name: "Cloud Hosting",
    price: 3000,
    description: "Monthly cloud hosting services",
  },
  {
    id: 5,
    name: "Maintenance",
    price: 5000,
    description: "Monthly website maintenance",
  },
  {
    id: 6,
    name: "Consulting",
    price: 15000,
    description: "Business consulting services",
  },
];

const TAX_RATE = 15; // 15% VAT

export default function AddInvoicePage() {
  const router = useRouter();

  // Form state
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [invoiceNumber, setInvoiceNumber] = useState(
    () =>
      `INV-${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
  );
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState(
    () =>
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
  );
  const [notes, setNotes] = useState("Thank you for your business!");
  const [terms, setTerms] = useState(
    "Payment due within 30 days. Late payments subject to 2% monthly fee.",
  );

  // Line items state
  const [items, setItems] = useState([
    { id: 1, product: PRODUCTS[0], quantity: 1, price: PRODUCTS[0].price },
  ]);

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * (TAX_RATE / 100);
  const total = subtotal + tax;

  // Handlers
  const handleAddItem = () => {
    const newId = Math.max(...items.map((i) => i.id)) + 1;
    setItems([
      ...items,
      {
        id: newId,
        product: PRODUCTS[0],
        quantity: 1,
        price: PRODUCTS[0].price,
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          if (field === "product") {
            const product = PRODUCTS.find((p) => p.id === parseInt(value));
            return { ...item, product, price: product.price };
          }
          return {
            ...item,
            [field]: field === "quantity" ? parseInt(value) || 0 : value,
          };
        }
        return item;
      }),
    );
  };

  const handleSaveDraft = () => {
    const invoiceData = {
      customer,
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      notes,
      terms,
      status: "draft",
    };
    console.log("Saving as draft:", invoiceData);
    alert("Invoice saved as draft!");
    router.push("/dashboard/invoices");
  };

  const handleSendInvoice = () => {
    const invoiceData = {
      customer,
      invoiceNumber,
      invoiceDate,
      dueDate,
      items,
      subtotal,
      tax,
      total,
      notes,
      terms,
      status: "pending",
    };
    console.log("Sending invoice:", invoiceData);
    alert("Invoice sent to customer!");
    router.push("/dashboard/invoices");
  };

  const handlePreview = () => {
    // In a real app, this would open a preview modal
    alert("Preview feature coming soon!");
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download PDF
    alert("PDF download feature coming soon!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/invoices")}
            className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold">Create New Invoice</h1>
            <p className="text-sm text-(--muted) mt-1">
              Create and send invoices to your customers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Customer & Invoice Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Section */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold">Customer Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-(--muted) mb-2">
                  Select Customer
                </label>
                <select
                  value={customer.id}
                  onChange={(e) =>
                    setCustomer(
                      CUSTOMERS.find((c) => c.id === parseInt(e.target.value)),
                    )
                  }
                  className="w-full px-4 py-3 border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                >
                  {CUSTOMERS.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name} - {cust.company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-(--muted)" />
                  <div>
                    <p className="text-sm text-(--muted)">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-(--muted)" />
                  <div>
                    <p className="text-sm text-(--muted)">Company</p>
                    <p className="font-medium">{customer.company}</p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-6 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition">
              + Add New Customer
            </button>
          </div>

          {/* Invoice Items Section */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold">Invoice Items</h2>
              </div>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-(--muted/10) border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Item</th>
                    <th className="text-left p-4 font-semibold">Description</th>
                    <th className="text-left p-4 font-semibold">Quantity</th>
                    <th className="text-left p-4 font-semibold">Price</th>
                    <th className="text-left p-4 font-semibold">Amount</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-(--border/50)">
                      <td className="p-4">
                        <select
                          value={item.product.id}
                          onChange={(e) =>
                            handleItemChange(item.id, "product", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                        >
                          {PRODUCTS.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-(--muted)">
                          {item.product.description}
                        </p>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-20 px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-(--muted)" />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handleItemChange(item.id, "price", e.target.value)
                            }
                            className="w-32 px-3 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                placeholder="Add any notes for the customer..."
              />
            </div>

            <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Terms & Conditions
              </h3>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border border-(--border) rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                placeholder="Add payment terms and conditions..."
              />
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="space-y-8">
          {/* Invoice Details */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h2 className="text-xl font-bold mb-6">Invoice Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--muted) mb-2">
                  Invoice Number
                </label>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-(--muted)" />
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-(--muted) mb-2">
                    Invoice Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-(--muted)" />
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-4 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-(--muted) mb-2">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-(--muted)" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-2 border border-(--border) rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-(--card)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h2 className="text-xl font-bold mb-6">Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-(--muted)">Subtotal</span>
                <span className="font-semibold">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-(--muted)" />
                  <span className="text-(--muted)">Tax (VAT {TAX_RATE}%)</span>
                </div>
                <span className="font-semibold">৳ {tax.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-t">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ৳ {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleSaveDraft}
                className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </button>

              <button
                onClick={handleSendInvoice}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Invoice
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border p-6 bg-(--card) shadow-sm">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handlePreview}
                className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
              >
                Preview Invoice
              </button>
              <button
                onClick={handleDownloadPDF}
                className="w-full px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
