"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Home,
  Compass,
  LayoutDashboard,
  Zap,
  Video,
  Trophy,
  Award,
  FileCheck,
  CreditCard,
  BookOpen,
  Sparkles,
  UserCheck,
  Shield,
  LogIn,
  UserPlus,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    description?: string;
    href: string;
    icon: typeof Home;
    badge?: string;
    badgeColor?: string;
    isExternal?: boolean;
  }[];
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const pathname = usePathname();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const navSections: NavSection[] = [
    {
      title: "Apprentissage & Parcours",
      items: [
        {
          label: "Accueil",
          href: "/",
          icon: Home,
        },
        {
          label: "Parcours d'apprentissage",
          description: "Niveaux CECRL A1 à B2 & paliers",
          href: "/parcours",
          icon: Compass,
          badge: "CECRL",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        },
        {
          label: "Tableau de bord",
          description: "Leçon du jour, XP et séries",
          href: "/tableau-de-bord",
          icon: LayoutDashboard,
          badge: "Apprenant",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        },
        {
          label: "Test de niveau",
          description: "Évaluation interactive en 5 min",
          href: "/test-de-niveau",
          icon: Zap,
          badge: "100% Gratuit",
          badgeColor: "bg-amber-400 text-slate-950 font-black",
        },
        {
          label: "Vidéos à la Demande (VOD)",
          description: "Masterclasses, capsules HD & 3G Éco",
          href: "/vod",
          icon: Video,
          badge: "VOD",
          badgeColor: "bg-sky-400 text-slate-950 font-black",
        },
      ],
    },
    {
      title: "Communauté & Succès",
      items: [
        {
          label: "Classement RDC",
          description: "Top apprenants Kinshasa & provinces",
          href: "/classement",
          icon: Trophy,
        },
        {
          label: "Badges & Trophées",
          description: "Vos distinctions et succès",
          href: "/badges",
          icon: Award,
        },
        {
          label: "Certificats Officiels",
          description: "Attestations de fin de palier",
          href: "/certificats",
          icon: FileCheck,
          badge: "Vérifiable",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        },
      ],
    },
    {
      title: "Découverte & Programmes",
      items: [
        {
          label: "Tarifs & Mobile Money",
          description: "M-Pesa, Airtel Money, Orange Money",
          href: "/tarifs",
          icon: CreditCard,
          badge: "Prix RDC",
          badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/40",
        },
        {
          label: "Nos Programmes",
          description: "Du débutant absolu à l'anglais pro",
          href: "/#programmes",
          icon: BookOpen,
        },
        {
          label: "Méthode Interactive",
          description: "Micro-leçons style Duolingo adaptées RDC",
          href: "/#methode",
          icon: Sparkles,
        },
        {
          label: "Coach David Liandja",
          description: "Fondateur & Formateur certifié à Kinshasa",
          href: "/#coach",
          icon: UserCheck,
        },
      ],
    },
    {
      title: "Administration & Enseignement",
      items: [
        {
          label: "Portail Administrateur",
          description: "Réservé Coach David Liandja & Équipe de gestion",
          href: "/admin",
          icon: Shield,
          badge: "🔒 Réservé",
          badgeColor: "bg-amber-400 text-slate-950 font-black",
        },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu latéral de navigation"
    >
      {/* Dimmed Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <aside className="w-screen max-w-[88vw] sm:max-w-md h-dvh bg-[#0B1F42] text-white shadow-2xl flex flex-col border-l border-amber-400/20 animate-in slide-in-from-right duration-300">
          {/* Header with safe-area support */}
          <div className="p-3.5 sm:p-5 pt-[max(env(safe-area-inset-top),0.875rem)] border-b border-white/10 flex items-center justify-between bg-navy-dark/60 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Logo size="sm" variant="dark" withSlogan={false} />
            </div>

            <button
              onClick={onClose}
              className="min-tap flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-white/10 shrink-0 active:scale-95"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick User Actions / Auth Banner */}
          <div className="p-4 bg-white/5 border-b border-white/10 shrink-0 flex items-center justify-between gap-2">
            <Link
              href="/connexion"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/10 transition"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Connexion</span>
            </Link>

            <Link
              href="/test-de-niveau"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-black text-slate-950 transition shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Test Gratuit</span>
            </Link>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/20">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-amber-400/80 px-2">
                  {section.title}
                </h3>

                <div className="space-y-1">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={itemIdx}
                        href={item.href}
                        onClick={onClose}
                        className={`group flex items-center justify-between p-2.5 rounded-xl transition-all ${
                          isActive
                            ? "bg-amber-400/15 border border-amber-400/40 text-amber-300"
                            : "hover:bg-white/10 text-slate-200 hover:text-white border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              isActive
                                ? "bg-amber-400 text-slate-950"
                                : "bg-white/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold truncate">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                    item.badgeColor ||
                                    "bg-white/10 text-white border-white/20"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Direct WhatsApp Coach Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border border-emerald-500/30 text-white space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-300">
                    Besoin d&apos;aide ou d&apos;orientation ?
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Contact direct avec Coach David à Kinshasa
                  </p>
                </div>
              </div>

              <a
                href={BRAND.coach.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <span>Écrire sur WhatsApp (+243)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sticky Footer with safe-area padding for mobile home indicator */}
          <div className="p-4 pb-[max(env(safe-area-inset-bottom),1rem)] border-t border-white/10 bg-navy-dark/95 shrink-0 text-center text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">
              PA³ English Academy • {BRAND.slogan}
            </p>
            <p className="text-[11px] text-slate-500">
              Kinshasa, RDC 🇨🇩 • Conçu pour faible bande passante
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
