'use client';

import React, { useState } from 'react';
import {
  BODY_PARTS_DATA,
  BodyPartItem,
} from '@/lib/domain/illustrated-syllabus-data';
import { Sparkles, AlertCircle, Volume2, ShieldCheck, Check } from 'lucide-react';
import { toast } from 'sonner';

export function IllustratedAnatomyChart() {
  const [selectedPartId, setSelectedPartId] = useState<string>('mouth');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedPart =
    BODY_PARTS_DATA.find((p) => p.id === selectedPartId) || BODY_PARTS_DATA[0];

  const filteredParts =
    activeCategory === 'all'
      ? BODY_PARTS_DATA
      : BODY_PARTS_DATA.filter((p) => p.category === activeCategory);

  const playPronunciationDemo = (nameEn: string, phonetic: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(nameEn);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      toast.success(`Prononciation : ${nameEn} ${phonetic}`);
    } else {
      toast.info(`Prononciation : ${nameEn} ${phonetic}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-100 rounded-2xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>🎯</span>
          <span>Zone Anatomique :</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Toutes les parties (21)' },
            { id: 'head', label: 'Tête, Visage & Cou' },
            { id: 'upper_body', label: 'Poitrine & Tronc' },
            { id: 'arms', label: 'Bras & Mains' },
            { id: 'lower_body', label: 'Jambes & Pieds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Anatomy Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Silhouette & Visual Pins */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                Carte Visuelle Interactive
              </span>
              <h4 className="text-base font-black text-white">The Human Body</h4>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              Cliquez sur un point 📍
            </span>
          </div>

          {/* SVG Human Silhouette with Pin Hotspots */}
          <div className="relative w-full max-w-[280px] h-[440px] flex items-center justify-center my-2">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full drop-shadow-2xl select-none"
              style={{ filter: 'drop-shadow(0 10px 20px rgba(16, 185, 129, 0.15))' }}
            >
              {/* Head */}
              <circle cx="100" cy="40" r="24" fill="#334155" stroke="#10b981" strokeWidth="2" />
              {/* Neck */}
              <rect x="94" y="64" width="12" height="14" rx="3" fill="#334155" />
              {/* Torso */}
              <path
                d="M 65 78 L 135 78 L 125 180 L 75 180 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
              />
              {/* Chest Accent */}
              <path
                d="M 75 95 Q 100 115 125 95"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {/* Left Arm */}
              <path
                d="M 65 80 L 40 140 L 32 195"
                fill="none"
                stroke="#334155"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Arm */}
              <path
                d="M 135 80 L 160 140 L 168 195"
                fill="none"
                stroke="#334155"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Hands */}
              <circle cx="30" cy="205" r="8" fill="#475569" />
              <circle cx="170" cy="205" r="8" fill="#475569" />
              {/* Left Leg */}
              <path
                d="M 85 180 L 80 280 L 75 365"
                fill="none"
                stroke="#334155"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right Leg */}
              <path
                d="M 115 180 L 120 280 L 125 365"
                fill="none"
                stroke="#334155"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Feet */}
              <ellipse cx="68" cy="380" rx="14" ry="7" fill="#475569" />
              <ellipse cx="132" cy="380" rx="14" ry="7" fill="#475569" />
            </svg>

            {/* Interactive Pin Markers Placed on Body Coordinates */}
            {[
              { id: 'head', x: '50%', y: '8%', label: 'Head' },
              { id: 'eyes', x: '50%', y: '13%', label: 'Eyes' },
              { id: 'ears', x: '38%', y: '13%', label: 'Ears' },
              { id: 'nose', x: '50%', y: '17%', label: 'Nose' },
              { id: 'mouth', x: '50%', y: '21%', label: 'Mouth' },
              { id: 'neck', x: '50%', y: '26%', label: 'Neck' },
              { id: 'shoulders', x: '28%', y: '28%', label: 'Shoulders' },
              { id: 'chest', x: '50%', y: '33%', label: 'Chest' },
              { id: 'arm', x: '22%', y: '40%', label: 'Arm' },
              { id: 'elbow', x: '18%', y: '48%', label: 'Elbow' },
              { id: 'stomach', x: '50%', y: '45%', label: 'Stomach' },
              { id: 'hand', x: '12%', y: '60%', label: 'Hands' },
              { id: 'knee', x: '38%', y: '72%', label: 'Knees' },
              { id: 'ankle', x: '36%', y: '88%', label: 'Ankles' },
              { id: 'foot', x: '32%', y: '95%', label: 'Feet' },
            ].map((pin) => {
              const isSelected = selectedPartId === pin.id;
              return (
                <button
                  key={pin.id}
                  onClick={() => setSelectedPartId(pin.id)}
                  style={{ left: pin.x, top: pin.y }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer focus:outline-none`}
                  title={pin.label}
                >
                  <span
                    className={`block w-4 h-4 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-400 border-white scale-125 shadow-lg shadow-emerald-400/50 animate-pulse'
                        : 'bg-emerald-600 border-slate-900 hover:scale-110 hover:bg-emerald-300'
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase whitespace-nowrap pointer-events-none transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 opacity-100 scale-100'
                        : 'bg-slate-800 text-slate-200 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
                    }`}
                  >
                    {pin.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full text-center text-xs text-slate-400 mt-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            Partie sélectionnée :{' '}
            <strong className="text-emerald-300 font-bold">
              {selectedPart.nameEn} ({selectedPart.nameFr})
            </strong>
          </div>
        </div>

        {/* Right Column: Detailed Card with Phonetics, Lingala & Medical Roleplay */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Part Spotlight Card */}
          <div className="p-6 rounded-3xl bg-white border-2 border-emerald-500/40 shadow-lg space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                    Anatomie &amp; Santé
                  </span>
                  {selectedPart.lingalaNote && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      🇨🇩 Lingala : {selectedPart.lingalaNote}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-navy mt-1">
                  {selectedPart.nameEn}
                </h3>
                <p className="text-base text-slate-600 font-medium">
                  Français : <strong className="text-slate-900">{selectedPart.nameFr}</strong>
                </p>
              </div>

              {/* Pronunciation Audio Button */}
              <button
                onClick={() =>
                  playPronunciationDemo(selectedPart.nameEn, selectedPart.phonetic)
                }
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Écouter {selectedPart.phonetic}</span>
              </button>
            </div>

            {/* Pitfall Alert Warning */}
            {selectedPart.pitfallWarningFr && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-rose-800">
                    ⚠️ Piège fréquent des apprenants francophones :
                  </strong>
                  <span>{selectedPart.pitfallWarningFr}</span>
                </div>
              </div>
            )}

            {/* Context & Example Sentences */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                Exemple pratique en situation :
              </span>
              <p className="text-sm font-bold text-navy italic">
                &ldquo;{selectedPart.sampleSentenceEn}&rdquo;
              </p>
              <p className="text-xs text-slate-600">
                👉 {selectedPart.sampleSentenceFr}
              </p>
            </div>
          </div>

          {/* Quick Selection Grid of all Body Parts */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Toutes les parties du corps disponibles :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredParts.map((part) => {
                const isCurrent = selectedPartId === part.id;
                return (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-navy">{part.nameEn}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {part.nameFr}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 mt-1">
                      {part.phonetic}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
