'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { getStoredPlatformSettings, PlatformSettings } from '@/lib/domain/platform-settings';

export function AnnouncementBanner() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const s = getStoredPlatformSettings();
    setSettings(s);
  }, []);

  if (!settings || !settings.announcement?.enabled || isDismissed) {
    return null;
  }

  const { badge, message, linkUrl, linkText } = settings.announcement;

  return (
    <aside
      aria-label="Annonce officielle"
      className="print:hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs py-2 px-3 sm:px-4 shadow-sm relative z-50 flex items-center justify-between gap-2 border-b border-amber-400/40"
    >
      <div className="flex-1 flex flex-wrap items-center justify-center gap-2 text-center">
        {badge && (
          <span className="bg-slate-950 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
            {badge}
          </span>
        )}
        <span className="text-slate-950 font-extrabold">{message}</span>
        {linkUrl && (
          <Link
            href={linkUrl}
            className="inline-flex items-center gap-1 text-slate-950 underline hover:text-white transition font-black ml-1"
          >
            <span>{linkText || 'En savoir plus'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      <button
        onClick={() => setIsDismissed(true)}
        className="w-6 h-6 rounded-full hover:bg-black/10 flex items-center justify-center text-slate-950/70 hover:text-slate-950 transition shrink-0 cursor-pointer"
        title="Masquer cette annonce"
        aria-label="Fermer la bannière d'annonce"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
