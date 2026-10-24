'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { AdminUser } from '@/lib/auth-admin';

export type AdminTabType =
  | 'overview'
  | 'lessons'
  | 'learners'
  | 'questions'
  | 'paliers'
  | 'vod'
  | 'pricing'
  | 'tokens'
  | 'settings';

interface NavItem {
  id: AdminTabType;
  label: string;
  shortLabel: string;
  icon: string;
  badge?: string | number;
  badgeColor?: string;
  description: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  counts: {
    lessons: number;
    learners: number;
    questions: number;
    paliers: number;
    vod: number;
    tokens?: number;
    rate?: number;
  };
  adminUser: AdminUser | null;
  onLogout: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  counts,
  adminUser,
  onLogout,
}: AdminSidebarProps) {
  const sections: NavSection[] = [
    {
      title: 'Pilotage & Chiffres',
      items: [
        {
          id: 'overview',
          label: 'Vue d’ensemble & KPI',
          shortLabel: 'Vue d’ensemble',
          icon: '📊',
          description: 'Métriques globales, inscriptions et revenus',
        },
      ],
    },
    {
      title: 'Gestion Pédagogique',
      items: [
        {
          id: 'lessons',
          label: 'Gestion des Leçons',
          shortLabel: 'Leçons',
          icon: '📚',
          badge: counts.lessons,
          badgeColor: 'bg-gold/20 text-gold border-gold/40',
          description: 'Créer, éditer, ordonner et publier les cours',
        },
        {
          id: 'paliers',
          label: 'Paliers & Niveaux CECRL',
          shortLabel: 'Paliers',
          icon: '🎯',
          badge: counts.paliers,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          description: 'Configuration A1, A2, B1, B2, seuils et XP',
        },
        {
          id: 'questions',
          label: 'Banque Test de Niveau',
          shortLabel: 'Test & Questions',
          icon: '🧭',
          badge: counts.questions,
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          description: 'QCM d’évaluation initiale & orientation',
        },
        {
          id: 'vod',
          label: 'Vidéothèque VOD',
          shortLabel: 'VOD & 3G',
          icon: '🎥',
          badge: counts.vod,
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          description: 'Cloudinary streaming éco 3G & prononciation',
        },
      ],
    },
    {
      title: 'Communauté & Étudiants',
      items: [
        {
          id: 'learners',
          label: 'Gestion des Apprenants',
          shortLabel: 'Apprenants',
          icon: '👥',
          badge: counts.learners,
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          description: 'Comptes, progression, XP et promotions',
        },
      ],
    },
    {
      title: 'Monétisation & Contrôle',
      items: [
        {
          id: 'pricing',
          label: 'Tarifs & Afrimoney',
          shortLabel: 'Tarifs & Mobile',
          icon: '💳',
          badge: 'RDC',
          badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
          description: 'Abonnements, réductions et passerelle SASPay',
        },
        {
          id: 'tokens',
          label: 'Tokens & Vouchers',
          shortLabel: 'Tokens',
          icon: '🎟️',
          badge: counts.tokens !== undefined ? counts.tokens : 'CRUD',
          badgeColor: 'bg-gold/30 text-gold-light border-gold',
          description: 'Génération en lot, déverrouillage de niveaux',
        },
        {
          id: 'settings',
          label: 'Paramètres & Taux CDF',
          shortLabel: 'Taux & Annonces',
          icon: '⚙️',
          badge: counts.rate ? `${counts.rate}` : '2800',
          badgeColor: 'bg-slate-700 text-slate-200 border-slate-600',
          description: 'Taux de change USD/CDF, bannière live & support',
        },
      ],
    },
  ];

  const handleSelectTab = (tabId: AdminTabType) => {
    setActiveTab(tabId);
    setIsOpenMobile(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 select-none">
      {/* Top Brand & Portal Badge */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="inline-block" onClick={() => setIsOpenMobile(false)}>
            <Logo variant="dark" size="sm" />
          </Link>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition"
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded-md">
            Administration
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Panneau de Contrôle</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-white font-extrabold border-l-4 border-amber-400 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className={`text-base shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate">
                          {item.label}
                        </div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-amber-300/80' : 'text-slate-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${
                          item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Dedicated Pedagogical Guide & Video Suggestions Link */}
        <div className="pt-2 px-1">
          <Link
            href="/admin/suggestions"
            onClick={() => setIsOpenMobile(false)}
            className="w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group bg-gradient-to-r from-amber-500/15 via-gold/10 to-transparent border border-gold/30 hover:border-gold/60 text-amber-200 hover:text-white shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                💡
              </span>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate flex items-center gap-1.5">
                  <span>Guide Vidéos & Scripts</span>
                  <span className="text-[9px] bg-gold/20 text-gold px-1.5 py-0.2 rounded font-black">
                    12 SCRIPTS
                  </span>
                </div>
                <div className="text-[10px] text-amber-300/70 truncate">
                  Suggestions & formule de tournage
                </div>
              </div>
            </div>
            <span className="text-xs text-amber-400 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </nav>

      {/* Bottom Profile & Actions Card */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 shrink-0 space-y-3">
        {/* Coach Status Card */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                {adminUser?.avatar || 'CD'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" title="En ligne" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Coach David Liandja'}
              </div>
              <div className="text-[10px] text-amber-400 font-semibold truncate flex items-center gap-1">
                <span>👑</span>
                <span>Directeur Pédagogique</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
            title="Verrouiller la session"
            aria-label="Déconnexion"
          >
            🔒
          </button>
        </div>

        {/* Quick academy link */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
          <Link
            href="/tableau-de-bord"
            className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-center transition border border-slate-700/50 truncate"
          >
            ← Académie
          </Link>
          <Link
            href="/tarifs"
            className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-center transition border border-slate-700/50 truncate"
          >
            Voir Tarifs →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR: Permanent fixed/sticky left column */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-slate-800 shadow-xl z-20 sticky top-0 h-screen overflow-hidden">
        {navContent}
      </aside>

      {/* MOBILE DRAWER: Slide-over backdrop & panel */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
            aria-hidden="true"
          />

          {/* Slide-over Container */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
