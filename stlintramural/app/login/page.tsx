import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In - STL Intramural",
  description: "Sign in to your STL Intramural account to manage teams, events, and points.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to track your points, check in to games, and manage your teams."
      variant="primary"
    >
      <LoginForm />
    </AuthLayout>
  );
}
