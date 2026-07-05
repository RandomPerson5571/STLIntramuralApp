"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import AuthInput from "@/components/auth/AuthInput";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import {
  useAuthErrorMessage,
  useResetPassword,
  useSignIn,
} from "@/hooks/useAuth";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";

export default function LoginForm() {
  const router = useRouter();
  const signIn = useSignIn();
  const resetPassword = useResetPassword();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const authError = useAuthErrorMessage(signIn.error ?? resetPassword.error);
  const isSubmitting = signIn.isPending;
  const isResetting = resetPassword.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setResetSuccess(false);

    if (!email.trim() || !password) {
      setFormError("Email and password are required.");
      return;
    }

    try {
      await signIn.mutateAsync({ email: email.trim(), password });
      router.push("/");
      router.refresh();
    } catch {
      // Error surfaced via signIn.error
    }
  }

  async function handleForgotPassword() {
    setFormError(null);
    setResetSuccess(false);

    if (!email.trim()) {
      setFormError("Enter your email address to reset your password.");
      return;
    }

    try {
      await resetPassword.mutateAsync({
        email: email.trim(),
        redirectTo: getAuthCallbackUrl("/login"),
      });
      setResetSuccess(true);
      setShowForgotPassword(false);
    } catch {
      // Error surfaced via resetPassword.error
    }
  }

  const displayError = formError ?? authError;

  return (
    <>
      {resetSuccess ? (
        <div
          className="mb-md rounded-xl border border-secondary/20 bg-secondary/[0.08] px-4 py-3 text-body-md text-on-surface"
          role="status"
        >
          Check your email for a password reset link.
        </div>
      ) : null}

      {displayError ? (
        <div
          className="mb-md rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-body-md text-error"
          role="alert"
        >
          {displayError}
        </div>
      ) : null}

      <form
        className="flex flex-col gap-md"
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@university.edu"
          icon="mail"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon="lock"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-x-sm gap-y-2">
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-outline-variant accent-primary"
            />
            <span className="text-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
              Remember me
            </span>
          </label>

          <button
            type="button"
            className="text-label-sm font-label-sm uppercase text-primary transition-colors hover:text-primary-fixed-variant disabled:opacity-60"
            disabled={isSubmitting || isResetting}
            onClick={() => {
              setShowForgotPassword((current) => !current);
              setFormError(null);
              setResetSuccess(false);
              resetPassword.reset();
            }}
          >
            Forgot password?
          </button>
        </div>

        {showForgotPassword ? (
          <div className="rounded-xl border border-surface-variant/70 bg-surface px-4 py-3">
            <p className="mb-3 text-body-md text-on-surface-variant">
              We&apos;ll email you a link to reset your password.
            </p>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.06] py-2.5 text-label-sm font-label-sm uppercase text-primary transition-colors hover:bg-primary/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isResetting || isSubmitting}
              onClick={handleForgotPassword}
            >
              {isResetting ? (
                <>
                  <MaterialSymbol icon="progress_activity" className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MaterialSymbol icon="mail" />
                  Send reset link
                </>
              )}
            </button>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-label-sm font-label-sm uppercase text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)] transition-[transform,background-color,box-shadow] duration-200 hover:bg-primary-fixed-variant hover:shadow-[0_6px_18px_rgba(0,48,174,0.28)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <MaterialSymbol icon="progress_activity" className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <MaterialSymbol icon="login" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-md">
        <div className="relative mb-sm flex items-center justify-center">
          <span className="absolute inset-x-0 h-px bg-surface-variant/60" />
          <span className="relative bg-surface-container-lowest px-2 text-label-sm font-label-sm uppercase text-outline">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="SSO is not configured yet"
            className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-surface-variant/70 py-2 text-label-sm font-label-sm uppercase text-on-surface opacity-50"
          >
            <MaterialSymbol icon="school" className="text-base" />
            SSO
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="Campus ID sign-in is not configured yet"
            className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-surface-variant/70 py-2 text-label-sm font-label-sm uppercase text-on-surface opacity-50"
          >
            <MaterialSymbol icon="badge" className="text-base" />
            Campus ID
          </button>
        </div>
      </div>

      <p className="mt-md border-t border-surface-variant/50 pt-md text-center text-body-md text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-label-sm font-label-sm uppercase text-primary transition-colors hover:text-primary-fixed-variant"
        >
          Create one
        </Link>
      </p>
    </>
  );
}
