'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Download,
  Palette,
  Eye,
  Check,
  Lock,
  Unlock,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import {
  SYLLABUS_CURRICULUM,
  SYLLABUS_STATS,
  SyllabusLevelId,
  SyllabusLesson,
} from '@/lib/domain/syllabus-data';
import { IllustratedAnatomyChart } from '@/components/syllabus/IllustratedAnatomyChart';
import { IllustratedPronunciationGuide } from '@/components/syllabus/IllustratedPronunciationGuide';
import { IllustratedClothingWardrobe } from '@/components/syllabus/IllustratedClothingWardrobe';
import { IllustratedObjectsGrid } from '@/components/syllabus/IllustratedObjectsGrid';
import { isAdminAuthenticated } from '@/lib/auth-admin';
import { toast } from 'sonner';

export default function SyllabusPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'visual' | 'curriculum'>('visual');
  const [activeVisualSubTab, setActiveVisualSubTab] = useState<'anatomy' | 'pronunciation' | 'clothes' | 'objects'>('anatomy');
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

  useEffect(() => {
    setIsAdmin(isAdminAuthenticated());
  }, []);

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
  }, [selectedLevel, selectedSkill, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      {/* Printable Academic Header */}
      <div className="hidden print:block p-6 border-b-2 border-navy text-center space-y-1">
        <div className="text-xl font-black text-navy uppercase tracking-wider">
          PA³ English Academy • République Démocratique du Congo
        </div>
        <div className="text-xs font-bold text-amber-700 uppercase">
          Syllabus Officiel &amp; Programme Académique Illustré (CECRL A1 à B2 + ESP)
        </div>
        <div className="text-[10px] text-slate-500">
          Direction Pédagogique : Coach David Liandja • Kinshasa • https://pa-english-academy.vercel.app
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="print:hidden relative overflow-hidden bg-gradient-to-br from-[#071328] via-navy to-[#0F294A] text-white pt-10 pb-14 px-4 border-b border-amber-400/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Document Académique &amp; Livret Illustré • Référentiel CECRL RDC</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Syllabus Illustré &amp; <span className="text-gold-gradient">Catalogue en Couleurs</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed">
                Le répertoire exhaustif de toutes les leçons et planches visuelles de{' '}
                <strong className="text-white">PA³ English Academy</strong>. Spécialement adapté
                aux étudiants francophones, congolais et africains : corps humain, phonétique appliquée,
                habits, objets du quotidien et 64 leçons complètes.
              </p>
            </div>

            {/* Action Buttons: Admin-Only Direct PDF Distribution vs Learner Inquiry */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {isAdmin ? (
                <>
                  <a
                    href="/downloads/PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf"
                    download="PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf"
                    className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-sky-500/20"
                    title="Télécharger le Cahier d'Exercices Interactifs & Exemples Multipliés de A1 à B2 (30 pages A4)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Cahier Interactif (30 P.)</span>
                  </a>

                  <a
                    href="/downloads/PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf"
                    download="PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf"
                    className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs sm:text-sm font-black transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-amber-400/20"
                    title="Télécharger exclusivement le Cursus des Cours de A1 à B2 (11 pages A4 - 56 leçons)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Cours A1 ➔ B2 (11 P.)</span>
                  </a>

                  <a
                    href="/downloads/PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf"
                    download="PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf"
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-emerald-600/20"
                    title="Télécharger le Grand Syllabus Complet & Illustré (15 pages A4 - 64 leçons + Planches visuelles)"
                  >
                    <Download className="w-4 h-4" />
                    <span>Livret Illustré (15 P.)</span>
                  </a>

                  <Link
                    href="/admin?tab=documents"
                    className="px-3.5 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                    title="Accéder au Centre de Distribution pour partager les liens sur WhatsApp"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Partager (Admin)</span>
                  </Link>
                </>
              ) : (
                <a
                  href="https://wa.me/243897400379?text=Bonjour%20Coach%20David%20Liandja,%20je%20souhaite%20recevoir%20les%203%20livrets%20PDF%20officiels%20(Cahier%20interactif,%20Cours%20A1-B2,%20Syllabus%20illustr%C3%A9)%20de%20PA%C2%B3%20English%20Academy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-600/20"
                  title="Demander les 3 livrets PDF officiels au Coach David Liandja sur WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Demander les 3 PDFs au Coach</span>
                </a>
              )}

              <button
                onClick={handlePrint}
                className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs sm:text-sm font-bold transition-all flex items-center gap-2 active:scale-95 shadow-sm cursor-pointer"
                title="Imprimer ou enregistrer le syllabus en PDF couleur via le navigateur"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Imprimer</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Partager le lien du syllabus officiel"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unified Informational Banner: PDF Distribution Policy */}
          <div className="pt-2">
            {isAdmin ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-600/15 border border-amber-500/40 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center text-lg font-black shrink-0 shadow-md shadow-amber-500/20">
                    📑
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        Centre de Distribution des 3 PDFs
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        🔓 Accès Admin Actif
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed max-w-3xl">
                      En tant qu&apos;administrateur (Coach David Liandja), vous seul détenez l&apos;exclusivité du partage des liens pour le <strong>Cahier Interactif (30 P.)</strong>, le <strong>Cours A1-B2 (11 P.)</strong> et le <strong>Grand Syllabus Illustré (15 P.)</strong>.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin?tab=documents"
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-amber-500/25"
                >
                  <span>Gérer &amp; Partager via WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-lg shrink-0">
                    🔒
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                        Distribution Officielle des Supports PDF
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/15">
                        Réservé aux inscrits
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-3xl">
                      Les 3 livrets pédagogiques (Cahier interactif d&apos;exercices 30 pages, Répertoire de cours A1-B2 11 pages, et Grand Syllabus illustré 15 pages) sont remis directement aux apprenants par le Coach David Liandja lors de leur inscription.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <a
                    href="https://wa.me/243897400379?text=Bonjour%20Coach%20David%20Liandja,%20je%20souhaite%20recevoir%20les%203%20livrets%20PDF%20officiels%20de%20PA%C2%B3%20English%20Academy."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Demander mon Pack PDF au Coach</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
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
                <span>Planches Illustrées</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">4 Thématiques</div>
              <div className="text-[11px] text-slate-300">Corps, Prononciation, Mode, Objets</div>
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
        {/* Top-Level Mode Selector Switcher */}
        <section className="print:hidden bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveMainTab('visual')}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeMainTab === 'visual'
                  ? 'bg-navy text-white shadow-md'
                  : 'text-slate-600 hover:text-navy hover:bg-slate-100'
              }`}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span>🎨 Livret Visuel Illustré</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                Nouveau
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('curriculum')}
              className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeMainTab === 'curriculum'
                  ? 'bg-navy text-white shadow-md'
                  : 'text-slate-600 hover:text-navy hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>📚 Cursus des 64 Leçons (A1 ➔ B2 + ESP)</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden md:flex items-center gap-2 pr-2">
            <span>🇨🇩 Supports PDF :</span>
            {isAdmin ? (
              <>
                <a
                  href="/downloads/PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf"
                  download
                  className="text-sky-800 font-bold hover:underline flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200"
                  title="Cahier d'Exercices Interactif avec exemples multipliés (30 pages A4)"
                >
                  <Download className="w-3 h-3 text-sky-600" />
                  <span>Exercices (30 P.)</span>
                </a>
                <a
                  href="/downloads/PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf"
                  download
                  className="text-amber-800 font-bold hover:underline flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200"
                  title="Télécharger exclusivement les 56 leçons de cours de A1 à B2"
                >
                  <Download className="w-3 h-3 text-amber-600" />
                  <span>Cours A1-B2 (11 P.)</span>
                </a>
                <a
                  href="/downloads/PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf"
                  download
                  className="text-emerald-800 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                  title="Télécharger le Livret Illustré complet avec les 64 leçons"
                >
                  <Download className="w-3 h-3 text-emerald-600" />
                  <span>Livret Illustré (15 P.)</span>
                </a>
                <Link
                  href="/admin?tab=documents"
                  className="text-amber-800 font-bold hover:underline flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300"
                  title="Ouvrir le Centre de Distribution des PDFs"
                >
                  <span>🔓 Centre Admin</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/243897400379?text=Bonjour%20Coach%20David%20Liandja,%20je%20souhaite%20recevoir%20les%203%20livrets%20PDF%20officiels%20de%20PA%C2%B3%20English%20Academy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                  title="Demander les 3 livrets PDF officiels au Coach David Liandja sur WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>Demander au Coach (WhatsApp)</span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            VUE 1 : LIVRET VISUEL ILLUSTRE (ANATOMIE, PRONONCIATION, HABITS, OBJETS)
            ========================================================================= */}
        {activeMainTab === 'visual' && (
          <section className="space-y-6">
            {/* Visual Subtabs */}
            <div className="print:hidden flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
              <span className="font-bold text-slate-500 shrink-0">Planches thématiques :</span>
              {[
                { id: 'anatomy', label: '🧘‍♂️ 1. Corps Humain & Santé', count: '21 parties' },
                { id: 'pronunciation', label: '👄 2. Phonétique & Prononciation', count: '5 sons clés' },
                { id: 'clothes', label: '👔👗 3. Habits & Mode Africaine (Wax, Sape)', count: '16 tenues' },
                { id: 'objects', label: '📦 4. Objets du Quotidien & Bureau', count: '13 essentiels' },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setActiveVisualSubTab(subTab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeVisualSubTab === subTab.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{subTab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/10 font-mono">
                    {subTab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab 1: Human Body Anatomy */}
            {activeVisualSubTab === 'anatomy' && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-emerald-950">
                      Planche 1 : Les Différentes Parties du Corps Humain &amp; la Santé
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Vocabulaire anatomique complet, phonétique IPA, équivalents en lingala et simulations de consultation médicale à Kinshasa.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shrink-0">
                    Niveau A1 - A2
                  </span>
                </div>

                <IllustratedAnatomyChart />
              </div>
            )}

            {/* Tab 2: Pronunciation Guide */}
            {activeVisualSubTab === 'pronunciation' && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-sky-950">
                      Planche 2 : Le Grand Guide Visuel de Prononciation &amp; Phonétique
                    </h3>
                    <p className="text-xs text-sky-800 mt-0.5">
                      Schémas articulatoires de la bouche, sons /th/, /h/ aspiré, voyelles courtes vs longues et terminaisons du passé -ED.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-600 text-white text-xs font-black shrink-0">
                    Tous Niveaux
                  </span>
                </div>

                <IllustratedPronunciationGuide />
              </div>
            )}

            {/* Tab 3: Clothes & African Fashion */}
            {activeVisualSubTab === 'clothes' && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-purple-950">
                      Planche 3 : La Garde-Robe, Vêtements &amp; Mode Africaine
                    </h3>
                    <p className="text-xs text-purple-800 mt-0.5">
                      Costumes corporate d&apos;affaires, tissus traditionnels africains (Wax/Pagne), Dashiki/Boubou et élégance de la SAPE.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-700 text-white text-xs font-black shrink-0">
                    A1 - B1 Pro
                  </span>
                </div>

                <IllustratedClothingWardrobe />
              </div>
            )}

            {/* Tab 4: Everyday & Office Objects */}
            {activeVisualSubTab === 'objects' && (
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-amber-950">
                      Planche 4 : Les Objets du Quotidien, de Bureau &amp; Terrain RDC
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Équipements informatiques, téléphones Mobile Money, batteries externes anti-délestage et kits de terrain minier.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-600 text-slate-950 text-xs font-black shrink-0">
                    A1 - A2 Pratique
                  </span>
                </div>

                <IllustratedObjectsGrid />
              </div>
            )}
          </section>
        )}

        {/* =========================================================================
            VUE 2 : CURSUS ACADEMIQUE DES 64 LECONS (A1, A2, B1, B2, ESP)
            ========================================================================= */}
        {activeMainTab === 'curriculum' && (
          <div className="space-y-8">
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

              {/* Level Filter Tabs with Colorful Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
                <button
                  onClick={() => setSelectedLevel('ALL')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    selectedLevel === 'ALL'
                      ? 'bg-navy text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tous les Paliers (64)
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

            {/* Curriculum Level Blocks */}
            <section className="space-y-8">
              {filteredLevels.map((lvl) => {
                const isExpanded = expandedLevel[lvl.id] ?? true;
                const lessonCount = lvl.filteredLessons.length;

                if (lessonCount === 0 && searchQuery) {
                  return null;
                }

                return (
                  <div
                    key={lvl.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all"
                  >
                    {/* Header Strip with Color Gradient */}
                    <div
                      className={`p-5 sm:p-6 text-white bg-gradient-to-r ${lvl.colorScheme.gradientFrom} ${lvl.colorScheme.gradientTo} cursor-pointer select-none`}
                      onClick={() => toggleLevelExpand(lvl.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-2xl">{lvl.colorScheme.iconEmoji}</span>
                            <span className="px-3 py-1 rounded-full bg-black/20 text-white font-black text-xs uppercase tracking-wider backdrop-blur-xs">
                              {lvl.code}
                            </span>
                            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                              {lvl.hourlyVolume}
                            </span>
                            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                              {lvl.totalLessons} Leçons
                            </span>
                          </div>

                          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                            {lvl.nameFr}
                            <span className="block sm:inline sm:ml-3 text-sm sm:text-base font-semibold opacity-90">
                              ({lvl.nameEn})
                            </span>
                          </h2>

                          <p className="text-xs sm:text-sm text-white/90 max-w-3xl leading-relaxed">
                            {lvl.taglineFr} • <em>{lvl.targetProfileFr}</em>
                          </p>
                        </div>

                        <button
                          className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
                          title={isExpanded ? 'Réduire ce niveau' : 'Ouvrir ce niveau'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Lesson Cards Container */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 space-y-6">
                        {/* Level Exit Competencies Banner */}
                        <div
                          className={`p-4 rounded-2xl ${lvl.colorScheme.lightBg} border ${lvl.colorScheme.border} space-y-2`}
                        >
                          <span
                            className={`text-xs font-black uppercase tracking-wider ${lvl.colorScheme.accentText} flex items-center gap-1.5`}
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Compétences Opérationnelles Acquises à la fin du {lvl.nameFr} :</span>
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                            {lvl.exitCompetenciesFr.map((comp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2
                                  className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${lvl.colorScheme.accentText}`}
                                />
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
                                        &ldquo;{lesson.titleEn}&rdquo;
                                      </span>
                                    </h3>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{lesson.durationMinutes} min</span>
                                    </span>
                                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                                      <span>+{lesson.xpReward} XP</span>
                                    </span>
                                    {lesson.isInteractiveOnSite && lesson.slug ? (
                                      <Link
                                        href={`/lecon/${lesson.slug}`}
                                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center gap-1 shadow-xs"
                                      >
                                        <span>Suivre</span>
                                        <ArrowRight className="w-3 h-3" />
                                      </Link>
                                    ) : null}
                                  </div>
                                </div>

                                {/* Objective */}
                                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                  <strong className="text-navy font-bold">Objectif opérationnel : </strong>
                                  {lesson.objectiveFr}
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100">
                                  {/* Grammar */}
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                      <span>📐</span> Grammaire &amp; Structure
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {lesson.grammarPoints.map((gp, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[11px]"
                                        >
                                          {gp}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Vocabulary */}
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                      <span>💬</span> Lexique Clé
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {lesson.keyVocabulary.map((kv, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60 font-medium text-[11px]"
                                        >
                                          {kv}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* RDC Real-World Context */}
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                      <span>🇨🇩</span> Contexte RDC &amp; Afrique
                                    </span>
                                    <p className="text-[11px] text-slate-600 leading-snug">
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
                  </div>
                );
              })}
            </section>
          </div>
        )}

        {/* Global Pedagogical Methodology Callout */}
        <section className="print:hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-navy via-slate-900 to-navy text-white space-y-6 shadow-xl border border-amber-400/20">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
              ✨ La Formule PA³
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Une Méthode Conçue Pour les Réalités d&apos;Afrique Francophone
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              La plupart des manuels d&apos;anglais traditionnels échouent parce qu&apos;ils ignorent les interférences entre le français, le lingala, le swahili et l&apos;anglais. Notre méthode combine micro-apprentissage et décomplexion orale totale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h4 className="font-black text-sm text-white">Zéro Blocage Psychologique</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Adieu la peur de faire des fautes ! Vous apprenez à parler avec assurance dès la première séance.
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
              href="https://wa.me/27742932071?text=Bonjour%20Coach%20David%2C%20je%20consulte%20le%20syllabus%20illustré%20et%20je%20souhaite%20m%27inscrire%20!"
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
