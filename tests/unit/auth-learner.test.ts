import { describe, it, expect, beforeEach } from 'vitest';
import {
  isLearnerAuthenticated,
  getLearnerProfile,
  loginLearner,
  updateLearnerProfile,
  changeLearnerPassword,
  getLearnerProgressStats,
  logoutLearner,
} from '../../src/lib/auth-learner';

describe('Learner Authentication & Profile Helper', () => {
  beforeEach(() => {
    logoutLearner();
  });

  it('initially reports unauthenticated for visitors', () => {
    expect(isLearnerAuthenticated()).toBe(false);
    expect(getLearnerProfile()).toBeNull();
  });

  it('authenticates learner and stores profile details', () => {
    const profile = loginLearner('naomi.k@gmail.com', 'Naomi Kabamba', 'Kinshasa');
    expect(profile.email).toBe('naomi.k@gmail.com');
    expect(profile.name).toBe('Naomi Kabamba');
    expect(isLearnerAuthenticated()).toBe(true);

    const saved = getLearnerProfile();
    expect(saved).not.toBeNull();
    expect(saved?.email).toBe('naomi.k@gmail.com');
    expect(saved?.name).toBe('Naomi Kabamba');
  });

  it('updates learner profile fields including avatar and bio', () => {
    loginLearner('dieudonne@pa3.cd', 'Dieudonné Mutombo', 'Lubumbashi');
    const updated = updateLearnerProfile({
      bio: 'Préparation entretien d’embauche en anglais',
      phone: '+243812345678',
      dailyGoalMin: 30,
      avatarUrl: 'data:image/svg+xml;base64,mockAvatar',
    });

    expect(updated.bio).toBe('Préparation entretien d’embauche en anglais');
    expect(updated.phone).toBe('+243812345678');
    expect(updated.dailyGoalMin).toBe(30);
    expect(updated.avatarUrl).toBe('data:image/svg+xml;base64,mockAvatar');
  });

  it('validates and changes learner password', () => {
    loginLearner('tresor@pa3.cd', 'Trésor');
    
    // Too short
    const shortRes = changeLearnerPassword('', '12345');
    expect(shortRes.success).toBe(false);
    expect(shortRes.error).toContain('au moins 6 caractères');

    // Valid password
    const okRes = changeLearnerPassword('', 'NouveauMotDePasse2026!');
    expect(okRes.success).toBe(true);
  });

  it('retrieves aggregate progress stats for learner', () => {
    loginLearner('sarah@pa3.cd', 'Sarah Ilunga');
    const stats = getLearnerProgressStats();
    expect(stats.level).toBeDefined();
    expect(stats.xp).toBeGreaterThanOrEqual(0);
    expect(stats.streak).toBeGreaterThanOrEqual(1);
  });

  it('logs out learner and clears session', () => {
    loginLearner('grace@pa3.cd', 'Grace Mwamba');
    expect(isLearnerAuthenticated()).toBe(true);

    logoutLearner();
    expect(isLearnerAuthenticated()).toBe(false);
    expect(getLearnerProfile()).toBeNull();
  });
});
