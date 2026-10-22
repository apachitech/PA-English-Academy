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
  Phone,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { BRAND } from "@/lib/brand";
import { features } from "@/lib/env";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("pa3_user_logged_in", "true");
        localStorage.setItem("pa3_user_email", email.trim().toLowerCase());
        localStorage.setItem("pa3_user_name", email.split("@")[0] || "Apprenant");
        
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/tableau-de-bord";
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

      {/* Login Card */}
      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto p-4 sm:p-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6 animate-pop">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900">
              Connexion à l&apos;Académie
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Retrouvez vos leçons, vos streaks et vos certificats.
            </p>
          </div>

          {/* Toggle Email vs Phone OTP (if feature enabled) */}
          {features.phoneOtp && (
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode("email")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === "email"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500"
                }`}
              >
                Par Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMode === "phone"
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500"
                }`}
              >
                Par SMS / Téléphone
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "email" ? (
              <>
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

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700">
                      Mot de passe
                    </label>
                    <a
                      href="#"
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Oublié ?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-base sm:text-sm font-medium outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Numéro de téléphone en RDC (+243)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+243 81 234 5678"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-primary text-base sm:text-sm font-medium outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-3d-gold py-3.5 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 mt-2 shadow"
            >
              <span>{isLoading ? "Connexion..." : "Se connecter"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Google Auth Button (if enabled) */}
          {features.googleAuth && (
            <div className="space-y-3 pt-2">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase">
                  ou
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continuer avec Google</span>
              </button>
            </div>
          )}

          {/* Signup link */}
          <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
            Nouveau sur l&apos;Académie ?{" "}
            <Link
              href="/inscription"
              className="text-primary font-bold hover:underline"
            >
              Créer un compte gratuit
            </Link>
          </div>

          {/* Admin Portal link */}
          <div className="text-center text-[11px] text-slate-400 pt-1">
            <Link
              href="/admin"
              className="text-slate-500 hover:text-amber-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>🔒 Espace Administrateur (Coach David)</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
