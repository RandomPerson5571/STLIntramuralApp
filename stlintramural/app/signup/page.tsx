import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up - STL Intramural",
  description: "Create your STL Intramural account and join leagues across campus.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join The League"
      subtitle="Create your account to register for events, earn points, and compete."
      variant="secondary"
    >
      <SignupForm />
    </AuthLayout>
  );
}
