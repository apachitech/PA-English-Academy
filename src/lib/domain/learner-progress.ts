/**
 * PA³ English Academy - Centralized Learner Progress Tracking Engine
 * Records every lesson attempt, quiz score, speech evaluation, and placement assessment.
 * Synchronizes seamlessly with the admin dashboard for instant inspection by Coach David.
 */

import { PlacementResult } from "./placement";
import { SAMPLE_LESSONS } from "./lessons-data";

export interface LessonProgressEntry {
  slug: string;
  lessonTitle: string;
  level: string; // 'A1' | 'A2' | 'B1' | 'B2'
  score: number;
  passed: boolean;
  xpEarned: number;
  completedAt: string;
}

export interface AssessmentProgressEntry {
  id: string;
  completedAt: string;
  scorePct: number;
  recommendedLevel: string;
  skillScores: Record<string, number>;
  totalQuestions: number;
  correctAnswers: number;
}

export interface LearnerDetailedProgress {
  email: string;
  name: string;
  city: string;
  phone?: string;
  currentLevel: string;
  totalXp: number;
  streakDays: number;
  lastActive: string;
  lessons: LessonProgressEntry[];
  assessments: AssessmentProgressEntry[];
}

const STORAGE_KEYS = {
  DETAILED_PROGRESS: "pa3_learners_detailed_progress",
  COMPLETED_LESSONS: "pa3_completed_lessons",
  TOTAL_XP: "pa3_total_xp",
  CURRENT_LEVEL: "pa3_current_level",
  PLACEMENT_RESULT: "pa3_placement_result",
  USER_EMAIL: "pa3_user_email",
  USER_NAME: "pa3_user_name",
  USER_CITY: "pa3_user_city",
  ADMIN_LEARNERS: "pa3_admin_learners",
};

// Memory fallback for SSR & testing
const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryStore.get(key) ?? null;
}

function setItem(key: string, value: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
  memoryStore.set(key, value);
}

/**
 * Returns the current active learner's email or fallback
 */
export function getCurrentLearnerEmail(): string {
  const email = getItem(STORAGE_KEYS.USER_EMAIL);
  if (email && email.trim()) return email.trim().toLowerCase();
  return "apprenant.demo@pa3.cd";
}

/**
 * Returns the current active learner's name or fallback
 */
export function getCurrentLearnerName(): string {
  const name = getItem(STORAGE_KEYS.USER_NAME);
  if (name && name.trim()) return name.trim();
  const email = getCurrentLearnerEmail();
  return email.split("@")[0] || "Apprenant PA³";
}

/**
 * Sets current learner identity (used in session and testing)
 */
export function setCurrentLearnerIdentity(email: string, name: string, city: string = "Kinshasa"): void {
  setItem(STORAGE_KEYS.USER_EMAIL, email);
  setItem(STORAGE_KEYS.USER_NAME, name);
  setItem(STORAGE_KEYS.USER_CITY, city);
}

/**
 * Resets storage for unit tests
 */
export function clearAllProgressForTesting(): void {
  memoryStore.clear();
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.DETAILED_PROGRESS);
      window.localStorage.removeItem(STORAGE_KEYS.COMPLETED_LESSONS);
      window.localStorage.removeItem(STORAGE_KEYS.TOTAL_XP);
      window.localStorage.removeItem(STORAGE_KEYS.CURRENT_LEVEL);
      window.localStorage.removeItem(STORAGE_KEYS.PLACEMENT_RESULT);
      window.localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      window.localStorage.removeItem(STORAGE_KEYS.USER_NAME);
      window.localStorage.removeItem(STORAGE_KEYS.USER_CITY);
      window.localStorage.removeItem(STORAGE_KEYS.ADMIN_LEARNERS);
    } catch {}
  }
}

/**
 * Returns all detailed progress records indexed by email
 */
export function getAllLearnersProgress(): Record<string, LearnerDetailedProgress> {
  try {
    const raw = getItem(STORAGE_KEYS.DETAILED_PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/**
 * Saves all detailed progress records
 */
function saveAllLearnersProgress(records: Record<string, LearnerDetailedProgress>): void {
  setItem(STORAGE_KEYS.DETAILED_PROGRESS, JSON.stringify(records));
}

/**
 * Retrieves detailed progression for a given user or the current active user
 */
export function getLearnerDetailedProgress(email?: string): LearnerDetailedProgress {
  const targetEmail = (email || getCurrentLearnerEmail()).trim().toLowerCase();
  const all = getAllLearnersProgress();

  if (all[targetEmail]) {
    return all[targetEmail];
  }

  // Generate initial progress record from standard storage
  let completedSlugs: string[] = [];
  try {
    const rawCompleted = getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    if (rawCompleted) completedSlugs = JSON.parse(rawCompleted);
  } catch {}

  const xp = Number(getItem(STORAGE_KEYS.TOTAL_XP) || "60");
  const level = getItem(STORAGE_KEYS.CURRENT_LEVEL) || "A1";
  const name = getItem(STORAGE_KEYS.USER_NAME) || targetEmail.split("@")[0] || "Apprenant PA³";
  const city = getItem(STORAGE_KEYS.USER_CITY) || "Kinshasa";

  const lessons: LessonProgressEntry[] = completedSlugs.map((slug, idx) => {
    const lessonMeta = SAMPLE_LESSONS[slug]?.lesson;
    const inferredLevel = slug.startsWith("a1-")
      ? "A1"
      : slug.startsWith("a2-")
      ? "A2"
      : slug.startsWith("b1-")
      ? "B1"
      : "B2";

    return {
      slug,
      lessonTitle: lessonMeta?.title_fr || slug,
      level: inferredLevel,
      score: 85 + (idx % 15),
      passed: true,
      xpEarned: lessonMeta?.xp_reward || 20,
      completedAt: new Date(Date.now() - (completedSlugs.length - idx) * 86400000).toISOString(),
    };
  });

  const assessments: AssessmentProgressEntry[] = [];
  try {
    const rawPlacement = getItem(STORAGE_KEYS.PLACEMENT_RESULT);
    if (rawPlacement) {
      const p = JSON.parse(rawPlacement);
      assessments.push({
        id: "eval-init",
        completedAt: new Date().toISOString(),
        scorePct: p.overallScorePct || 75,
        recommendedLevel: p.recommendedStartingLevel || level,
        skillScores: p.skillBreakdown || {
          vocabulary: 80,
          grammar: 70,
          reading: 85,
          listening: 75,
          speaking: 65,
        },
        totalQuestions: 16,
        correctAnswers: Math.round(((p.overallScorePct || 75) / 100) * 16),
      });
    }
  } catch {}

  const newRecord: LearnerDetailedProgress = {
    email: targetEmail,
    name,
    city,
    currentLevel: level,
    totalXp: xp,
    streakDays: Math.max(1, Math.min(30, Math.floor(xp / 20))),
    lastActive: "Aujourd’hui",
    lessons,
    assessments,
  };

  all[targetEmail] = newRecord;
  saveAllLearnersProgress(all);
  return newRecord;
}

/**
 * Records completion of an interactive lesson by the user
 */
export function recordLessonCompletion(
  slug: string,
  score: number,
  xpReward: number
): { success: boolean; progress: LearnerDetailedProgress } {
  const email = getCurrentLearnerEmail();
  const all = getAllLearnersProgress();
  const current = getLearnerDetailedProgress(email);

  const lessonMeta = SAMPLE_LESSONS[slug]?.lesson;
  const inferredLevel = slug.startsWith("a1-")
    ? "A1"
    : slug.startsWith("a2-")
    ? "A2"
    : slug.startsWith("b1-")
    ? "B1"
    : "B2";

  const title = lessonMeta?.title_fr || slug;
  const passed = score >= (lessonMeta?.pass_mark || 70);

  // Check if previously recorded
  const existingIdx = current.lessons.findIndex((l) => l.slug === slug);
  const entry: LessonProgressEntry = {
    slug,
    lessonTitle: title,
    level: inferredLevel,
    score,
    passed,
    xpEarned: passed ? xpReward : Math.round(xpReward * 0.3),
    completedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    current.lessons[existingIdx] = entry;
  } else {
    current.lessons.push(entry);
  }

  // Update total XP and last active
  if (passed && existingIdx < 0) {
    current.totalXp += xpReward;
    // Update global total XP storage
    const currentStorageXp = Number(getItem(STORAGE_KEYS.TOTAL_XP) || "60");
    setItem(STORAGE_KEYS.TOTAL_XP, String(currentStorageXp + xpReward));
  }
  current.lastActive = "En ligne maintenant";

  // Update standard completed lessons storage
  try {
    const raw = getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(slug) && passed) {
      list.push(slug);
      setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(list));
    }
  } catch {}

  all[email] = current;
  saveAllLearnersProgress(all);

  // Synchronize to admin learners directory
  syncProgressToAdminRegistry(current);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pa3_progress_updated", { detail: current }));
    window.dispatchEvent(new CustomEvent("pa3_xp_updated", { detail: current.totalXp }));
  }

  return { success: true, progress: current };
}

/**
 * Records completion of the placement test / diagnostic assessment
 */
export function recordAssessmentCompletion(
  result: PlacementResult
): { success: boolean; progress: LearnerDetailedProgress } {
  const email = getCurrentLearnerEmail();
  const all = getAllLearnersProgress();
  const current = getLearnerDetailedProgress(email);

  const skillScoresMap: Record<string, number> = {};
  if (result.skillScores) {
    Object.entries(result.skillScores).forEach(([k, v]) => {
      skillScoresMap[k] =
        typeof v === "object" && v !== null && "percentage" in v
          ? (v as { percentage: number }).percentage
          : Number(v);
    });
  }

  const entry: AssessmentProgressEntry = {
    id: `eval-${Date.now()}`,
    completedAt: new Date().toISOString(),
    scorePct:
      result.overallPercentage ??
      ((result as unknown as { overallScorePct?: number }).overallScorePct || 0),
    recommendedLevel: result.recommendedStartingLevel,
    skillScores: skillScoresMap,
    totalQuestions: result.totalQuestions,
    correctAnswers: result.totalCorrect,
  };

  current.assessments.unshift(entry);
  current.currentLevel = result.recommendedStartingLevel;
  current.totalXp += 30; // 30 XP bonus for completing assessment
  current.lastActive = "En ligne maintenant";

  // Update global level & XP storage
  setItem(STORAGE_KEYS.CURRENT_LEVEL, result.recommendedStartingLevel);
  const currentStorageXp = Number(getItem(STORAGE_KEYS.TOTAL_XP) || "60");
  setItem(STORAGE_KEYS.TOTAL_XP, String(currentStorageXp + 30));

  all[email] = current;
  saveAllLearnersProgress(all);

  // Synchronize to admin learners directory
  syncProgressToAdminRegistry(current);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pa3_progress_updated", { detail: current }));
    window.dispatchEvent(new CustomEvent("pa3_level_updated", { detail: result.recommendedStartingLevel }));
    window.dispatchEvent(new CustomEvent("pa3_xp_updated", { detail: current.totalXp }));
  }

  return { success: true, progress: current };
}

/**
 * Synchronizes detailed learner progress into the admin learners table in localStorage
 */
export function syncProgressToAdminRegistry(progress: LearnerDetailedProgress): void {
  try {
    const raw = getItem(STORAGE_KEYS.ADMIN_LEARNERS);
    if (!raw) return;

    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return;

    const idx = list.findIndex(
      (l) => l.email && l.email.toLowerCase() === progress.email.toLowerCase()
    );

    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        level: progress.currentLevel,
        lessonsDone: progress.lessons.filter((l) => l.passed).length,
        totalXp: progress.totalXp,
        streakDays: progress.streakDays,
        lastActive: progress.lastActive,
      };
    } else {
      // Add dynamically registered learner
      list.push({
        id: `lrn-${Date.now().toString().slice(-4)}`,
        name: progress.name,
        email: progress.email,
        phone: progress.phone || "+243 81 000 0000",
        city: progress.city,
        level: progress.currentLevel,
        role: "learner",
        status: "active",
        lessonsDone: progress.lessons.filter((l) => l.passed).length,
        totalXp: progress.totalXp,
        streakDays: progress.streakDays,
        lastActive: progress.lastActive,
      });
    }

    setItem(STORAGE_KEYS.ADMIN_LEARNERS, JSON.stringify(list));
  } catch {}
}
