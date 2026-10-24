/**
 * Learner Authentication & Profile Helper
 * Manages learner login status, profile details, settings, and password updates in session/localStorage
 */

const LEARNER_LOGGED_IN_KEY = 'pa3_user_logged_in';
const LEARNER_EMAIL_KEY = 'pa3_user_email';
const LEARNER_NAME_KEY = 'pa3_user_name';
const LEARNER_CITY_KEY = 'pa3_user_city';
const LEARNER_AVATAR_KEY = 'pa3_user_avatar';
const LEARNER_PHONE_KEY = 'pa3_user_phone';
const LEARNER_BIO_KEY = 'pa3_user_bio';
const LEARNER_PASSWORD_KEY = 'pa3_user_password';
const LEARNER_DAILY_GOAL_KEY = 'pa3_daily_goal';
const LEARNER_DATA_SAVER_KEY = 'pa3_data_saver';
const LEARNER_PLAN_KEY = 'pa3_user_plan';
const LEARNER_PLAN_EXPIRY_KEY = 'pa3_user_plan_expires';
const LEARNER_JOINED_AT_KEY = 'pa3_user_joined_at';
const REGISTERED_USERS_KEY = 'pa3_registered_users';

/**
 * Pre-existing accounts already registered in the PA³ English Academy system
 */
export const DEFAULT_REGISTERED_EMAILS: string[] = [
  'liandjadavid@gmail.com',
  'admin@pa3academy.cd',
  'coach@pa3academy.cd',
  'grace.mwamba@pa3.cd',
  'patrick.kalonji@pa3.cd',
  'naomi.k@gmail.com',
  'gloire.m@yahoo.fr',
  'junior.ilunga@gmail.com',
  'dorcas.m@gmail.com',
  'prince.mulumba@gmail.com',
];

const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryStore.get(key) ?? null;
}

function setItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
  memoryStore.set(key, value);
}

function removeItem(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
  memoryStore.delete(key);
}

export interface LearnerProfile {
  name: string;
  email: string;
  city?: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  dailyGoalMin?: number;
  dataSaver?: boolean;
  activePlan?: string;
  activePlanExpiry?: string;
  joinedAt?: string;
}

export interface LearnerProgressStats {
  level: string;
  xp: number;
  streak: number;
  completedLessonsCount: number;
  completedLessons: string[];
  certificatesCount: number;
  badgesCount: number;
  dailyGoalMin: number;
  todayMinutes: number;
}

/**
 * Checks if a learner is currently logged in
 */
export function isLearnerAuthenticated(): boolean {
  try {
    return getItem(LEARNER_LOGGED_IN_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Gets the current learner profile details
 */
export function getLearnerProfile(): LearnerProfile | null {
  try {
    if (!isLearnerAuthenticated()) return null;

    const email = getItem(LEARNER_EMAIL_KEY) || '';
    const name = getItem(LEARNER_NAME_KEY) || email.split('@')[0] || 'Apprenant';
    const city = getItem(LEARNER_CITY_KEY) || 'Kinshasa';
    const avatarUrl = getItem(LEARNER_AVATAR_KEY) || undefined;
    const phone = getItem(LEARNER_PHONE_KEY) || undefined;
    const bio = getItem(LEARNER_BIO_KEY) || 'Objectif : Parler anglais avec assurance en RDC.';
    const goalStr = getItem(LEARNER_DAILY_GOAL_KEY);
    const dailyGoalMin = goalStr ? Number(goalStr) : 15;
    const dataSaver = getItem(LEARNER_DATA_SAVER_KEY) === 'true';
    const activePlan = getItem(LEARNER_PLAN_KEY) || 'Accès Gratuit A1';
    const activePlanExpiry = getItem(LEARNER_PLAN_EXPIRY_KEY) || 'Accès à vie';
    const joinedAt = getItem(LEARNER_JOINED_AT_KEY) || '2026';

    return {
      name,
      email,
      city,
      avatarUrl,
      phone,
      bio,
      dailyGoalMin,
      dataSaver,
      activePlan,
      activePlanExpiry,
      joinedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Logs in a learner and saves profile details
 */
export function loginLearner(
  email: string,
  name?: string,
  city?: string,
  avatarUrl?: string
): LearnerProfile {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name?.trim() || cleanEmail.split('@')[0] || 'Apprenant';
  const cleanCity = city?.trim() || 'Kinshasa';

  setItem(LEARNER_LOGGED_IN_KEY, 'true');
  setItem(LEARNER_EMAIL_KEY, cleanEmail);
  setItem(LEARNER_NAME_KEY, cleanName);
  setItem(LEARNER_CITY_KEY, cleanCity);

  // If this is a dedicated administrator (Coach David Liandja or admin), grant admin privileges
  const isDedicatedAdmin =
    cleanEmail === 'liandjadavid@gmail.com' ||
    cleanEmail === 'admin@pa3academy.cd' ||
    cleanEmail === 'coach@pa3academy.cd' ||
    cleanEmail === 'david.liandja@pa3.cd' ||
    cleanEmail.endsWith('@pa3academy.cd');

  if (isDedicatedAdmin) {
    setItem('pa3_admin_authenticated', 'true');
    setItem('pa3_admin_user', JSON.stringify({
      name: cleanName.includes('David') || cleanEmail.includes('david') ? 'Coach David Liandja' : 'Administrateur PA³',
      email: cleanEmail,
      role: 'admin',
      avatar: 'CD',
      authenticatedAt: new Date().toISOString(),
    }));
  } else {
    removeItem('pa3_admin_authenticated');
    removeItem('pa3_admin_user');
  }

  if (avatarUrl) {
    setItem(LEARNER_AVATAR_KEY, avatarUrl);
  }
  if (!getItem(LEARNER_JOINED_AT_KEY)) {
    setItem(LEARNER_JOINED_AT_KEY, new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }));
  }
  if (!getItem(LEARNER_PLAN_KEY)) {
    setItem(LEARNER_PLAN_KEY, 'Accès Gratuit A1');
  }

  const profile: LearnerProfile = {
    email: cleanEmail,
    name: cleanName,
    city: cleanCity,
    avatarUrl: getItem(LEARNER_AVATAR_KEY) || undefined,
    dailyGoalMin: Number(getItem(LEARNER_DAILY_GOAL_KEY) || '15'),
    dataSaver: getItem(LEARNER_DATA_SAVER_KEY) === 'true',
    activePlan: getItem(LEARNER_PLAN_KEY) || 'Accès Gratuit A1',
  };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pa3_auth_updated', { detail: profile }));
  }

  return profile;
}

/**
 * Updates editable fields in the learner profile
 */
export function updateLearnerProfile(updates: Partial<LearnerProfile>): LearnerProfile {
  if (updates.name !== undefined) setItem(LEARNER_NAME_KEY, updates.name.trim());
  if (updates.city !== undefined) setItem(LEARNER_CITY_KEY, updates.city.trim());
  if (updates.phone !== undefined) setItem(LEARNER_PHONE_KEY, updates.phone.trim());
  if (updates.bio !== undefined) setItem(LEARNER_BIO_KEY, updates.bio.trim());
  if (updates.avatarUrl !== undefined) {
    if (updates.avatarUrl) {
      setItem(LEARNER_AVATAR_KEY, updates.avatarUrl);
    } else {
      removeItem(LEARNER_AVATAR_KEY);
    }
  }
  if (updates.dailyGoalMin !== undefined) {
    setItem(LEARNER_DAILY_GOAL_KEY, String(updates.dailyGoalMin));
  }
  if (updates.dataSaver !== undefined) {
    setItem(LEARNER_DATA_SAVER_KEY, String(updates.dataSaver));
  }
  if (updates.activePlan !== undefined) {
    setItem(LEARNER_PLAN_KEY, updates.activePlan);
  }
  if (updates.activePlanExpiry !== undefined) {
    setItem(LEARNER_PLAN_EXPIRY_KEY, updates.activePlanExpiry);
  }

  const profile = getLearnerProfile();
  if (!profile) {
    throw new Error('Aucun profil apprenant actif.');
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pa3_auth_updated', { detail: profile }));
  }
  return profile;
}

/**
 * Changes learner password with validation
 */
export function changeLearnerPassword(
  oldPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  if (!isLearnerAuthenticated()) {
    return { success: false, error: 'Vous devez être connecté pour modifier votre mot de passe.' };
  }

  const trimmedNew = newPassword.trim();
  if (trimmedNew.length < 6) {
    return { success: false, error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' };
  }

  // If a password was previously saved, ensure current password matches
  const savedPassword = getItem(LEARNER_PASSWORD_KEY);
  if (savedPassword && oldPassword && oldPassword !== savedPassword) {
    return { success: false, error: 'Le mot de passe actuel est incorrect.' };
  }

  setItem(LEARNER_PASSWORD_KEY, trimmedNew);
  return { success: true };
}

/**
 * Retrieves aggregate progress stats for the logged-in learner
 */
export function getLearnerProgressStats(): LearnerProgressStats {
  let completedLessons: string[] = ['a1-salutations'];
  try {
    const raw = getItem('pa3_completed_lessons');
    if (raw) completedLessons = JSON.parse(raw);
  } catch {}

  const xp = Number(getItem('pa3_total_xp') || '60');
  const level = getItem('pa3_current_level') || 'A1';
  const goalStr = getItem('pa3_daily_goal');
  const dailyGoalMin = goalStr ? Number(goalStr) : 15;

  return {
    level,
    xp,
    streak: Math.max(1, Math.min(30, Math.floor(xp / 20))),
    completedLessonsCount: completedLessons.length,
    completedLessons,
    certificatesCount: level === 'A1' ? 1 : 2,
    badgesCount: Math.max(2, Math.min(10, completedLessons.length + 1)),
    dailyGoalMin,
    todayMinutes: Math.min(dailyGoalMin, 8),
  };
}

/**
 * Logs out the learner and clears session
 */
export function logoutLearner(): void {
  removeItem(LEARNER_LOGGED_IN_KEY);
  removeItem(LEARNER_EMAIL_KEY);
  removeItem(LEARNER_NAME_KEY);
  removeItem(LEARNER_CITY_KEY);
  removeItem(LEARNER_AVATAR_KEY);
  removeItem(LEARNER_PHONE_KEY);
  removeItem(LEARNER_BIO_KEY);
  removeItem(LEARNER_PASSWORD_KEY);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pa3_auth_updated', { detail: null }));
  }
}

export interface RegisteredUserRecord {
  email: string;
  name: string;
  city?: string;
  registeredAt: string;
}

/**
 * Returns all dynamically registered users stored in localStorage/session
 */
export function getRegisteredUsers(): RegisteredUserRecord[] {
  try {
    const raw = getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Checks whether an email address already exists in the PA³ Academy system
 * (either as a default account or a registered account).
 */
export function isEmailRegistered(email: string): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();

  // 1. Check in default pre-seeded accounts
  if (DEFAULT_REGISTERED_EMAILS.some((e) => e.toLowerCase() === clean)) {
    return true;
  }

  // 2. Check current active user email if set
  const currentEmail = getItem(LEARNER_EMAIL_KEY);
  if (currentEmail && currentEmail.trim().toLowerCase() === clean) {
    return true;
  }

  // 3. Check registered users list in storage
  const registered = getRegisteredUsers();
  return registered.some((u) => u.email.trim().toLowerCase() === clean);
}

/**
 * Registers a new learner account.
 * CRITICAL RULE: If the email already exists in the system, it strictly restricts the process
 * and returns a clear error with notification for the user.
 */
export function registerNewLearner(data: {
  email: string;
  name?: string;
  city?: string;
  password?: string;
  dailyGoal?: number;
}): { success: boolean; error?: string; profile?: LearnerProfile } {
  if (!data.email || !data.email.trim()) {
    return {
      success: false,
      error: 'Veuillez saisir une adresse e-mail valide.',
    };
  }

  const cleanEmail = data.email.trim().toLowerCase();

  // Basic email syntax check
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return {
      success: false,
      error: 'Format d\'adresse e-mail invalide. Exemple : nom@domaine.cd',
    };
  }

  // 🚨 RESTRICTION: Check if email already exists in the system
  if (isEmailRegistered(cleanEmail)) {
    return {
      success: false,
      error: `L'adresse e-mail « ${cleanEmail} » est déjà enregistrée dans le système de la PA³ English Academy. Veuillez vous connecter avec ce compte ou utiliser une autre adresse e-mail.`,
    };
  }

  // Append new user to registered registry
  const users = getRegisteredUsers();
  users.push({
    email: cleanEmail,
    name: data.name?.trim() || cleanEmail.split('@')[0] || 'Apprenant',
    city: data.city || 'Kinshasa',
    registeredAt: new Date().toISOString(),
  });
  setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

  // Log in user and establish session
  const profile = loginLearner(cleanEmail, data.name, data.city);

  if (data.password) {
    setItem(LEARNER_PASSWORD_KEY, data.password.trim());
  }
  if (data.dailyGoal) {
    setItem(LEARNER_DAILY_GOAL_KEY, String(data.dailyGoal));
  }

  return {
    success: true,
    profile,
  };
}

/**
 * Helper to clear registered users (useful for test isolation)
 */
export function clearRegisteredUsersForTesting(): void {
  removeItem(REGISTERED_USERS_KEY);
}

