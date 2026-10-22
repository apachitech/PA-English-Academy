'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { Logo } from '@/components/brand/Logo';
import {
  LEAGUE_TIERS,
  LeagueTier,
  MOCK_LEADERBOARD_ENTRIES,
  LeaderboardEntry,
} from '@/lib/domain/gamification';

export default function ClassementPage() {
  const [selectedLeague, setSelectedLeague] = useState<LeagueTier>('or');
  const [optInLeaderboard, setOptInLeaderboard] = useState(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD_ENTRIES);

  const league = LEAGUE_TIERS[selectedLeague];
  const topThree = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Clean Spacious Top Navigation with Side Menu */}
      <Navbar variant="app" showTestCta={true} />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Header Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30 mb-2">
                🏆 Ligue de la semaine
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Classement Hebdomadaire
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-lg">
                Remise à zéro chaque lundi à 00h00 (heure de Kinshasa / Lubumbashi). Les 3 premiers montent dans la ligue supérieure !
              </p>
            </div>

            {/* Countdown / Status Box */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center sm:min-w-[170px]">
              <div className="text-xs text-slate-300 uppercase font-semibold">Prochaine réinitialisation</div>
              <div className="text-lg font-bold text-gold mt-0.5">Dimanche 23:59</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kinshasa (GMT+1)</div>
            </div>
          </div>
        </div>

        {/* League Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {(Object.keys(LEAGUE_TIERS) as LeagueTier[]).map((tierKey) => {
            const t = LEAGUE_TIERS[tierKey];
            const isSelected = selectedLeague === tierKey;
            return (
              <button
                key={tierKey}
                onClick={() => setSelectedLeague(tierKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                  isSelected
                    ? `${t.bgClass} ${t.borderClass} shadow-md scale-105`
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{t.badgeIcon}</span>
                <span>{t.label_fr}</span>
                <span className="text-[10px] font-normal opacity-75">
                  ({t.minXp}+ XP)
                </span>
              </button>
            );
          })}
        </div>

        {/* Privacy & Opt-in Toggle */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">👁️</span>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-800">
                Participer au classement public
              </div>
              <div className="text-[11px] text-slate-500">
                Permet d’apparaître sur le classement des apprenants en RDC.
              </div>
            </div>
          </div>
          <button
            onClick={() => setOptInLeaderboard(!optInLeaderboard)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              optInLeaderboard ? 'bg-gold' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                optInLeaderboard ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end mb-8 pt-6">
          {/* Rank 2 */}
          {topThree[1] && (
            <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-slate-200 shadow-sm flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-lg sm:text-2xl font-bold text-slate-700 shadow-inner">
                  {topThree[1].fullName.charAt(0)}
                </div>
                <span className="absolute -bottom-2 -right-1 text-xl">🥈</span>
              </div>
              <div className="mt-3 font-bold text-xs sm:text-sm text-slate-800 truncate w-full">
                {topThree[1].fullName}
              </div>
              <div className="text-[10px] text-slate-500 truncate w-full">{topThree[1].city}</div>
              <div className="mt-2 text-xs sm:text-sm font-extrabold text-navy">
                {topThree[1].weeklyXp} <span className="text-[10px] font-medium text-slate-500">XP</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                🔥 {topThree[1].streakDays}j
              </div>
            </div>
          )}

          {/* Rank 1 - Champion */}
          {topThree[0] && (
            <div className="bg-gradient-to-b from-yellow-50 to-white rounded-2xl p-4 sm:p-5 border-2 border-gold shadow-md flex flex-col items-center text-center -translate-y-3">
              <div className="text-2xl mb-1">👑</div>
              <div className="relative">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-yellow-100 border-2 border-gold flex items-center justify-center text-xl sm:text-3xl font-extrabold text-yellow-800 shadow-inner">
                  {topThree[0].fullName.charAt(0)}
                </div>
                <span className="absolute -bottom-2 -right-1 text-2xl">🥇</span>
              </div>
              <div className="mt-3 font-extrabold text-xs sm:text-base text-slate-900 truncate w-full">
                {topThree[0].fullName}
              </div>
              <div className="text-[11px] text-gold-dark font-medium truncate w-full">
                {topThree[0].city}
              </div>
              <div className="mt-2 text-sm sm:text-base font-black text-navy">
                {topThree[0].weeklyXp} <span className="text-xs font-semibold text-slate-500">XP</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 bg-amber-100 font-bold px-2.5 py-0.5 rounded-full">
                🔥 {topThree[0].streakDays}j d'affilée
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {topThree[2] && (
            <div className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-amber-200 shadow-sm flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-lg sm:text-2xl font-bold text-amber-900 shadow-inner">
                  {topThree[2].fullName.charAt(0)}
                </div>
                <span className="absolute -bottom-2 -right-1 text-xl">🥉</span>
              </div>
              <div className="mt-3 font-bold text-xs sm:text-sm text-slate-800 truncate w-full">
                {topThree[2].fullName}
              </div>
              <div className="text-[10px] text-slate-500 truncate w-full">{topThree[2].city}</div>
              <div className="mt-2 text-xs sm:text-sm font-extrabold text-navy">
                {topThree[2].weeklyXp} <span className="text-[10px] font-medium text-slate-500">XP</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                🔥 {topThree[2].streakDays}j
              </div>
            </div>
          )}
        </div>

        {/* Detailed Leaderboard Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>{league.badgeIcon}</span> {league.label_fr} — Classement en direct
            </h2>
            <span className="text-xs text-slate-500">{entries.length} apprenants actifs</span>
          </div>

          <div className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const isUser = entry.isCurrentUser;
              return (
                <div
                  key={entry.userId}
                  className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 transition-colors ${
                    isUser
                      ? 'bg-yellow-50/80 border-l-4 border-gold font-medium'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span
                      className={`w-7 text-center font-black text-sm ${
                        entry.rank === 1
                          ? 'text-yellow-600'
                          : entry.rank === 2
                          ? 'text-slate-500'
                          : entry.rank === 3
                          ? 'text-amber-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {entry.rank}
                    </span>

                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                      {entry.fullName.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                        <span>{entry.fullName}</span>
                        {isUser && (
                          <span className="text-[10px] bg-navy text-white px-2 py-0.5 rounded-full font-semibold">
                            Vous
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{entry.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div className="hidden sm:flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
                      🔥 <span className="font-bold">{entry.streakDays}</span>
                      <span className="text-[10px] text-slate-400">j</span>
                    </div>

                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-navy">
                        {entry.weeklyXp}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 ml-1">XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Callout */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-4">
          <div className="text-3xl shrink-0">🦁</div>
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Conseil du Coach David Liandja
            </h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              « Pour grimper dans la Ligue Or ou Diamant, 15 minutes par jour suffisent ! Faites au moins une leçon chaque matin à Kinshasa avant que la journée ne commence. La régularité bat toujours le talent. »
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
