import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  GraduationCap,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { SAMPLE_CERTIFICATES } from "@/lib/domain/certificates";
import { PrintButton } from "@/components/certificates/PrintButton";

export async function generateStaticParams() {
  return Object.keys(SAMPLE_CERTIFICATES).map((certificateId) => ({
    certificateId,
  }));
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const cert =
    SAMPLE_CERTIFICATES[certificateId.toUpperCase()] || {
      code: certificateId.toUpperCase(),
      learnerName: "Apprenant PA³ Academy",
      levelCode: "A1" as const,
      levelTitleFr: "Niveau A1 — Débutant",
      score: 85,
      issuedAt: "2026-10-21",
      academyName: BRAND.name,
      sloganFr: BRAND.slogan,
      coachName: BRAND.coach.name,
      coachTitle: "Head Coach & Fondateur",
      qrUrl: `http://localhost:3000/verify/${certificateId.toUpperCase()}`,
    };

  const whatsappShareText = encodeURIComponent(
    `🎓 J'ai obtenu mon Certificat officiel d'anglais (${cert.levelTitleFr}) à PA³ English Academy avec ${cert.score}% de score ! Vérifiez mon diplôme ici : ${cert.qrUrl}`,
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-foreground selection:bg-amber-400 selection:text-navy">
      {/* Top flag bar */}
      <div className="flag-badge h-1.5 w-full" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo size="sm" withSlogan={false} />
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-primary"
          >
            Accueil de l&apos;Académie
          </Link>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Verification Status Banner */}
        <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between gap-3 animate-pop">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-100">
                Registre officiel RDC • Vérification instantanée
              </p>
              <h1 className="text-base sm:text-lg font-black leading-tight">
                Certificat Authentique Vérifié
              </h1>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white/20 px-2.5 py-1 rounded-lg">
            {cert.code}
          </span>
        </div>

        {/* Certificate Display Card (Printable & Viewable) */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border-4 border-amber-400/80 shadow-2xl relative overflow-hidden space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Subtle watermark background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
            <span className="text-[140px] font-black tracking-widest text-slate-900">
              PA³
            </span>
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b border-slate-200 pb-6">
            <div className="flex justify-center mb-2">
              <Logo size="md" withSlogan={false} linkToHome={false} />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-700">
              {BRAND.slogan} • RÉPUBLIQUE DÉMOCRATIQUE DU CONGO 🇨🇩
            </p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
              CERTIFICAT D&apos;ACCOMPLISSEMENT
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Ce certificat officiel atteste que l&apos;apprenant(e) ci-dessous a
              réussi avec succès l&apos;examen de validation :
            </p>
          </div>

          {/* Learner Name & Achievement */}
          <div className="text-center space-y-3 py-2">
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              DÉCERNÉ À
            </p>
            <p className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              {cert.learnerName}
            </p>
            <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full" />
            <p className="text-base sm:text-lg text-slate-700 max-w-lg mx-auto font-medium leading-relaxed">
              Pour la maîtrise validée du{" "}
              <strong className="text-slate-900">{cert.levelTitleFr}</strong>{" "}
              selon le Cadre Européen Commun de Référence pour les Langues (CECRL)
              avec un score de{" "}
              <strong className="text-emerald-700 font-black">{cert.score}%</strong>.
            </p>
          </div>

          {/* Signatures & Seal Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 items-end border-t border-slate-200 pt-8 text-center sm:text-left">
            {/* Signature 1: Coach */}
            <div className="space-y-1">
              <div className="h-12 flex items-end">
                <span className="font-serif italic text-lg text-slate-800 tracking-wider">
                  David Liandja
                </span>
              </div>
              <div className="w-full border-t border-slate-400" />
              <p className="text-xs font-bold text-slate-900">{cert.coachName}</p>
              <p className="text-[10px] text-slate-500">{cert.coachTitle}</p>
            </div>

            {/* Official Seal Badge */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex flex-col items-center justify-center border-4 border-amber-300 shadow-md">
                <Sparkles className="w-4 h-4 mb-0.5" />
                <span>OFFICIEL</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Kinshasa, RDC
              </span>
            </div>

            {/* QR Code Verification Link */}
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-end space-y-1">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <p className="text-[10px] text-slate-400">Scan QR pour vérification</p>
              <p className="text-[10px] font-mono text-slate-500 font-bold">
                Délivré le : {cert.issuedAt}
              </p>
            </div>
          </div>
        </div>

        {/* Share & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <a
            href={`https://wa.me/?text=${whatsappShareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-success py-3 px-5 rounded-xl text-xs font-extrabold inline-flex items-center gap-2 shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Partager sur WhatsApp</span>
          </a>

          <div className="flex items-center gap-2">
            <PrintButton />
            <Link
              href="/tableau-de-bord"
              className="btn-3d-primary py-3 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Mon tableau de bord</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
