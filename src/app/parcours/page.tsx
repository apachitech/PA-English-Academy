"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  Lock,
  MessageCircle,
  Play,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Navbar } from "@/components/navigation/Navbar";
import { BRAND } from "@/lib/brand";
import { CefrLevel } from "@/lib/supabase/database.types";
import { Palier, INITIAL_PALIERS, getStoredPaliers } from "@/lib/domain/paliers";

interface LessonNode {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  xpReward: number;
  estMinutes: number;
  icon: string;
}

interface UnitData {
  id: string;
  position: number;
  titleFr: string;
  descriptionFr: string;
  lessons: LessonNode[];
  examTitle: string;
}

const A1_UNITS: UnitData[] = [
  {
    id: "u-1",
    position: 1,
    titleFr: "Unité 1 : Premiers pas",
    descriptionFr: "Saluer, se présenter et compter jusqu'à 20.",
    lessons: [
      { id: "l-1", slug: "a1-salutations", titleFr: "Les salutations", titleEn: "Greetings", xpReward: 20, estMinutes: 8, icon: "👋" },
      { id: "l-2", slug: "a1-se-presenter", titleFr: "Se présenter", titleEn: "Introducing yourself", xpReward: 20, estMinutes: 10, icon: "🙋" },
      { id: "l-3", slug: "a1-nombres-0-20", titleFr: "Nombres de 0 à 20", titleEn: "Numbers 0–20", xpReward: 20, estMinutes: 8, icon: "🔢" },
      { id: "l-4", slug: "a1-alphabet", titleFr: "Alphabet & Épeler", titleEn: "Alphabet & spelling", xpReward: 20, estMinutes: 8, icon: "🔤" },
      { id: "l-5", slug: "a1-pays-villes", titleFr: "Pays & Villes", titleEn: "Countries & cities", xpReward: 20, estMinutes: 8, icon: "🌍" },
    ],
    examTitle: "Test de l'unité 1 : Premiers pas",
  },
  {
    id: "u-2",
    position: 2,
    titleFr: "Unité 2 : Ma famille et moi",
    descriptionFr: "Présenter sa famille, décrire les personnes et sa maison.",
    lessons: [
      { id: "l-6", slug: "a1-la-famille", titleFr: "La famille", titleEn: "Family members", xpReward: 20, estMinutes: 8, icon: "👨‍👩‍👧" },
      { id: "l-7", slug: "a1-possessifs", titleFr: "My, your, his, her", titleEn: "Possessives", xpReward: 20, estMinutes: 8, icon: "🏷️" },
      { id: "l-8", slug: "a1-decrire-personnes", titleFr: "Décrire quelqu'un", titleEn: "Describing people", xpReward: 20, estMinutes: 8, icon: "👀" },
      { id: "l-9", slug: "a1-ma-maison", titleFr: "Ma maison", titleEn: "My home", xpReward: 20, estMinutes: 8, icon: "🏠" },
      { id: "l-10", slug: "a1-have-got", titleFr: "Avoir : have / has", titleEn: "Have & has", xpReward: 20, estMinutes: 8, icon: "📦" },
    ],
    examTitle: "Test de l'unité 2 : Ma famille et moi",
  },
  {
    id: "u-3",
    position: 3,
    titleFr: "Unité 3 : Au marché",
    descriptionFr: "La nourriture, les prix et les courses au marché de Gambela.",
    lessons: [
      { id: "l-11", slug: "a1-nourriture", titleFr: "La nourriture", titleEn: "Food & meals", xpReward: 20, estMinutes: 8, icon: "🍲" },
      { id: "l-12", slug: "a1-combien", titleFr: "Combien ça coûte ?", titleEn: "How much is it?", xpReward: 20, estMinutes: 8, icon: "💵" },
      { id: "l-13", slug: "a1-aimer", titleFr: "J'aime, je n'aime pas", titleEn: "Likes & dislikes", xpReward: 20, estMinutes: 8, icon: "👍" },
      { id: "l-14", slug: "a1-quantites", titleFr: "Some, any & quantités", titleEn: "Quantities", xpReward: 20, estMinutes: 8, icon: "⚖️" },
      { id: "l-15", slug: "a1-restaurant", titleFr: "Au restaurant", titleEn: "At the restaurant", xpReward: 20, estMinutes: 8, icon: "🍽️" },
    ],
    examTitle: "Test de l'unité 3 : Au marché",
  },
  {
    id: "u-4",
    position: 4,
    titleFr: "Unité 4 : Le temps et la ville",
    descriptionFr: "Les jours, l'heure, les taxi-bus et les directions.",
    lessons: [
      { id: "l-16", slug: "a1-jours-semaine", titleFr: "Jours de la semaine", titleEn: "Days of the week", xpReward: 20, estMinutes: 8, icon: "📅" },
      { id: "l-17", slug: "a1-heure", titleFr: "Quelle heure est-il ?", titleEn: "Telling the time", xpReward: 20, estMinutes: 8, icon: "⏰" },
      { id: "l-18", slug: "a1-mois-dates", titleFr: "Mois et dates", titleEn: "Months & dates", xpReward: 20, estMinutes: 8, icon: "🗓️" },
      { id: "l-19", slug: "a1-transports", titleFr: "Les transports", titleEn: "Transport", xpReward: 20, estMinutes: 8, icon: "🚐" },
      { id: "l-20", slug: "a1-directions", titleFr: "Demander son chemin", titleEn: "Directions", xpReward: 20, estMinutes: 8, icon: "🧭" },
    ],
    examTitle: "Test de l'unité 4 : Le temps et la ville",
  },
];

export default function ParcoursPage() {
  const [paliers, setPaliers] = useState<Palier[]>(INITIAL_PALIERS);
  const [selectedLevel, setSelectedLevel] = useState<string>("A1");
  const [completedSlugs, setCompletedSlugs] = useState<string[]>(["a1-salutations"]);
  const [totalXp, setTotalXp] = useState(60);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadedPaliers = getStoredPaliers();
      setPaliers(loadedPaliers);

      const storedCompleted = JSON.parse(
        localStorage.getItem("pa3_completed_lessons") || '["a1-salutations"]',
      );
      setCompletedSlugs(storedCompleted);

      const storedXp = Number(localStorage.getItem("pa3_total_xp") || "60");
      setTotalXp(storedXp);
    }
  }, []);

  const activePalier = paliers.find((p) => p.code === selectedLevel) || paliers[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-foreground selection:bg-amber-400 selection:text-navy">
      {/* Top flag bar */}
      <div className="flag-badge h-1 w-full" />

      {/* Clean Spacious Header with Side Menu */}
      <Navbar
        variant="app"
        showTestCta={false}
        showAdminBadge={false}
        customRightElement={
          <div className="flex items-center gap-2">
            <Link
              href="/tableau-de-bord"
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors hidden sm:inline-flex items-center gap-1 text-xs font-bold border border-slate-200"
              title="Retour au Tableau de bord"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{totalXp} XP</span>
            </div>
          </div>
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Dynamic CEFR Level / Palier Selector Tabs */}
        <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto touch-scroll no-scrollbar">
          {paliers
            .filter((p) => p.status === "published")
            .sort((a, b) => a.position - b.position)
            .map((p) => {
              const isSelected = selectedLevel === p.code;
              const isFree = p.isFree;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedLevel(p.code)}
                  className={`flex-1 py-2.5 sm:py-3 px-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex flex-col items-center justify-center gap-0.5 min-w-[95px] sm:min-w-[105px] min-h-[44px] cursor-pointer active:scale-95 ${
                    isSelected
                      ? "btn-3d-gold text-amber-950"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{p.badgeIcon}</span>
                    <span>{p.code}</span>
                    {!isFree && <Lock className="w-3 h-3 text-slate-400" />}
                  </div>
                  <span className="text-[10px] font-bold opacity-85 whitespace-nowrap">
                    {isFree ? "100% Gratuit" : "Déblocable"}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Selected Level Header Banner */}
        <div className="bg-gradient-to-r from-navy to-slate-900 text-white p-6 rounded-3xl border border-amber-400/30 shadow-md flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {activePalier?.isFree ? "Accès Libre & Gratuit" : "Niveau Supérieur • Pass Membre"}
            </span>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <span>{activePalier?.badgeIcon}</span>
              <span>{activePalier?.titleFr || `Parcours Niveau ${selectedLevel}`}</span>
            </h1>
            <p className="text-xs text-slate-300">
              {activePalier?.descriptionFr ||
                "Accessible après validation du niveau précédent ou abonnement."}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
            {activePalier?.code || selectedLevel}
          </div>
        </div>

        {/* ================= DUOLINGO MAP NODES ================= */}
        {selectedLevel === "A1" ? (
          <div className="space-y-10 py-4">
            {A1_UNITS.map((unit, unitIdx) => (
              <div key={unit.id} className="space-y-6">
                {/* Unit Header Card */}
                <div className="bg-primary text-white p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                      Unité {unit.position}
                    </span>
                    <h2 className="text-base sm:text-lg font-black">
                      {unit.titleFr}
                    </h2>
                    <p className="text-xs text-blue-100 max-w-md">
                      {unit.descriptionFr}
                    </p>
                  </div>

                  <span className="text-2xl p-2 rounded-xl bg-white/10 shrink-0">
                    {unitIdx === 0 ? "🚀" : unitIdx === 1 ? "👨‍👩‍👧" : unitIdx === 2 ? "🛍️" : "⏰"}
                  </span>
                </div>

                {/* Duolingo Visual Zig-Zag Stepper Path */}
                <div className="flex flex-col items-center gap-6 py-4 relative">
                  {unit.lessons.map((lesson, idx) => {
                    const isCompleted = completedSlugs.includes(lesson.slug);
                    const isNext =
                      !isCompleted &&
                      (idx === 0 || completedSlugs.includes(unit.lessons[idx - 1].slug));
                    const isLocked = !isCompleted && !isNext;

                    // Alternating slight left/right offset for Duolingo winding path feel
                    const offsetClass =
                      idx % 3 === 1
                        ? "translate-x-8"
                        : idx % 3 === 2
                        ? "-translate-x-8"
                        : "translate-x-0";

                    return (
                      <div
                        key={lesson.id}
                        className={`flex flex-col items-center text-center transition-transform ${offsetClass}`}
                      >
                        {/* Circle node */}
                        {isLocked ? (
                          <div
                            className="w-16 h-16 rounded-full bg-slate-200 border-4 border-slate-300 text-slate-400 flex items-center justify-center text-xl shadow-xs cursor-not-allowed select-none"
                            title="Complétez les leçons précédentes pour débloquer"
                          >
                            <Lock className="w-5 h-5 text-slate-400" />
                          </div>
                        ) : isCompleted ? (
                          <Link
                            href={`/lecon/${lesson.slug}`}
                            className="w-16 h-16 rounded-full btn-3d-success flex items-center justify-center text-2xl shadow-md transform hover:scale-110 transition-transform relative group"
                            title="Leçon complétée — Rejouer"
                          >
                            <span>{lesson.icon}</span>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-white" />
                            </div>
                          </Link>
                        ) : (
                          <Link
                            href={`/lecon/${lesson.slug}`}
                            className="w-18 h-18 rounded-full btn-3d-gold flex items-center justify-center text-2xl shadow-lg ring-4 ring-amber-400/30 transform hover:scale-110 transition-transform relative animate-bounce-subtle"
                            title="Commencer cette leçon !"
                          >
                            <span>{lesson.icon}</span>
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">
                              START
                            </span>
                          </Link>
                        )}

                        {/* Title label */}
                        <div className="mt-2 max-w-32">
                          <p
                            className={`text-xs font-bold leading-tight ${
                              isCompleted
                                ? "text-slate-800"
                                : isNext
                                ? "text-primary font-black"
                                : "text-slate-400"
                            }`}
                          >
                            {lesson.titleFr}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            +{lesson.xpReward} XP
                          </span>
                        </div>

                        {/* Vertical connector line */}
                        {idx < unit.lessons.length - 1 && (
                          <div
                            className={`w-1 h-8 mt-2 rounded-full ${
                              isCompleted ? "bg-emerald-500" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Unit Exam Trophy Node */}
                  <div className="pt-4 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 border-2 border-slate-300 text-slate-400 flex items-center justify-center text-2xl shadow-xs">
                      <Trophy className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-2 max-w-36">
                      {unit.examTitle}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Validation de l&apos;unité (≥ 70%)
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Final Level A1 Exam & Certificate Milestone */}
            <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 text-amber-950 p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-4 border-4 border-white">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white text-amber-600 flex items-center justify-center shadow-md">
                <Award className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider bg-amber-950/10 px-3 py-1 rounded-full">
                  Épreuve Finale
                </span>
                <h3 className="text-2xl font-black">
                  Examen Final Niveau A1 & Certificat Officiel
                </h3>
                <p className="text-xs sm:text-sm max-w-md mx-auto text-amber-900 leading-relaxed">
                  Validez les 4 unités pour passer l&apos;examen final (score ≥
                  75%) et télécharger votre <strong>Certificat officiel PA³ English Academy</strong>{" "}
                  signé avec QR Code de vérification publique.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 rounded-xl bg-amber-950/20 text-amber-950 font-bold text-xs cursor-not-allowed"
                >
                  Débloqué après l&apos;Unité 4
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Locked level banner with dynamic palier information */
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto shadow-sm animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-3xl shadow-inner">
              {activePalier?.badgeIcon || "🔒"}
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {activePalier?.titleFr || `Niveau ${selectedLevel} réservé aux abonnés`}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activePalier?.descriptionFr ||
                "Accessible avec le pass flexible payable par M-Pesa, Airtel Money et Orange Money."}
            </p>
            {activePalier?.requiredXp ? (
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex justify-between items-center">
                <span>XP Requis pour validation :</span>
                <span className="font-black text-navy text-sm">{activePalier.requiredXp} XP</span>
              </div>
            ) : null}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/tarifs"
                className="btn-duo !py-3 text-xs font-black inline-flex items-center justify-center gap-2 shadow"
              >
                <span>⚡ Débloquer l&apos;accès avec un Pass</span>
              </Link>
              <a
                href={BRAND.coach.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-success py-3 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter le Coach sur WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedLevel("A1")}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 py-2"
              >
                ← Revenir au niveau A1 (Gratuit)
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
