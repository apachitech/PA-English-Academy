import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredPricingPlans,
  savePricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  resetPricingPlansToDefault,
  getStoredPaymentMethods,
  savePaymentMethods,
  INITIAL_PRICING_PLANS,
} from '../../src/lib/domain/pricing';

describe('Pricing & Afrimoney Payment System', () => {
  beforeEach(() => {
    resetPricingPlansToDefault();
  });

  it('loads initial pricing plans with free A1 and paid passes', () => {
    const plans = getStoredPricingPlans();
    expect(plans.length).toBeGreaterThanOrEqual(4);
    const a1 = plans.find((p) => p.id === 'plan_a1');
    expect(a1?.priceUsd).toBe(0);
    expect(a1?.isFree).toBe(true);

    const a2 = plans.find((p) => p.id === 'plan_a2');
    expect(a2?.priceUsd).toBe(5);
  });

  it('creates a new promotional pricing plan', () => {
    const created = createPricingPlan({
      title: 'Pass Rentrée Universitaire UPC/UNIKIN',
      levelBadge: 'Promo Étudiant',
      priceUsd: 8,
      priceCdf: '22 400 FC',
      isPopular: false,
      isFree: false,
      active: true,
      duration: 'Semestre',
      description: 'Tarif réduit pour étudiants de Kinshasa et Lubumbashi.',
      features: ['Accès A1 & A2', 'Groupe d’étude Telegram/WhatsApp', 'Attestation'],
      ctaLabel: 'Profiter de l’offre (8 $)',
    });

    expect(created.id).toBeDefined();
    expect(created.priceUsd).toBe(8);

    const all = getStoredPricingPlans();
    expect(all.some((p) => p.title.includes('UPC/UNIKIN'))).toBe(true);
  });

  it('updates plan price and duration', () => {
    const updated = updatePricingPlan('plan_a2', {
      priceUsd: 6,
      priceCdf: '16 800 FC',
      duration: 'Accès 1 an',
    });

    expect(updated.priceUsd).toBe(6);
    expect(updated.priceCdf).toBe('16 800 FC');
    expect(updated.duration).toBe('Accès 1 an');
  });

  it('deletes a pricing plan', () => {
    const initialCount = getStoredPricingPlans().length;
    deletePricingPlan('plan_vip_coaching');
    const remaining = getStoredPricingPlans();
    expect(remaining.length).toBe(initialCount - 1);
    expect(remaining.some((p) => p.id === 'plan_vip_coaching')).toBe(false);
  });

  it('includes Afrimoney among default supported payment methods', () => {
    const methods = getStoredPaymentMethods();
    const afrimoney = methods.find((m) => m.id === 'afrimoney');
    expect(afrimoney).toBeDefined();
    expect(afrimoney?.operator).toContain('Africell');
    expect(afrimoney?.networkCode).toBe('afrimoney_cd');
    expect(afrimoney?.phonePrefixes).toContain('090');
    expect(afrimoney?.enabled).toBe(true);
  });
});
