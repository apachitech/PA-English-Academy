"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Video,
  Volume2,
  XCircle,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CompleteLesson } from "@/lib/domain/lessons-data";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";

interface LessonClientProps {
  data: CompleteLesson;
}

type ActiveTab = "content" | "exercises";

export function LessonClient({ data }: LessonClientProps) {
  const router = useRouter();
  const { lesson, video, vocabulary, exercises } = data;

  const [activeTab, setActiveTab] = useState<ActiveTab>("content");
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [exerciseScores, setExerciseScores] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  // Audio helper
  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  };

  // Callback from ExerciseRenderer
  const handleAnswer = (isCorrect: boolean, score: number) => {
    setLastCorrect(isCorrect);
    setExerciseScores((prev) => [...prev, score]);
  };

  // Next exercise or complete
  const handleNextExercise = () => {
    setLastCorrect(null);
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex((prev) => prev + 1);
    } else {
      // Completed all exercises
      setIsCompleted(true);

      // Calculate final score
      const totalScore = exerciseScores.reduce((acc, s) => acc + s, 0);
      const avgScore = Math.round(totalScore / exercises.length);

      // Save progress to localStorage (for demo & offline)
      if (typeof window !== "undefined" && avgScore >= lesson.pass_mark) {
        const stored = JSON.parse(
          localStorage.getItem("pa3_completed_lessons") || "[]",
        );
        if (!stored.includes(lesson.slug)) {
          stored.push(lesson.slug);
          localStorage.setItem("pa3_completed_lessons", JSON.stringify(stored));
        }

        // Add XP
        const currentXp = Number(localStorage.getItem("pa3_total_xp") || "60");
        localStorage.setItem("pa3_total_xp", String(currentXp + lesson.xp_reward));
      }
    }
  };

  const finalAvgScore =
    exerciseScores.length > 0
      ? Math.round(
          exerciseScores.reduce((acc, s) => acc + s, 0) / exercises.length,
        )
      : 0;

  const hasPassed = finalAvgScore >= lesson.pass_mark;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground selection:bg-amber-400 selection:text-navy">
      {/* Top flag bar */}
      <div className="flag-badge h-1 w-full" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/parcours"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              title="Retour au parcours"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {lesson.slug.startsWith("a1") ? "Niveau A1 • Unité 1" : "Niveau A1"}
              </p>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {lesson.title_fr} ({lesson.title_en})
              </h1>
            </div>
          </div>

          {/* XP Reward & Progress */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>+{lesson.xp_reward} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Lesson Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Tabs (Vidéo & Fiche vs Exercices Pratiques) */}
        {!isCompleted && (
          <div className="flex bg-slate-200/80 p-1 rounded-2xl max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === "content"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Video className="w-4 h-4 text-amber-500" />
              <span>1. Vidéo & Vocabulaire</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("exercises")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === "exercises"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-4 h-4 text-primary" />
              <span>2. Exercices ({exercises.length})</span>
            </button>
          </div>
        )}

        {/* ================= TAB 1: CONTENT & VIDEO ================= */}
        {!isCompleted && activeTab === "content" && (
          <div className="space-y-6 animate-pop">
            {/* Objective Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-slate-900 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                  Objectif de cette leçon
                </p>
                <p className="text-sm font-semibold mt-0.5">
                  {lesson.objective_fr}
                </p>
              </div>
            </div>

            {/* Video Player */}
            <VideoPlayer
              provider={video.provider}
              url={video.url}
              lowUrl={video.low_url}
              audioUrl={video.audio_url}
              posterUrl={video.poster_url}
              title={`${lesson.title_fr} — ${lesson.title_en}`}
              captions={video.captions as any}
              transcriptFr={video.transcript_fr}
            />

            {/* Grammar / Explanation Card */}
            {lesson.explanation_fr && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>Explications grammaticales & Astuces (en français)</span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {lesson.explanation_fr}
                </div>
              </div>
            )}

            {/* Vocabulary Section */}
            {vocabulary.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Vocabulaire clé de la leçon
                  </h3>
                  <span className="text-xs text-slate-500">
                    Appuyez sur le haut-parleur pour écouter
                  </span>
                </div>

                <div className="grid gap-2.5">
                  {vocabulary.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-base font-extrabold text-slate-900">
                            {v.term_en}
                          </span>
                          <span className="text-xs text-slate-500">
                            — {v.term_fr}
                          </span>
                        </div>
                        {v.example_en && (
                          <p className="text-xs text-slate-600 italic">
                            « {v.example_en} » ({v.example_fr})
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => speak(v.term_en)}
                        className="p-2.5 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors shrink-0"
                        title="Écouter la prononciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA to start exercises */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab("exercises")}
                className="btn-3d-gold px-8 py-4 rounded-2xl text-base font-extrabold inline-flex items-center gap-2 shadow-lg"
              >
                <span>Passer aux exercices pratiques</span>
                <ArrowRight className="w-5 h-5 text-amber-950" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: EXERCISES PRACTICE ================= */}
        {!isCompleted && activeTab === "exercises" && (
          <div className="space-y-6 animate-pop">
            {/* Exercise progress indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                <span>
                  Exercice {currentExIndex + 1} sur {exercises.length}
                </span>
                <span>Palier de réussite : ≥ {lesson.pass_mark}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentExIndex + 1) / exercises.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Exercise Prompt Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-l-4 border-amber-400 pl-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Consigne
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {exercises[currentExIndex].exercise.prompt_fr}
                </h2>
              </div>

              {/* Dynamic Exercise Renderer */}
              <ExerciseRenderer
                key={exercises[currentExIndex].exercise.id}
                exercise={exercises[currentExIndex].exercise}
                options={exercises[currentExIndex].options}
                onAnswer={handleAnswer}
                disabled={lastCorrect !== null}
              />

              {/* Explanation (if answered) */}
              {lastCorrect !== null &&
                exercises[currentExIndex].exercise.explanation_fr && (
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 animate-pop">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">
                        Explication :{" "}
                      </span>
                      <span>
                        {exercises[currentExIndex].exercise.explanation_fr}
                      </span>
                    </div>
                  </div>
                )}
            </div>

            {/* Next button after answer */}
            {lastCorrect !== null && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 animate-pop">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {lastCorrect ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Excellent travail !</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Retenez bien la correction !</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNextExercise}
                  className="w-full sm:w-auto btn-3d-primary px-8 py-3.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 min-h-[44px] cursor-pointer"
                >
                  <span>
                    {currentExIndex < exercises.length - 1
                      ? "Exercice suivant"
                      : "Terminer la leçon"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 3: LESSON COMPLETE CELEBRATION ================= */}
        {isCompleted && (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-lg text-center space-y-6 max-w-xl mx-auto animate-pop">
            <div className="relative w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-lg border-4">
              {hasPassed ? (
                <div className="w-full h-full rounded-3xl bg-amber-400 border-amber-300 text-amber-950 flex items-center justify-center">
                  <Trophy className="w-12 h-12 fill-amber-950 text-amber-950 animate-bounce-subtle" />
                </div>
              ) : (
                <div className="w-full h-full rounded-3xl bg-slate-100 border-slate-300 text-slate-600 flex items-center justify-center">
                  <RotateCcw className="w-10 h-10" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span
                className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  hasPassed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {hasPassed ? "Leçon validée !" : "Presque réussi !"}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {hasPassed ? "Bravo ! Continuez comme ça !" : "Continuez vos efforts !"}
              </h2>

              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                {hasPassed
                  ? `Vous avez obtenu un score de ${finalAvgScore}% (palier requis : ${lesson.pass_mark}%). Vous débloquez la leçon suivante et gagnez +${lesson.xp_reward} XP !`
                  : `Votre score est de ${finalAvgScore}%. Le palier de maîtrise est de ${lesson.pass_mark}%. Réessayez la leçon pour ancrer le vocabulaire et continuer votre progression !`}
              </p>
            </div>

            {/* Score & XP Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Votre score
                </span>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  {finalAvgScore}%
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] font-bold uppercase text-amber-800">
                  Points XP gagnés
                </span>
                <p className="text-xl font-black text-amber-900 mt-0.5">
                  {hasPassed ? `+${lesson.xp_reward} XP` : "+0 XP"}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {hasPassed ? (
                <Link
                  href="/parcours"
                  className="flex-1 btn-3d-primary py-4 px-6 rounded-2xl text-sm font-extrabold inline-flex items-center justify-center gap-2"
                >
                  <span>Continuer mon parcours</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentExIndex(0);
                    setExerciseScores([]);
                    setIsCompleted(false);
                    setLastCorrect(null);
                    setActiveTab("exercises");
                  }}
                  className="flex-1 btn-3d-gold py-4 px-6 rounded-2xl text-sm font-extrabold inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réessayer la leçon</span>
                </button>
              )}

              <Link
                href="/tableau-de-bord"
                className="py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold inline-flex items-center justify-center"
              >
                Tableau de bord
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
