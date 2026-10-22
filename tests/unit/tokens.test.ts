import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredTokens,
  saveStoredTokens,
  createToken,
  claimToken,
  purchaseAndClaimToken,
  toggleTokenStatus,
  deleteToken,
  getNextCefrLevel,
  generateRandomTokenCode,
  INITIAL_LEVEL_TOKENS,
  USER_LEVEL_STORAGE_KEY,
  USER_XP_STORAGE_KEY,
} from '../../src/lib/domain/tokens';

describe('Level Tokens Domain Engine', () => {
  beforeEach(() => {
    // Reset stored tokens to defaults before each test
    saveStoredTokens(JSON.parse(JSON.stringify(INITIAL_LEVEL_TOKENS)));
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(USER_LEVEL_STORAGE_KEY);
      window.localStorage.removeItem(USER_XP_STORAGE_KEY);
    }
  });

  it('correctly maps CEFR level progression', () => {
    expect(getNextCefrLevel('A1')).toBe('A2');
    expect(getNextCefrLevel('A2')).toBe('B1');
    expect(getNextCefrLevel('B1')).toBe('B2');
    expect(getNextCefrLevel('B2')).toBe('C1');
    expect(getNextCefrLevel('C1')).toBe('C2');
  });

  it('generates random token code with prefix', () => {
    const code = generateRandomTokenCode('PA3-A2');
    expect(code).toMatch(/^PA3A2-[A-Z0-9]{4}$/);
  });

  it('creates and stores a new admin token', () => {
    const token = createToken({
      code: 'TEST-A2-SPECIAL',
      title: 'Passe Test A2',
      type: 'level_grant',
      targetLevel: 'A2',
      bonusXp: 500,
      maxRedemptions: 1,
      note: 'Pour test unitaire',
    });

    expect(token.code).toBe('TEST-A2-SPECIAL');
    expect(token.targetLevel).toBe('A2');
    expect(token.bonusXp).toBe(500);
    expect(token.status).toBe('active');

    const all = getStoredTokens();
    const found = all.find((t) => t.code === 'TEST-A2-SPECIAL');
    expect(found).toBeDefined();
  });

  it('claims a level grant token and upgrades user level from A1 to A2', () => {
    createToken({
      code: 'CLAIM-A2',
      title: 'Test A2 Voucher',
      type: 'level_grant',
      targetLevel: 'A2',
      bonusXp: 500,
      maxRedemptions: 1,
    });

    const user = {
      email: 'test.learner@speakup.cd',
      name: 'Test Learner',
      currentLevel: 'A1',
      currentXp: 100,
    };

    const res = claimToken('CLAIM-A2', user);
    expect(res.success).toBe(true);
    expect(res.previousLevel).toBe('A1');
    expect(res.newLevel).toBe('A2');
    expect(res.xpGranted).toBe(500);

    // Verify token marked as redeemed because maxRedemptions = 1
    const tokens = getStoredTokens();
    const claimed = tokens.find((t) => t.code === 'CLAIM-A2');
    expect(claimed?.status).toBe('redeemed');
    expect(claimed?.redemptionCount).toBe(1);
    expect(claimed?.redemptions[0].userEmail).toBe('test.learner@speakup.cd');
  });

  it('claims a level boost token (+1 level) and bumps from B1 to B2', () => {
    createToken({
      code: 'BOOST-PLUS-ONE',
      title: 'Boost 1 Level',
      type: 'level_boost',
      bonusXp: 300,
      maxRedemptions: 5,
    });

    const user = {
      email: 'cadre.kin@speakup.cd',
      currentLevel: 'B1',
      currentXp: 1200,
    };

    const res = claimToken('BOOST-PLUS-ONE', user);
    expect(res.success).toBe(true);
    expect(res.previousLevel).toBe('B1');
    expect(res.newLevel).toBe('B2');
    expect(res.xpGranted).toBe(300);
  });

  it('rejects invalid or already-used tokens for the same user', () => {
    createToken({
      code: 'SINGLE-USE',
      title: 'Single Voucher',
      type: 'level_grant',
      targetLevel: 'B1',
      maxRedemptions: 5,
    });

    const user = { email: 'junior@speakup.cd', currentLevel: 'A1' };
    const firstClaim = claimToken('SINGLE-USE', user);
    expect(firstClaim.success).toBe(true);

    const secondClaim = claimToken('SINGLE-USE', user);
    expect(secondClaim.success).toBe(false);
    expect(secondClaim.message).toContain('déjà utilisé');
  });

  it('allows user to purchase and immediately claim a token with Afrimoney', () => {
    const user = {
      email: 'africell.user@speakup.cd',
      name: 'Africell Student',
      currentLevel: 'A1',
      currentXp: 50,
    };

    const res = purchaseAndClaimToken({
      tokenPackageId: 'tok-a2-leopard',
      paymentMethod: 'afrimoney',
      phoneNumber: '0901234567',
      user,
    });

    expect(res.success).toBe(true);
    expect(res.newLevel).toBe('A2');
    expect(res.xpGranted).toBe(500);
  });

  it('can revoke and delete tokens', () => {
    const token = createToken({
      code: 'TO-REVOKE',
      title: 'Temporary',
      type: 'xp_boost',
      bonusXp: 200,
    });

    const updated = toggleTokenStatus(token.id, 'revoked');
    expect(updated?.status).toBe('revoked');

    const claimRes = claimToken('TO-REVOKE', { email: 'user@speakup.cd' });
    expect(claimRes.success).toBe(false);
    expect(claimRes.message).toContain('désactivé ou révoqué');

    const deleted = deleteToken(token.id);
    expect(deleted).toBe(true);
    expect(getStoredTokens().some((t) => t.id === token.id)).toBe(false);
  });
});
