"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/authApi";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => router.push("/login"),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate(form);
      }}
      className="space-y-4"
    >
      <Input
        label="Email address"
        type="email"
        placeholder="you@business.com"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        label="Phone number"
        placeholder="+880 1XXXXXXXXX"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {error && (
        <p className="text-sm text-red-600">Registration failed. Try again.</p>
      )}

      <Button loading={isPending}>Create account</Button>
    </form>
  );
}
