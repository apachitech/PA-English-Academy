/**
 * PA³ English Academy - Platform Global Controls & Settings
 * Allows Administrator (Coach David Liandja) to manage:
 * - USD to CDF Exchange Rate
 * - Site-Wide Top Announcement / Promotion Banner
 * - Afrimoney Special Discount Campaigns
 * - Emergency Contact & Support Lines
 */

export interface AnnouncementSettings {
  enabled: boolean;
  badge: string;            // e.g. "OFFRE LIMITÉE", "NOUVEAU", "FLASH RDC"
  message: string;          // e.g. "Passez au Palier A2 avec Afrimoney et bénéficiez de 500 XP offerts !"
  linkUrl?: string;         // e.g. "/profil?tab=tokens" or "/tarifs"
  linkText?: string;        // e.g. "En profiter →"
}

export interface PlatformSettings {
  usdToCdfRate: number;                   // e.g. 2800 (1 USD = 2800 CDF)
  announcement: AnnouncementSettings;
  afrimoneyPromoActive: boolean;          // true when special Afrimoney promo is running
  afrimoneyDiscountPct: number;           // e.g. 15%
  supportPhone: string;                   // e.g. "+27 74 293 2071"
  supportEmail: string;                   // e.g. "liandjadavid@gmail.com"
  maintenanceNotice?: string;
  updatedAt: string;
}

export const PLATFORM_SETTINGS_STORAGE_KEY = 'pa3_platform_settings';

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  usdToCdfRate: 2800,
  announcement: {
    enabled: true,
    badge: '⚡ PROMO RDC',
    message: 'Débloquez vos Niveaux A2, B1 et B2 en direct avec Afrimoney & Mobile Money SasPay !',
    linkUrl: '/profil?tab=tokens',
    linkText: 'Découvrir les Passes →',
  },
  afrimoneyPromoActive: true,
  afrimoneyDiscountPct: 15,
  supportPhone: '+27 74 293 2071',
  supportEmail: 'liandjadavid@gmail.com',
  updatedAt: new Date().toISOString(),
};

const memorySettings = new Map<string, string>();

function safeGet(key: string): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return memorySettings.get(key) ?? null;
}

function safeSet(key: string, value: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
  memorySettings.set(key, value);
}

/**
 * Retrieves current platform settings
 */
export function getStoredPlatformSettings(): PlatformSettings {
  try {
    const raw = safeGet(PLATFORM_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_PLATFORM_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLATFORM_SETTINGS,
      ...parsed,
      announcement: {
        ...DEFAULT_PLATFORM_SETTINGS.announcement,
        ...(parsed.announcement || {}),
      },
    };
  } catch {
    return DEFAULT_PLATFORM_SETTINGS;
  }
}

/**
 * Saves platform settings
 */
export function savePlatformSettings(settings: PlatformSettings): void {
  safeSet(
    PLATFORM_SETTINGS_STORAGE_KEY,
    JSON.stringify({ ...settings, updatedAt: new Date().toISOString() })
  );
}

/**
 * Updates partial settings
 */
export function updatePlatformSettings(updates: Partial<PlatformSettings>): PlatformSettings {
  const current = getStoredPlatformSettings();
  const next: PlatformSettings = {
    ...current,
    ...updates,
    announcement: updates.announcement
      ? { ...current.announcement, ...updates.announcement }
      : current.announcement,
    updatedAt: new Date().toISOString(),
  };
  savePlatformSettings(next);
  return next;
}

/**
 * Converts USD amount to CDF using the current platform exchange rate (or custom rate)
 */
export function convertUsdToCdf(usdAmount: number, customRate?: number): number {
  const settings = getStoredPlatformSettings();
  const rate = customRate !== undefined ? customRate : (settings.usdToCdfRate || 2800);
  return Math.round(usdAmount * rate);
}
