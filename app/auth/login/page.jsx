import LoginForm from "@/components/auth/LoginForm";
import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <AuthCard
        title="Welcome back"
        subtitle="Manage orders, inventory & invoices"
      >
        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black hover:underline"
          >
            Create one
          </Link>
        </p>
      </AuthCard>
    </>
  );
}
