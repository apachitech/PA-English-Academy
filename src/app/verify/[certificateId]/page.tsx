import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { SAMPLE_CERTIFICATES, resolveCertificate } from "@/lib/domain/certificates";
import { ModernCertificate } from "@/components/certificates/ModernCertificate";

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
  const cert = resolveCertificate(certificateId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-foreground selection:bg-amber-400 selection:text-navy print:bg-white print:p-0">
      {/* Top flag bar (Hidden on print) */}
      <div className="flag-badge h-1.5 w-full print:hidden" />

      {/* Header (Hidden on print) */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs print:hidden">
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
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
        <ModernCertificate initialCert={cert} />
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="print:hidden border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>
          PA³ English Academy • Parler Anglais Avec Assurance • Kinshasa, RDC &copy; 2026.
        </p>
      </footer>
    </div>
  );
}
