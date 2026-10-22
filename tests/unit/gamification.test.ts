import { describe, it, expect } from 'vitest';
import {
  computeStreakUpdate,
  evaluateBadges,
  getLeagueTierForXp,
  OFFICIAL_BADGES,
} from '../../src/lib/domain/gamification';

describe('Gamification Domain Engine', () => {
  describe('Streak Computation', () => {
    it('initializes streak on first day of activity', () => {
      const res = computeStreakUpdate(0, 0, null, '2026-10-21T12:00:00Z');
      expect(res.newCurrentStreak).toBe(1);
      expect(res.newLongestStreak).toBe(1);
      expect(res.incremented).toBe(true);
      expect(res.status).toBe('first_day');
    });

    it('maintains streak if already practiced today', () => {
      const res = computeStreakUpdate(5, 10, '2026-10-21T08:00:00Z', '2026-10-21T14:30:00Z');
      expect(res.newCurrentStreak).toBe(5);
      expect(res.incremented).toBe(false);
      expect(res.status).toBe('maintained');
    });

    it('increments streak if practiced on consecutive day', () => {
      const res = computeStreakUpdate(3, 3, '2026-10-20T18:00:00Z', '2026-10-21T10:00:00Z');
      expect(res.newCurrentStreak).toBe(4);
      expect(res.newLongestStreak).toBe(4);
      expect(res.incremented).toBe(true);
      expect(res.status).toBe('incremented');
    });

    it('resets streak to 1 if user missed a full day', () => {
      const res = computeStreakUpdate(7, 14, '2026-10-18T10:00:00Z', '2026-10-21T10:00:00Z');
      expect(res.newCurrentStreak).toBe(1);
      expect(res.newLongestStreak).toBe(14);
      expect(res.incremented).toBe(false);
      expect(res.status).toBe('broken');
    });
  });

  describe('Badge Evaluation', () => {
    it('unlocks first lesson and placement badges correctly', () => {
      const results = evaluateBadges({
        lessonsCompleted: 1,
        streakDays: 1,
        hasPerfectScore: false,
        totalXp: 40,
        certificatesCount: 0,
        hasCompletedPlacement: true,
      });

      const firstLessonBadge = results.find((r) => r.badge.code === 'first_lesson');
      const placementBadge = results.find((r) => r.badge.code === 'placement');
      const streak30Badge = results.find((r) => r.badge.code === 'streak_30');

      expect(firstLessonBadge?.unlocked).toBe(true);
      expect(placementBadge?.unlocked).toBe(true);
      expect(streak30Badge?.unlocked).toBe(false);
      expect(streak30Badge?.progress).toBe(3); // 1 / 30 = 3%
    });

    it('unlocks leopard badge for 30 days streak', () => {
      const results = evaluateBadges({
        lessonsCompleted: 35,
        streakDays: 30,
        hasPerfectScore: true,
        totalXp: 850,
        certificatesCount: 1,
        hasCompletedPlacement: true,
      });

      const leopardBadge = results.find((r) => r.badge.code === 'streak_30');
      const certBadge = results.find((r) => r.badge.code === 'certificate_1');
      const xpBadge = results.find((r) => r.badge.code === 'xp_500');

      expect(leopardBadge?.unlocked).toBe(true);
      expect(certBadge?.unlocked).toBe(true);
      expect(xpBadge?.unlocked).toBe(true);
    });
  });

  describe('League Tier Evaluation', () => {
    it('assigns correct tier by XP', () => {
      expect(getLeagueTierForXp(50)).toBe('bronze');
      expect(getLeagueTierForXp(180)).toBe('argent');
      expect(getLeagueTierForXp(400)).toBe('or');
      expect(getLeagueTierForXp(750)).toBe('saphir');
      expect(getLeagueTierForXp(1500)).toBe('diamant');
    });
  });
});
