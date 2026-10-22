'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4">
      <header className="py-4 border-b border-slate-200">
        <div className="max-w-md mx-auto">
          <Logo size="sm" />
        </div>
      </header>

      <main className="max-w-md w-full mx-auto my-auto text-center py-10 px-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
          📡
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-3">
          Mode Hors Ligne (RDC)
        </span>

        <h1 className="text-2xl font-black text-slate-900 mb-3">
          Pas de signal Internet
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Le réseau cellulaire (Vodacom, Airtel, Orange) semble temporairement inaccessible ou instable. Pas de panique ! Vos données et vos progrès locaux sont bien sauvegardés.
        </p>

        {/* Offline tips */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 text-left mb-6 shadow-sm">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            💡 Pendant que la connexion revient :
          </h2>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
            <li>Révisez vos phrases de salutations : <em>Good morning, How are you doing?</em></li>
            <li>Répétez à voix haute les nombres de 0 à 20 en insistant sur l'accent de <em>thirteen</em> à <em>nineteen</em>.</li>
            <li>Dès que le signal est rétabli, cliquez ci-dessous pour reprendre.</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="btn-duo w-full !py-3 text-sm flex items-center justify-center gap-2 mb-3"
        >
          <span>🔄</span> Réessayer la connexion
        </button>

        <Link
          href="/parcours"
          className="text-xs text-navy font-bold hover:underline block"
        >
          Tenter d'ouvrir le parcours enregistré
        </Link>
      </main>

      <footer className="text-center text-[11px] text-slate-400 py-4">
        PA³ English Academy • Parler Anglais Avec Assurance
      </footer>
    </div>
  );
}
