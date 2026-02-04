"use client";

import { useState } from "react";
import { DollarSign, Calendar, CreditCard, Tag, FileText } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Check, X, Pencil } from "lucide-react";

export default function ExpenseDetailPage() {
  const [expense, setExpense] = useState({
    name: "Facebook Ads",
    description: "Campaign for February",
    amount: 5000,
    category: "Marketing",
    date: "2026-02-01",
    payment_method: "Bkash",
    reference: "INV-1021",
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-theme bg-(--card) p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Expense Details</h1>
          <ThemeToggle />
        </div>

        <EditableField
          label="Expense Name"
          value={expense.name}
          icon={FileText}
          onSave={(v) => setExpense({ ...expense, name: v })}
        />

        <EditableTextArea
          value={expense.description}
          onSave={(v) => setExpense({ ...expense, description: v })}
          placeholder="Description"
        />

        <EditableField
          label="Amount"
          value={expense.amount}
          prefix="৳ "
          icon={DollarSign}
          type="number"
          onSave={(v) => setExpense({ ...expense, amount: Number(v) })}
        />

        <EditableField
          label="Category"
          value={expense.category}
          icon={Tag}
          onSave={(v) => setExpense({ ...expense, category: v })}
        />

        <EditableField
          label="Date"
          value={expense.date}
          icon={Calendar}
          type="date"
          onSave={(v) => setExpense({ ...expense, date: v })}
        />

        <EditableField
          label="Payment Method"
          value={expense.payment_method}
          icon={CreditCard}
          type="select"
          options={["Cash", "Bkash", "Bank"]}
          onSave={(v) => setExpense({ ...expense, payment_method: v })}
        />

        <EditableField
          label="Reference"
          value={expense.reference}
          onSave={(v) => setExpense({ ...expense, reference: v })}
        />
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  icon: Icon,
  prefix = "",
  type = "text",
  options = [],
  onSave,
}) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-(--muted)">
        {label}
      </label>

      {editing ? (
        <div className="flex items-center gap-2 w-full min-w-0">
          {Icon && <Icon className="h-5 w-5 text-(--muted)" />}
          {type === "select" ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2 rounded-xl border bg-(--card) border-theme focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) =>
                setTempValue(
                  type === "number" ? Number(e.target.value) : e.target.value,
                )
              }
              className="flex-1 min-w-0 px-4 py-2 rounded-xl border bg-(--card) border-theme focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-between p-3 rounded-xl border border-theme hover:bg-(--muted/5) transition cursor-pointer group w-full min-w-0"
          onClick={() => setEditing(true)}
        >
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            {Icon && <Icon className="h-5 w-5 text-(--muted)" />}
            <span className="font-medium truncate">
              {prefix}
              {value}
            </span>
          </div>
          <Pencil className="h-4 w-4 text-(--muted) opacity-0 group-hover:opacity-100 transition" />
        </div>
      )}
    </div>
  );
}
function EditableTextArea({ value, onSave, placeholder, rows = 3 }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setEditing(false);
  };

  return (
    <div className="relative group w-full min-w-0">
      {editing ? (
        <div className="space-y-3 w-full min-w-0">
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            rows={rows}
            className="w-full min-w-0 px-4 py-3 rounded-xl border bg-(--card) border-theme focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder={placeholder}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Check className="h-4 w-4" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-theme rounded-xl hover:bg-(--muted/10) transition"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded-xl border border-theme hover:bg-(--muted/5) transition cursor-pointer w-full min-w-0"
          onClick={() => setEditing(true)}
        >
          <p className="text-(--text) whitespace-pre-line wrap-break-word">
            {value}
          </p>
        </div>
      )}
    </div>
  );
}
