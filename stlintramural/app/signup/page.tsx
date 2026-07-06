import type { Metadata } from "next";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign Up",
  description: "Create your STL Intramural account and join leagues across campus.",
  path: "/signup",
});

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
