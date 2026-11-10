'use client';

import React, { useState } from 'react';
import { CLOTHING_DATA, ClothingItem } from '@/lib/domain/illustrated-syllabus-data';
import { Sparkles, Volume2, Check } from 'lucide-react';
import { toast } from 'sonner';

export function IllustratedClothingWardrobe() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('african-wax');

  const filteredItems =
    selectedCategory === 'all'
      ? CLOTHING_DATA
      : CLOTHING_DATA.filter((item) => item.category === selectedCategory);

  const selectedItem =
    CLOTHING_DATA.find((item) => item.id === selectedItemId) || CLOTHING_DATA[0];

  const playPronunciation = (nameEn: string, phonetic: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(nameEn);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success(`Écoute : "${nameEn}" (${phonetic})`);
    } else {
      toast.info(`Mot : ${nameEn} (${phonetic})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs">
        <span className="font-bold text-purple-900 flex items-center gap-1.5">
          <span>👔</span>
          <span>Catégorie Vestimentaire :</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Toutes les tenues (16)' },
            { id: 'business', label: 'Corporate & Business Suit' },
            { id: 'african_heritage', label: 'Pagne / Wax & Sapeur' },
            { id: 'casual', label: 'Casual & Week-end' },
            { id: 'accessories', label: 'Accessoires & Bijoux' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Spotlight & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spotlight Item Detail */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-slate-950 to-purple-950 text-white p-6 rounded-3xl border border-purple-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-purple-900/60 pb-4">
            <span className="text-4xl">{selectedItem.emoji}</span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black uppercase">
              {selectedItem.category.replace('_', ' ')}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">{selectedItem.nameEn}</h3>
            <p className="text-sm text-purple-200 mt-0.5">{selectedItem.nameFr}</p>
            <span className="inline-block mt-2 font-mono text-xs text-amber-300 bg-purple-900/40 px-2 py-0.5 rounded">
              {selectedItem.phonetic}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-900/30 border border-purple-700/50 space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Contexte &amp; Culture Africaine :</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedItem.culturalNoteFr}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Phrase type en situation :
            </span>
            <p className="text-xs font-bold text-white italic">
              &ldquo;{selectedItem.sampleSentenceEn}&rdquo;
            </p>
            <p className="text-[11px] text-slate-400">👉 {selectedItem.sampleSentenceFr}</p>
          </div>

          <button
            onClick={() => playPronunciation(selectedItem.nameEn, selectedItem.phonetic)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Écouter la prononciation</span>
          </button>
        </div>

        {/* Right Column: Interactive Visual Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const isCurrent = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isCurrent
                    ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400/30 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.emoji}</span>
                  {isCurrent && <Check className="w-4 h-4 text-purple-600" />}
                </div>

                <div>
                  <h4 className="text-xs font-black text-navy leading-tight">{item.nameEn}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.nameFr}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="font-mono text-purple-700 font-bold">{item.phonetic}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

