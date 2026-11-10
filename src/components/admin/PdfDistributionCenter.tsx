'use client';

import React, { useState } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Layers,
  BookOpen,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

export interface PdfDocumentResource {
  id: string;
  title: string;
  subtitle: string;
  filename: string;
  publicUrl: string;
  pagesCount: number;
  fileSize: string;
  themeColor: string;
  badgeText: string;
  badgeBg: string;
  targetAudience: string;
  keyFeatures: string[];
  whatsAppMessage: string;
}

export const OFFICIAL_PDF_RESOURCES: PdfDocumentResource[] = [
  {
    id: 'workbook',
    title: "Cahier d'Interactivité & d'Exercices Pratiques (A1 à B2)",
    subtitle: "56 Fiches Leçons Interactives • 200+ Exemples • Mini-Dialogues • QCM [ ]",
    filename: "PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf",
    publicUrl: "https://pa-english-academy.vercel.app/downloads/PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf",
    pagesCount: 30,
    fileSize: "110 Ko",
    themeColor: "from-sky-500 to-indigo-600",
    badgeText: "Pratique Intensive • A1 à B2",
    badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/40",
    targetAudience: "Étudiants inscrits, entraînements quotidiens de 15 min, ateliers oraux du Coach",
    keyFeatures: [
      "4 exemples bilingues par leçon (200+ au total) ancrés à Kinshasa et en Afrique",
      "Mini-dialogues vivants entre Speaker A & B avec traduction",
      "Tests QCM interactifs avec cases à cocher au stylo [ ]",
      "Puzzles de phrases (Sentence Ordering) avec ligne manuscrite",
      "Défis vocaux 'Speak Up !' pour débloquer la prononciation",
    ],
    whatsAppMessage: `Bonjour ! Voici votre *Cahier d'Exercices Interactifs Officiel PA³ English Academy* (30 pages A4 - Niveaux A1 à B2) :
🔗 https://pa-english-academy.vercel.app/downloads/PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf

Ce livret contient 56 fiches d'activités pratiques avec dialogues, QCM à cocher et exercices vocaux pour vous entraîner au quotidien.
_Direction Pédagogique : Coach David Liandja_`,
  },
  {
    id: 'course-lessons',
    title: "Cursus des Cours A1 à B2 (Répertoire Académique)",
    subtitle: "Les 56 Leçons Fondamentales • Objectifs • Grammaire • Lexique RDC",
    filename: "PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf",
    publicUrl: "https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf",
    pagesCount: 11,
    fileSize: "47 Ko",
    themeColor: "from-amber-400 to-amber-600",
    badgeText: "Programme Officiel • A1 à B2",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    targetAudience: "Recruteurs, responsables RH, apprenants souhaitant le programme officiel des cours",
    keyFeatures: [
      "Catalogue exhaustif des 56 leçons de A1 à B2",
      "Objectifs opérationnels mesurables pour chaque séance",
      "Règles grammaticales et structures de phrases clés",
      "Vocabulaire prioritaire et correspondances contextuelles RDC",
      "Matrice de progression CECRL et compétences de sortie",
    ],
    whatsAppMessage: `Bonjour ! Voici le *Curriculum Officiel des Cours de la PA³ English Academy* (11 pages A4 - 56 leçons de A1 à B2) :
🔗 https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf

Vous y trouverez l'ensemble des objectifs opérationnels, points de grammaire et lexique professionnel.
_Direction Pédagogique : Coach David Liandja_`,
  },
  {
    id: 'illustrated-syllabus',
    title: "Grand Syllabus Complet & Livret Illustré",
    subtitle: "64 Leçons (A1-B2 + 8 Masterclasses ESP) • 4 Planches Visuelles Thématiques",
    filename: "PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf",
    publicUrl: "https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf",
    pagesCount: 15,
    fileSize: "62 Ko",
    themeColor: "from-emerald-500 to-teal-700",
    badgeText: "Master Syllabus • 64 Leçons + 4 Planches",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    targetAudience: "Dossiers d'accréditation, partenariats entreprises, ambassades, banques et ONGs",
    keyFeatures: [
      "Planche 1 : Corps humain & santé (21 parties avec phonétique et lingala)",
      "Planche 2 : Grand guide de prononciation (5 sons pièges et paires minimales)",
      "Planche 3 : Habits, mode africaine, wax/pagne et élégance de la SAPE",
      "Planche 4 : Objets du quotidien, power bank délestage, EPI minier et bureau",
      "8 Masterclasses spécialisées : Mines Kolwezi, Banque Rawbank, Droit OHADA, Santé, Diplomatie",
    ],
    whatsAppMessage: `Bonjour ! Voici le *Grand Syllabus Complet & Livret Illustré PA³ English Academy* (15 pages A4 - 64 leçons + 4 planches thématiques) :
🔗 https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf

Il réunit l'intégralité du cursus CECRL, les masterclasses métiers (Mines, Banque, Droit, Santé) et les planches visuelles.
_Direction Pédagogique : Coach David Liandja_`,
  },
];

export function PdfDistributionCenter() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success(`Lien copié : ${label}`);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const sharePackViaWhatsApp = () => {
    const fullMessage = `*PA³ ENGLISH ACADEMY — PACK OFFICIEL DES 3 DOCUMENTS PDF*
Direction Pédagogique : Coach David Liandja (Kinshasa, RDC)

Voici vos 3 livrets de formation officielle à télécharger :

1️⃣ *Cahier d'Exercices Interactifs (30 Pages A4 - 200+ Exemples & QCM)* :
🔗 https://pa-english-academy.vercel.app/downloads/PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf

2️⃣ *Curriculum Officiel des Cours A1 à B2 (11 Pages A4 - 56 Leçons)* :
🔗 https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf

3️⃣ *Grand Syllabus Complet & Livret Illustré (15 Pages A4 - 64 Leçons + 4 Planches)* :
🔗 https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf

Plateforme en ligne : https://pa-english-academy.vercel.app
_Bonne pratique et excellent succès dans votre apprentissage de l'anglais !_`;

    const encoded = encodeURIComponent(fullMessage);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const copyFullPack = () => {
    const fullMessage = `PA³ ENGLISH ACADEMY — PACK OFFICIEL DES 3 LIVRETS PDF (A1 à B2)
1. Cahier d'Exercices Interactifs (30 P.) : https://pa-english-academy.vercel.app/downloads/PA3-CAHIER-INTERACTIF-EXERCICES-A1-A-B2.pdf
2. Cursus des Cours A1 à B2 (11 P.) : https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-COURSE-LESSONS-A1-TO-B2.pdf
3. Grand Syllabus Complet & Illustré (15 P.) : https://pa-english-academy.vercel.app/downloads/PA3-ENGLISH-ACADEMY-SYLLABUS-ILLUSTRE.pdf`;

    copyToClipboard(fullMessage, 'pack', 'Pack des 3 liens PDF');
  };

  return (
    <div className="space-y-8">
      {/* Policy Security Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-gold/10 to-slate-900 border border-gold/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-black uppercase tracking-wider border border-gold/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Distribution Réservée à l&apos;Administration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Centre de Distribution des Liens &amp; PDFs Officiels
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Tous les livrets PDF officiels sont rassemblés ici. Seul l&apos;administrateur (Coach David Liandja)
            a l&apos;autorisation de partager ces liens avec les apprenants inscrits ou les entreprises partenaires.
          </p>
        </div>

        {/* Global Pack Sharing Button */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={sharePackViaWhatsApp}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Partager le Pack (3 PDFs) sur WhatsApp</span>
          </button>

          <button
            onClick={copyFullPack}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedId === 'pack' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>Copier le Pack</span>
          </button>
        </div>
      </div>

      {/* Grid of the 3 Official PDFs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {OFFICIAL_PDF_RESOURCES.map((doc) => {
          const isCopied = copiedId === doc.id;

          const shareDocOnWhatsApp = () => {
            const encoded = encodeURIComponent(doc.whatsAppMessage);
            window.open(`https://wa.me/?text=${encoded}`, '_blank');
          };

          return (
            <div
              key={doc.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between overflow-hidden group"
            >
              {/* Header Strip */}
              <div className={`p-5 text-white bg-gradient-to-r ${doc.themeColor} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-xs ${doc.badgeBg}`}>
                    {doc.badgeText}
                  </span>
                  <span className="text-[11px] font-bold bg-black/25 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {doc.pagesCount} Pages • {doc.fileSize}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                  {doc.title}
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  {doc.subtitle}
                </p>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 space-y-4 text-xs">
                {/* Target Audience */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Public Cible &amp; Utilisation :
                  </span>
                  <p className="text-slate-300 font-medium">
                    {doc.targetAudience}
                  </p>
                </div>

                {/* Features Checklist */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Éléments Inclus dans le Document :
                  </span>
                  <ul className="space-y-1.5 text-slate-300">
                    {doc.keyFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-5 pt-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2.5">
                {/* WhatsApp Share Button */}
                <button
                  onClick={shareDocOnWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Partager à un Étudiant sur WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* Copy Link */}
                  <button
                    onClick={() => copyToClipboard(doc.publicUrl, doc.id, doc.title)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Lien Copié !' : 'Copier Lien'}</span>
                  </button>

                  {/* Direct Download for Admin */}
                  <a
                    href={`/downloads/${doc.filename}`}
                    download={doc.filename}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 text-center"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Télécharger</span>
                  </a>
                </div>

                <div className="text-[10px] text-center text-slate-500 font-mono truncate">
                  Fichier : {doc.filename}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Access Guidelines Card */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-gold font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Charte de Distribution &amp; Protection des Documents PA³</span>
        </div>
        <p className="leading-relaxed">
          1. <strong>Étudiants Privés :</strong> Les PDFs ne doivent être remis qu&apos;aux apprenants ayant activé leur forfait ou leur abonnement via Mobile Money (SASPay / M-Pesa / Orange Money).<br />
          2. <strong>Entreprises &amp; B2B :</strong> Pour les banques, mines et ONGs, transmettez le pack complet accompagné de l&apos;offre de formation institutionnelle signée par Coach David Liandja.<br />
          3. <strong>Anti-Piratage :</strong> Chaque document contient les mentions légales, la signature de direction et l&apos;URL officielle de contrôle.
        </p>
      </div>
    </div>
  );
}
