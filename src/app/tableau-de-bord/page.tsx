"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Flame,
  GraduationCap,
  Headphones,
  Lock,
  MessageCircle,
  Play,
  RotateCcw,
  Settings,
  Share2,
  Sparkles,
  Trophy,
  Wifi,
  WifiOff,
  Zap,
  User,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Navbar } from "@/components/navigation/Navbar";
import { BRAND } from "@/lib/brand";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { getLearnerProfile } from "@/lib/auth-learner";
import { CefrLevel } from "@/lib/supabase/database.types";

interface StoredStats {
  level: CefrLevel;
  xp: number;
  streak: number;
  completedLessons: string[];
  dataSaver: boolean;
  dailyGoalMin: number;
  todayMinutes: number;
}

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [learnerName, setLearnerName] = useState("Apprenant");
  const [stats, setStats] = useState<StoredStats>({
    level: "A1",
    xp: 60,
    streak: 3,
    completedLessons: ["a1-salutations"],
    dataSaver: false,
    dailyGoalMin: 10,
    todayMinutes: 8,
  });

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
    const learner = getLearnerProfile();
    if (learner?.name) {
      setLearnerName(learner.name);
    }
    if (typeof window !== "undefined") {
      const storedLvl = (localStorage.getItem("pa3_current_level") as CefrLevel) || "A1";
      const storedDataSaver = localStorage.getItem("pa3_data_saver") === "true";
      setStats((prev) => ({
        ...prev,
        level: storedLvl,
        dataSaver: storedDataSaver,
      }));
    }
  }, []);

  const toggleDataSaver = () => {
    setStats((prev) => {
      const next = !prev.dataSaver;
      if (typeof window !== "undefined") {
        localStorage.setItem("pa3_data_saver", String(next));
      }
      return { ...prev, dataSaver: next };
    });
  };

  const nextLesson = {
    slug: "a1-se-presenter",
    titleFr: "Se présenter",
    titleEn: "Introducing yourself",
    unitTitle: "Unité 1 : Premiers pas",
    durationMin: 10,
    xpReward: 20,
  };

  const dailyGoalPercent = Math.min(
    100,
    Math.round((stats.todayMinutes / stats.dailyGoalMin) * 100),
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground selection:bg-amber-400 selection:text-navy">
      {/* Top Congolese flag accent stripe */}
      <div className="flag-badge h-1 w-full" />

      {/* Main App Navigation Bar with Side Menu */}
      <Navbar
        variant="app"
        showTestCta={false}
        showAdminBadge={false}
        customRightElement={
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
            {/* Streak */}
            <div
              className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200"
              title="Série de jours consécutifs"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{stats.streak} j</span>
            </div>

            {/* XP */}
            <div
              className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200"
              title="Points d'expérience"
            >
              <Zap className="w-4 h-4 fill-blue-600 text-blue-600" />
              <span>{stats.xp} XP</span>
            </div>

            {/* Current Level Badge */}
            <div className="hidden md:flex items-center gap-1.5 text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Niveau {stats.level}</span>
            </div>

            {/* Data Saver Toggle */}
            <button
              onClick={toggleDataSaver}
              className={`hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all border ${
                stats.dataSaver
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
              title="Active le mode faible consommation de données (idéal 3G/4G)"
            >
              {stats.dataSaver ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Éco Données : ON</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden lg:inline">Éco Données : OFF</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Banner with Next Lesson CTA */}
        <section className="bg-gradient-to-r from-navy via-slate-900 to-navy-dark text-white rounded-3xl p-5 sm:p-8 border border-amber-400/30 shadow-md relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase px-3 py-1 rounded-full border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Niveau {stats.level} • {stats.level === "A1" ? "Débutant" : "En progression"}</span>
              </div>

              <h1 className="clamp-title font-black">
                Mbote {learnerName.split(" ")[0]} ! Prêt(e) pour votre leçon du jour ?
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Prochaine étape :{" "}
                <strong className="text-white">
                  {nextLesson.titleFr} ({nextLesson.titleEn})
                </strong>
                . Apprenez à dire d&apos;où vous venez et votre âge en anglais.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href={`/lecon/${nextLesson.slug}`}
                  className="btn-3d-gold w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-lg text-center"
                >
                  <Play className="w-4 h-4 fill-amber-950 text-amber-950" />
                  <span>Continuer ({nextLesson.durationMin} min)</span>
                </Link>

                <Link
                  href="/parcours"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full sm:w-auto px-5 py-3.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Voir le parcours complet</span>
                </Link>
              </div>
            </div>

            {/* Daily Goal Ring Card */}
            <div className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-amber-400">
                  Objectif quotidien
                </p>
                <p className="text-lg font-black text-white">
                  {stats.todayMinutes} / {stats.dailyGoalMin} min
                </p>
                <p className="text-[11px] text-slate-300">
                  {dailyGoalPercent >= 100
                    ? "🎉 Objectif atteint aujourd'hui !"
                    : `Plus que ${stats.dailyGoalMin - stats.todayMinutes} min pour valider votre flamme.`}
                </p>
              </div>

              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-amber-400"
                    strokeDasharray={`${dailyGoalPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-amber-300">
                  {dailyGoalPercent}%
                </span>
              </div>
            </div>
          </div>
        </section>


        {/* 3-Column Stats & Skills Overview */}
        <section className="grid md:grid-cols-12 gap-6">
          {/* Left Column: Skill Mastery Bars (8 cols) */}
          <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Maîtrise des compétences (Niveau {stats.level})
                </h2>
                <p className="text-xs text-slate-500">
                  Progression calculée d&apos;après vos leçons et le test de niveau
                </p>
              </div>

              <Link
                href="/test-de-niveau"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refaire le test</span>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Vocab */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Vocabulaire usuel</span>
                  <span className="text-emerald-700 font-extrabold">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "75%" }} />
                </div>
                <p className="text-[11px] text-slate-500">Salutations, famille et marché</p>
              </div>

              {/* Grammar */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Grammaire & Structures</span>
                  <span className="text-blue-700 font-extrabold">60%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "60%" }} />
                </div>
                <p className="text-[11px] text-slate-500">Verbe 'to be', possessifs</p>
              </div>

              {/* Listening */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Compréhension orale</span>
                  <span className="text-amber-700 font-extrabold">70%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "70%" }} />
                </div>
                <p className="text-[11px] text-slate-500">Comprendre l'accent anglophone</p>
              </div>

              {/* Speaking */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700">Prononciation & Oral</span>
                  <span className="text-purple-700 font-extrabold">50%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: "50%" }} />
                </div>
                <p className="text-[11px] text-slate-500">Exercices vocaux enregistrés</p>
              </div>
            </div>

            {/* Quick action to lessons */}
            <div className="pt-2 flex justify-between items-center text-xs text-slate-600 border-t border-slate-100">
              <span>Leçons terminées : <strong>1 sur 20 (Niveau A1)</strong></span>
              <Link
                href="/parcours"
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Accéder à la carte du cours</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Coach & Certificates Widget (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            {/* Coach David Contact Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-gold shrink-0 bg-slate-900">
                  <Image
                    src="/images/coach-david.jpg"
                    alt="Coach David Liandja"
                    fill
                    sizes="48px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {BRAND.coach.name}
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold">
                    Votre Mentor Dédié
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Une question sur une leçon ou besoin d&apos;une séance de
                conversation personnalisée à Kinshasa ?
              </p>

              <a
                href={BRAND.coach.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-3d-success py-2.5 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Poser une question sur WhatsApp</span>
              </a>
            </div>

            {/* Certificate Widget */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Certificat Officiel PA³</span>
              </div>

              <p className="text-xs text-slate-600">
                Passez l&apos;examen final du niveau A1 (score ≥ 75%) pour
                débloquer votre certificat PDF officiel vérifiable par QR Code.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center">
                <span className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Certificat Niveau A1 (Verrouillé)</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Terminez les 4 unités pour débloquer l&apos;examen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Units Preview Accordion / Cards */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">
              Unités du Niveau {stats.level} (A1 Débutant)
            </h2>
            <Link
              href="/parcours"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Voir la carte interactive</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Unit 1 */}
            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Unité 1
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Premiers pas
              </h3>
              <p className="text-xs text-slate-600">
                Saluer, se présenter et compter de 0 à 20.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">1 / 5 leçons</span>
                <Link
                  href="/lecon/a1-se-presenter"
                  className="font-bold text-primary hover:underline"
                >
                  Continuer →
                </Link>
              </div>
            </div>

            {/* Unit 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 opacity-90">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Unité 2
                </span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Ma famille et moi
              </h3>
              <p className="text-xs text-slate-600">
                Membres de la famille, maison et possessifs.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                Débloqué après Unité 1
              </div>
            </div>

            {/* Unit 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 opacity-90">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Unité 3
                </span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Au marché
              </h3>
              <p className="text-xs text-slate-600">
                Aliments, prix, commander et faire ses courses.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                Débloqué après Unité 2
              </div>
            </div>

            {/* Unit 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 opacity-90">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Unité 4
                </span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Le temps et la ville
              </h3>
              <p className="text-xs text-slate-600">
                Jours, heures, taxi-bus et directions en ville.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-400">
                Débloqué après Unité 3
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile-first bottom navigation bar */}
      <nav className="sm:hidden sticky bottom-0 bg-white border-t border-slate-200 py-2 px-6 flex justify-around items-center z-40 shadow-lg safe-bottom">
        <Link
          href="/parcours"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary text-[10px] font-bold"
        >
          <Compass className="w-5 h-5" />
          <span>Parcours</span>
        </Link>
        <Link
          href="/tableau-de-bord"
          className="flex flex-col items-center gap-1 text-primary text-[10px] font-bold"
        >
          <GraduationCap className="w-5 h-5 text-amber-500" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/test-de-niveau"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary text-[10px] font-bold"
        >
          <Zap className="w-5 h-5" />
          <span>Test</span>
        </Link>

        <Link
          href="/profil"
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary text-[10px] font-bold"
        >
          <User className="w-5 h-5 text-slate-600" />
          <span>Profil</span>
        </Link>
        <a
          href={BRAND.coach.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-emerald-600 text-[10px] font-bold"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Coach</span>
        </a>
      </nav>
    </div>
  );
}
