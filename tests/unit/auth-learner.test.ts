import { describe, it, expect, beforeEach } from 'vitest';
import {
  isLearnerAuthenticated,
  getLearnerProfile,
  loginLearner,
  updateLearnerProfile,
  changeLearnerPassword,
  getLearnerProgressStats,
  logoutLearner,
  isEmailRegistered,
  registerNewLearner,
  clearRegisteredUsersForTesting,
} from '../../src/lib/auth-learner';

describe('Learner Authentication & Profile Helper', () => {
  beforeEach(() => {
    logoutLearner();
    clearRegisteredUsersForTesting();
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

  it('correctly identifies pre-seeded and existing accounts as registered', () => {
    expect(isEmailRegistered('grace.mwamba@pa3.cd')).toBe(true);
    expect(isEmailRegistered('liandjadavid@gmail.com')).toBe(true);
    expect(isEmailRegistered('brand_new_unique_learner_2026@pa3.cd')).toBe(false);
  });

  it('successfully registers a brand new learner account', () => {
    const res = registerNewLearner({
      email: 'nouveau.etudiant@unikin.ac.cd',
      name: 'Fabrice Mukendi',
      city: 'Kinshasa',
      password: 'password123',
      dailyGoal: 15,
    });

    expect(res.success).toBe(true);
    expect(res.profile).toBeDefined();
    expect(res.profile?.email).toBe('nouveau.etudiant@unikin.ac.cd');
    expect(isLearnerAuthenticated()).toBe(true);
    expect(isEmailRegistered('nouveau.etudiant@unikin.ac.cd')).toBe(true);
  });

  it('strictly restricts signup when an email already exists in the system', () => {
    // 1. Try to register with an existing pre-seeded email
    const duplicatePreseeded = registerNewLearner({
      email: 'grace.mwamba@pa3.cd',
      name: 'Impostor Grace',
      password: 'pass_duplicate',
    });

    expect(duplicatePreseeded.success).toBe(false);
    expect(duplicatePreseeded.error).toBeDefined();
    expect(duplicatePreseeded.error).toContain('est déjà enregistrée dans le système');

    // 2. Register a new user first
    const firstReg = registerNewLearner({
      email: 'charlotte.mbuyi@gmail.com',
      name: 'Charlotte Mbuyi',
      city: 'Goma',
    });
    expect(firstReg.success).toBe(true);

    // 3. Second attempt with the exact same email must be strictly restricted
    const secondReg = registerNewLearner({
      email: 'charlotte.mbuyi@gmail.com',
      name: 'Charlotte Clone',
      city: 'Lubumbashi',
    });

    expect(secondReg.success).toBe(false);
    expect(secondReg.error).toContain('est déjà enregistrée dans le système');
  });
});

