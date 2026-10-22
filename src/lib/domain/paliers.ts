export interface Palier {
  id: string;
  code: string;               // e.g. "A1", "A2", "B1", "B2", "C1", "C2", "PRO", "BIZ"
  titleFr: string;            // e.g. "Palier A1 - Débutant Fondamental"
  titleEn: string;            // e.g. "A1 - Beginner Essentials"
  descriptionFr: string;      // e.g. "Salutations, vie quotidienne, se présenter à Kinshasa."
  badgeIcon: string;          // e.g. "🌱", "🚀", "💼", "🏆", "👑", "💎"
  colorTheme: 'emerald' | 'blue' | 'indigo' | 'purple' | 'amber' | 'rose';
  position: number;           // 1, 2, 3, 4, 5...
  isFree: boolean;            // true for A1, false for higher levels
  requiredXp: number;         // e.g. 0, 500, 1200, 2500...
  passingScorePct: number;    // e.g. 75
  status: 'published' | 'draft' | 'archived';
  estimatedWeeks?: number;    // e.g. 4 semaines
  targetLearner?: string;     // e.g. "Débutant complet sans base en anglais"
}

export const INITIAL_PALIERS: Palier[] = [
  {
    id: "palier-a1",
    code: "A1",
    titleFr: "Palier A1 - Débutant Fondamental",
    titleEn: "A1 - Beginner Essentials",
    descriptionFr: "Saluer, se présenter, faire des achats à Kinshasa et compter jusqu'à 20.",
    badgeIcon: "🌱",
    colorTheme: "emerald",
    position: 1,
    isFree: true,
    requiredXp: 0,
    passingScorePct: 70,
    status: "published",
    estimatedWeeks: 4,
    targetLearner: "Débutant complet sans base préalable",
  },
  {
    id: "palier-a2",
    code: "A2",
    titleFr: "Palier A2 - Élémentaire Quotidien",
    titleEn: "A2 - Elementary Communication",
    descriptionFr: "Décrire son entourage, ses routines, poser des questions et se débrouiller en voyage.",
    badgeIcon: "🚀",
    colorTheme: "blue",
    position: 2,
    isFree: false,
    requiredXp: 500,
    passingScorePct: 75,
    status: "published",
    estimatedWeeks: 6,
    targetLearner: "Capacité à former des phrases simples",
  },
  {
    id: "palier-b1",
    code: "B1",
    titleFr: "Palier B1 - Intermédiaire Professionnel",
    titleEn: "B1 - Intermediate Fluency",
    descriptionFr: "Échanger au travail, rédiger des e-mails, donner son opinion et négocier.",
    badgeIcon: "💼",
    colorTheme: "indigo",
    position: 3,
    isFree: false,
    requiredXp: 1200,
    passingScorePct: 75,
    status: "published",
    estimatedWeeks: 8,
    targetLearner: "Professionnels et étudiants universitaires",
  },
  {
    id: "palier-b2",
    code: "B2",
    titleFr: "Palier B2 - Avancé & Affaires",
    titleEn: "B2 - Upper Intermediate / Business",
    descriptionFr: "Présentations professionnelles, débats complexes, réunions d'affaires et rédaction formelle.",
    badgeIcon: "🏆",
    colorTheme: "amber",
    position: 4,
    isFree: false,
    requiredXp: 2500,
    passingScorePct: 80,
    status: "published",
    estimatedWeeks: 10,
    targetLearner: "Cadres, managers et candidats aux certifications",
  },
  {
    id: "palier-c1",
    code: "C1",
    titleFr: "Palier C1 - Expert & Bilinguisme",
    titleEn: "C1 - Advanced Fluency & Mastery",
    descriptionFr: "Maîtrise fluide, nuances idiomatiques, anglais académique, préparation TOEFL/IELTS.",
    badgeIcon: "👑",
    colorTheme: "purple",
    position: 5,
    isFree: false,
    requiredXp: 4500,
    passingScorePct: 85,
    status: "draft",
    estimatedWeeks: 12,
    targetLearner: "Experts internationaux, diplomates et chercheurs",
  },
];

export const PALIERS_STORAGE_KEY = "pa3_admin_paliers";

export function getStoredPaliers(): Palier[] {
  if (typeof window === "undefined") return INITIAL_PALIERS;
  try {
    const raw = localStorage.getItem(PALIERS_STORAGE_KEY);
    if (!raw) return INITIAL_PALIERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_PALIERS;
}

export function saveStoredPaliers(paliers: Palier[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PALIERS_STORAGE_KEY, JSON.stringify(paliers));
  } catch {
    // ignore
  }
}
