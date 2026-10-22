"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Lock,
  MessageCircle,
  Printer,
  QrCode,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { BRAND } from "@/lib/brand";
import {
  isLearnerAuthenticated,
  getLearnerProfile,
  getLearnerProgressStats,
} from "@/lib/auth-learner";
import {
  CertificateData,
  getLearnerCertificates,
} from "@/lib/domain/certificates";

export default function CertificatsPage() {
  const [studentName, setStudentName] = useState("Apprenant PA³ Academy");
  const [studentLevel, setStudentLevel] = useState("A1");
  const [certificates, setCertificates] = useState<CertificateData[]>([]);

  useEffect(() => {
    let name = "Apprenant PA³ Academy";
    let level = "A1";

    if (isLearnerAuthenticated()) {
      const profile = getLearnerProfile();
      if (profile?.name) {
        name = profile.name.trim();
      }
      const stats = getLearnerProgressStats();
      if (stats?.level) {
        level = stats.level;
      }
    } else if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("pa3_user_name");
      if (savedName) {
        name = savedName.trim();
      }
    }

    setStudentName(name);
    setStudentLevel(level);
    setCertificates(getLearnerCertificates(name, level));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground selection:bg-amber-400 selection:text-navy">
      <div className="flag-badge h-1 w-full" />

      {/* Clean Spacious Header with Side Menu */}
      <Navbar
        variant="app"
        showTestCta={false}
        showAdminBadge={false}
        customRightElement={
          <Link
            href="/tableau-de-bord"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors inline-flex items-center gap-1 text-xs font-bold border border-slate-200"
            title="Retour au Tableau de bord"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Page Title & Accreditation Banner */}
        <div className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Diplômes Officiels CECRL • Vérifiables en Ligne</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Certificats Officiels de {studentName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Chaque diplôme est délivré sous l&apos;autorité du <strong className="text-amber-300 font-semibold">Coach David Liandja</strong> et comporte un numéro de série unique ainsi qu&apos;un QR Code d&apos;authentification opposable aux universités, ambassades et employeurs en RDC et à l&apos;international.
            </p>
          </div>
        </div>

        {/* Earned Certificates Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <span>Certificats Obtenus &amp; Validés ({certificates.length})</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Format officiel Haute Résolution (A4 Paysage)
            </span>
          </div>

          <div className="grid gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.code}
                className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400/90 shadow-lg relative overflow-hidden transition-all hover:shadow-xl space-y-6"
              >
                {/* Top Certificate Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-black text-2xl">
                      <Award className="w-7 h-7" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          ✓ {cert.mention}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {cert.serialNumber}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {cert.levelTitleFr}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Délivré à : <strong className="text-[#0B1F42] font-black text-sm">{cert.learnerName}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Score & Badge */}
                  <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                    <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                      Score : {cert.score}%
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Délivré le {cert.issuedAt}
                    </span>
                  </div>
                </div>

                {/* Skills breakdown */}
                {cert.competences && cert.competences.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {cert.competences.map((c) => (
                      <div
                        key={c.skill}
                        className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-center"
                      >
                        <p className="text-[10px] uppercase font-bold text-slate-500 truncate">
                          {c.skillFr}
                        </p>
                        <p className="text-sm font-black text-slate-900 mt-0.5">
                          {c.score}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <QrCode className="w-4 h-4 text-slate-700" />
                    <span>Code vérifiable : <strong className="text-slate-900 font-bold">{cert.code}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/verify/${cert.code}?name=${encodeURIComponent(studentName)}`}
                      className="btn-3d-gold py-2.5 px-5 rounded-xl text-xs font-black inline-flex items-center gap-2 shadow"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Consulter le Diplôme Officiel</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Next Levels (Roadmap to B2) */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-500" />
            <span>Paliers Supérieurs à Valider</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* A2 or B1 */}
            <div className="bg-white/80 border border-dashed border-slate-300 rounded-3xl p-5 flex items-start gap-3.5 opacity-75 hover:opacity-100 transition">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Niveau Suivant
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  Certificat d&apos;Anglais — Niveau A2 (Élémentaire)
                </h3>
                <p className="text-xs text-slate-500">
                  Débloquez cet examen en complétant les unités du Niveau A2.
                </p>
                <Link
                  href="/tarifs"
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-block pt-1 hover:underline"
                >
                  Débloquer le Niveau A2 via Afrimoney / Mobile Money →
                </Link>
              </div>
            </div>

            {/* B1 / B2 */}
            <div className="bg-white/80 border border-dashed border-slate-300 rounded-3xl p-5 flex items-start gap-3.5 opacity-75 hover:opacity-100 transition">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Objectif Professionnel
                </span>
                <h3 className="text-sm font-black text-slate-900">
                  Certificat d&apos;Anglais — Niveau B1 &amp; B2 (Avancé)
                </h3>
                <p className="text-xs text-slate-500">
                  Anglais pour entretiens d&apos;embauche, ONGs, bourses et voyages d&apos;affaires.
                </p>
                <Link
                  href="/parcours"
                  className="text-xs font-bold text-primary hover:underline inline-block pt-1"
                >
                  Explorer le cursus complet →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
