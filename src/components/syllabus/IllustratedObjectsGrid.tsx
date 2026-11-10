'use client';

import React, { useState } from 'react';
import { EVERYDAY_OBJECTS_DATA, EverydayObjectItem } from '@/lib/domain/illustrated-syllabus-data';
import {
  Laptop,
  Smartphone,
  Headphones,
  ShieldCheck,
  BookOpen,
  Key,
  CreditCard,
  CupSoda,
  Umbrella,
  FileCheck,
  BatteryCharging,
  HardHat,
  Send,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export function IllustratedObjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string>('power-bank');

  const filteredItems =
    selectedCategory === 'all'
      ? EVERYDAY_OBJECTS_DATA
      : EVERYDAY_OBJECTS_DATA.filter((item) => item.category === selectedCategory);

  const selectedItem =
    EVERYDAY_OBJECTS_DATA.find((item) => item.id === selectedItemId) ||
    EVERYDAY_OBJECTS_DATA[0];

  const getObjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-sky-600" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      case 'Key':
        return <Key className="w-5 h-5 text-orange-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-teal-600" />;
      case 'CupSoda':
        return <CupSoda className="w-5 h-5 text-cyan-600" />;
      case 'Umbrella':
        return <Umbrella className="w-5 h-5 text-blue-600" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-rose-600" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-amber-500" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-amber-600" />;
      case 'Send':
        return <Send className="w-5 h-5 text-emerald-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-slate-600" />;
    }
  };

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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs">
        <span className="font-bold text-amber-900 flex items-center gap-1.5">
          <span>📦</span>
          <span>Catégories d&apos;Objets :</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Tous les objets (13)' },
            { id: 'tech_office', label: 'Tech & Bureau' },
            { id: 'daily_essentials', label: 'Vie Urbaine & Voyage' },
            { id: 'rdc_field', label: '🇨🇩 Spécial RDC (Délestage, Mines, Mobile Money)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Spotlight Item Detail */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="p-3 bg-slate-800 rounded-2xl">
              {getObjectIcon(selectedItem.iconName)}
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase">
              {selectedItem.category.replace('_', ' ')}
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">{selectedItem.nameEn}</h3>
            <p className="text-sm text-slate-300 mt-0.5">{selectedItem.nameFr}</p>
            <span className="inline-block mt-2 font-mono text-xs text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
              {selectedItem.phonetic}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Contexte d&apos;utilisation pratique en RDC :</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedItem.practicalContextFr}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Phrase type en situation :
            </span>
            <p className="text-xs font-bold text-white italic">
              &ldquo;{selectedItem.sampleSentenceEn}&rdquo;
            </p>
            <p className="text-[11px] text-slate-300">👉 {selectedItem.sampleSentenceFr}</p>
          </div>

          <button
            onClick={() => playPronunciation(selectedItem.nameEn, selectedItem.phonetic)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Écouter la prononciation</span>
          </button>
        </div>

        {/* Right Column: Objects Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const isCurrent = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isCurrent
                    ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/30 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-100">
                    {getObjectIcon(item.iconName)}
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-black text-navy leading-tight">{item.nameEn}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.nameFr}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="font-mono text-amber-700 font-bold">{item.phonetic}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

