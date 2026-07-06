type MutationErrorOptions<E extends Error> = {
  DomainError: abstract new (...args: never[]) => E;
  fallback: string;
  /** Return a message, or null to use domain error's message. */
  mapDomainError?: (error: E) => string | null;
};

/** Normalize mutation errors into user-facing copy. */
export function getMutationErrorMessage<E extends Error>(
  error: unknown,
  { DomainError, fallback, mapDomainError }: MutationErrorOptions<E>,
): string | null {
  if (!error) return null;

  if (error instanceof DomainError) {
    const mapped = mapDomainError?.(error);
    if (mapped) return mapped;
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
