import RegisterForm from "@/components/auth/RegisterForm";
import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function RegisterPage() {
  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <AuthCard
        title="Create your account"
        subtitle="Start managing your Facebook shop today"
      >
        <RegisterForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </>
  );
}
