/**
 * PA³ English Academy - Gamification Engine
 * Streaks, XP, League Tiers, Badges, and Weekly Leaderboards
 */

export interface BadgeDefinition {
  code: string;
  title_fr: string;
  description_fr: string;
  icon: string;
  criteria: {
    type: 'lessons' | 'streak' | 'perfect' | 'xp' | 'certificates' | 'placement';
    value: number;
  };
  position: number;
}

export const OFFICIAL_BADGES: BadgeDefinition[] = [
  {
    code: 'first_lesson',
    title_fr: 'Premier pas',
    description_fr: 'Terminer votre première leçon avec succès.',
    icon: '👣',
    criteria: { type: 'lessons', value: 1 },
    position: 1,
  },
  {
    code: 'lessons_10',
    title_fr: 'Élève assidu',
    description_fr: 'Terminer 10 leçons sur la plateforme.',
    icon: '📖',
    criteria: { type: 'lessons', value: 10 },
    position: 2,
  },
  {
    code: 'streak_3',
    title_fr: 'En route !',
    description_fr: 'Pratiquer 3 jours d’affilée.',
    icon: '🔥',
    criteria: { type: 'streak', value: 3 },
    position: 3,
  },
  {
    code: 'streak_7',
    title_fr: 'Une semaine de feu',
    description_fr: 'Pratiquer 7 jours d’affilée sans interruption.',
    icon: '⚡',
    criteria: { type: 'streak', value: 7 },
    position: 4,
  },
  {
    code: 'streak_30',
    title_fr: 'Léopard de la RDC',
    description_fr: '30 jours d’affilée ! Détermination légendaire.',
    icon: '🐆',
    criteria: { type: 'streak', value: 30 },
    position: 5,
  },
  {
    code: 'perfect',
    title_fr: 'Sans faute',
    description_fr: 'Obtenir 100 % de réussite à une leçon.',
    icon: '⭐',
    criteria: { type: 'perfect', value: 1 },
    position: 6,
  },
  {
    code: 'xp_500',
    title_fr: 'Champion 500 XP',
    description_fr: 'Accumuler au moins 500 points d’expérience.',
    icon: '🏆',
    criteria: { type: 'xp', value: 500 },
    position: 7,
  },
  {
    code: 'certificate_1',
    title_fr: 'Diplômé officiel',
    description_fr: 'Décrocher votre premier certificat officiel PA³.',
    icon: '📜',
    criteria: { type: 'certificates', value: 1 },
    position: 8,
  },
  {
    code: 'placement',
    title_fr: 'Je me connais',
    description_fr: 'Compléter l’évaluation diagnostique de niveau.',
    icon: '🧭',
    criteria: { type: 'placement', value: 1 },
    position: 9,
  },
];

export type LeagueTier = 'bronze' | 'argent' | 'or' | 'saphir' | 'diamant';

export interface LeagueInfo {
  tier: LeagueTier;
  label_fr: string;
  minXp: number;
  badgeIcon: string;
  colorHex: string;
  bgClass: string;
  borderClass: string;
}

export const LEAGUE_TIERS: Record<LeagueTier, LeagueInfo> = {
  bronze: {
    tier: 'bronze',
    label_fr: 'Ligue Bronze',
    minXp: 0,
    badgeIcon: '🥉',
    colorHex: '#CD7F32',
    bgClass: 'bg-amber-100 text-amber-900 border-amber-300',
    borderClass: 'border-amber-400',
  },
  argent: {
    tier: 'argent',
    label_fr: 'Ligue Argent',
    minXp: 150,
    badgeIcon: '🥈',
    colorHex: '#9E9E9E',
    bgClass: 'bg-slate-100 text-slate-900 border-slate-300',
    borderClass: 'border-slate-400',
  },
  or: {
    tier: 'or',
    label_fr: 'Ligue Or',
    minXp: 350,
    badgeIcon: '🥇',
    colorHex: '#F5A623',
    bgClass: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    borderClass: 'border-yellow-400',
  },
  saphir: {
    tier: 'saphir',
    label_fr: 'Ligue Saphir',
    minXp: 700,
    badgeIcon: '💎',
    colorHex: '#0070F3',
    bgClass: 'bg-blue-100 text-blue-900 border-blue-300',
    borderClass: 'border-blue-400',
  },
  diamant: {
    tier: 'diamant',
    label_fr: 'Ligue Diamant',
    minXp: 1200,
    badgeIcon: '👑',
    colorHex: '#8A2BE2',
    bgClass: 'bg-purple-100 text-purple-900 border-purple-300',
    borderClass: 'border-purple-400',
  },
};

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarSeed: string;
  city: string;
  weeklyXp: number;
  streakDays: number;
  isCurrentUser?: boolean;
  tier: LeagueTier;
}

export const MOCK_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u-1',
    fullName: 'Naomi Kabamba',
    avatarSeed: 'naomi',
    city: 'Kinshasa (Gombe)',
    weeklyXp: 480,
    streakDays: 14,
    tier: 'or',
  },
  {
    rank: 2,
    userId: 'u-2',
    fullName: 'Gloire Mwamba',
    avatarSeed: 'gloire',
    city: 'Lubumbashi',
    weeklyXp: 420,
    streakDays: 9,
    tier: 'or',
  },
  {
    rank: 3,
    userId: 'u-3',
    fullName: 'Christelle Lukusa',
    avatarSeed: 'christelle',
    city: 'Goma',
    weeklyXp: 360,
    streakDays: 21,
    tier: 'or',
  },
  {
    rank: 4,
    userId: 'u-4',
    fullName: 'Junior Ilunga',
    avatarSeed: 'junior',
    city: 'Kinshasa (Limete)',
    weeklyXp: 310,
    streakDays: 5,
    tier: 'argent',
  },
  {
    rank: 5,
    userId: 'current-user',
    fullName: 'Vous (Apprenant)',
    avatarSeed: 'you',
    city: 'Kinshasa',
    weeklyXp: 260,
    streakDays: 4,
    isCurrentUser: true,
    tier: 'argent',
  },
  {
    rank: 6,
    userId: 'u-5',
    fullName: 'Dorcas Masika',
    avatarSeed: 'dorcas',
    city: 'Bukavu',
    weeklyXp: 220,
    streakDays: 7,
    tier: 'argent',
  },
  {
    rank: 7,
    userId: 'u-6',
    fullName: 'Prince Mulumba',
    avatarSeed: 'prince',
    city: 'Matadi',
    weeklyXp: 190,
    streakDays: 3,
    tier: 'argent',
  },
  {
    rank: 8,
    userId: 'u-7',
    fullName: 'Esther Tshilombo',
    avatarSeed: 'esther',
    city: 'Kinshasa (Bandal)',
    weeklyXp: 140,
    streakDays: 2,
    tier: 'bronze',
  },
  {
    rank: 9,
    userId: 'u-8',
    fullName: 'Arsène Kasongo',
    avatarSeed: 'arsene',
    city: 'Kolwezi',
    weeklyXp: 110,
    streakDays: 2,
    tier: 'bronze',
  },
  {
    rank: 10,
    userId: 'u-9',
    fullName: 'Grace Mutombo',
    avatarSeed: 'grace',
    city: 'Kisangani',
    weeklyXp: 80,
    streakDays: 1,
    tier: 'bronze',
  },
];

/**
 * Check which badges are unlocked for a given user's state.
 */
export function evaluateBadges(stats: {
  lessonsCompleted: number;
  streakDays: number;
  hasPerfectScore: boolean;
  totalXp: number;
  certificatesCount: number;
  hasCompletedPlacement: boolean;
}): { badge: BadgeDefinition; unlocked: boolean; progress: number }[] {
  return OFFICIAL_BADGES.map((b) => {
    let unlocked = false;
    let progress = 0;

    switch (b.criteria.type) {
      case 'lessons':
        unlocked = stats.lessonsCompleted >= b.criteria.value;
        progress = Math.min(100, Math.round((stats.lessonsCompleted / b.criteria.value) * 100));
        break;
      case 'streak':
        unlocked = stats.streakDays >= b.criteria.value;
        progress = Math.min(100, Math.round((stats.streakDays / b.criteria.value) * 100));
        break;
      case 'perfect':
        unlocked = stats.hasPerfectScore;
        progress = stats.hasPerfectScore ? 100 : 0;
        break;
      case 'xp':
        unlocked = stats.totalXp >= b.criteria.value;
        progress = Math.min(100, Math.round((stats.totalXp / b.criteria.value) * 100));
        break;
      case 'certificates':
        unlocked = stats.certificatesCount >= b.criteria.value;
        progress = Math.min(100, Math.round((stats.certificatesCount / b.criteria.value) * 100));
        break;
      case 'placement':
        unlocked = stats.hasCompletedPlacement;
        progress = stats.hasCompletedPlacement ? 100 : 0;
        break;
    }

    return { badge: b, unlocked, progress };
  });
}

/**
 * Calculates streak maintenance based on last activity date in Congolese time (GMT+1).
 */
export function computeStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActiveDateIso: string | null,
  nowIso: string = new Date().toISOString()
): {
  newCurrentStreak: number;
  newLongestStreak: number;
  incremented: boolean;
  status: 'maintained' | 'incremented' | 'broken' | 'first_day';
} {
  const parseYmd = (iso: string) => {
    const d = new Date(iso);
    // Approximate GMT+1 (Kinshasa)
    const kinshasaHours = d.getUTCHours() + 1;
    const dateCopy = new Date(d);
    dateCopy.setUTCHours(kinshasaHours);
    return dateCopy.toISOString().slice(0, 10);
  };

  const today = parseYmd(nowIso);

  if (!lastActiveDateIso) {
    return {
      newCurrentStreak: 1,
      newLongestStreak: Math.max(1, longestStreak),
      incremented: true,
      status: 'first_day',
    };
  }

  const lastDate = parseYmd(lastActiveDateIso);

  if (lastDate === today) {
    // Already practiced today, keep current
    return {
      newCurrentStreak: currentStreak,
      newLongestStreak: longestStreak,
      incremented: false,
      status: 'maintained',
    };
  }

  // Calculate day difference
  const dToday = new Date(today).getTime();
  const dLast = new Date(lastDate).getTime();
  const diffDays = Math.round((dToday - dLast) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    const newStreak = currentStreak + 1;
    return {
      newCurrentStreak: newStreak,
      newLongestStreak: Math.max(newStreak, longestStreak),
      incremented: true,
      status: 'incremented',
    };
  }

  // Broken streak
  return {
    newCurrentStreak: 1,
    newLongestStreak: longestStreak,
    incremented: false,
    status: 'broken',
  };
}

/**
 * Calculate user's current league tier based on XP.
 */
export function getLeagueTierForXp(xp: number): LeagueTier {
  if (xp >= LEAGUE_TIERS.diamant.minXp) return 'diamant';
  if (xp >= LEAGUE_TIERS.saphir.minXp) return 'saphir';
  if (xp >= LEAGUE_TIERS.or.minXp) return 'or';
  if (xp >= LEAGUE_TIERS.argent.minXp) return 'argent';
  return 'bronze';
}
