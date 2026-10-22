import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  GraduationCap,
  Headphones,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  WifiOff,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-400 selection:text-navy">
      {/* Top Bar with Congolese Flag Accent */}
      <div className="flag-badge h-1 w-full" />

      {/* Clean, Spacious Navigation Header with Side Menu */}
      <Navbar variant="home" showTestCta={true} showAdminBadge={true} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-navy to-[#071328] text-white pt-12 pb-20 px-4">
          {/* Subtle gold glow behind hero */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>🇨🇩 RDC • Évaluation de niveau + 1ère séance offertes !</span>
              </div>

              <h1 className="clamp-hero font-black tracking-tight">
                RÉUSSISSEZ EN ANGLAIS !
                <span className="block text-gold-gradient mt-1">
                  Succeed in English!
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
                {BRAND.subtitle} Une plateforme d&apos;apprentissage interactive
                style <strong className="text-white">Duolingo</strong>, adaptée
                aux réalités de la RDC : connexions lentes, faible consommation
                de données et paiement facile par Mobile Money.
              </p>

              {/* Action Buttons: The 2 Core Onboarding Choices */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/test-de-niveau"
                  className="btn-3d-gold w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl text-sm sm:text-base font-extrabold inline-flex items-center justify-center gap-2.5 text-center shadow-lg active:scale-95 transition-transform"
                >
                  <Compass className="w-5 h-5 text-amber-950 shrink-0" />
                  <span>Passer le test de niveau</span>
                </Link>

                <Link
                  href="/parcours"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 w-full sm:w-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2.5 text-center transition-all active:scale-95"
                >
                  <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Je débute complètement (A1)</span>
                </Link>
              </div>

              {/* Trust Indicators: fluid stack on mobile */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t border-slate-700/60 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Niveau A1 100% gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Mode Éco Données 3G/4G</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Certificat QR vérifiable</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Duolingo App Experience Preview (No coach picture here) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-navy to-slate-950 p-6 rounded-3xl border-2 border-gold/40 shadow-2xl space-y-4">
                {/* Header of preview card */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/50 flex items-center justify-center p-1">
                      <Image
                        src="/icon.png"
                        alt="PA³ Emblem"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">Leçon Active • A1</div>
                      <div className="text-[10px] text-gold font-semibold">Salutations &amp; Présentations</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    En direct
                  </span>
                </div>

                {/* Simulated interactive exercise */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Écoutez et répondez :</span>
                    <span className="text-amber-400 font-bold">⚡ +20 XP</span>
                  </div>

                  {/* Audio stem bubble */}
                  <div className="bg-navy p-3 rounded-xl border border-amber-400/30 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gold text-navy font-black flex items-center justify-center shrink-0 text-base shadow">
                      🔊
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">
                        &laquo; Good morning! How are you doing? &raquo;
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Traduction : Bonjour ! Comment allez-vous ?
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-bold flex items-center justify-between">
                      <span>✓ I&apos;m fine, thank you! And you?</span>
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-medium opacity-60">
                      <span>✕ My name is Kinshasa.</span>
                    </div>
                  </div>
                </div>

                {/* Live indicators */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-base font-black text-gold">🔥 4 jours</div>
                    <div className="text-[10px] text-slate-400">Série active</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-base font-black text-emerald-400">100% Gratuit</div>
                    <div className="text-[10px] text-slate-400">Niveau A1 Débutant</div>
                  </div>
                </div>

                {/* Direct CTA */}
                <Link
                  href="/test-de-niveau"
                  className="w-full btn-duo text-xs sm:text-sm !py-3 text-center block font-black shadow-lg"
                >
                  Faire le test de niveau gratuit
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Core Programs from the Official Flyer */}
        <section id="programmes" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-primary font-black uppercase tracking-widest text-xs">
              Formations ciblées
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              Nos Programmes Spéciaux
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Conçus spécialement pour répondre aux besoins professionnels et
              académiques des Congolais.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Professional & NGOs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Anglais Professionnel & ONGs
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Préparez vos entretiens d&apos;embauche, rédigez un CV en
                anglais percutant, maîtrisez les emails formels et animez des
                réunions avec assurance.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Entretiens d&apos;embauche réussis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>CV & emails professionnels</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Fluency & Conversation */}
            <div className="bg-white p-6 rounded-2xl border-2 border-amber-400 shadow-md relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Populaire
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Fluidité & Conversation
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Parlez sans bloquer, surmontez la peur de faire des fautes et
                corrigez votre accent avec des expressions utiles du quotidien.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Débloquer l&apos;oral en toute confiance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Correction de la prononciation</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Travel & Studies */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-black text-xl mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Voyages & Études à l&apos;étranger
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Postulez à des bourses internationales, préparez votre départ et
                développez vos affaires dans le commerce frontalier anglophone.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium border-t border-slate-100 pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bourses & candidatures d&apos;études</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Commerce transfrontalier (SADC, EAC)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Duolingo-style Learning Path Showcase */}
        <section id="methode" className="py-16 bg-white border-y border-slate-200 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-amber-600 font-black uppercase tracking-wider text-xs">
                  Pédagogie Duolingo Interactive
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
                  Apprenez en vous amusant, 10 minutes par jour
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Chaque leçon combine une vidéo courte (3 à 8 min) sous-titrée
                  en français et en anglais avec des exercices interactifs
                  stimulants :
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-primary shrink-0">
                      <Play className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Vidéos avec contexte congolais
                      </h4>
                      <p className="text-xs text-slate-600">
                        Exemples vivants au marché de Gambela, à l&apos;UNIKIN,
                        dans le taxi-bus et au bureau.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Exercices variés & immersifs
                      </h4>
                      <p className="text-xs text-slate-600">
                        QCM, textes à trous, paires de mots, phrases à ordonner,
                        écoute et répétition vocale.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Validation par palier (≥ 70%)
                      </h4>
                      <p className="text-xs text-slate-600">
                        Vous ne passez à l&apos;étape suivante qu&apos;une fois
                        la notion réellement acquise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <Link
                    href="/lecon/a1-salutations"
                    className="btn-3d-primary px-6 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2"
                  >
                    <span>Essayer la 1ère leçon maintenant</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Duolingo Visual Path Preview */}
              <div className="lg:col-span-6 bg-slate-100 p-6 rounded-3xl border border-slate-200">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-700">
                        Unité 1 : Premiers pas (Niveau A1)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      20 XP par leçon
                    </span>
                  </div>

                  {/* Visual nodes */}
                  <div className="flex flex-col items-center gap-4 py-2">
                    <Link
                      href="/lecon/a1-salutations"
                      className="w-16 h-16 rounded-full btn-3d-gold flex items-center justify-center text-xl shadow-md transform hover:scale-110 transition-transform"
                      title="Leçon 1 : Les salutations"
                    >
                      👋
                    </Link>
                    <span className="text-xs font-bold text-slate-800">
                      1. Les salutations
                    </span>

                    <div className="w-1 h-6 bg-amber-400 rounded-full" />

                    <Link
                      href="/lecon/a1-se-presenter"
                      className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-lg shadow hover:scale-105 transition-transform"
                      title="Leçon 2 : Se présenter"
                    >
                      🙋
                    </Link>
                    <span className="text-xs font-semibold text-slate-600">
                      2. Se présenter
                    </span>

                    <div className="w-1 h-6 bg-slate-300 rounded-full" />

                    <Link
                      href="/lecon/a1-nombres-0-20"
                      className="w-14 h-14 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-lg hover:scale-105 transition-transform"
                      title="Leçon 3 : Les nombres 0 à 20"
                    >
                      🔢
                    </Link>
                    <span className="text-xs font-semibold text-slate-500">
                      3. Nombres 0–20
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coach David Liandja Section */}
        <section id="coach" className="py-12 sm:py-16 px-4 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-navy via-slate-900 to-navy-dark text-white rounded-3xl p-5 sm:p-8 md:p-12 border border-amber-400/30 shadow-xl grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-56 sm:w-64 rounded-3xl overflow-hidden border-4 border-gold shadow-2xl bg-slate-900 group">
                <Image
                  src="/images/coach-david.jpg?v=1"
                  alt="Coach David Liandja — Fondateur & Head Coach PA³ English Academy"
                  width={320}
                  height={420}
                  priority
                  unoptimized
                  className="w-full h-auto object-cover object-top group-hover:scale-105 transition-transform duration-500 block"
                />
                <div className="absolute bottom-3 inset-x-3 text-center bg-slate-950/85 backdrop-blur-md py-2 px-3 rounded-xl border border-gold/40 shadow">
                  <span className="text-gold font-black text-xs uppercase tracking-wider block">Coach David Liandja</span>
                  <p className="text-[10px] text-slate-300">Kinshasa • En ligne & Présentiel</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="inline-block bg-amber-400 text-amber-950 font-black text-xs uppercase px-3 py-1 rounded-full">
                Votre Formateur
              </div>
              <h2 className="clamp-title font-black">
                {BRAND.coach.name}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Passionné par l&apos;autonomisation linguistique de la jeunesse et
                des cadres congolais. À travers{" "}
                <strong className="text-white">PA³ English Academy</strong>,
                Coach David vous accompagne avec bienveillance pour briser les
                blocages et transformer votre anglais en atout professionnel.
              </p>

              <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs font-medium text-slate-200 pt-1">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp : {BRAND.coach.whatsapp}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Appel direct : {BRAND.coach.phone}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <span>📍 {BRAND.coach.locations}</span>
                </span>
              </div>

              <div className="pt-2">
                <a
                  href={BRAND.coach.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d-gold w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 text-center"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Contacter directement Coach David</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Money Payment Section */}
        <section id="paiement" className="py-14 bg-slate-100 border-t border-slate-200 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-primary font-black uppercase text-xs tracking-wider">
              Accessible à tous
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Prix flexible et paiement par Mobile Money
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Pas besoin de carte internationale. Réglez simplement par vos
              opérateurs préférés en RDC :
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <span>M-Pesa (Vodacom)</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span>Airtel Money</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span>Orange Money</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span className="w-3 h-3 rounded-full bg-blue-700" />
                <span>Cartes Visa / Mastercard</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy-dark text-slate-400 text-xs py-10 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo variant="dark" size="sm" withSlogan />

          <div className="text-center md:text-right space-y-1">
            <p className="text-slate-300 font-medium">
              © 2026 {BRAND.name}. Tous droits réservés.
            </p>
            <p>
              Kinshasa, République Démocratique du Congo 🇨🇩 • Email :{" "}
              <a
                href={`mailto:${BRAND.coach.email}`}
                className="text-amber-400 hover:underline"
              >
                {BRAND.coach.email}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
