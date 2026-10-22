"use client";

import { useState } from "react";
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
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Navbar } from "@/components/navigation/Navbar";
import { BRAND } from "@/lib/brand";

export default function CertificatsPage() {
  const [earnedCerts] = useState([
    {
      code: "PA3-A1-DEMO-2026",
      title: "Certificat d'Anglais — Niveau A1 (Débutant)",
      score: 88,
      date: "21 Octobre 2026",
      status: "Validé avec mention",
    },
  ]);

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
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Diplômes et reconnaissances officielles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Mes Certificats PA³ English Academy
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Tous vos certificats comportent un identifiant unique et un QR Code
            permettant à vos employeurs et universités de vérifier leur
            authenticité en ligne.
          </p>
        </div>

        {/* Earned certificates grid */}
        <div className="grid gap-4">
          {earnedCerts.map((cert) => (
            <div
              key={cert.code}
              className="bg-white p-6 rounded-3xl border-2 border-amber-400 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-md font-black text-xl">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {cert.status}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Score : <strong>{cert.score}%</strong> • Délivré le {cert.date} • Code :{" "}
                    <span className="font-mono font-bold text-slate-700">{cert.code}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/verify/${cert.code}`}
                  className="flex-1 sm:flex-initial btn-3d-primary py-2.5 px-4 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Consulter & Imprimer</span>
                </Link>
              </div>
            </div>
          ))}

          {/* Locked Next Level Certificate */}
          <div className="bg-slate-100 p-6 rounded-3xl border border-dashed border-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-80">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                  À débloquer
                </span>
                <h3 className="text-base font-bold text-slate-700">
                  Certificat d&apos;Anglais — Niveau A2 (Élémentaire)
                </h3>
                <p className="text-xs text-slate-400">
                  Débloquez cet examen en complétant les unités du Niveau A2.
                </p>
              </div>
            </div>

            <Link
              href="/parcours"
              className="text-xs font-bold text-primary hover:underline"
            >
              Voir le parcours →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
