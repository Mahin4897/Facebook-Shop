"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/authApi";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => router.push("/dashboard"),
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
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {error && (
        <p className="text-sm text-red-600">Invalid email or password</p>
      )}

      <Button loading={isPending}>Sign in</Button>
    </form>
  );
}
