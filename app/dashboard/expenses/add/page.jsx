"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function CreateExpensePage() {
  const [expense, setExpense] = useState({
    name: "",
    description: "",
    amount: "",
    category: "",
    date: "",
    payment_method: "",
    reference: "",
  });

  const field = "w-full px-4 py-2 rounded-xl border bg-(--card) border-theme";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(expense);
    alert("Expense created");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-theme bg-(--card) p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Expense</h1>
          <ThemeToggle />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className={field}
            placeholder="Expense Name"
            value={expense.name}
            onChange={(e) => setExpense({ ...expense, name: e.target.value })}
            required
          />

          <textarea
            className={field}
            rows={3}
            placeholder="Description"
            value={expense.description}
            onChange={(e) =>
              setExpense({ ...expense, description: e.target.value })
            }
          />

          <input
            type="number"
            className={field}
            placeholder="Amount"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className={field}
              placeholder="Category"
              value={expense.category}
              onChange={(e) =>
                setExpense({ ...expense, category: e.target.value })
              }
            />

            <input
              type="date"
              className={field}
              value={expense.date}
              onChange={(e) => setExpense({ ...expense, date: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className={field}
              value={expense.payment_method}
              onChange={(e) =>
                setExpense({ ...expense, payment_method: e.target.value })
              }
            >
              <option value="">Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Bkash">Bkash</option>
              <option value="Bank">Bank</option>
            </select>

            <input
              className={field}
              placeholder="Reference / Note"
              value={expense.reference}
              onChange={(e) =>
                setExpense({ ...expense, reference: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            <Save className="h-4 w-4" />
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
}
