"use client";

import { useState } from "react";

interface CustomerFormProps {
  onSave: (customer: { id: number; name: string; phone: string; address: string }) => void;
}

export default function CustomerForm({ onSave }: CustomerFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Select / Add Customer</h2>

      <input
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border"
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border"
      />

      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border resize-none"
        rows={3}
      />

      <button
        onClick={() =>
          onSave({
            id: Date.now(),
            name,
            phone,
            address,
          })
        }
        className="w-full py-3 bg-blue-600 text-white rounded-xl"
      >
        Save Customer
      </button>
    </div>
  );
}
