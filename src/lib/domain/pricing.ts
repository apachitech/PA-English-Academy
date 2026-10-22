/**
 * Pricing & Payment Plans Domain Model
 * Supports Admin CRUD for course prices, subscriptions, and payment methods (including Afrimoney)
 */

export interface PricingPlan {
  id: string;
  title: string;
  levelBadge: string;
  priceUsd: number;
  priceCdf: string;
  isPopular?: boolean;
  isFree?: boolean;
  description: string;
  features: string[];
  ctaLabel: string;
  active?: boolean;
  duration?: string;
}

export interface PaymentMethodConfig {
  id: 'mpesa' | 'airtel' | 'orange' | 'afrimoney' | 'card';
  name: string;
  operator: string;
  networkCode: string;
  color: string;
  badge: string;
  enabled: boolean;
  phonePrefixes: string[];
}

export const PRICING_STORAGE_KEY = 'pa3_admin_pricing_plans';
export const PAYMENT_METHODS_STORAGE_KEY = 'pa3_admin_payment_methods';

export const DEFAULT_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    operator: 'Vodacom RDC',
    networkCode: 'mpesa_cd',
    color: 'border-red-500 bg-red-50 text-red-950',
    badge: '🔴 Vodacom',
    enabled: true,
    phonePrefixes: ['081', '082', '083'],
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    operator: 'Airtel RDC',
    networkCode: 'airtel_cd',
    color: 'border-rose-500 bg-rose-50 text-rose-950',
    badge: '⚪ Airtel',
    enabled: true,
    phonePrefixes: ['097', '098', '099'],
  },
  {
    id: 'orange',
    name: 'Orange Money',
    operator: 'Orange RDC',
    networkCode: 'orange_cd',
    color: 'border-orange-500 bg-orange-50 text-orange-950',
    badge: '🟠 Orange',
    enabled: true,
    phonePrefixes: ['084', '085', '089'],
  },
  {
    id: 'afrimoney',
    name: 'Afrimoney',
    operator: 'Africell RDC',
    networkCode: 'afrimoney_cd',
    color: 'border-purple-500 bg-purple-50 text-purple-950',
    badge: '🟣 Africell',
    enabled: true,
    phonePrefixes: ['090', '091'],
  },
  {
    id: 'card',
    name: 'Carte Bancaire',
    operator: 'Visa / Mastercard',
    networkCode: 'card',
    color: 'border-blue-500 bg-blue-50 text-blue-950',
    badge: '💳 International',
    enabled: true,
    phonePrefixes: [],
  },
];

export const INITIAL_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan_a1',
    title: 'Niveau A1 Débutant',
    levelBadge: 'A1 Débutant',
    priceUsd: 0,
    priceCdf: '0 FC',
    isFree: true,
    active: true,
    duration: 'Accès Illimité à Vie',
    description: 'Promesse du Coach David : les bases indispensables sont 100 % gratuites pour tous les Congolais.',
    features: [
      'Accès complet aux 4 unités A1',
      'Exercices interactifs & écoute audio',
      'Test diagnostique adaptatif',
      'Mode basse consommation 3G',
      'Certificat d’initiation A1',
    ],
    ctaLabel: 'Commencer gratuitement',
  },
  {
    id: 'plan_a2',
    title: 'Pass Niveau A2',
    levelBadge: 'A2 Élémentaire',
    priceUsd: 5,
    priceCdf: '14 000 FC',
    active: true,
    duration: 'Paiement Unique • À vie',
    description: 'Racontez votre routine, vos voyages et échangez avec aisance au marché ou au travail.',
    features: [
      'Toutes les leçons A2 à vie',
      'Vidéos avec transcriptions complètes',
      'Exercices d’expression orale & audio',
      'Examen final A2 avec certificat officiel vérifiable',
      'Support par groupe WhatsApp avec Coach David',
    ],
    ctaLabel: 'Débloquer A2 (5 $)',
  },
  {
    id: 'plan_all_access',
    title: 'Pass Tout Accès (A2 + B1 + B2)',
    levelBadge: 'Meilleure Offre',
    priceUsd: 15,
    priceCdf: '42 000 FC',
    isPopular: true,
    active: true,
    duration: 'Paiement Unique • À vie',
    description: 'Idéal pour booster votre carrière dans les ONGs, multinationales ou préparer un voyage à l’étranger.',
    features: [
      'Accès illimité à tous les niveaux (A1 à B2)',
      'Module Spécial : Anglais Professionnel & ONGs',
      'Module Spécial : Préparation Entretiens & Ambassades',
      'Tous les certificats officiels PA³ (A1, A2, B1, B2)',
      'Accès prioritaire aux webinaires de Coach David',
    ],
    ctaLabel: 'Choisir le Pass Tout Accès (15 $)',
  },
  {
    id: 'plan_vip_coaching',
    title: 'Coaching VIP Présentiel & En Ligne',
    levelBadge: 'Accompagnement VIP',
    priceUsd: 35,
    priceCdf: '98 000 FC / mois',
    active: true,
    duration: 'Abonnement Mensuel',
    description: 'Séances privées de conversation avec Coach David Liandja à Kinshasa ou via Google Meet.',
    features: [
      'Tous les accès numériques illimités',
      '2 séances de conversation en direct / semaine',
      'Correction personnalisée de prononciation',
      'Orientation personnalisée pour visas & bourses',
      'Ligne WhatsApp directe avec Coach David',
    ],
    ctaLabel: 'Contacter Coach David',
  },
];

const memoryStore = new Map<string, string>();

function getItem(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryStore.get(key) ?? null;
}

function setItem(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
  memoryStore.set(key, value);
}

/**
 * Retrieves stored pricing plans or default fallback
 */
export function getStoredPricingPlans(): PricingPlan[] {
  try {
    const raw = getItem(PRICING_STORAGE_KEY);
    if (!raw) return INITIAL_PRICING_PLANS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}
  return INITIAL_PRICING_PLANS;
}

/**
 * Persists pricing plans to storage
 */
export function savePricingPlans(plans: PricingPlan[]): void {
  setItem(PRICING_STORAGE_KEY, JSON.stringify(plans));
}

/**
 * Creates a new pricing plan
 */
export function createPricingPlan(plan: Omit<PricingPlan, 'id'>): PricingPlan {
  const plans = getStoredPricingPlans();
  const id = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newPlan: PricingPlan = {
    ...plan,
    id,
    active: plan.active !== false,
  };
  const updated = [...plans, newPlan];
  savePricingPlans(updated);
  return newPlan;
}

/**
 * Updates an existing pricing plan
 */
export function updatePricingPlan(id: string, updates: Partial<PricingPlan>): PricingPlan {
  const plans = getStoredPricingPlans();
  const index = plans.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Plan avec l'identifiant ${id} non trouvé.`);
  }

  const updatedPlan: PricingPlan = {
    ...plans[index],
    ...updates,
  };
  plans[index] = updatedPlan;
  savePricingPlans(plans);
  return updatedPlan;
}

/**
 * Deletes a pricing plan
 */
export function deletePricingPlan(id: string): void {
  const plans = getStoredPricingPlans();
  const filtered = plans.filter((p) => p.id !== id);
  savePricingPlans(filtered);
}

/**
 * Resets pricing plans to factory defaults
 */
export function resetPricingPlansToDefault(): PricingPlan[] {
  savePricingPlans(INITIAL_PRICING_PLANS);
  return INITIAL_PRICING_PLANS;
}

/**
 * Retrieves configured payment methods (including Afrimoney)
 */
export function getStoredPaymentMethods(): PaymentMethodConfig[] {
  try {
    const raw = getItem(PAYMENT_METHODS_STORAGE_KEY);
    if (!raw) return DEFAULT_PAYMENT_METHODS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {}
  return DEFAULT_PAYMENT_METHODS;
}

/**
 * Saves payment methods
 */
export function savePaymentMethods(methods: PaymentMethodConfig[]): void {
  setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(methods));
}
