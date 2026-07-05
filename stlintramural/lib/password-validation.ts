export const PASSWORD_MIN_LENGTH = 6;

export type PasswordRequirementId =
  | "length"
  | "lowercase"
  | "uppercase"
  | "digit"
  | "symbol";

export interface PasswordRequirement {
  id: PasswordRequirementId;
  label: string;
  met: boolean;
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "At least 6 characters",
      met: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "digit",
      label: "One number",
      met: /\d/.test(password),
    },
    {
      id: "symbol",
      label: "One symbol (!@#$…)",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

export function isPasswordValid(password: string): boolean {
  return getPasswordRequirements(password).every((requirement) => requirement.met);
}

export function getPasswordValidationError(password: string): string | null {
  if (isPasswordValid(password)) {
    return null;
  }

  return "Password must meet all requirements below.";
}
