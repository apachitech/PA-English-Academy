"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Zap, ArrowRight, Shield, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SideMenu } from "./SideMenu";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { isLearnerAuthenticated, getLearnerProfile, LearnerProfile } from "@/lib/auth-learner";

interface NavbarProps {
  variant?: "home" | "app" | "minimal";
  showTestCta?: boolean;
  showAdminBadge?: boolean;
  customRightElement?: React.ReactNode;
}

export function Navbar({
  variant = "home",
  showTestCta = true,
  showAdminBadge = false,
  customRightElement,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [learner, setLearner] = useState<LearnerProfile | null>(null);

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    if (isLearnerAuthenticated()) {
      setLearner(getLearnerProfile());
    }
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs"
        suppressHydrationWarning
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo - Left */}
          <div className="shrink-0 flex items-center min-w-0">
            <Logo
              size={variant === "minimal" ? "sm" : "md"}
              withSlogan={variant === "home"}
            />
          </div>

          {/* Clean, spacious middle area */}
          <div className="flex-1 hidden lg:flex items-center justify-center">
            {/* Kept uncluttered to give clean breathing room */}
          </div>

          {/* Right Action Elements */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Custom injected element (e.g. stats, streaks, etc.) */}
            {customRightElement}

            {/* Learner Profile Quick Access */}
            {learner && (
              <Link
                href="/profil"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-amber-50 hover:border-amber-300 text-navy font-bold text-xs sm:text-sm border border-slate-200 transition active:scale-95 shadow-2xs"
                title={`Profil de ${learner.name}`}
              >
                {learner.avatarUrl && learner.avatarUrl.startsWith("emoji:") ? (
                  <span className="text-sm sm:text-base leading-none">{learner.avatarUrl.replace("emoji:", "")}</span>
                ) : learner.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={learner.avatarUrl}
                    alt={learner.name}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                    {learner.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline font-bold">{learner.name.split(" ")[0]}</span>
              </Link>
            )}

            {/* Admin Portal quick pill - visible when admin session is active */}
            {showAdminBadge && isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-400 text-slate-950 hover:bg-amber-300 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-all shadow-2xs border border-amber-500/40 active:scale-95 shrink-0"
                title="Portail Administration & Gestion des cours"
              >
                <Shield className="w-3.5 h-3.5 fill-slate-950" />
                <span className="hidden xs:inline">Admin</span>
              </Link>
            )}

            {/* Quick Test Level CTA */}
            {showTestCta && (
              <Link
                href="/test-de-niveau"
                className="btn-3d-gold px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1 sm:gap-1.5 shadow-2xs shrink-0"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-950 text-amber-950 shrink-0" />
                <span className="hidden 2xs:inline">Test Gratuit</span>
                <span className="2xs:hidden">Test</span>
                <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
              </Link>
            )}

            {/* Elegant Side Menu Trigger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={isMenuOpen}
              className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-10 sm:min-h-11 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all border border-slate-200 active:scale-95 cursor-pointer shadow-2xs shrink-0"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 shrink-0" />
              <span className="hidden xs:inline font-extrabold">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Navigation Drawer */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
