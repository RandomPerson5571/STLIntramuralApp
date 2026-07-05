type AuthErrorDetails = {
  message?: string;
  status?: number;
  code?: string;
  name?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readAuthErrorDetails(error: unknown): AuthErrorDetails {
  if (error instanceof Error) {
    const authError = error as Error & AuthErrorDetails;
    return {
      message: authError.message,
      status: authError.status,
      code: authError.code,
      name: authError.name,
    };
  }

  if (isRecord(error)) {
    return {
      message: typeof error.message === "string" ? error.message : undefined,
      status: typeof error.status === "number" ? error.status : undefined,
      code: typeof error.code === "string" ? error.code : undefined,
      name: typeof error.name === "string" ? error.name : undefined,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return {};
}

function isUnhelpfulMessage(message: string | undefined): boolean {
  if (!message) {
    return true;
  }

  const trimmed = message.trim();
  return (
    trimmed === "" || trimmed === "{}" || trimmed === "[object Object]"
  );
}

function getRetryableFetchMessage(status: number | undefined): string {
  if (status === 0) {
    return "Network error. Check your connection and try again.";
  }

  if (status && status >= 500) {
    return "Something went wrong on our end. Please try again in a moment.";
  }

  return "Unable to reach the authentication service. Please try again.";
}

function mapKnownAuthMessage(message: string, code?: string): string | null {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Invalid email or password.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists.";
  }

  if (normalized.includes("database error saving new user")) {
    return "We couldn't finish setting up your account. Please try again or contact support.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests")
  ) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (normalized.includes("signup is disabled")) {
    return "New account registration is currently unavailable.";
  }

  if (normalized.includes("invalid email")) {
    return "That email address does not look valid.";
  }

  if (normalized.includes("password")) {
    return message;
  }

  if (code === "unexpected_failure") {
    return "We couldn't complete that request. Please try again or contact support.";
  }

  return null;
}

/** Normalize auth, network, and validation errors into user-facing copy. */
export function getAuthErrorMessage(error: unknown): string {
  const { message, status, code, name } = readAuthErrorDetails(error);

  if (name === "AuthRetryableFetchError" || isUnhelpfulMessage(message)) {
    const retryMessage = getRetryableFetchMessage(status);
    if (!isUnhelpfulMessage(message)) {
      const mapped = mapKnownAuthMessage(message!, code);
      if (mapped) {
        return mapped;
      }
    }
    return retryMessage;
  }

  const mapped = mapKnownAuthMessage(message!, code);
  if (mapped) {
    return mapped;
  }

  return message!;
}
