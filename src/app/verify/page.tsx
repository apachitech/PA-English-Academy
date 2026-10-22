"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  GraduationCap,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { SAMPLE_CERTIFICATES } from "@/lib/domain/certificates";

export default function VerificationPortalPage() {
  const router = useRouter();
  const [certCode, setCertCode] = useState("");
  const [learnerName, setLearnerName] = useState("");

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = certCode.trim();
    if (cleanCode) {
      const url = learnerName.trim()
        ? `/verify/${encodeURIComponent(cleanCode)}?name=${encodeURIComponent(learnerName.trim())}`
        : `/verify/${encodeURIComponent(cleanCode)}`;
      router.push(url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground selection:bg-amber-400 selection:text-navy">
      {/* Top DRC Flag bar */}
      <div className="flag-badge h-1.5 w-full" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo size="sm" withSlogan={false} />
          <div className="flex items-center gap-3">
            <Link
              href="/certificats"
              className="text-xs font-bold text-slate-600 hover:text-primary inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Mes Certificats</span>
            </Link>
            <Link
              href="/tableau-de-bord"
              className="btn-3d-gold !py-1.5 !px-3 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Espace Apprenant</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Registre Public d&apos;Authentification CECRL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Vérification Officielle de Certificat d&apos;Anglais
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Consultez instantanément l&apos;authenticité des diplômes délivrés par{" "}
            <strong className="text-amber-300 font-bold">{BRAND.name}</strong> sous la direction du{" "}
            <strong className="text-amber-300 font-bold">{BRAND.coach.name}</strong> à Kinshasa (RDC).
          </p>

          {/* Form */}
          <form
            onSubmit={handleVerify}
            className="pt-4 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={certCode}
                onChange={(e) => setCertCode(e.target.value)}
                placeholder="Ex: PA3-A1-DEMO-2026"
                className="w-full bg-white text-slate-900 placeholder-slate-400 font-mono text-sm font-bold pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              className="btn-3d-gold !py-3.5 !px-6 text-xs font-black rounded-2xl flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Vérifier le diplôme</span>
            </button>
          </form>

          {/* Quick Examples */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Exemples vérifiables :</span>
            {Object.keys(SAMPLE_CERTIFICATES).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCertCode(code)}
                className="text-amber-300 font-mono font-bold hover:underline bg-white/10 px-2 py-0.5 rounded-md cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Methods of Verification Explanation */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              Comment vérifier l&apos;authenticité d&apos;un certificat ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Trois méthodes simples et immédiates mises à disposition des recruteurs, ambassades et universités.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 pt-2">
            {/* Method 1: QR Code */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                Méthode 1 • Recommandée
              </span>
              <h3 className="text-base font-black text-slate-900">
                Scan du QR Code Smartphone
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pointez l&apos;appareil photo de n&apos;importe quel téléphone (Android ou iPhone) sur le QR Code figurant en bas à droite du diplôme papier ou PDF. Le certificat officiel s&apos;ouvre instantanément.
              </p>
            </div>

            {/* Method 2: Online Search */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full inline-block">
                Méthode 2 • Saisie Manuelle
              </span>
              <h3 className="text-base font-black text-slate-900">
                Identifiant Unique &amp; Registre
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Saisissez l&apos;identifiant officiel (ex: <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">PA3-A1-DEMO-2026</code>) ou le numéro de série dans la barre de recherche ci-dessus pour afficher la fiche officielle.
              </p>
            </div>

            {/* Method 3: Direct Link */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                Méthode 3 • Lien Sécurisé
              </span>
              <h3 className="text-base font-black text-slate-900">
                Lien HTTPS Public
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque certificat possède une URL permanente infalsifiable hébergée sur <strong className="text-slate-800">pa-english-academy.vercel.app/verify/[code]</strong> consultable 24h/24 sans nécessiter de mot de passe.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Authenticity Guarantees */}
        <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Éléments de sécurité infalsifiables présents sur chaque certificat officiel
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Signature certifiée</strong> du Head Coach David Liandja (Kinshasa, RDC).</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Sceau 3D embossé</strong> aux armoiries de PA³ English Academy.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Numéro de série unique (S/N)</strong> cryptographique indexé au registre.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-3 rounded-2xl border border-slate-200/70">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Ventilation des 4 compétences CECRL</strong> (Speaking, Listening, Reading, Grammar).</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          PA³ English Academy • Parler Anglais Avec Assurance • Kinshasa, RDC &copy; 2026.
        </p>
      </footer>
    </div>
  );
}
