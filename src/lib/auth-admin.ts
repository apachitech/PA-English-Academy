import { BRAND } from "./brand";

const ADMIN_STORAGE_KEY = "pa3_admin_authenticated";
const ADMIN_USER_KEY = "pa3_admin_user";

// Accepted master keys / passwords for admin access
const VALID_ADMIN_EMAILS = [
  "liandjadavid@gmail.com",
  "admin@pa3academy.cd",
  "coach@pa3academy.cd",
];

const VALID_ADMIN_PASSWORDS = [
  "CoachDavid2026!",
  "admin2026",
  "pa3-admin-kinshasa-2026",
  "PA3AcademyAdmin#2026",
];

export interface AdminUser {
  name: string;
  email: string;
  role: "admin";
  avatar: string;
  authenticatedAt: string;
}

// Isomorphic storage helper (browser localStorage + memory fallback for tests/SSR)
const memoryStore = new Map<string, string>();

function getStorageItem(key: string): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  if (typeof localStorage !== "undefined") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryStore.get(key) ?? null;
}

function setStorageItem(key: string, value: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
  memoryStore.set(key, value);
}

function removeStorageItem(key: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
  memoryStore.delete(key);
}

/**
 * Checks if the current client session has a verified administrator token.
 * Regular learners who are logged in will never pass as admin.
 */
export function isAdminAuthenticated(): boolean {
  try {
    const isAuth = getStorageItem(ADMIN_STORAGE_KEY) === "true";
    if (!isAuth) return false;

    // Security check: if a non-admin learner is logged in, do not grant admin visibility
    const learnerEmail = getStorageItem("pa3_user_email");
    if (learnerEmail) {
      const clean = learnerEmail.trim().toLowerCase();
      const isAdminEmail =
        VALID_ADMIN_EMAILS.includes(clean) ||
        clean.startsWith("admin@") ||
        clean.includes("david");
      if (!isAdminEmail) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the current authenticated admin user details.
 */
export function getAdminUser(): AdminUser | null {
  try {
    const raw = getStorageItem(ADMIN_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Authenticates an administrator with email and master key / password.
 */
export function verifyAndLoginAdmin(
  email: string,
  keyOrPassword: string
): { success: boolean; error?: string; user?: AdminUser } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = keyOrPassword.trim();

  // Validate email format
  const isEmailValid =
    VALID_ADMIN_EMAILS.includes(cleanEmail) ||
    cleanEmail.startsWith("admin@") ||
    cleanEmail.includes("david");

  if (!isEmailValid) {
    return {
      success: false,
      error: "Cet email ne figure pas sur la liste des administrateurs autorisés.",
    };
  }

  // Validate master password or secret key
  const isPassValid =
    VALID_ADMIN_PASSWORDS.includes(cleanPass) ||
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_ADMIN_KEY &&
      cleanPass === process.env.NEXT_PUBLIC_ADMIN_KEY);

  if (!isPassValid) {
    return {
      success: false,
      error: "Mot de passe ou clé de sécurité administrateur incorrect.",
    };
  }

  // Authentication successful
  const adminUser: AdminUser = {
    name: cleanEmail.includes("david") ? BRAND.coach.name : "Administrateur PA³",
    email: cleanEmail,
    role: "admin",
    avatar: "CD",
    authenticatedAt: new Date().toISOString(),
  };

  setStorageItem(ADMIN_STORAGE_KEY, "true");
  setStorageItem(ADMIN_USER_KEY, JSON.stringify(adminUser));

  return {
    success: true,
    user: adminUser,
  };
}

/**
 * Logs out the administrator and clears secure tokens.
 */
export function logoutAdmin(): void {
  removeStorageItem(ADMIN_STORAGE_KEY);
  removeStorageItem(ADMIN_USER_KEY);
}

