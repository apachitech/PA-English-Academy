import { describe, it, expect, beforeEach } from 'vitest';
import {
  isAdminAuthenticated,
  verifyAndLoginAdmin,
  logoutAdmin,
  getAdminUser,
} from '../../src/lib/auth-admin';
import { loginLearner, logoutLearner } from '../../src/lib/auth-learner';

describe('Admin Authentication Guard', () => {
  beforeEach(() => {
    logoutAdmin();
    logoutLearner();
  });

  it('initially reports unauthenticated session', () => {
    expect(isAdminAuthenticated()).toBe(false);
    expect(getAdminUser()).toBeNull();
  });

  it('rejects unauthorized non-admin email', () => {
    const result = verifyAndLoginAdmin('intruder@gmail.com', 'CoachDavid2026!');
    expect(result.success).toBe(false);
    expect(result.error).toContain('liste des administrateurs autorisés');
    expect(isAdminAuthenticated()).toBe(false);
  });

  it('rejects wrong password for authorized email', () => {
    const result = verifyAndLoginAdmin('liandjadavid@gmail.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Mot de passe ou clé de sécurité administrateur incorrect');
    expect(isAdminAuthenticated()).toBe(false);
  });

  it('authenticates Coach David Liandja with valid master credentials', () => {
    const result = verifyAndLoginAdmin('liandjadavid@gmail.com', 'CoachDavid2026!');
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user?.role).toBe('admin');
    expect(isAdminAuthenticated()).toBe(true);

    const user = getAdminUser();
    expect(user?.email).toBe('liandjadavid@gmail.com');
  });

  it('successfully logs out and clears admin tokens', () => {
    verifyAndLoginAdmin('liandjadavid@gmail.com', 'admin2026');
    expect(isAdminAuthenticated()).toBe(true);

    logoutAdmin();
    expect(isAdminAuthenticated()).toBe(false);
    expect(getAdminUser()).toBeNull();
  });

  it('ensures regular logged-in learners never pass as admin and do not see admin access', () => {
    // Normal learner logs in
    loginLearner('etudiant.kinshasa@gmail.com', 'Felly Makiese', 'Kinshasa');
    
    // Admin check must strictly return false
    expect(isAdminAuthenticated()).toBe(false);
  });
});
