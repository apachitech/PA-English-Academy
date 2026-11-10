"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { features } from "@/lib/env";
import {
  isEmailRegistered,
  registerNewLearner,
  initiateGoogleSignIn,
  loginLearnerWithGoogle,
} from "@/lib/auth-learner";
import { toast } from "sonner";

const DRC_CITIES = [
  "Kinshasa",
  "Lubumbashi",
  "Goma",
  "Bukavu",
  "Matadi",
  "Kisangani",
  "Kananga",
  "Mbuji-Mayi",
  "Kolwezi",
  "Autre ville / Diaspora",
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("Kinshasa");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);

    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const redirect = params?.get('redirect') || '/test-de-niveau';

    const result = await initiateGoogleSignIn(redirect);

    if (result.mode === 'demo') {
      toast.info('Mode Démo : Création de compte simulée avec Google.');
      setTimeout(() => {
        setIsGoogleLoading(false);
        loginLearnerWithGoogle({
          email: email.trim() || 'nouvel.apprenant@gmail.com',
          name: fullName.trim() || 'Nouvel Apprenant (Google)',
          city: city || 'Kinshasa',
          avatarUrl: 'emoji:🎓',
        });
        toast.success('Compte créé avec succès via Google !');
        router.push(redirect);
      }, 450);
      return;
    }

    if (!result.success) {
      setIsGoogleLoading(false);
      toast.error(result.error || 'Impossible de créer un compte avec Google.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateEmail(null);

    const cleanEmail = email.trim().toLowerCase();

    // 🚨 RESTRICTION: Verify if email already exists in the system
    if (isEmailRegistered(cleanEmail)) {
      setErrorMessage(
        `L'adresse e-mail « ${cleanEmail} » existe déjà dans notre système. Un compte apprenant est déjà actif avec cette adresse.`
      );
      setDuplicateEmail(cleanEmail);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const reg = registerNewLearner({
        email: cleanEmail,
        name: fullName || "Apprenant",
        city,
        password,
        dailyGoal,
      });

      setIsLoading(false);

      if (!reg.success) {
        setErrorMessage(reg.error || "Impossible de créer le compte.");
        if (reg.error && reg.error.includes("déjà enregistrée")) {
          setDuplicateEmail(cleanEmail);
        }
        return;
      }

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/test-de-niveau";
        router.push(redirect);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-foreground selection:bg-amber-400 selection:text-navy">
      <div className="flag-badge h-1.5 w-full" />

      {/* Header */}
      <header className="p-4 flex items-center justify-between max-w-md mx-auto w-full">
        <Link
          href="/"
          className="p-2 rounded-xl hover:bg-slate-200/60 text-slate-600 transition-colors"
          title="Accueil"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Logo size="sm" withSlogan={false} />
        <div className="w-9" />
      </header>

      {/* Register Card */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto p-4 sm:p-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 animate-pop">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Niveau A1 100% Gratuit</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Créer mon compte apprenant
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Rejoignez les apprenants de la PA³ English Academy en RDC.
            </p>
          </div>

          {/* Duplicate Email Restriction Notification Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-slate-900 space-y-3 shadow-sm animate-pop">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                    ⚠️ Compte Déjà Existant
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {errorMessage}
                  </p>
                </div>
              </div>

              {duplicateEmail && (
                <div className="pt-2.5 border-t border-amber-300 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-600">
                    C&apos;est votre adresse ?
                  </span>
                  <Link
                    href={`/connexion?email=${encodeURIComponent(duplicateEmail)}`}
                    className="btn-3d-gold !py-1.5 !px-3 text-xs font-black inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Se connecter maintenant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Nom complet
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Patrick Ilunga"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-base sm:text-sm font-medium outline-none"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Ville de résidence
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-base sm:text-sm font-medium outline-none bg-white"
                >
                  {DRC_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@unikin.ac.cd"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-base sm:text-sm font-medium outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-base sm:text-sm font-medium outline-none"
                />
              </div>
            </div>

            {/* Daily Goal Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700">
                Votre objectif quotidien :
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDailyGoal(m)}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      dailyGoal === m
                        ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full btn-3d-gold py-3.5 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 mt-4 shadow"
            >
              <span>{isLoading ? "Création du compte..." : "Créer mon compte"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google Auth Button (if enabled) */}
          {features.googleAuth && (
            <div className="space-y-3 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  ou
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              <button
                type="button"
                disabled={isGoogleLoading || isLoading}
                onClick={handleGoogleRegister}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? "Création en cours..." : "S'inscrire avec Google"}</span>
              </button>
            </div>
          )}

          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            Déjà inscrit(e) ?{" "}
            <Link
              href="/connexion"
              className="text-primary font-bold hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
