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

const A2_UNITS: UnitData[] = [
  {
    id: "u-a2-1",
    position: 1,
    titleFr: "Unité A2-1 : Quotidien, Restaurant & Ville",
    descriptionFr: "Commander poliment au restaurant et s'orienter en ville à Kinshasa.",
    lessons: [
      { id: "l-a2-1", slug: "a2-au-restaurant", titleFr: "Au restaurant & Politesse", titleEn: "Ordering Food & Dining", xpReward: 25, estMinutes: 9, icon: "🍽️" },
      { id: "l-a2-2", slug: "a2-directions-ville", titleFr: "Demander son chemin", titleEn: "Asking Directions", xpReward: 25, estMinutes: 8, icon: "🧭" },
    ],
    examTitle: "Test de l'unité A2-1 : Quotidien & Politesse",
  },
  {
    id: "u-a2-2",
    position: 2,
    titleFr: "Unité A2-2 : Raconter, Projeter & Comparer",
    descriptionFr: "Le passé régulier en -ED, les projets futurs et les comparatifs.",
    lessons: [
      { id: "l-a2-3", slug: "a2-passe-simple-regular", titleFr: "Passé & 3 sons du -ED", titleEn: "Past Simple Regular", xpReward: 25, estMinutes: 9, icon: "⏳" },
      { id: "l-a2-4", slug: "a2-futur-projets", titleFr: "L'Avenir & Projets", titleEn: "Future Plans", xpReward: 25, estMinutes: 8, icon: "🚀" },
      { id: "l-a2-5", slug: "a2-comparatifs-superlatifs", titleFr: "Comparer & Choisir", titleEn: "Comparatives", xpReward: 25, estMinutes: 8, icon: "⚖️" },
    ],
    examTitle: "Test de l'unité A2-2 : Narration & Comparaisons",
  },
];

const B1_UNITS: UnitData[] = [
  {
    id: "u-b1-1",
    position: 1,
    titleFr: "Unité B1-1 : Recrutement & Écrits Professionnels",
    descriptionFr: "Réussir son entretien d'embauche et rédiger des emails modernes.",
    lessons: [
      { id: "l-b1-1", slug: "b1-entretien-embauche", titleFr: "Entretien d'embauche (3P)", titleEn: "Job Interview Pitch", xpReward: 30, estMinutes: 10, icon: "💼" },
      { id: "l-b1-2", slug: "b1-rediger-email-pro", titleFr: "Email professionnel moderne", titleEn: "Business Emails", xpReward: 30, estMinutes: 9, icon: "✉️" },
    ],
    examTitle: "Test de l'unité B1-1 : Communication Professionnelle",
  },
  {
    id: "u-b1-2",
    position: 2,
    titleFr: "Unité B1-2 : Téléphone, Expérience & Opinions",
    descriptionFr: "Appels sans stress, Present Perfect et expression d'opinions.",
    lessons: [
      { id: "l-b1-3", slug: "b1-telephoner-anglais", titleFr: "Téléphoner & Messages", titleEn: "Phone Calls", xpReward: 30, estMinutes: 8, icon: "📞" },
      { id: "l-b1-4", slug: "b1-present-perfect-experience", titleFr: "Expériences de carrière", titleEn: "Present Perfect", xpReward: 30, estMinutes: 10, icon: "🏆" },
      { id: "l-b1-5", slug: "b1-donner-son-opinion", titleFr: "Exprimer son opinion", titleEn: "Debating Opinions", xpReward: 30, estMinutes: 9, icon: "🗣️" },
    ],
    examTitle: "Test de l'unité B1-2 : Échanges & Argumentation",
  },
];

const B2_UNITS: UnitData[] = [
  {
    id: "u-b2-1",
    position: 1,
    titleFr: "Unité B2-1 : Négociation & Leadership Exécutif",
    descriptionFr: "Négocier des contrats win-win et animer des réunions internationales.",
    lessons: [
      { id: "l-b2-1", slug: "b2-negociation-affaires", titleFr: "Négociation & Contrats", titleEn: "Business Negotiations", xpReward: 35, estMinutes: 11, icon: "🤝" },
      { id: "l-b2-2", slug: "b2-reunion-leadership", titleFr: "Animer une réunion", titleEn: "Chairing Meetings", xpReward: 35, estMinutes: 10, icon: "👑" },
    ],
    examTitle: "Test de l'unité B2-1 : Leadership & Négociation",
  },
  {
    id: "u-b2-2",
    position: 2,
    titleFr: "Unité B2-2 : Rapports, ONGs & Rhétorique Avancée",
    descriptionFr: "Notes de synthèse C-Level, jargon ONG/MONUSCO et force de persuasion.",
    lessons: [
      { id: "l-b2-3", slug: "b2-redaction-rapports", titleFr: "Notes de synthèse C-Level", titleEn: "Executive Summaries", xpReward: 35, estMinutes: 11, icon: "📊" },
      { id: "l-b2-4", slug: "b2-anglais-ong-humanitaire", titleFr: "Anglais ONG & Bailleurs", titleEn: "NGO Proposals", xpReward: 35, estMinutes: 10, icon: "🌐" },
      { id: "l-b2-5", slug: "b2-debat-argumentation", titleFr: "Rhétorique & Objections", titleEn: "Advanced Rhetoric", xpReward: 35, estMinutes: 10, icon: "⚡" },
    ],
    examTitle: "Test de l'unité B2-2 : Expertise Internationale & Épreuve Finale",
  },
];

const UNITS_BY_LEVEL: Record<string, UnitData[]> = {
  A1: A1_UNITS,
  A2: A2_UNITS,
  B1: B1_UNITS,
  B2: B2_UNITS,
};

export default function ParcoursPage() {
  const [paliers, setPaliers] = useState<Palier[]>(INITIAL_PALIERS);
  const [selectedLevel, setSelectedLevel] = useState<string>("A1");
  const [completedSlugs, setCompletedSlugs] = useState<string[]>(["a1-salutations"]);
  const [totalXp, setTotalXp] = useState(60);

  useEffect(() => {
    const loadRealtimeParcours = () => {
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
    };

    loadRealtimeParcours();
    window.addEventListener("storage", loadRealtimeParcours);
    window.addEventListener("pa3_progress_updated", loadRealtimeParcours);
    window.addEventListener("pa3_xp_updated", loadRealtimeParcours);
    window.addEventListener("pa3_level_updated", loadRealtimeParcours);

    return () => {
      window.removeEventListener("storage", loadRealtimeParcours);
      window.removeEventListener("pa3_progress_updated", loadRealtimeParcours);
      window.removeEventListener("pa3_xp_updated", loadRealtimeParcours);
      window.removeEventListener("pa3_level_updated", loadRealtimeParcours);
    };
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

        {/* ================= DUOLINGO MAP NODES (A1, A2, B1, B2) ================= */}
        {(() => {
          const currentUnits = UNITS_BY_LEVEL[selectedLevel] || A1_UNITS;
          return (
            <div className="space-y-10 py-4">
              {currentUnits.map((unit, unitIdx) => (
                <div key={unit.id} className="space-y-6">
                  {/* Unit Header Card */}
                  <div className="bg-primary text-white p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        {unit.titleFr.split(":")[0]}
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
                        (idx === 0 || completedSlugs.includes(unit.lessons[idx - 1].slug) || selectedLevel !== "A1");
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
                          <div className="mt-2 max-w-36">
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

              {/* Final Level Exam & Certificate Milestone */}
              <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 text-amber-950 p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-4 border-4 border-white">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-white text-amber-600 flex items-center justify-center shadow-md">
                  <Award className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider bg-amber-950/10 px-3 py-1 rounded-full">
                    Épreuve Finale Palier {selectedLevel}
                  </span>
                  <h3 className="text-2xl font-black">
                    Examen Final Niveau {selectedLevel} & Certificat Officiel
                  </h3>
                  <p className="text-xs sm:text-sm max-w-md mx-auto text-amber-900 leading-relaxed">
                    Validez toutes les unités du niveau {selectedLevel} pour passer l&apos;examen final (score ≥ 75%)
                    et télécharger votre <strong>Certificat officiel CECRL {selectedLevel}</strong> signé avec QR Code vérifiable en ligne.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={`/test-de-niveau`}
                    className="px-6 py-3 rounded-xl btn-3d-navy text-white font-bold text-xs shadow-md"
                  >
                    Passer le Test d&apos;Évaluation
                  </Link>
                  <Link
                    href="/tarifs"
                    className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-amber-950 border border-amber-950/20 font-bold text-xs shadow-xs"
                  >
                    Voir les Pass Membre →
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
