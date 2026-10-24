"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  GraduationCap,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { CefrLevel, Skill } from "@/lib/supabase/database.types";
import { PLACEMENT_QUESTIONS, PlacementQuestion } from "@/lib/domain/placement-bank";
import {
  AnswerRecord,
  calculatePlacementResult,
  getNextAdaptiveQuestion,
  PlacementResult,
  SKILL_LABELS_FR,
  CEFR_ORDER,
} from "@/lib/domain/placement";
import { recordAssessmentCompletion } from "@/lib/domain/learner-progress";

type TestStep = "intro" | "quiz" | "result";

export default function PlacementTestPage() {
  const router = useRouter();
  const [step, setStep] = useState<TestStep>("intro");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<PlacementQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [selectedStartLevel, setSelectedStartLevel] = useState<CefrLevel>("A1");
  const [questionBank, setQuestionBank] = useState<PlacementQuestion[]>(PLACEMENT_QUESTIONS);

  // Load custom questions saved by Admin, with fallback to initial 40 bank
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("pa3_admin_placement_questions");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestionBank(parsed);
          }
        }
      }
    } catch {
      // fallback to default bank
    }
  }, []);

  // Start test
  const startTest = () => {
    setAnswers([]);
    setSelectedIndex(null);
    setIsAnswered(false);
    const firstQ = getNextAdaptiveQuestion([], questionBank, 16);
    setCurrentQuestion(firstQ);
    setStep("quiz");
  };

  // Play audio (TTS fallback for listening questions)
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for Congolese learners
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Automatically speak listening questions once loaded
  useEffect(() => {
    if (currentQuestion?.audio_text && step === "quiz" && !isAnswered) {
      speakText(currentQuestion.audio_text);
    }
  }, [currentQuestion, step, isAnswered]);

  // Handle option selection
  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
  };

  // Validate current answer
  const handleValidate = () => {
    if (selectedIndex === null || !currentQuestion || isAnswered) return;

    const isCorrect = selectedIndex === currentQuestion.correct_index;
    setIsAnswered(true);

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      level: currentQuestion.level,
      skill: currentQuestion.skill,
      chosenIndex: selectedIndex,
      isCorrect,
      answeredAt: new Date().toISOString(),
    };

    const nextAnswers = [...answers, record];
    setAnswers(nextAnswers);
  };

  // Move to next question or finalize
  const handleNext = () => {
    const nextQ = getNextAdaptiveQuestion(answers, questionBank, 16);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      // Calculate final result
      const finalResult = calculatePlacementResult(answers);
      setResult(finalResult);
      setSelectedStartLevel(finalResult.recommendedStartingLevel);
      setStep("result");

      // Save to centralized progress engine & sync with admin
      try {
        recordAssessmentCompletion(finalResult);
      } catch {
        // Fallback to direct storage
        if (typeof window !== "undefined") {
          localStorage.setItem("pa3_placement_result", JSON.stringify(finalResult));
          localStorage.setItem("pa3_current_level", finalResult.recommendedStartingLevel);
        }
      }
    }
  };

  // Save level and navigate to dashboard
  const handleSaveAndContinue = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pa3_current_level", selectedStartLevel);
    }
    router.push("/tableau-de-bord");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground selection:bg-amber-400 selection:text-navy">
      {/* Top Bar with Congolese Flag */}
      <div className="flag-badge h-1 w-full" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Logo size="sm" withSlogan={false} />

          {step === "quiz" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Question {answers.length + 1} / 16
              </span>
              <button
                onClick={() => {
                  if (confirm("Voulez-vous vraiment quitter le test en cours ?")) {
                    setStep("intro");
                  }
                }}
                className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded"
              >
                Quitter
              </button>
            </div>
          )}

          {step !== "quiz" && (
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto p-4 sm:p-6">
        {/* ================= STEP 1: INTRO ================= */}
        {step === "intro" && (
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm animate-pop">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-2">
                <Compass className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                Quel est votre niveau d&apos;anglais ?
              </h1>
              <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
                Choisissez l&apos;option qui vous correspond le mieux pour
                démarrer votre apprentissage personnalisé à la{" "}
                <strong>PA³ English Academy</strong>.
              </p>
            </div>

            <div className="grid gap-3 sm:gap-4 pt-2 sm:pt-4">
              {/* Option A: Complete Beginner */}
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("pa3_current_level", "A1");
                  }
                  router.push("/tableau-de-bord");
                }}
                className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-primary/60 hover:bg-slate-50/80 transition-all flex items-start gap-3 sm:gap-4 group cursor-pointer active:scale-95"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Je débute complètement
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Recommandé
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Commencez directement au <strong>Niveau A1 (Débutant)</strong>.
                    Idéal si vous n&apos;avez jamais étudié l&apos;anglais ou si
                    vous souhaitez reprendre depuis zéro.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary shrink-0 self-center hidden 2xs:block" />
              </button>

              {/* Option B: Take Placement Test */}
              <button
                onClick={startTest}
                className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-500 transition-all flex items-start gap-3 sm:gap-4 group shadow-sm cursor-pointer active:scale-95"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Passer le test de niveau adaptatif
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                      10–15 min
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Test intelligent de ~16 questions qui s&apos;ajuste à vos
                    réponses (Vocabulaire, Grammaire, Écoute, Lecture) pour situer
                    votre niveau CECRL (A1, A2, B1 ou B2).
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-amber-700 shrink-0 self-center hidden 2xs:block" />
              </button>
            </div>

            {/* Reassurance note */}
            <div className="text-center pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                100% gratuit • Aucune carte bancaire requise • Résultat immédiat
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: QUIZ ================= */}
        {step === "quiz" && currentQuestion && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-primary flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Compétence : {SKILL_LABELS_FR[currentQuestion.skill]}
                </span>
                <span className="text-slate-500">
                  Niveau estimé : {currentQuestion.level}
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, (answers.length / 16) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              {/* French prompt instruction */}
              <div className="border-l-4 border-amber-400 pl-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Instruction
                </p>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {currentQuestion.prompt_fr}
                </h2>
              </div>

              {/* Reading Passage (if applicable) */}
              {currentQuestion.passage && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-slate-800 text-sm sm:text-base leading-relaxed italic">
                  « {currentQuestion.passage} »
                </div>
              )}

              {/* Audio Listen Button (for listening questions) */}
              {currentQuestion.audio_text && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => speakText(currentQuestion.audio_text!)}
                      className={`btn-3d-gold p-3.5 rounded-2xl flex items-center justify-center shrink-0 ${
                        isSpeaking ? "animate-pulse" : ""
                      }`}
                      aria-label="Écouter l'extrait audio"
                    >
                      <Volume2 className="w-6 h-6 text-amber-950" />
                    </button>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
                        Extrait audio
                      </p>
                      <p className="text-xs text-amber-800">
                        {isSpeaking
                          ? "Lecture en cours..."
                          : "Cliquez pour réécouter"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Stem in English */}
              <div className="text-base sm:text-lg font-extrabold text-slate-900 py-1">
                {currentQuestion.stem}
              </div>

              {/* Options list */}
              <div className="grid gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isCorrect = idx === currentQuestion.correct_index;

                  let optionStyle =
                    "border-2 border-slate-200 hover:border-primary/50 bg-white text-slate-800";

                  if (isAnswered) {
                    if (isCorrect) {
                      optionStyle =
                        "border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                    } else if (isSelected) {
                      optionStyle =
                        "border-2 border-red-500 bg-red-50 text-red-950 line-through";
                    } else {
                      optionStyle = "border border-slate-200 opacity-50 bg-slate-50";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "border-2 border-primary bg-blue-50/50 text-primary font-bold shadow-xs";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-sm sm:text-base transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Note (after validation) */}
              {isAnswered && currentQuestion.explanation_fr && (
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 animate-pop">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Explication : </span>
                    <span>{currentQuestion.explanation_fr}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-1">
              <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                {isAnswered
                  ? selectedIndex === currentQuestion.correct_index
                    ? "✨ Bien joué !"
                    : "💡 Continuez, vous apprenez !"
                  : "Sélectionnez votre réponse"}
              </span>

              {!isAnswered ? (
                <button
                  type="button"
                  disabled={selectedIndex === null}
                  onClick={handleValidate}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold min-h-[44px] flex items-center justify-center ${
                    selectedIndex === null
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "btn-3d-gold cursor-pointer"
                  }`}
                >
                  Valider
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto btn-3d-primary px-8 py-3.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <span>Question suivante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 3: RESULT ================= */}
        {step === "result" && result && (
          <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm animate-pop">
            {/* Celebration Badge */}
            <div className="text-center space-y-3 border-b border-slate-100 pb-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-3xl shadow-lg border-4 border-amber-300">
                {result.cefrLevel}
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Test complété avec succès !</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Votre niveau estimé : {result.titleFr}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                {result.descriptionFr}
              </p>
            </div>

            {/* Strengths & Focus Areas */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Vos points forts</span>
                </div>
                <ul className="text-xs text-emerald-800 space-y-1.5 font-medium">
                  {result.strengths.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Objectif prioritaire</span>
                </div>
                <ul className="text-xs text-amber-800 space-y-1.5 font-medium">
                  {result.weaknesses.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900">
                Bilan par compétence :
              </h3>
              <div className="space-y-2.5">
                {(Object.keys(result.skillScores) as Skill[])
                  .filter((sk) => result.skillScores[sk].total > 0)
                  .map((sk) => {
                    const s = result.skillScores[sk];
                    return (
                      <div key={sk} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{s.labelFr}</span>
                          <span className="text-slate-900 font-bold">
                            {s.correct} / {s.total} ({s.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${s.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Choose Starting Level */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirmer votre niveau de départ :
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CEFR_ORDER.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedStartLevel(lvl)}
                    className={`py-3 rounded-xl text-center text-sm font-extrabold transition-all ${
                      selectedStartLevel === lvl
                        ? "btn-3d-gold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic">
                💡 Recommandé :{" "}
                <strong>Niveau {result.recommendedStartingLevel}</strong>. Vous
                pourrez toujours réviser les niveaux précédents librement.
              </p>
            </div>

            {/* CTA Continue */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSaveAndContinue}
                className="flex-1 btn-3d-primary py-4 px-6 rounded-2xl text-sm font-extrabold inline-flex items-center justify-center gap-2"
              >
                <span>Accéder à mon tableau de bord</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={startTest}
                className="p-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refaire le test</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
