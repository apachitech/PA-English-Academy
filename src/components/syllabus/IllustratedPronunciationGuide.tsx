'use client';

import React, { useState } from 'react';
import { PRONUNCIATION_RULES_DATA, PronunciationRule } from '@/lib/domain/illustrated-syllabus-data';
import { Volume2, Sparkles, AlertTriangle, CheckCircle2, Flame, Award } from 'lucide-react';
import { toast } from 'sonner';

export function IllustratedPronunciationGuide() {
  const [selectedRuleId, setSelectedRuleId] = useState<string>('th-unvoiced');

  const selectedRule =
    PRONUNCIATION_RULES_DATA.find((r) => r.id === selectedRuleId) ||
    PRONUNCIATION_RULES_DATA[0];

  const playSoundDemo = (word: string, ipa: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      toast.success(`Écoute : "${word}" (${ipa})`);
    } else {
      toast.info(`Mot : ${word} (${ipa})`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Sound Selection Ribbon */}
      <div className="flex flex-wrap items-center gap-2.5 p-2 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-bold px-3 py-1 flex items-center gap-1.5">
          <span>👄</span>
          <span>Sons Clés :</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {PRONUNCIATION_RULES_DATA.map((rule) => {
            const isSelected = selectedRuleId === rule.id;
            return (
              <button
                key={rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                className={`px-3.5 py-2 rounded-xl font-black transition cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span className="font-mono text-sm">{rule.soundIpa}</span>
                <span className="hidden sm:inline text-xs">{rule.titleFr.split('(')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Visual Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Anatomical Articulation & Method Diagram */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black font-mono">
                {selectedRule.soundIpa}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                Cordes vocales : {selectedRule.vocalCords}
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{selectedRule.titleFr}</h3>
            <p className="text-xs text-amber-300/90 font-medium">{selectedRule.subtitleFr}</p>
          </div>

          {/* Articulation Visual Schema */}
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Positionnement des lèvres &amp; de la langue :</span>
            </span>
            <p className="text-sm font-semibold text-slate-100 leading-relaxed">
              {selectedRule.mouthPositionFr}
            </p>
          </div>

          {/* Coach David's Advice Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
            <span className="text-amber-400 font-black block">💡 Astuce Spéciale du Coach David :</span>
            <p className="text-slate-300 leading-relaxed">{selectedRule.coachTipFr}</p>
          </div>
        </div>

        {/* Right: African Pitfalls, Traps & Audio Practice */}
        <div className="lg:col-span-7 space-y-6">
          {/* African Pitfall Alert Card */}
          <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide">
                Le Piège Africain &amp; Francophone :
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-medium">
              {selectedRule.africanPitfallFr}
            </p>
          </div>

          {/* Embarrassing Minimal Pairs Table */}
          {selectedRule.trapComparison.length > 0 && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                🚨 Paires Minimales &amp; Confusions Embarrassantes :
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="py-2 px-2 text-rose-600">❌ Mauvaise Prononciation</th>
                      <th className="py-2 px-2">Sens involontaire</th>
                      <th className="py-2 px-2 text-emerald-600">✅ Prononciation Correcte</th>
                      <th className="py-2 px-2">Vrai Sens</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRule.trapComparison.map((trap, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-2 font-black text-rose-700">
                          {trap.wrongWord} ({trap.wrongSound})
                        </td>
                        <td className="py-2.5 px-2 text-slate-600 italic">{trap.wrongMeaning}</td>
                        <td className="py-2.5 px-2 font-black text-emerald-700">
                          <button
                            onClick={() => playSoundDemo(trap.correctWord, selectedRule.soundIpa)}
                            className="inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span>{trap.correctWord}</span>
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-slate-900">
                          {trap.correctMeaning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Model Examples with Pronunciation Clickers */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              🎧 Mots Modèles à Répéter à Voix Haute :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedRule.goodExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-black text-navy">{ex.word}</strong>
                      <span className="text-xs font-mono text-emerald-700">{ex.phonetic}</span>
                    </div>
                    <span className="text-xs text-slate-500">{ex.translationFr}</span>
                  </div>
                  <button
                    onClick={() => playSoundDemo(ex.word, ex.phonetic)}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                    title="Écouter la prononciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

