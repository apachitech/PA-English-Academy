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
import { isEmailRegistered, registerNewLearner } from "@/lib/auth-learner";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateEmail, setDuplicateEmail] = useState<string | null>(null);

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
              disabled={isLoading}
              className="w-full btn-3d-gold py-3.5 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 mt-4 shadow"
            >
              <span>{isLoading ? "Création du compte..." : "Créer mon compte"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

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
