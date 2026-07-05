"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import AuthInput from "@/components/auth/AuthInput";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import SettingsToggle from "@/components/settings/SettingsToggle";
import { useAuthErrorMessage, useSignUp } from "@/hooks/useAuth";
import {
  parseYcdsbSignupEmail,
  YCDSB_EMAIL_DOMAIN,
  type YcdsbSignupRole,
} from "@/lib/ycdsb-email";
import { getPasswordValidationError } from "@/lib/password-validation";

export default function SignupForm() {
  const router = useRouter();
  const signUp = useSignUp();

  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const signupRole: YcdsbSignupRole = isAdminSignup ? "admin" : "student";

  const parsedEmail = useMemo(
    () =>
      email.trim() ? parseYcdsbSignupEmail(email, signupRole) : null,
    [email, signupRole],
  );

  const authError = useAuthErrorMessage(signUp.error);
  const isSubmitting = signUp.isPending;

  const showPasswordRequirements = passwordFocused || password.length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setConfirmationSent(false);

    if (!email.trim()) {
      setFormError("Email is required.");
      return;
    }

    const emailResult = parseYcdsbSignupEmail(email, signupRole);

    if (!emailResult.success) {
      setFormError(emailResult.error);
      return;
    }

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setFormError("You must accept the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      const result = await signUp.mutateAsync({
        email: email.trim(),
        password,
        role: signupRole,
      });

      if (result.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setConfirmationSent(true);
    } catch {
      // Validation and Supabase errors surface via signUp.error.
    }
  }

  const displayError = formError ?? authError;

  if (confirmationSent) {
    return (
      <>
        <div
          className="rounded-xl border border-secondary/20 bg-secondary/[0.08] px-4 py-4 text-center"
          role="status"
        >
          <MaterialSymbol
            icon="mark_email_read"
            className="mx-auto mb-3 text-3xl text-secondary"
          />
          <p className="text-body-lg font-medium text-on-surface">
            Check your email to confirm your account
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            We sent a confirmation link to{" "}
            <span className="font-medium text-on-surface">{email.trim()}</span>.
          </p>
        </div>

        <p className="mt-md border-t border-surface-variant/50 pt-md text-center text-body-md text-on-surface-variant">
          Already confirmed?{" "}
          <Link
            href="/login"
            className="text-label-sm font-label-sm uppercase text-secondary transition-colors hover:text-on-secondary-container"
          >
            Sign in
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
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
        <div className="flex items-center justify-between gap-3 rounded-xl border border-surface-variant/70 bg-surface px-4 py-3">
          <div>
            <p className="text-body-md font-medium text-on-surface">
              Admin account
            </p>
            <p className="text-body-sm text-on-surface-variant">
              {isAdminSignup
                ? "Staff email without graduation year"
                : "Student email with graduation year"}
            </p>
          </div>
          <SettingsToggle
            id="adminSignup"
            checked={isAdminSignup}
            disabled={isSubmitting}
            onChange={(checked) => {
              setIsAdminSignup(checked);
              setFormError(null);
            }}
          />
        </div>

        <div>
          <AuthInput
            id="email"
            label="School Email"
            type="email"
            placeholder={
              isAdminSignup
                ? `firstname.lastname@${YCDSB_EMAIL_DOMAIN}`
                : `firstname.lastname27@${YCDSB_EMAIL_DOMAIN}`
            }
            icon="mail"
            autoComplete="email"
            variant="secondary"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            required
          />
          <p className="mt-1.5 text-body-sm text-on-surface-variant">
            {isAdminSignup ? (
              <>
                Use your YCDSB staff email (e.g.{" "}
                <span className="font-medium text-on-surface">
                  alex.rivera@{YCDSB_EMAIL_DOMAIN}
                </span>
                ).
              </>
            ) : (
              <>
                Use your YCDSB email: firstname.lastname plus the last 2 digits
                of your graduation year (e.g.{" "}
                <span className="font-medium text-on-surface">
                  alex.rivera27@{YCDSB_EMAIL_DOMAIN}
                </span>
                ).
              </>
            )}
          </p>
        </div>

        {parsedEmail?.success ? (
          <div
            className="rounded-xl border border-secondary/20 bg-secondary/[0.06] px-4 py-3 text-body-md text-on-surface-variant"
            role="status"
          >
            <p className="font-medium text-on-surface">
              {parsedEmail.data.firstName} {parsedEmail.data.lastName}
            </p>
            <p className="mt-1">
              {parsedEmail.data.role === "admin" ? (
                <>Administrator</>
              ) : (
                <>
                  Grade {parsedEmail.data.grade} · Class of{" "}
                  {parsedEmail.data.graduationYear}
                </>
              )}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <AuthInput
            id="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            icon="lock"
            autoComplete="new-password"
            variant="secondary"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            disabled={isSubmitting}
            describedBy={
              showPasswordRequirements ? "password-requirements" : undefined
            }
            required
          />

          <PasswordRequirements
            password={password}
            visible={showPasswordRequirements}
          />
        </div>

        <AuthInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          icon="lock"
          autoComplete="new-password"
          variant="secondary"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={isSubmitting}
          required
        />

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            id="terms"
            type="checkbox"
            name="terms"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-outline-variant accent-secondary"
          />
          <span className="text-body-md leading-snug text-on-surface-variant">
            I agree to the{" "}
            <button
              type="button"
              className="text-secondary underline underline-offset-2 transition-colors hover:text-on-secondary-container"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-secondary underline underline-offset-2 transition-colors hover:text-on-secondary-container"
            >
              Privacy Policy
            </button>
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 text-label-sm font-label-sm uppercase text-on-secondary shadow-[0_4px_14px_rgba(0,102,136,0.25)] transition-[transform,opacity,box-shadow] duration-200 hover:opacity-95 hover:shadow-[0_6px_18px_rgba(0,102,136,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <MaterialSymbol icon="progress_activity" className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <MaterialSymbol icon="person_add" />
              Create Account
            </>
          )}
        </button>
      </form>

      <p className="mt-md border-t border-surface-variant/50 pt-md text-center text-body-md text-on-surface-variant">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-label-sm font-label-sm uppercase text-secondary transition-colors hover:text-on-secondary-container"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
