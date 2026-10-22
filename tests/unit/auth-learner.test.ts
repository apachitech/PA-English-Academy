import { describe, it, expect, beforeEach } from 'vitest';
import {
  isLearnerAuthenticated,
  getLearnerProfile,
  loginLearner,
  logoutLearner,
} from '../../src/lib/auth-learner';

describe('Learner Authentication Helper', () => {
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

  it('logs out learner and clears session', () => {
    loginLearner('grace@pa3.cd', 'Grace Mwamba');
    expect(isLearnerAuthenticated()).toBe(true);

    logoutLearner();
    expect(isLearnerAuthenticated()).toBe(false);
    expect(getLearnerProfile()).toBeNull();
  });
});
