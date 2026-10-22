import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredPlatformSettings,
  savePlatformSettings,
  updatePlatformSettings,
  convertUsdToCdf,
  DEFAULT_PLATFORM_SETTINGS,
} from '../../src/lib/domain/platform-settings';
import {
  bulkGenerateTokens,
  updateToken,
  claimToken,
  resetTokenRedemptions,
  getStoredTokens,
  saveStoredTokens,
  grantLevelUpgradeDirectly,
  INITIAL_LEVEL_TOKENS,
} from '../../src/lib/domain/tokens';

describe('Platform Settings & Token CRUD Extensions', () => {
  beforeEach(() => {
    savePlatformSettings(DEFAULT_PLATFORM_SETTINGS);
    saveStoredTokens(JSON.parse(JSON.stringify(INITIAL_LEVEL_TOKENS)));
  });

  it('retrieves default platform settings and converts USD to CDF', () => {
    const settings = getStoredPlatformSettings();
    expect(settings.usdToCdfRate).toBe(2800);
    expect(convertUsdToCdf(10, 2800)).toBe(28000);
    expect(convertUsdToCdf(5, 3000)).toBe(15000);
  });

  it('updates platform settings including rate and announcement banner', () => {
    const updated = updatePlatformSettings({
      usdToCdfRate: 2850,
      announcement: {
        enabled: true,
        message: 'Promotion Rentrée 2026 : -25% sur tous les packs avec Afrimoney !',
        badge: 'FLASH',
      },
    });

    expect(updated.usdToCdfRate).toBe(2850);
    expect(updated.announcement.enabled).toBe(true);
    expect(updated.announcement.badge).toBe('FLASH');

    const reloaded = getStoredPlatformSettings();
    expect(reloaded.usdToCdfRate).toBe(2850);
  });

  it('allows admin to edit/update an existing token', () => {
    const tokens = getStoredTokens();
    const first = tokens[0];
    expect(first).toBeDefined();

    const updated = updateToken(first.id, {
      title: 'Titre Modifié par Admin',
      priceUsd: 12,
      priceCdf: 33600,
    });

    expect(updated?.title).toBe('Titre Modifié par Admin');
    expect(updated?.priceUsd).toBe(12);
    expect(updated?.priceCdf).toBe(33600);
  });

  it('bulk generates a batch of tokens for mass distribution', () => {
    const batch = bulkGenerateTokens({
      count: 5,
      prefix: 'BATCH26',
      title: 'Voucher Événement Kinshasa',
      type: 'level_grant',
      targetLevel: 'A2',
      bonusXp: 500,
      maxRedemptions: 1,
      note: 'Lot de 5 vouchers salon',
    });

    expect(batch.length).toBe(5);
    batch.forEach((t) => {
      expect(t.code.startsWith('BATCH26-')).toBe(true);
      expect(t.status).toBe('active');
      expect(t.targetLevel).toBe('A2');
      expect(t.bonusXp).toBe(500);
    });

    const all = getStoredTokens();
    expect(all.length).toBeGreaterThanOrEqual(INITIAL_LEVEL_TOKENS.length + 5);
  });

  it('resets redemptions counter for an expired/depleted token', () => {
    const batch = bulkGenerateTokens({
      count: 1,
      prefix: 'RESET-TEST',
      title: 'Token à Réinitialiser',
      type: 'level_grant',
      targetLevel: 'B1',
      bonusXp: 300,
      maxRedemptions: 1,
    });
    const token = batch[0];

    // Claim the token so it gets redeemed
    claimToken(token.code, {
      email: 'user@speakup.cd',
      name: 'Jean',
    });

    const refreshed = getStoredTokens().find((t) => t.id === token.id);
    expect(refreshed?.status).toBe('redeemed');
    expect(refreshed?.redemptionCount).toBe(1);

    const reset = resetTokenRedemptions(token.id);
    expect(reset?.status).toBe('active');
    expect(reset?.redemptionCount).toBe(0);
    expect(reset?.redemptions.length).toBe(0);
  });

  it('grants level upgrade directly to a learner and logs a direct_grant token', () => {
    const res = grantLevelUpgradeDirectly({
      learnerEmail: 'esther.mutombo@gmail.com',
      learnerName: 'Esther Mutombo',
      targetLevel: 'B2',
      bonusXp: 500,
      reason: 'Validation orale avec Coach David',
    });

    expect(res.success).toBe(true);
    expect(res.token.type).toBe('level_grant');
    expect(res.token.targetLevel).toBe('B2');
    expect(res.token.status).toBe('redeemed');
    expect(res.token.redemptions[0].userEmail).toBe('esther.mutombo@gmail.com');
  });
});
