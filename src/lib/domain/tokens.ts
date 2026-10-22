/**
 * PA³ English Academy - Tokens & Level Upgrades Domain Engine
 * Enables Admin to generate level upgrade vouchers/tokens.
 * Enables learners to claim tokens or purchase them via SasPay (Afrimoney, M-Pesa, etc.)
 */

export type TokenType = 'level_grant' | 'level_boost' | 'xp_boost';
export type TokenStatus = 'active' | 'redeemed' | 'revoked' | 'expired';
export type CefrTargetLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface TokenRedemptionRecord {
  userId: string;
  userEmail: string;
  userName?: string;
  claimedAt: string;
  previousLevel: string;
  newLevel: string;
  xpGranted: number;
}

export interface LevelToken {
  id: string;
  code: string;                      // e.g. "PA3-A2-LEOPARD-2026"
  title: string;                     // e.g. "Passe Palier A2 - Élémentaire"
  description: string;               // e.g. "Débloque immédiatement l'accès au Palier A2 et accorde 500 XP"
  type: TokenType;
  targetLevel?: CefrTargetLevel;      // e.g. "A2"
  bonusXp: number;                   // e.g. 500
  priceUsd: number;                  // e.g. 15
  priceCdf: number;                  // e.g. 42000
  isPurchasable: boolean;            // true if learners can buy it in the token store
  maxRedemptions: number;            // 1 for single-use, > 1 for group/promotional codes
  redemptionCount: number;
  status: TokenStatus;
  createdAt: string;                 // ISO string
  expiresAt: string | null;          // ISO string or null for never expires
  createdBy: string;                 // e.g. "Coach David Liandja"
  note?: string;                     // e.g. "Offert à l'apprenant pour mérites"
  redemptions: TokenRedemptionRecord[];
}

export const TOKENS_STORAGE_KEY = 'pa3_level_tokens';
export const USER_LEVEL_STORAGE_KEY = 'pa3_current_level';
export const USER_XP_STORAGE_KEY = 'pa3_total_xp';
export const USER_CLAIMED_TOKENS_KEY = 'pa3_user_claimed_tokens_history';

/**
 * Pre-seeded starter tokens for testing and quick administrative use
 */
export const INITIAL_LEVEL_TOKENS: LevelToken[] = [
  {
    id: 'tok-a2-leopard',
    code: 'PA3-A2-LEOPARD',
    title: 'Passe Niveau A2 - Élémentaire Quotidien',
    description: 'Passe officiel accordant un accès immédiat au niveau A2 et 500 XP bonus.',
    type: 'level_grant',
    targetLevel: 'A2',
    bonusXp: 500,
    priceUsd: 12,
    priceCdf: 33600,
    isPurchasable: true,
    maxRedemptions: 100,
    redemptionCount: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    createdBy: 'Coach David Liandja',
    note: 'Code promotionnel de bienvenue A2',
    redemptions: [
      {
        userId: 'lrn-demo-1',
        userEmail: 'etudiant.kin@gmail.com',
        userName: 'Junior Ilunga',
        claimedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        previousLevel: 'A1',
        newLevel: 'A2',
        xpGranted: 500,
      },
    ],
  },
  {
    id: 'tok-b1-pro',
    code: 'PA3-B1-PRO',
    title: 'Passe Niveau B1 - Intermédiaire Professionnel',
    description: 'Débloque le niveau B1 pour le travail, e-mails d’affaires et réunions à Kinshasa.',
    type: 'level_grant',
    targetLevel: 'B1',
    bonusXp: 1200,
    priceUsd: 20,
    priceCdf: 56000,
    isPurchasable: true,
    maxRedemptions: 50,
    redemptionCount: 1,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    createdBy: 'Coach David Liandja',
    note: 'Bourse de perfectionnement professionnel',
    redemptions: [],
  },
  {
    id: 'tok-b2-expert',
    code: 'PA3-B2-EXPERT',
    title: 'Passe Niveau B2 - Avancé & Négociation',
    description: 'Accès au palier supérieur B2 avec simulations d’entretiens et 2500 XP.',
    type: 'level_grant',
    targetLevel: 'B2',
    bonusXp: 2500,
    priceUsd: 30,
    priceCdf: 84000,
    isPurchasable: true,
    maxRedemptions: 25,
    redemptionCount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    createdBy: 'Coach David Liandja',
    note: 'Accès Master pour dirigeants et boursiers',
    redemptions: [],
  },
  {
    id: 'tok-boost-lvlplus',
    code: 'PA3-LEVEL-UP',
    title: 'Booster +1 Niveau Supérieur',
    description: 'Passe magique faisant monter immédiatement l’apprenant au niveau CEFR suivant.',
    type: 'level_boost',
    bonusXp: 400,
    priceUsd: 15,
    priceCdf: 42000,
    isPurchasable: true,
    maxRedemptions: 200,
    redemptionCount: 12,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    createdBy: 'Coach David Liandja',
    note: 'Booster de progression rapide',
    redemptions: [],
  },
  {
    id: 'tok-xp-1000',
    code: 'PA3-XP-1000',
    title: 'Pack Super Booster +1000 XP',
    description: 'Accorde 1000 XP d’un coup pour grimper dans la Ligue Diamant des Léopards.',
    type: 'xp_boost',
    bonusXp: 1000,
    priceUsd: 5,
    priceCdf: 14000,
    isPurchasable: true,
    maxRedemptions: 500,
    redemptionCount: 28,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: null,
    createdBy: 'Coach David Liandja',
    note: 'Gamification boost',
    redemptions: [],
  },
];

const memoryTokens = new Map<string, string>();

function safeGet(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memoryTokens.get(key) ?? null;
}

function safeSet(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
  memoryTokens.set(key, value);
}

/**
 * Retrieves all stored tokens, fallback to INITIAL_LEVEL_TOKENS
 */
export function getStoredTokens(): LevelToken[] {
  try {
    const raw = safeGet(TOKENS_STORAGE_KEY);
    if (!raw) return INITIAL_LEVEL_TOKENS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_LEVEL_TOKENS;
  } catch {
    return INITIAL_LEVEL_TOKENS;
  }
}

/**
 * Saves tokens to persistent storage
 */
export function saveStoredTokens(tokens: LevelToken[]): void {
  safeSet(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
}

/**
 * Helper to generate a clean, random token code
 * e.g. PA3-A2-7B4K
 */
export function generateRandomTokenCode(prefix: string = 'PA3'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanPrefix = prefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${cleanPrefix}-${rand}`;
}

/**
 * Next CEFR level progression map
 */
export function getNextCefrLevel(currentLevel: string): CefrTargetLevel {
  const progression: Record<string, CefrTargetLevel> = {
    A0: 'A1',
    A1: 'A2',
    A2: 'B1',
    B1: 'B2',
    B2: 'C1',
    C1: 'C2',
    C2: 'C2',
  };
  return progression[currentLevel.toUpperCase()] || 'A2';
}

/**
 * Admin Action: Create / Generate a new Token
 */
export function createToken(options: {
  code?: string;
  title: string;
  description?: string;
  type: TokenType;
  targetLevel?: CefrTargetLevel;
  bonusXp?: number;
  priceUsd?: number;
  priceCdf?: number;
  isPurchasable?: boolean;
  maxRedemptions?: number;
  expiresAt?: string | null;
  createdBy?: string;
  note?: string;
}): LevelToken {
  const tokens = getStoredTokens();
  const rawCode = options.code?.trim().toUpperCase() || generateRandomTokenCode(`PA3-${options.targetLevel || 'LVL'}`);

  // Ensure unique code
  const existing = tokens.find((t) => t.code.toUpperCase() === rawCode);
  if (existing) {
    throw new Error(`Le code de token "${rawCode}" existe déjà.`);
  }

  const newToken: LevelToken = {
    id: `tok-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    code: rawCode,
    title: options.title.trim(),
    description: options.description?.trim() || `Token de mise à niveau ${options.targetLevel || '+1 Niveau'}`,
    type: options.type,
    targetLevel: options.targetLevel,
    bonusXp: options.bonusXp ?? (options.type === 'xp_boost' ? 500 : 300),
    priceUsd: options.priceUsd ?? 15,
    priceCdf: options.priceCdf ?? (options.priceUsd ? options.priceUsd * 2800 : 42000),
    isPurchasable: options.isPurchasable ?? true,
    maxRedemptions: options.maxRedemptions ?? 1,
    redemptionCount: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: options.expiresAt || null,
    createdBy: options.createdBy || 'Coach David Liandja',
    note: options.note?.trim(),
    redemptions: [],
  };

  const updated = [newToken, ...tokens];
  saveStoredTokens(updated);
  return newToken;
}

/**
 * Admin Action: Revoke or toggle a token's status
 */
export function toggleTokenStatus(tokenId: string, status: TokenStatus): LevelToken | null {
  const tokens = getStoredTokens();
  const idx = tokens.findIndex((t) => t.id === tokenId);
  if (idx === -1) return null;

  tokens[idx].status = status;
  saveStoredTokens(tokens);
  return tokens[idx];
}

/**
 * Admin Action: Update an existing token (Full CRUD Update)
 */
export function updateToken(
  tokenId: string,
  updates: Partial<Omit<LevelToken, 'id' | 'createdAt' | 'redemptions'>>
): LevelToken {
  const tokens = getStoredTokens();
  const idx = tokens.findIndex((t) => t.id === tokenId);
  if (idx === -1) {
    throw new Error(`Token #${tokenId} introuvable.`);
  }

  const existing = tokens[idx];

  // If code is changing, check uniqueness
  if (updates.code && updates.code.trim().toUpperCase() !== existing.code.toUpperCase()) {
    const codeUpper = updates.code.trim().toUpperCase();
    const collision = tokens.find((t) => t.id !== tokenId && t.code.toUpperCase() === codeUpper);
    if (collision) {
      throw new Error(`Le code de token "${codeUpper}" est déjà utilisé par un autre token.`);
    }
    existing.code = codeUpper;
  }

  if (updates.title !== undefined) existing.title = updates.title.trim();
  if (updates.description !== undefined) existing.description = updates.description.trim();
  if (updates.type !== undefined) existing.type = updates.type;
  if (updates.targetLevel !== undefined) existing.targetLevel = updates.targetLevel;
  if (updates.bonusXp !== undefined) existing.bonusXp = Number(updates.bonusXp);
  if (updates.priceUsd !== undefined) existing.priceUsd = Number(updates.priceUsd);
  if (updates.priceCdf !== undefined) existing.priceCdf = Number(updates.priceCdf);
  if (updates.isPurchasable !== undefined) existing.isPurchasable = updates.isPurchasable;
  if (updates.maxRedemptions !== undefined) {
    existing.maxRedemptions = Number(updates.maxRedemptions);
    // If max is increased above redemptions, reactivate if was redeemed
    if (existing.status === 'redeemed' && existing.redemptionCount < existing.maxRedemptions) {
      existing.status = 'active';
    }
  }
  if (updates.status !== undefined) existing.status = updates.status;
  if (updates.expiresAt !== undefined) existing.expiresAt = updates.expiresAt;
  if (updates.note !== undefined) existing.note = updates.note?.trim();

  saveStoredTokens(tokens);
  return existing;
}

/**
 * Admin Action: Delete a token
 */
export function deleteToken(tokenId: string): boolean {
  const tokens = getStoredTokens();
  const filtered = tokens.filter((t) => t.id !== tokenId);
  if (filtered.length === tokens.length) return false;
  saveStoredTokens(filtered);
  return true;
}

/**
 * Admin Action: Bulk generate multiple tokens at once
 */
export function bulkGenerateTokens(options: {
  count: number;
  prefix?: string;
  title: string;
  type: TokenType;
  targetLevel?: CefrTargetLevel;
  bonusXp?: number;
  maxRedemptions?: number;
  note?: string;
}): LevelToken[] {
  const count = Math.min(100, Math.max(1, options.count));
  const generated: LevelToken[] = [];

  for (let i = 0; i < count; i++) {
    const code = generateRandomTokenCode(options.prefix || `PA3-${options.targetLevel || 'PRO'}`);
    const token = createToken({
      code,
      title: `${options.title} #${i + 1}`,
      type: options.type,
      targetLevel: options.targetLevel,
      bonusXp: options.bonusXp,
      maxRedemptions: options.maxRedemptions || 1,
      isPurchasable: false,
      note: options.note || `Lot généré en masse (${i + 1}/${count})`,
    });
    generated.push(token);
  }

  return generated;
}

/**
 * Admin Action: Reset redemptions / claim counter for a token
 */
export function resetTokenRedemptions(tokenId: string): LevelToken | null {
  const tokens = getStoredTokens();
  const idx = tokens.findIndex((t) => t.id === tokenId);
  if (idx === -1) return null;

  tokens[idx].redemptionCount = 0;
  tokens[idx].redemptions = [];
  tokens[idx].status = 'active';
  saveStoredTokens(tokens);
  return tokens[idx];
}

/**
 * Admin Action: Directly promote a learner or award a token
 */
export function grantLevelUpgradeDirectly(options: {
  learnerEmail: string;
  learnerName?: string;
  targetLevel: CefrTargetLevel;
  bonusXp?: number;
  reason?: string;
}): { success: boolean; message: string; token: LevelToken } {
  // Generate dedicated voucher
  const token = createToken({
    code: generateRandomTokenCode(`VIP-${options.targetLevel}`),
    title: `Attribution Directe Palier ${options.targetLevel}`,
    type: 'level_grant',
    targetLevel: options.targetLevel,
    bonusXp: options.bonusXp ?? 500,
    maxRedemptions: 1,
    isPurchasable: false,
    note: options.reason || `Octroyé directement par Coach David Liandja à ${options.learnerName || options.learnerEmail}`,
  });

  const claimRes = claimToken(token.code, {
    email: options.learnerEmail,
    name: options.learnerName,
  });

  return {
    success: claimRes.success,
    message: claimRes.message,
    token: claimRes.token || token,
  };
}

export interface ClaimResult {
  success: boolean;
  message: string;
  token?: LevelToken;
  previousLevel?: string;
  newLevel?: string;
  xpGranted?: number;
}

/**
 * Learner Action: Claim / Redeem a Token
 * Validates the code, upgrades the user's level and XP, and marks the token as used.
 */
export function claimToken(
  tokenCode: string,
  user: {
    email: string;
    name?: string;
    currentLevel?: string;
    currentXp?: number;
  }
): ClaimResult {
  const cleanCode = tokenCode.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, message: 'Veuillez saisir un code de token.' };
  }

  const tokens = getStoredTokens();
  const token = tokens.find((t) => t.code.toUpperCase() === cleanCode);

  if (!token) {
    return {
      success: false,
      message: `Code de token "${cleanCode}" introuvable ou non valide. Vérifiez l’orthographe ou contactez le Coach David.`,
    };
  }

  if (token.status !== 'active') {
    return {
      success: false,
      message: `Ce token est actuellement désactivé ou révoqué (statut: ${token.status}).`,
    };
  }

  if (token.expiresAt && new Date(token.expiresAt).getTime() < Date.now()) {
    return {
      success: false,
      message: `Ce token a expiré le ${new Date(token.expiresAt).toLocaleDateString('fr-FR')}.`,
    };
  }

  if (token.redemptionCount >= token.maxRedemptions) {
    return {
      success: false,
      message: 'Ce token a atteint sa limite maximale d’utilisations.',
    };
  }

  // Check if this specific user already claimed this token
  const userAlreadyClaimed = token.redemptions.some(
    (r) => r.userEmail.toLowerCase() === user.email.toLowerCase()
  );
  if (userAlreadyClaimed) {
    return {
      success: false,
      message: 'Vous avez déjà utilisé ce code de token avec ce compte.',
    };
  }

  // Calculate Level Upgrade
  const prevLevel = user.currentLevel || safeGet(USER_LEVEL_STORAGE_KEY) || 'A1';
  let nextLevel = prevLevel;

  if (token.type === 'level_grant' && token.targetLevel) {
    nextLevel = token.targetLevel;
  } else if (token.type === 'level_boost') {
    nextLevel = getNextCefrLevel(prevLevel);
  }

  // Calculate XP bonus
  const prevXp = user.currentXp ?? Number(safeGet(USER_XP_STORAGE_KEY) || '60');
  const xpBonus = token.bonusXp || 0;
  const newXp = prevXp + xpBonus;

  // Persist user level & XP updates
  safeSet(USER_LEVEL_STORAGE_KEY, nextLevel);
  safeSet(USER_XP_STORAGE_KEY, String(newXp));

  // Record redemption in token
  token.redemptionCount += 1;
  if (token.redemptionCount >= token.maxRedemptions) {
    token.status = 'redeemed';
  }

  const redemptionRecord: TokenRedemptionRecord = {
    userId: `user-${Date.now()}`,
    userEmail: user.email.toLowerCase(),
    userName: user.name || user.email.split('@')[0],
    claimedAt: new Date().toISOString(),
    previousLevel: prevLevel,
    newLevel: nextLevel,
    xpGranted: xpBonus,
  };
  token.redemptions.unshift(redemptionRecord);

  // Update token list
  saveStoredTokens(tokens);

  // Record in user's personal claim history
  try {
    const rawHistory = safeGet(USER_CLAIMED_TOKENS_KEY);
    const history = rawHistory ? JSON.parse(rawHistory) : [];
    history.unshift({
      tokenId: token.id,
      code: token.code,
      title: token.title,
      claimedAt: redemptionRecord.claimedAt,
      previousLevel: prevLevel,
      newLevel: nextLevel,
      xpGranted: xpBonus,
    });
    safeSet(USER_CLAIMED_TOKENS_KEY, JSON.stringify(history));
  } catch {}

  const levelUpMessage =
    nextLevel !== prevLevel
      ? `Félicitations ! Votre niveau a été promu de ${prevLevel} à ${nextLevel} 🚀 (+${xpBonus} XP)`
      : `Token validé avec succès ! +${xpBonus} XP ajoutés à votre compte 🌟`;

  return {
    success: true,
    message: levelUpMessage,
    token,
    previousLevel: prevLevel,
    newLevel: nextLevel,
    xpGranted: xpBonus,
  };
}

/**
 * Learner Action: Buy a Token directly via SasPay / Mobile Money
 * Creates a purchased token and immediately redeems it for the buyer!
 */
export function purchaseAndClaimToken(options: {
  tokenPackageId: string;
  paymentMethod: 'afrimoney' | 'mpesa' | 'airtel' | 'orange' | 'card';
  phoneNumber?: string;
  user: {
    email: string;
    name?: string;
    currentLevel?: string;
    currentXp?: number;
  };
}): ClaimResult {
  const tokens = getStoredTokens();
  const basePackage = tokens.find((t) => t.id === options.tokenPackageId);

  if (!basePackage) {
    return { success: false, message: 'Passe de niveau introuvable.' };
  }

  // Create a personalized single-use token issued for this purchase
  const uniqueCode = generateRandomTokenCode(`PA3-${basePackage.targetLevel || 'PASS'}`);
  const purchasedToken = createToken({
    code: uniqueCode,
    title: basePackage.title,
    description: `Acheté via ${options.paymentMethod.toUpperCase()} (${options.phoneNumber || 'N/A'})`,
    type: basePackage.type,
    targetLevel: basePackage.targetLevel,
    bonusXp: basePackage.bonusXp,
    priceUsd: basePackage.priceUsd,
    priceCdf: basePackage.priceCdf,
    isPurchasable: false,
    maxRedemptions: 1,
    note: `Paiement ${options.paymentMethod.toUpperCase()} validé pour ${options.user.email}`,
  });

  // Automatically redeem it for the learner
  return claimToken(purchasedToken.code, options.user);
}

/**
 * Retrieves learner's claimed tokens history
 */
export function getUserClaimedTokensHistory(): Array<{
  tokenId: string;
  code: string;
  title: string;
  claimedAt: string;
  previousLevel: string;
  newLevel: string;
  xpGranted: number;
}> {
  try {
    const raw = safeGet(USER_CLAIMED_TOKENS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
