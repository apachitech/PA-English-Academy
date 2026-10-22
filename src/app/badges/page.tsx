'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { Logo } from '@/components/brand/Logo';
import { evaluateBadges, OFFICIAL_BADGES } from '@/lib/domain/gamification';

export default function BadgesPage() {
  // Demo user stats
  const [stats] = useState({
    lessonsCompleted: 3,
    streakDays: 4,
    hasPerfectScore: true,
    totalXp: 260,
    certificatesCount: 0,
    hasCompletedPlacement: true,
  });

  const evaluatedBadges = evaluateBadges(stats);
  const unlockedCount = evaluatedBadges.filter((b) => b.unlocked).length;
  const totalCount = evaluatedBadges.length;

  const shareText = encodeURIComponent(
    `🏆 J'ai déjà débloqué ${unlockedCount}/${totalCount} badges sur PA³ English Academy ! Rejoins-moi pour apprendre l'anglais avec Coach David Liandja : https://speakup-congo.vercel.app`
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Clean Spacious Top Navigation with Side Menu */}
      <Navbar variant="app" showTestCta={true} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Hero Card */}
        <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30 mb-2">
                🎖️ Succès & Trophées
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Vos Badges Officiels
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-lg">
                Chaque étape franchie sur PA³ English Academy témoigne de votre engagement et de vos progrès vers la fluidité.
              </p>
            </div>

            {/* Badges Progress Ring/Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center sm:min-w-[190px]">
              <div className="text-3xl font-black text-gold">
                {unlockedCount} / {totalCount}
              </div>
              <div className="text-xs text-slate-300 font-medium uppercase mt-0.5">
                Badges débloqués
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Share Button on WhatsApp */}
        <div className="mb-8 flex items-center justify-between bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📱</span>
            <div>
              <div className="text-sm font-bold text-slate-800">
                Fier de vos progrès ?
              </div>
              <div className="text-xs text-slate-500">
                Partagez vos trophées avec Coach David ou vos proches sur WhatsApp !
              </div>
            </div>
          </div>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-duo-secondary !py-2 !px-4 text-xs shrink-0 flex items-center gap-2"
          >
            <span>💬</span> Partager
          </a>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {evaluatedBadges.map(({ badge, unlocked, progress }) => {
            return (
              <div
                key={badge.code}
                className={`rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  unlocked
                    ? 'bg-white border-yellow-300 shadow-sm hover:shadow-md'
                    : 'bg-slate-100/70 border-slate-200 opacity-80'
                }`}
              >
                {/* Top Badge Icon & Status */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                        unlocked
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-slate-200/80 grayscale'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    {unlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                        ✓ Obtenu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-200 text-slate-600">
                        🔒 En cours
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3
                    className={`font-bold text-base ${
                      unlocked ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {badge.title_fr}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {badge.description_fr}
                  </p>
                </div>

                {/* Bottom Progress Bar if locked */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {unlocked ? (
                    <div className="text-[11px] text-gold-dark font-semibold flex items-center gap-1">
                      ⭐ Succès validé à 100 %
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>Progression</span>
                        <span className="font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-navy h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
