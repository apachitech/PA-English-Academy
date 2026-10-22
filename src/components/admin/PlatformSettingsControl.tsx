'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  DollarSign,
  Megaphone,
  Percent,
  Phone,
  Mail,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PlatformSettings,
  getStoredPlatformSettings,
  savePlatformSettings,
  DEFAULT_PLATFORM_SETTINGS,
} from '@/lib/domain/platform-settings';

export function PlatformSettingsControl() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [isMounted, setIsMounted] = useState(false);
  const [calculatorUsd, setCalculatorUsd] = useState(15);

  useEffect(() => {
    setIsMounted(true);
    setSettings(getStoredPlatformSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePlatformSettings(settings);
    toast.success('⚙️ Paramètres de la plateforme et taux de change enregistrés avec succès !');
  };

  const handleReset = () => {
    if (confirm('Voulez-vous réinitialiser les paramètres aux valeurs d’origine ?')) {
      savePlatformSettings(DEFAULT_PLATFORM_SETTINGS);
      setSettings(DEFAULT_PLATFORM_SETTINGS);
      toast.success('Paramètres réinitialisés aux valeurs par défaut.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Paramètres Globaux &amp; Contrôle Direction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Contrôle de la Plateforme &amp; Taux de Change
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Ajustez le taux de change officiel <strong>USD ➔ Franc Congolais (CDF)</strong>, gérez la <strong>bannière d’annonce diffusée en direct</strong> sur tout le site, activez les promotions <strong>Afrimoney</strong> et mettez à jour les coordonnées de support.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: CURRENCY & EXCHANGE RATE CONTROL */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-navy flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Taux de Change &amp; Conversion Monétaire RDC</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Définissez la valeur du dollar américain en Francs Congolais (CDF) appliquée sur les calculs automatiques.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              1 $ = {settings.usdToCdfRate.toLocaleString()} CDF
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Taux de conversion officiel (1 USD = X Francs Congolais)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  max="10000"
                  step="50"
                  required
                  value={settings.usdToCdfRate}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      usdToCdfRate: Number(e.target.value) || 2800,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  CDF / $
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Taux standard Kinshasa : 2,800 CDF ou 2,850 CDF.
              </p>
            </div>

            {/* Live conversion tester */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Calculateur de vérification en direct :</span>
                <span className="text-[11px] text-slate-500">Test rapide</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    value={calculatorUsd}
                    onChange={(e) => setCalculatorUsd(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                    placeholder="Montant USD"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    $
                  </span>
                </div>
                <span className="text-slate-400 font-bold">➔</span>
                <div className="flex-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-black text-emerald-800 text-center">
                  {(calculatorUsd * settings.usdToCdfRate).toLocaleString()} CDF
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: GLOBAL SITE-WIDE ANNOUNCEMENT BANNER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-navy flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <span>Bannière d’Annonce &amp; Flash Infos du Site</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ce bandeau s’affiche tout en haut de toutes les pages (Accueil, Parcours, Profil, Tarifs) pour tous les visiteurs.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={settings.announcement.enabled}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    announcement: { ...p.announcement, enabled: e.target.checked },
                  }))
                }
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span className="text-xs font-bold text-slate-800">
                {settings.announcement.enabled ? '🟢 Bannière Activée' : '⚪ Bannière Masquée'}
              </span>
            </label>
          </div>

          {/* Form fields for banner */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge de mise en avant
                </label>
                <input
                  type="text"
                  value={settings.announcement.badge}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      announcement: { ...p.announcement, badge: e.target.value },
                    }))
                  }
                  placeholder="Ex: ⚡ PROMO RDC"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message Principal de l’Annonce
                </label>
                <input
                  type="text"
                  value={settings.announcement.message}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      announcement: { ...p.announcement, message: e.target.value },
                    }))
                  }
                  placeholder="Ex: Débloquez vos Niveaux en direct avec Afrimoney & Mobile Money !"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lien de Redirection (URL)
                </label>
                <input
                  type="text"
                  value={settings.announcement.linkUrl || ''}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      announcement: { ...p.announcement, linkUrl: e.target.value },
                    }))
                  }
                  placeholder="Ex: /profil?tab=tokens ou /tarifs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Texte du Bouton d’Action
                </label>
                <input
                  type="text"
                  value={settings.announcement.linkText || ''}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      announcement: { ...p.announcement, linkText: e.target.value },
                    }))
                  }
                  placeholder="Ex: Découvrir les Passes →"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Live Preview of the Banner */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Aperçu Visuel en Direct :
              </span>
              <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-between gap-2 border border-amber-400/50">
                <div className="flex-1 flex flex-wrap items-center justify-center gap-2 text-center">
                  {settings.announcement.badge && (
                    <span className="bg-slate-950 text-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                      {settings.announcement.badge}
                    </span>
                  )}
                  <span className="font-extrabold">{settings.announcement.message}</span>
                  {settings.announcement.linkText && (
                    <span className="underline font-black cursor-pointer ml-1">
                      {settings.announcement.linkText}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PROMOTIONS & AFRIMONEY CAMPAIGN */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-navy flex items-center gap-2">
              <Percent className="w-5 h-5 text-red-600" />
              <span>Campagne Promotionnelle Afrimoney &amp; Mobile Money</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Activez des remises incitatives pour les étudiants payant par Afrimoney (Africell RDC).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.afrimoneyPromoActive}
                  onChange={(e) =>
                    setSettings((p) => ({
                      ...p,
                      afrimoneyPromoActive: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-400"
                />
                <span className="text-xs font-black text-red-950">
                  Activer la mise en avant Afrimoney (-{settings.afrimoneyDiscountPct}%)
                </span>
              </label>
              <p className="text-[11px] text-red-900/80">
                Affiche le badge &laquo; Partenaire Recommandé &raquo; et un tarif préférentiel sur la page des tarifs.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pourcentage de Réduction (%)
              </label>
              <select
                value={settings.afrimoneyDiscountPct}
                onChange={(e) =>
                  setSettings((p) => ({
                    ...p,
                    afrimoneyDiscountPct: Number(e.target.value) || 15,
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
              >
                <option value={10}>10 % de réduction immédiate</option>
                <option value={15}>15 % de réduction recommandée</option>
                <option value={20}>20 % grande promotion de rentrée</option>
                <option value={25}>25 % offre flash limitée</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: SUPPORT CONTACTS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-navy flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>Coordonnées Officielles &amp; Ligne d’Assistance Coach</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Numéro WhatsApp et email affichés aux apprenants en cas de demande d’aide pour le paiement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Numéro WhatsApp Assistance (avec indicatif)
              </label>
              <input
                type="text"
                required
                value={settings.supportPhone}
                onChange={(e) => setSettings((p) => ({ ...p, supportPhone: e.target.value }))}
                placeholder="+27 74 293 2071 ou +243 ..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Direction / Support
              </label>
              <input
                type="email"
                required
                value={settings.supportEmail}
                onChange={(e) => setSettings((p) => ({ ...p, supportEmail: e.target.value }))}
                placeholder="liandjadavid@gmail.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rétablir les Paramètres par Défaut</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer Tous les Paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
}
