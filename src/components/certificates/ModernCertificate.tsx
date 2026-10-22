"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Copy,
  Download,
  Edit2,
  ExternalLink,
  GraduationCap,
  MessageCircle,
  Printer,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { CertificateData } from "@/lib/domain/certificates";
import { BRAND } from "@/lib/brand";
import { isLearnerAuthenticated, getLearnerProfile } from "@/lib/auth-learner";

interface ModernCertificateProps {
  initialCert: CertificateData;
  initialLearnerName?: string;
}

export function ModernCertificate({
  initialCert,
  initialLearnerName,
}: ModernCertificateProps) {
  const [learnerName, setLearnerName] = useState<string>(
    initialLearnerName || initialCert.learnerName || "Apprenant PA³ Academy"
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(learnerName);
  const [copied, setCopied] = useState(false);

  // Sync with active logged-in learner profile on client if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const queryName = urlParams.get("name");
      if (queryName && queryName.trim()) {
        setLearnerName(queryName.trim());
        setTempName(queryName.trim());
        return;
      }

      if (isLearnerAuthenticated()) {
        const profile = getLearnerProfile();
        if (profile?.name && profile.name.trim()) {
          setLearnerName(profile.name.trim());
          setTempName(profile.name.trim());
        }
      } else {
        const savedName = localStorage.getItem("pa3_user_name");
        if (savedName && savedName.trim()) {
          setLearnerName(savedName.trim());
          setTempName(savedName.trim());
        }
      }
    }
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setLearnerName(tempName.trim());
      setIsEditingName(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("pa3_user_name", tempName.trim());
        // Update URL parameter without reload
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("name", tempName.trim());
        window.history.replaceState({}, "", newUrl.toString());
      }
      toast.success("Nom mis à jour sur le certificat officiel !");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/verify/${initialCert.code}?name=${encodeURIComponent(learnerName)}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Lien officiel de vérification copié dans le presse-papier !");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${initialCert.code}?name=${encodeURIComponent(learnerName)}`
      : `https://pa-english-academy.vercel.app/verify/${initialCert.code}?name=${encodeURIComponent(learnerName)}`;

  const whatsappMessage = encodeURIComponent(
    `🎓 J'ai le plaisir d'annoncer l'obtention de mon Certificat Officiel d'anglais (${initialCert.levelTitleFr}) à PA³ English Academy avec ${initialCert.score}% de score (${initialCert.mention}) !\n\nConsultez et vérifiez l'authenticité de mon certificat en ligne : ${shareUrl}`
  );

  return (
    <div className="space-y-6">
      {/* Top Verification Status Bar (Hidden on print) */}
      <div className="print:hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg border border-emerald-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pop">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 bg-white/10 px-2 py-0.5 rounded-full">
                Registre National & International • CECRL
              </span>
              <span className="text-xs">🇨🇩</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight mt-0.5">
              Certificat Officiel Authentifié & Vérifié
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="text-xs font-mono font-bold bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">
            {initialCert.code}
          </span>
          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1.5 border border-white/20 cursor-pointer"
            title="Modifier le nom affiché sur le certificat"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Changer le Nom</span>
          </button>
        </div>
      </div>

      {/* Name Edit Modal / Form (Hidden on print) */}
      {isEditingName && (
        <form
          onSubmit={handleSaveName}
          className="print:hidden bg-amber-50 border-2 border-amber-400 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3 animate-pop"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
              <span>✍️</span>
              <span>Personnaliser le nom officiel sur le diplôme</span>
            </label>
            <button
              type="button"
              onClick={() => setIsEditingName(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold"
            >
              Annuler
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Nom et Prénom complets de l'apprenant"
              className="flex-1 bg-white border border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none"
            />
            <button
              type="submit"
              className="btn-3d-gold !py-2.5 !px-5 text-xs font-black rounded-xl shrink-0"
            >
              Appliquer au certificat
            </button>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            Conseil : Inscrivez votre nom complet tel qu'il figure sur votre passeport ou carte d'électeur congolaise pour vos démarches officielles (employeurs, visas, bourses).
          </p>
        </form>
      )}

      {/* ========================================================================= */}
      {/* THE OFFICIAL DIPLOMA CERTIFICATE FRAME (Printable Landscape / Clean A4) */}
      {/* ========================================================================= */}
      <div
        id="official-certificate"
        className="relative bg-white text-slate-900 rounded-3xl p-6 sm:p-12 md:p-16 border-4 sm:border-8 border-amber-500/80 shadow-2xl overflow-hidden print:p-8 print:border-8 print:shadow-none print:rounded-none print:w-full print:m-0"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(11, 31, 66, 0.25), 0 0 0 1px rgba(217, 119, 6, 0.15)",
        }}
      >
        {/* Ornate Multi-Layered Border System */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-amber-400/60 rounded-2xl pointer-events-none" />
        <div className="absolute inset-3 sm:inset-4 border border-dashed border-slate-300 rounded-xl pointer-events-none" />

        {/* Corner Guilloché Ornaments */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 text-amber-500/70 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M0,0 L40,0 C20,10 10,20 0,40 Z M10,10 L30,10 C20,15 15,20 10,30 Z" />
            <circle cx="20" cy="20" r="4" />
          </svg>
        </div>
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 text-amber-500/70 pointer-events-none select-none rotate-90">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M0,0 L40,0 C20,10 10,20 0,40 Z M10,10 L30,10 C20,15 15,20 10,30 Z" />
            <circle cx="20" cy="20" r="4" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-12 h-12 text-amber-500/70 pointer-events-none select-none -rotate-90">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M0,0 L40,0 C20,10 10,20 0,40 Z M10,10 L30,10 C20,15 15,20 10,30 Z" />
            <circle cx="20" cy="20" r="4" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 text-amber-500/70 pointer-events-none select-none rotate-180">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
            <path d="M0,0 L40,0 C20,10 10,20 0,40 Z M10,10 L30,10 C20,15 15,20 10,30 Z" />
            <circle cx="20" cy="20" r="4" />
          </svg>
        </div>

        {/* Faint Center Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.035] flex flex-col items-center justify-center">
          <span className="text-[140px] sm:text-[220px] font-black tracking-widest text-navy">
            PA³
          </span>
          <span className="text-xl sm:text-3xl font-black uppercase tracking-widest text-slate-800 -mt-10">
            ENGLISH ACADEMY
          </span>
        </div>

        {/* Certificate Inner Body */}
        <div className="relative z-10 space-y-6 sm:space-y-8 text-center max-w-2xl mx-auto">
          {/* Header & Badges */}
          <div className="space-y-3">
            {/* National Roundel & Crest */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-base sm:text-lg">🇨🇩</span>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                RÉPUBLIQUE DÉMOCRATIQUE DU CONGO
              </span>
              <span className="text-base sm:text-lg">🇨🇩</span>
            </div>

            {/* Academy Branding */}
            <div className="flex flex-col items-center justify-center pt-1">
              <div className="inline-flex items-center gap-2 select-none">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B1F42]">
                  PA<sup className="text-amber-500 font-extrabold text-sm">3</sup>
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-wide text-amber-500">
                  ENGLISH
                </span>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">
                  ACADEMY
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest mt-1">
                {BRAND.slogan} • SUCCEED IN ENGLISH!
              </p>
            </div>

            {/* Certificate Grand Title */}
            <div className="pt-3">
              <div className="inline-block relative">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase font-serif">
                  CERTIFICAT D&apos;ACCOMPLISSEMENT
                </h2>
                <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent w-full mt-2 rounded-full" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide mt-2">
                Cadre Européen Commun de Référence pour les Langues (CECRL)
              </p>
            </div>
          </div>

          {/* Recipient Section */}
          <div className="space-y-3 py-2 sm:py-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              DÉCERNÉ AVEC HONNEUR ET LES FÉLICITATIONS DU JURY À
            </p>

            {/* Recipient Full Name */}
            <div className="relative inline-block py-2">
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#0B1F42] tracking-tight font-serif capitalize">
                {learnerName}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-0.5 w-12 sm:w-20 bg-amber-400 rounded-full" />
                <span className="text-amber-500 text-xs sm:text-sm">★ ★ ★</span>
                <div className="h-0.5 w-12 sm:w-20 bg-amber-400 rounded-full" />
              </div>
            </div>

            {/* Level & Distinction Statement */}
            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed max-w-xl mx-auto font-normal">
              Pour avoir validé avec succès l&apos;examen d&apos;évaluation officiel
              et démontré une maîtrise active et fluide du{" "}
              <strong className="text-slate-950 font-black font-serif text-base sm:text-xl block sm:inline mt-1 sm:mt-0">
                {initialCert.levelTitleFr}
              </strong>{" "}
              avec la distinction :
            </p>

            {/* Honors Mention Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 px-4 py-1.5 rounded-full text-amber-950 font-black text-xs sm:text-sm shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
              <span>{initialCert.mention}</span>
              <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-black">
                {initialCert.score}%
              </span>
            </div>
          </div>

          {/* Competences Matrix / Skills Breakdown */}
          {initialCert.competences && initialCert.competences.length > 0 && (
            <div className="pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-lg mx-auto">
                {initialCert.competences.map((comp) => (
                  <div
                    key={comp.skill}
                    className="bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 text-center shadow-xs"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-500 truncate">
                      {comp.skillFr}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                      {comp.score}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures, Golden Embossed Seal & Verification Block */}
          <div className="pt-6 sm:pt-10 border-t border-slate-200 grid grid-cols-3 gap-4 items-end">
            {/* Signature 1: Coach David Liandja */}
            <div className="text-center sm:text-left space-y-1.5">
              <div className="h-14 flex items-end justify-center sm:justify-start">
                {/* Elegant Handwritten Calligraphic Signature */}
                <div className="relative text-left">
                  <span className="font-serif italic font-bold text-xl sm:text-2xl text-slate-900 tracking-wider">
                    David Liandja
                  </span>
                  <div className="w-28 sm:w-36 h-0.5 bg-slate-400 mt-1" />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-950">
                {initialCert.coachName}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">
                {initialCert.coachTitle}
              </p>
            </div>

            {/* Center: Official 3D Golden Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-slate-950 p-1 shadow-xl flex items-center justify-center relative group">
                {/* Starburst rays */}
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900/40 flex flex-col items-center justify-center p-1 text-center bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950 fill-amber-950/20" />
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter leading-none mt-0.5">
                    SCEAU OFFICIEL
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-extrabold text-slate-900">
                    EXCELLENCE
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-1.5">
                KINSHASA • RDC
              </span>
            </div>

            {/* Signature 2: Academic Board & QR Code Verification */}
            <div className="text-center sm:text-right space-y-1.5">
              <div className="h-14 flex items-end justify-center sm:justify-end">
                <div className="p-1 rounded-xl bg-slate-50 border border-slate-200 shadow-xs inline-block">
                  <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-slate-800" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-800">
                Délivré le : {initialCert.issuedAt}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                S/N: {initialCert.serialNumber || `CD-PA3-2026-${initialCert.code}`}
              </p>
            </div>
          </div>

          {/* Certificate Security Microprint Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[10px] text-slate-400 font-mono gap-2">
            <span>PA³ ENGLISH ACADEMY • REGISTRE OFFICIEL NUMÉRIQUE</span>
            <span>IDENTIFIANT CERTIFIÉ : {initialCert.code}</span>
            <span>VÉRIFICATION : PA-ENGLISH-ACADEMY.VERCEL.APP</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ACTION TOOLBAR & SHARING BUTTONS (Hidden on print) */}
      {/* ========================================================================= */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Print / Save to PDF */}
          <button
            onClick={handlePrint}
            type="button"
            className="btn-3d-gold py-3 px-5 rounded-2xl text-xs font-black inline-flex items-center gap-2 shadow-md cursor-pointer active:scale-95 transition"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Imprimer / Télécharger en PDF</span>
          </button>

          {/* Copy Verification Link */}
          <button
            onClick={handleCopyLink}
            type="button"
            className="py-3 px-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4 text-slate-500" />
            )}
            <span>{copied ? "Lien copié !" : "Copier le lien vérifiable"}</span>
          </button>
        </div>

        {/* WhatsApp Sharing Button */}
        <a
          href={`https://wa.me/?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-3d-success py-3 px-5 rounded-2xl text-xs font-black inline-flex items-center gap-2 shadow cursor-pointer transition active:scale-95"
        >
          <MessageCircle className="w-4 h-4 text-white fill-white/20" />
          <span>Partager sur WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
