'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Printer,
  Share2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  Award,
  Globe,
  Filter,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Flame,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import {
  SYLLABUS_CURRICULUM,
  SYLLABUS_STATS,
  SyllabusLevelId,
  SyllabusLesson,
} from '@/lib/domain/syllabus-data';
import { toast } from 'sonner';

export default function SyllabusPage() {
  const [selectedLevel, setSelectedLevel] = useState<SyllabusLevelId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  const [expandedLevel, setExpandedLevel] = useState<Record<string, boolean>>({
    A1: true,
    A2: true,
    B1: true,
    B2: true,
    SPECIAL: true,
  });

  const toggleLevelExpand = (lvl: string) => {
    setExpandedLevel((prev) => ({ ...prev, [lvl]: !prev[lvl] }));
  };

  const expandAll = () => {
    setExpandedLevel({ A1: true, A2: true, B1: true, B2: true, SPECIAL: true });
  };

  const collapseAll = () => {
    setExpandedLevel({ A1: false, A2: false, B1: false, B2: false, SPECIAL: false });
  };

  const handlePrint = () => {
    expandAll();
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien du Syllabus officiel copié dans le presse-papier !');
    }
  };

  const filteredLevels = useMemo(() => {
    const levelsToInclude = selectedLevel === 'ALL'
      ? (['A1', 'A2', 'B1', 'B2', 'SPECIAL'] as SyllabusLevelId[])
      : [selectedLevel];

    const cleanQuery = searchQuery.trim().toLowerCase();

    return levelsToInclude.map((lvlKey) => {
      const lvl = SYLLABUS_CURRICULUM[lvlKey];
      const matchingLessons = lvl.lessons.filter((lesson) => {
        // Skill filter
        if (selectedSkill !== 'ALL' && lesson.skillFocus !== selectedSkill) {
          return false;
        }
        // Text search
        if (!cleanQuery) return true;

        const matchTitleFr = lesson.titleFr.toLowerCase().includes(cleanQuery);
        const matchTitleEn = lesson.titleEn.toLowerCase().includes(cleanQuery);
        const matchObj = lesson.objectiveFr.toLowerCase().includes(cleanQuery);
        const matchRdc = lesson.rdcContext.toLowerCase().includes(cleanQuery);
        const matchGrammar = lesson.grammarPoints.some((g) => g.toLowerCase().includes(cleanQuery));
        const matchVocab = lesson.keyVocabulary.some((v) => v.toLowerCase().includes(cleanQuery));

        return matchTitleFr || matchTitleEn || matchObj || matchRdc || matchGrammar || matchVocab;
      });

      return {
        ...lvl,
        filteredLessons: matchingLessons,
      };
    });
  }, [selectedLevel, searchQuery, selectedSkill]);

  const totalFilteredLessons = filteredLevels.reduce((acc, lvl) => acc + lvl.filteredLessons.length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-navy">
      {/* Flag Accent Stripe */}
      <div className="flag-badge h-1.5 w-full print:hidden" />

      {/* Main Navbar */}
      <div className="print:hidden">
        <Navbar variant="home" showTestCta={true} showAdminBadge={true} />
      </div>

      {/* Printable Academic Header */}
      <div className="hidden print:block p-6 border-b-2 border-navy text-center space-y-1">
        <div className="text-xl font-black text-navy uppercase tracking-wider">PA³ English Academy • République Démocratique du Congo</div>
        <div className="text-xs font-bold text-amber-700 uppercase">Syllabus Officiel &amp; Programme Académique Complet (CECRL A1 à B2)</div>
        <div className="text-[10px] text-slate-500">Direction Pédagogique : Coach David Liandja • Kinshasa • https://pa-english-academy.vercel.app</div>
      </div>

      {/* Hero Header Section */}
      <section className="print:hidden relative overflow-hidden bg-gradient-to-br from-[#071328] via-navy to-[#0F294A] text-white pt-10 pb-16 px-4 border-b border-amber-400/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Document Académique Officiel • Référentiel CECRL RDC</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Syllabus de Cours <span className="text-gold-gradient">Complet &amp; en Couleurs</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
                Le répertoire exhaustif de toutes les leçons de <strong className="text-white">PA³ English Academy</strong>, du niveau 
                débutant (A1) jusqu’au leadership international (B2) et masterclasses professionnelles adaptées aux réalités de la RDC.
              </p>
            </div>

            {/* Print & Share Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 active:scale-95 shadow-sm cursor-pointer"
                title="Imprimer ou enregistrer le syllabus en PDF couleur"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Imprimer / PDF</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 active:scale-95 shadow-md cursor-pointer"
                title="Partager le syllabus officiel"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Catalogue Global</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">64 Leçons</div>
              <div className="text-[11px] text-slate-300">Du A1 au B2 + Métiers</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Volume Horaire</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">160 Heures</div>
              <div className="text-[11px] text-slate-300">Micro-learning 15 min/j</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lexique &amp; Phrases</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">2 500+ Mots</div>
              <div className="text-[11px] text-slate-300">Contexte RDC &amp; Business</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Validation CECRL</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">4 Certificats</div>
              <div className="text-[11px] text-slate-300">QR Code vérifiable en ligne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Controls, Filters & Search Bar */}
        <section className="print:hidden bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une leçon, mot de vocabulaire, règle de grammaire, contexte RDC..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded-full hover:bg-slate-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Expand / Collapse Controls */}
            <div className="flex items-center gap-2 self-end md:self-auto text-xs">
              <button
                onClick={expandAll}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Tout ouvrir</span>
              </button>
              <button
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Tout fermer</span>
              </button>
            </div>
          </div>

          {/* Level Color Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto touch-scroll no-scrollbar pt-1">
            <button
              onClick={() => setSelectedLevel('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedLevel === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🌈 Tous les Niveaux (64)
            </button>

            <button
              onClick={() => setSelectedLevel('A1')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedLevel === 'A1'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>🌱</span>
              <span>Palier A1 (Débutant)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">12</span>
            </button>

            <button
              onClick={() => setSelectedLevel('A2')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedLevel === 'A2'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <span>🚀</span>
              <span>Palier A2 (Élémentaire)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">14</span>
            </button>

            <button
              onClick={() => setSelectedLevel('B1')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedLevel === 'B1'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>💼</span>
              <span>Palier B1 (Intermédiaire Pro)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">16</span>
            </button>

            <button
              onClick={() => setSelectedLevel('B2')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedLevel === 'B2'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>🏆</span>
              <span>Palier B2 (Avancé &amp; Affaires)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">14</span>
            </button>

            <button
              onClick={() => setSelectedLevel('SPECIAL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 flex items-center gap-1.5 ${
                selectedLevel === 'SPECIAL'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span>💎</span>
              <span>Masterclasses Métiers (ESP)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/15 font-mono">8</span>
            </button>
          </div>

          {/* Skill Filter Pills */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-bold flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Compétence :
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: 'Toutes' },
                { id: 'speaking', label: '🗣️ Speaking (Expression Orale)' },
                { id: 'listening', label: '👂 Listening (Compréhension Orale)' },
                { id: 'grammar', label: '📐 Grammar & Structure' },
                { id: 'vocabulary', label: '📚 Vocabulary & Lexique' },
                { id: 'writing', label: '✍️ Writing (Écrits & Emails)' },
                { id: 'business', label: '💼 Business & ONGs' },
              ].map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedSkill === skill.id
                      ? 'bg-navy text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results Count & Quick Notice */}
        <div className="print:hidden flex items-center justify-between text-xs text-slate-500 font-medium px-1">
          <div>
            Affichage de <strong className="text-navy font-bold">{totalFilteredLessons} leçons</strong> selon vos critères de recherche.
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Programme 100% conforme au Cadre Européen (CECRL)</span>
          </div>
        </div>

        {/* Level Sections */}
        <div className="space-y-10">
          {filteredLevels.map((lvl) => {
            const isExpanded = expandedLevel[lvl.id] ?? true;
            if (lvl.filteredLessons.length === 0 && searchQuery) {
              return null;
            }

            return (
              <section
                key={lvl.id}
                id={`level-${lvl.id}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md page-break-after"
              >
                {/* Level Header Banner */}
                <div
                  className={`p-6 sm:p-7 bg-gradient-to-r ${lvl.colorScheme.gradientFrom} ${lvl.colorScheme.gradientTo} text-white relative overflow-hidden`}
                >
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-white/30">
                          <span>{lvl.colorScheme.iconEmoji}</span>
                          <span>{lvl.code}</span>
                        </span>
                        <span className="text-xs font-bold text-white/90 bg-black/20 px-2.5 py-1 rounded-full">
                          {lvl.hourlyVolume}
                        </span>
                        <span className="text-xs font-bold text-white/90 bg-black/20 px-2.5 py-1 rounded-full">
                          {lvl.filteredLessons.length} leçons au catalogue
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        {lvl.nameFr}
                      </h2>
                      <p className="text-sm text-white/90 font-medium max-w-2xl">
                        {lvl.taglineFr}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <Link
                        href={`/parcours`}
                        className="px-4 py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-white/90 shadow-sm transition active:scale-95 flex items-center gap-1.5 print:hidden"
                      >
                        <span>Accéder au Parcours</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => toggleLevelExpand(lvl.id)}
                        className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition cursor-pointer print:hidden"
                        title={isExpanded ? 'Réduire ce niveau' : 'Déplier ce niveau'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Level Details Sub-row */}
                  <div className="mt-5 pt-4 border-t border-white/20 text-xs text-white/90 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <strong className="text-white block font-bold mb-0.5">🎯 Descriptif CECRL Officiel :</strong>
                      <p className="text-[11px] leading-relaxed text-white/80">{lvl.cefrDescriptorFr}</p>
                    </div>
                    <div>
                      <strong className="text-white block font-bold mb-0.5">🏆 Examen &amp; Seuil de Validation :</strong>
                      <p className="text-[11px] leading-relaxed text-white/80">
                        {lvl.examNameFr} • Seuil requis : <strong>{lvl.passMarkPct}%</strong> pour l’obtention du certificat sécurisé.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Collapsible Lesson Cards Container */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Level Exit Competencies Banner */}
                    <div className={`p-4 rounded-2xl ${lvl.colorScheme.lightBg} border ${lvl.colorScheme.border} space-y-2`}>
                      <span className={`text-xs font-black uppercase tracking-wider ${lvl.colorScheme.accentText} flex items-center gap-1.5`}>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Compétences Opérationnelles Acquises à la fin du {lvl.nameFr} :</span>
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                        {lvl.exitCompetenciesFr.map((comp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${lvl.colorScheme.accentText}`} />
                            <span>{comp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Lesson Grid */}
                    <div className="space-y-4">
                      {lvl.filteredLessons.map((lesson) => {
                        return (
                          <div
                            key={lesson.id}
                            className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70 transition-all space-y-3 shadow-xs"
                          >
                            {/* Card Header */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${lvl.colorScheme.bgBadge} ${lvl.colorScheme.textBadge}`}
                                  >
                                    Leçon #{lesson.number} • {lesson.level}
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500">
                                    {lesson.unitTitleFr}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                    Focus : {lesson.skillFocus.toUpperCase()}
                                  </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-black text-navy">
                                  {lesson.titleFr}
                                  <span className="block sm:inline sm:ml-2 text-xs sm:text-sm font-semibold text-slate-500">
                                    ({lesson.titleEn})
                                  </span>
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{lesson.durationMinutes} min</span>
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  <span>+{lesson.xpReward} XP</span>
                                </span>

                                {lesson.slug && lesson.isInteractiveOnSite ? (
                                  <Link
                                    href={`/lecon/${lesson.slug}`}
                                    className="px-3 py-1 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition flex items-center gap-1 shadow-xs print:hidden"
                                    title="S'entraîner sur cette leçon interactive en ligne"
                                  >
                                    <span>Pratiquer</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 text-[11px] font-semibold print:hidden">
                                    Module Cours
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Objective */}
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                              <strong>🎯 Objectif :</strong> {lesson.objectiveFr}
                            </p>

                            {/* Detailed Metadata Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100">
                              {/* Grammar Points */}
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
                                <span className="text-[10px] font-black uppercase text-slate-500 block">
                                  📐 Points de Grammaire &amp; Structure :
                                </span>
                                <ul className="space-y-0.5 text-slate-700 text-[11px]">
                                  {lesson.grammarPoints.map((g, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="text-amber-500">•</span>
                                      <span>{g}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Key Vocabulary */}
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 space-y-1">
                                <span className="text-[10px] font-black uppercase text-slate-500 block">
                                  🧠 Vocabulaire &amp; Expressions Cibles :
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {lesson.keyVocabulary.map((v, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-navy font-bold text-[10px]"
                                    >
                                      {v}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* RDC Real-Life Context */}
                              <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60 space-y-1">
                                <span className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1">
                                  <span>🇨🇩</span> Contexte Réel RDC &amp; Carrière :
                                </span>
                                <p className="text-[11px] text-slate-700 leading-relaxed">
                                  {lesson.rdcContext}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Pedagogical Method & Guarantee Section */}
        <section className="bg-gradient-to-br from-navy via-slate-900 to-navy-dark text-white rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-400/30 shadow-xl space-y-6">
          <div className="space-y-2">
            <div className="inline-block bg-amber-400 text-amber-950 font-black text-xs uppercase px-3 py-1 rounded-full">
              L’Approche Pédagogique PA³
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Pourquoi le Syllabus PA³ garantit votre fluidité en anglais
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Contrairement aux cours scolaires traditionnels axés sur la mémorisation passive de listes de verbes, 
              le syllabus PA³ est conçu pour <strong className="text-white">débloquer l’expression orale spontanée</strong> dès le premier jour.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="font-black text-sm text-white">Micro-Learning Quotidien</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Leçons calibrées de 10 à 15 minutes, faciles à intégrer dans votre journée à Kinshasa, Lubumbashi ou Goma.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h4 className="font-black text-sm text-white">Ancrage Culturel &amp; Pro</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Exemples vivants tirés du monde réel : entretiens chez Rawbank, gestion de projets ONGs, M-Pesa et voyages.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h4 className="font-black text-sm text-white">Pratique Orale Active</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reconnaissance vocale guidée, phonétique des sons pièges (-ED, TH, voyelles courtes) et simulations de dialogues.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-400/20 text-purple-300 flex items-center justify-center font-black text-lg">
                4
              </div>
              <h4 className="font-black text-sm text-white">Certificat CECRL Vérifié</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chaque palier validé donne droit à un certificat numérique officiel avec identifiant unique et QR code sécurisé.
              </p>
            </div>
          </div>

          {/* Contact with Coach David */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              Besoin d’un parcours sur-mesure pour votre entreprise ou d’un coaching VIP en présentiel ?
            </div>
            <a
              href="https://wa.me/27742932071?text=Bonjour%20Coach%20David%2C%20je%20consulte%20le%20syllabus%20officiel%20et%20je%20souhaite%20m%27inscrire%20!"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter Coach David Liandja (+27 74 293 2071)</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
