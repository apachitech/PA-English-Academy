/**
 * Learner Authentication Helper
 * Manages learner login status and profile in browser session
 */

const LEARNER_LOGGED_IN_KEY = 'pa3_user_logged_in';
const LEARNER_EMAIL_KEY = 'pa3_user_email';
const LEARNER_NAME_KEY = 'pa3_user_name';
const LEARNER_CITY_KEY = 'pa3_user_city';

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
    return {
      name: getItem(LEARNER_NAME_KEY) || 'Apprenant',
      email: getItem(LEARNER_EMAIL_KEY) || '',
      city: getItem(LEARNER_CITY_KEY) || 'Kinshasa',
    };
  } catch {
    return null;
  }
}

/**
 * Logs in a learner and saves profile details
 */
export function loginLearner(email: string, name?: string, city?: string): LearnerProfile {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name?.trim() || cleanEmail.split('@')[0] || 'Apprenant';
  const cleanCity = city?.trim() || 'Kinshasa';

  setItem(LEARNER_LOGGED_IN_KEY, 'true');
  setItem(LEARNER_EMAIL_KEY, cleanEmail);
  setItem(LEARNER_NAME_KEY, cleanName);
  setItem(LEARNER_CITY_KEY, cleanCity);

  return {
    email: cleanEmail,
    name: cleanName,
    city: cleanCity,
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
}
