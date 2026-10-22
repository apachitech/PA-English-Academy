"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  HelpCircle,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Square,
  Volume2,
  XCircle,
} from "lucide-react";
import { ExerciseRow, ExerciseOptionRow } from "@/lib/supabase/database.types";

export interface ExercisePayload {
  sentence?: string;
  answers?: string[];
  hint_fr?: string;
  tokens?: string[];
  answer?: string;
  audio_text?: string;
  target_en?: string;
  tip_fr?: string;
}

interface ExerciseRendererProps {
  exercise: ExerciseRow;
  options: ExerciseOptionRow[];
  onAnswer: (isCorrect: boolean, score: number) => void;
  disabled?: boolean;
}

export function ExerciseRenderer({
  exercise,
  options,
  onAnswer,
  disabled = false,
}: ExerciseRendererProps) {
  const payload = (exercise.payload || {}) as ExercisePayload;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState("");
  const [orderedTokens, setOrderedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);

  // Matching state
  const [selectedLeft, setSelectedLeft] = useState<ExerciseOptionRow | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // pair_key -> true

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);

  // General validation state
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Initialize word order tokens
  useEffect(() => {
    if (exercise.type === "word_order" && payload.tokens) {
      setAvailableTokens([...payload.tokens].sort(() => Math.random() - 0.5));
      setOrderedTokens([]);
    }
  }, [exercise, payload.tokens]);

  // Audio helper using speechSynthesis
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  };

  // Play audio on listen_choose load
  useEffect(() => {
    if (exercise.type === "listen_choose" && payload.audio_text && !isAnswered) {
      speak(payload.audio_text);
    }
  }, [exercise, payload.audio_text, isAnswered]);

  // Validate answer based on exercise type
  const handleValidate = () => {
    if (isAnswered) return;

    let correct = false;

    if (exercise.type === "multiple_choice" || exercise.type === "listen_choose") {
      const chosen = options.find((o) => o.id === selectedOptionId);
      correct = Boolean(chosen && chosen.is_correct);
    } else if (exercise.type === "fill_blank") {
      const cleanInput = fillInput.trim().toLowerCase();
      const validAnswers = (payload.answers || []).map((a) => a.trim().toLowerCase());
      correct = validAnswers.includes(cleanInput);
    } else if (exercise.type === "word_order") {
      const constructed = orderedTokens.join(" ").trim().toLowerCase();
      const expected = (payload.answer || "").trim().toLowerCase();
      correct = constructed === expected;
    } else if (exercise.type === "matching") {
      // Matching is considered complete when all distinct pair keys are matched
      const totalPairs = new Set(options.map((o) => o.pair_key).filter(Boolean)).size;
      correct = Object.keys(matchedPairs).length >= totalPairs && totalPairs > 0;
    } else if (exercise.type === "speaking") {
      // Practice speaking is self-evaluated and rewarding upon attempt
      correct = true;
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(correct, correct ? 100 : 0);
  };

  // 1 & 2: Multiple Choice & Listen Choose
  if (exercise.type === "multiple_choice" || exercise.type === "listen_choose") {
    return (
      <div className="space-y-4">
        {exercise.type === "listen_choose" && payload.audio_text && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => speak(payload.audio_text!)}
              className="btn-3d-gold p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold shrink-0"
            >
              <Volume2 className="w-5 h-5 text-amber-950" />
              <span>Écouter l'extrait vocal</span>
            </button>
            <span className="text-xs text-amber-900 font-medium italic">
              Cliquez pour réécouter
            </span>
          </div>
        )}

        <div className="grid gap-2.5">
          {options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let style = "border-2 border-slate-200 hover:border-primary/50 bg-white text-slate-800";

            if (isAnswered) {
              if (opt.is_correct) {
                style = "border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
              } else if (isSelected) {
                style = "border-2 border-red-500 bg-red-50 text-red-950 line-through";
              } else {
                style = "border border-slate-200 opacity-50 bg-slate-50";
              }
            } else if (isSelected) {
              style = "border-2 border-primary bg-blue-50/50 text-primary font-bold shadow-xs";
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={isAnswered || disabled}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between gap-3 min-h-[44px] cursor-pointer active:scale-[0.99] ${style}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </div>
                {isAnswered && opt.is_correct && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !opt.is_correct && (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {!isAnswered && (
          <button
            type="button"
            disabled={!selectedOptionId}
            onClick={handleValidate}
            className={`w-full py-3.5 rounded-xl text-sm font-bold mt-2 ${
              !selectedOptionId ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-3d-gold"
            }`}
          >
            Vérifier
          </button>
        )}
      </div>
    );
  }

  // 3: Fill in the Blank
  if (exercise.type === "fill_blank") {
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-base sm:text-lg font-bold text-slate-800 text-center">
          {payload.sentence || "Complétez la phrase"}
        </div>

        {payload.hint_fr && (
          <p className="text-xs text-slate-500 italic text-center">
            💡 Indice en français : {payload.hint_fr}
          </p>
        )}

        <div className="space-y-2">
          <input
            type="text"
            disabled={isAnswered || disabled}
            value={fillInput}
            onChange={(e) => setFillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && fillInput.trim()) handleValidate();
            }}
            placeholder="Tapez le mot manquant..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-primary text-base font-bold outline-none"
          />
        </div>

        {!isAnswered && (
          <button
            type="button"
            disabled={!fillInput.trim()}
            onClick={handleValidate}
            className={`w-full py-3.5 rounded-xl text-sm font-bold ${
              !fillInput.trim() ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-3d-gold"
            }`}
          >
            Vérifier
          </button>
        )}
      </div>
    );
  }

  // 4: Word Order
  if (exercise.type === "word_order") {
    return (
      <div className="space-y-4">
        {/* Drop zone / Constructed sentence */}
        <div className="min-h-18 p-4 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/40 flex flex-wrap items-center gap-2">
          {orderedTokens.length === 0 ? (
            <span className="text-xs text-slate-400 italic">
              Appuyez sur les mots ci-dessous pour construire la phrase...
            </span>
          ) : (
            orderedTokens.map((tok, i) => (
              <button
                key={i}
                type="button"
                disabled={isAnswered}
                onClick={() => {
                  setOrderedTokens(orderedTokens.filter((_, idx) => idx !== i));
                  setAvailableTokens([...availableTokens, tok]);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-primary-hover animate-pop"
              >
                {tok}
              </button>
            ))
          )}
        </div>

        {/* Word bank */}
        <div className="flex flex-wrap gap-2 pt-2">
          {availableTokens.map((tok, i) => (
            <button
              key={i}
              type="button"
              disabled={isAnswered}
              onClick={() => {
                setOrderedTokens([...orderedTokens, tok]);
                setAvailableTokens(availableTokens.filter((_, idx) => idx !== i));
              }}
              className="px-3.5 py-2 rounded-xl bg-white border-2 border-slate-200 hover:border-primary text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95"
            >
              {tok}
            </button>
          ))}
        </div>

        {!isAnswered && (
          <button
            type="button"
            disabled={orderedTokens.length === 0}
            onClick={handleValidate}
            className={`w-full py-3.5 rounded-xl text-sm font-bold ${
              orderedTokens.length === 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "btn-3d-gold"
            }`}
          >
            Vérifier
          </button>
        )}
      </div>
    );
  }

  // 5: Matching Pairs
  if (exercise.type === "matching") {
    const leftOptions = options.filter((o) => o.side === "left");
    const rightOptions = options.filter((o) => o.side === "right");

    const handleSelectOptionItem = (item: ExerciseOptionRow) => {
      if (isAnswered) return;

      if (item.side === "left") {
        setSelectedLeft(item);
      } else if (selectedLeft && item.side === "right") {
        // Check if pair matches
        if (selectedLeft.pair_key === item.pair_key) {
          setMatchedPairs((prev) => ({ ...prev, [item.pair_key!]: item.pair_key! }));
          setSelectedLeft(null);
        } else {
          // Flash mismatch
          setSelectedLeft(null);
        }
      }
    };

    const allMatched =
      leftOptions.length > 0 &&
      Object.keys(matchedPairs).length === leftOptions.length;

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-500 italic text-center">
          Sélectionnez un mot à gauche, puis sa correspondance à droite.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="space-y-2">
            {leftOptions.map((opt) => {
              const isMatched = Boolean(opt.pair_key && matchedPairs[opt.pair_key]);
              const isSelected = selectedLeft?.id === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isMatched || isAnswered}
                  onClick={() => handleSelectOptionItem(opt)}
                  className={`w-full p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-bold text-center border-2 transition-all min-h-[44px] flex items-center justify-center ${
                    isMatched
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 opacity-60 line-through"
                      : isSelected
                      ? "border-primary bg-blue-50 text-primary scale-102"
                      : "border-slate-200 bg-white hover:border-slate-400 text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {rightOptions.map((opt) => {
              const isMatched = Boolean(opt.pair_key && matchedPairs[opt.pair_key]);

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isMatched || isAnswered}
                  onClick={() => handleSelectOptionItem(opt)}
                  className={`w-full p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm font-bold text-center border-2 transition-all min-h-[44px] flex items-center justify-center ${
                    isMatched
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 opacity-60 line-through"
                      : "border-slate-200 bg-white hover:border-slate-400 text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {!isAnswered && (
          <button
            type="button"
            disabled={!allMatched}
            onClick={handleValidate}
            className={`w-full py-3.5 rounded-xl text-sm font-bold ${
              !allMatched ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-3d-gold"
            }`}
          >
            Vérifier les paires
          </button>
        )}
      </div>
    );
  }

  // 6: Speaking Practice (Record & Playback)
  if (exercise.type === "speaking") {
    return (
      <div className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 text-center">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase text-amber-700">
            Phrase à prononcer à voix haute :
          </p>
          <p className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            « {payload.target_en || "Good morning, teacher!"} »
          </p>
          {payload.tip_fr && (
            <p className="text-xs text-slate-500 italic max-w-md mx-auto">
              💡 Conseil : {payload.tip_fr}
            </p>
          )}
        </div>

        {/* Listen native pronunciation */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => speak(payload.target_en || "")}
            className="px-4 py-2 rounded-xl bg-blue-50 text-primary hover:bg-blue-100 text-xs font-bold inline-flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            <span>Écouter le modèle sonore</span>
          </button>
        </div>

        {/* Record simulator / Web Audio */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!isRecording) {
                setIsRecording(true);
                // Simulate recording 3 seconds
                setTimeout(() => {
                  setIsRecording(false);
                  setAudioBlobUrl("recorded");
                }, 3000);
              } else {
                setIsRecording(false);
                setAudioBlobUrl("recorded");
              }
            }}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform ${
              isRecording
                ? "bg-red-600 animate-pulse scale-110"
                : "bg-primary hover:scale-105"
            }`}
            title="Appuyez pour vous enregistrer"
          >
            {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-7 h-7" />}
          </button>

          <span className="text-xs font-semibold text-slate-600">
            {isRecording
              ? "Enregistrement en cours... Parlez maintenant !"
              : audioBlobUrl
              ? "Enregistrement terminé !"
              : "Appuyez sur le micro et répétez la phrase"}
          </span>
        </div>

        {!isAnswered && (
          <button
            type="button"
            disabled={!audioBlobUrl && !isRecording}
            onClick={handleValidate}
            className={`w-full py-3.5 rounded-xl text-sm font-bold ${
              !audioBlobUrl ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-3d-gold"
            }`}
          >
            Terminer la prononciation (+20 XP)
          </button>
        )}
      </div>
    );
  }

  return null;
}
