"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("pa3_user_logged_in", "true");
        localStorage.setItem("pa3_user_email", email.trim().toLowerCase());
        localStorage.setItem("pa3_user_name", fullName || "Apprenant");
        localStorage.setItem("pa3_user_city", city);
        localStorage.setItem("pa3_daily_goal", String(dailyGoal));

        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/test-de-niveau";
        router.push(redirect);
      }
    }, 500);
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-sm font-medium outline-none"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-sm font-medium outline-none bg-white"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-sm font-medium outline-none"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-sm font-medium outline-none"
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
