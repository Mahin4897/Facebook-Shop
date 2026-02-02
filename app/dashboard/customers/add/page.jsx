"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  User,
  Phone,
  MapPin,
  Mail,
  Plus,
  ArrowLeft,
  Save,
  Tag,
  Building,
  Globe,
} from "lucide-react";

export default function AddCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Bangladesh",
    company: "",
    customerType: "individual", // individual or business
    tags: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle tag input
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would make an API call here
      console.log("Submitting customer data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success - redirect to customers list or customer detail page
      router.push(
        `/customers?success=true&name=${encodeURIComponent(formData.name)}`,
      );
    } catch (error) {
      console.error("Error adding customer:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to add customer. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field styles
  const fieldClass =
    "w-full px-4 py-3 rounded-xl border bg-(--card) text-(--text) border-(--border) focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
  const labelClass = "block text-sm font-medium mb-2 text-(--text)";
  const errorClass = "mt-1 text-sm text-red-600";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold">Add New Customer</h1>
            <p className="text-sm text-(--muted)">
              Create a new customer profile
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Success Message Placeholder */}
      <div className="mb-6">
        {/* You can add success message here after redirect */}
      </div>

      {/* Main Form */}
      <div className="rounded-3xl border bg-(--card) p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Type Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Type
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    customerType: "individual",
                  }))
                }
                className={`p-4 rounded-xl border transition-all ${
                  formData.customerType === "individual"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-(--border) hover:bg-(--muted/5)"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <User
                    className={`h-6 w-6 ${
                      formData.customerType === "individual"
                        ? "text-blue-600"
                        : "text-(--muted)"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      formData.customerType === "individual"
                        ? "text-blue-600"
                        : "text-(--text)"
                    }`}
                  >
                    Individual
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, customerType: "business" }))
                }
                className={`p-4 rounded-xl border transition-all ${
                  formData.customerType === "business"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-(--border) hover:bg-(--muted/5)"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Building
                    className={`h-6 w-6 ${
                      formData.customerType === "business"
                        ? "text-blue-600"
                        : "text-(--muted)"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      formData.customerType === "business"
                        ? "text-blue-600"
                        : "text-(--text)"
                    }`}
                  >
                    Business
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className={labelClass}>Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${fieldClass} pl-10 ${errors.name ? "border-red-500" : ""}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className={errorClass}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${fieldClass} pl-10 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${fieldClass} pl-10 ${errors.phone ? "border-red-500" : ""}`}
                    placeholder="01700000000"
                  />
                </div>
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>

              {/* Company (only for business) */}
              {formData.customerType === "business" && (
                <div>
                  <label className={labelClass}>Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`${fieldClass} pl-10`}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Address Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address */}
              <div className="md:col-span-2">
                <label className={labelClass}>Street Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-4 h-5 w-5 text-(--muted)" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`${fieldClass} pl-10 ${errors.address ? "border-red-500" : ""}`}
                    placeholder="123 Main Street, Apt 4B"
                  />
                </div>
                {errors.address && (
                  <p className={errorClass}>{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={fieldClass}
                  placeholder="Dhaka"
                />
              </div>

              {/* Country */}
              <div>
                <label className={labelClass}>Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-(--muted)" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`${fieldClass} pl-10`}
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Tags
            </h2>

            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className={`${fieldClass} flex-1`}
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 border border-(--border) rounded-xl hover:bg-(--muted/5) transition"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Additional Notes</h2>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              className={fieldClass}
              placeholder="Any additional information about the customer..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-(--border) rounded-xl hover:bg-(--muted/10) transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Add Customer
                </>
              )}
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}
        </form>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border p-4 bg-(--card)">
          <p className="text-sm text-(--muted)">Total Customers</p>
          <p className="text-2xl font-bold">1,247</p>
        </div>
        <div className="rounded-xl border p-4 bg-(--card)">
          <p className="text-sm text-(--muted)">Active This Month</p>
          <p className="text-2xl font-bold">84</p>
        </div>
        <div className="rounded-xl border p-4 bg-(--card)">
          <p className="text-sm text-(--muted)">Avg. Orders per Customer</p>
          <p className="text-2xl font-bold">3.2</p>
        </div>
      </div>
    </div>
  );
}

// X icon component (if not imported)
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
