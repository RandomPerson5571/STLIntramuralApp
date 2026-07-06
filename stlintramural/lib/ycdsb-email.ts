export const YCDSB_EMAIL_DOMAIN = "ycdsbk12.ca";

const YCDSB_STUDENT_EMAIL_PATTERN =
  /^([a-z]+)\.([a-z]+)(\d{2})@ycdsbk12\.ca$/i;
const YCDSB_ADMIN_EMAIL_PATTERN = /^([a-z]+)\.([a-z]+)@ycdsbk12\.ca$/i;

export type YcdsbSignupRole = "student" | "admin";

export interface ParsedYcdsbStudentEmail {
  role: "student";
  firstName: string;
  lastName: string;
  graduationYear: number;
  grade: number;
}

export interface ParsedYcdsbAdminEmail {
  role: "admin";
  firstName: string;
  lastName: string;
}

export type ParsedYcdsbSignupEmail =
  | ParsedYcdsbStudentEmail
  | ParsedYcdsbAdminEmail;

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** Convert the 2-digit suffix in a student email to a full graduation year. */
function expandGraduationYearFromSuffix(
  twoDigitYear: number,
  referenceDate: Date,
): number {
  const currentYear = referenceDate.getFullYear();
  const century = Math.floor(currentYear / 100) * 100;
  let graduationYear = century + twoDigitYear;

  if (graduationYear < currentYear - 1) {
    graduationYear += 100;
  } else if (graduationYear > currentYear + 8) {
    graduationYear -= 100;
  }

  return graduationYear;
}

/** School year ends in June of this calendar year. */
function getAcademicYearEnd(referenceDate: Date): number {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();

  if (month >= 8) {
    return year + 1;
  }

  if (month <= 5) {
    return year;
  }

  return year + 1;
}

function hasGraduated(graduationYear: number, referenceDate: Date): boolean {
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();

  return graduationYear < year || (graduationYear === year && month >= 6);
}

export function calculateGrade(graduationYear: number, referenceDate: Date): number {
  const month = referenceDate.getMonth();
  const academicYearEnd = getAcademicYearEnd(referenceDate);
  const summerOffset = month >= 6 && month <= 7 ? 1 : 0;

  return 12 - (graduationYear - academicYearEnd + summerOffset);
}

function parseDomainError(normalized: string): { success: false; error: string } | null {
  if (!normalized.endsWith(`@${YCDSB_EMAIL_DOMAIN}`)) {
    return {
      success: false,
      error: `Email must use an @${YCDSB_EMAIL_DOMAIN} address.`,
    };
  }

  return null;
}

function parseStudentEmail(
  normalized: string,
  referenceDate: Date,
):
  | { success: true; data: ParsedYcdsbStudentEmail }
  | { success: false; error: string } {
  const domainError = parseDomainError(normalized);

  if (domainError) {
    return domainError;
  }

  const match = normalized.match(YCDSB_STUDENT_EMAIL_PATTERN);

  if (!match) {
    return {
      success: false,
      error: `Email must be in the format firstname.lastnameYY@${YCDSB_EMAIL_DOMAIN} (e.g. alex.rivera27@${YCDSB_EMAIL_DOMAIN}).`,
    };
  }

  const [, firstRaw, lastRaw, yearStr] = match;
  const twoDigitYear = Number.parseInt(yearStr, 10);
  const graduationYear = expandGraduationYearFromSuffix(
    twoDigitYear,
    referenceDate,
  );
  const currentYear = referenceDate.getFullYear();

  if (Number.isNaN(twoDigitYear)) {
    return {
      success: false,
      error: "Graduation year in email does not look valid.",
    };
  }

  if (
    graduationYear < currentYear - 1 ||
    graduationYear > currentYear + 8
  ) {
    return {
      success: false,
      error: "Graduation year in email does not look valid.",
    };
  }

  if (hasGraduated(graduationYear, referenceDate)) {
    return {
      success: false,
      error: "This email belongs to a student who has already graduated.",
    };
  }

  const grade = calculateGrade(graduationYear, referenceDate);

  if (grade < 9 || grade > 12) {
    return {
      success: false,
      error: "Only students in grades 9–12 can register.",
    };
  }

  return {
    success: true,
    data: {
      role: "student",
      firstName: titleCase(firstRaw),
      lastName: titleCase(lastRaw),
      graduationYear,
      grade,
    },
  };
}

function parseAdminEmail(
  normalized: string,
):
  | { success: true; data: ParsedYcdsbAdminEmail }
  | { success: false; error: string } {
  const domainError = parseDomainError(normalized);

  if (domainError) {
    return domainError;
  }

  const match = normalized.match(YCDSB_ADMIN_EMAIL_PATTERN);

  if (!match) {
    return {
      success: false,
      error: `Email must be in the format firstname.lastname@${YCDSB_EMAIL_DOMAIN} (e.g. alex.rivera@${YCDSB_EMAIL_DOMAIN}).`,
    };
  }

  const [, firstRaw, lastRaw] = match;

  return {
    success: true,
    data: {
      role: "admin",
      firstName: titleCase(firstRaw),
      lastName: titleCase(lastRaw),
    },
  };
}

export function parseYcdsbSignupEmail(
  email: string,
  role: YcdsbSignupRole,
  referenceDate: Date = new Date(),
):
  | { success: true; data: ParsedYcdsbSignupEmail }
  | { success: false; error: string } {
  const normalized = email.trim().toLowerCase();

  if (role === "admin") {
    return parseAdminEmail(normalized);
  }

  return parseStudentEmail(normalized, referenceDate);
}
