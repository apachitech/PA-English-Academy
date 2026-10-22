"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Shield,
  CreditCard,
  Camera,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  BookOpen,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navigation/Navbar";
import { TokenSection } from "@/components/profile/TokenSection";
import { BRAND } from "@/lib/brand";
import {
  isLearnerAuthenticated,
  getLearnerProfile,
  updateLearnerProfile,
  changeLearnerPassword,
  getLearnerProgressStats,
  logoutLearner,
  LearnerProfile,
  LearnerProgressStats,
} from "@/lib/auth-learner";
import { isAdminAuthenticated, isValidAdminEmail, logoutAdmin } from "@/lib/auth-admin";

// Preset illustrated avatars for Congolese learners
const PRESET_AVATARS = [
  { id: "avatar-1", emoji: "🦁", label: "Léopard de Kinshasa", bg: "bg-amber-500 text-amber-950" },
  { id: "avatar-2", emoji: "🎓", label: "Académicien PA³", bg: "bg-blue-600 text-white" },
  { id: "avatar-3", emoji: "🚀", label: "Pionnier RDC", bg: "bg-emerald-600 text-white" },
  { id: "avatar-4", emoji: "⚡", label: "Rapide & Audacieux", bg: "bg-yellow-400 text-yellow-950" },
  { id: "avatar-5", emoji: "👑", label: "Leader d'Avenir", bg: "bg-purple-600 text-white" },
  { id: "avatar-6", emoji: "🌍", label: "Citoyen du Monde", bg: "bg-teal-600 text-white" },
];

const DRC_CITIES = [
  "Kinshasa",
  "Lubumbashi",
  "Goma",
  "Bukavu",
  "Kisangani",
  "Matadi",
  "Mbuji-Mayi",
  "Kolwezi",
  "Kananga",
  "Autre ville / Diaspora",
];

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [stats, setStats] = useState<LearnerProgressStats | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "settings" | "security" | "subscription" | "avatar" | "tokens"
  >("overview");

  // Editable settings state
  const [name, setName] = useState("");
  const [city, setCity] = useState("Kinshasa");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [dailyGoalMin, setDailyGoalMin] = useState(15);
  const [dataSaver, setDataSaver] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Security / Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Load profile & stats on mount
  useEffect(() => {
    const auth = isLearnerAuthenticated();
    setIsLoggedIn(auth);

    if (auth) {
      const p = getLearnerProfile();
      const s = getLearnerProgressStats();
      if (p) {
        setProfile(p);
        setName(p.name);
        setCity(p.city || "Kinshasa");
        setPhone(p.phone || "");
        setBio(p.bio || "");
        setDailyGoalMin(p.dailyGoalMin || 15);
        setDataSaver(p.dataSaver || false);

        // Check if the current user profile is an Admin
        const userIsAdmin = isValidAdminEmail(p.email) || isAdminAuthenticated();
        setIsAdmin(userIsAdmin);
      }
      setStats(s);
    } else {
      setIsAdmin(isAdminAuthenticated());
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const requestedTab = params.get("tab");
      if (
        requestedTab === "overview" ||
        requestedTab === "settings" ||
        requestedTab === "security" ||
        requestedTab === "subscription" ||
        requestedTab === "avatar" ||
        requestedTab === "tokens"
      ) {
        setActiveTab(requestedTab);
      }
    }

    setIsLoading(false);
  }, []);

  // Quick Demo Login for testing
  const handleQuickDemoLogin = () => {
    localStorage.removeItem("pa3_admin_authenticated");
    localStorage.removeItem("pa3_admin_user");
    localStorage.setItem("pa3_user_logged_in", "true");
    localStorage.setItem("pa3_user_email", "grace.mwamba@pa3.cd");
    localStorage.setItem("pa3_user_name", "Grace Mwamba");
    localStorage.setItem("pa3_user_city", "Kinshasa");
    localStorage.setItem("pa3_user_bio", "Étudiante à l'UPC, je prépare mes entretiens professionnels en anglais.");
    localStorage.setItem("pa3_daily_goal", "15");
    localStorage.setItem("pa3_user_plan", "Pass Découverte A1 (Actif)");
    
    setIsLoggedIn(true);
    setIsAdmin(false);
    const p = getLearnerProfile();
    const s = getLearnerProgressStats();
    if (p) {
      setProfile(p);
      setName(p.name);
      setCity(p.city || "Kinshasa");
      setBio(p.bio || "");
    }
    setStats(s);
    toast.success("Connecté en mode apprenant (Grace Mwamba) !");
  };

  // Quick Demo Login as Administrator (Coach David Liandja)
  const handleAdminDemoLogin = () => {
    localStorage.setItem("pa3_admin_authenticated", "true");
    localStorage.setItem(
      "pa3_admin_user",
      JSON.stringify({
        name: "Coach David Liandja",
        email: "liandjadavid@gmail.com",
        role: "admin",
        avatar: "CD",
        authenticatedAt: new Date().toISOString(),
      })
    );
    localStorage.setItem("pa3_user_logged_in", "true");
    localStorage.setItem("pa3_user_email", "liandjadavid@gmail.com");
    localStorage.setItem("pa3_user_name", "Coach David Liandja");
    localStorage.setItem("pa3_user_city", "Kinshasa (Gombe)");
    localStorage.setItem(
      "pa3_user_bio",
      "Fondateur & Head Coach PA³ English Academy. Parler anglais avec assurance !"
    );
    localStorage.setItem("pa3_daily_goal", "20");
    localStorage.setItem("pa3_user_plan", "Direction Pédagogique (Accès Total)");

    setIsLoggedIn(true);
    setIsAdmin(true);
    const p = getLearnerProfile();
    const s = getLearnerProgressStats();
    if (p) {
      setProfile(p);
      setName(p.name);
      setCity(p.city || "Kinshasa (Gombe)");
      setBio(p.bio || "");
    }
    setStats(s);
    toast.success("Connecté au profil Administrateur (Coach David Liandja) !");
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      const updated = updateLearnerProfile({
        name,
        city,
        phone,
        bio,
        dailyGoalMin,
        dataSaver,
      });
      setProfile(updated);
      toast.success("Vos modifications ont été enregistrées avec succès !");
    } catch {
      toast.error("Erreur lors de la sauvegarde du profil.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setIsSavingPassword(true);
    const result = changeLearnerPassword(oldPassword, newPassword);

    if (result.success) {
      toast.success("Mot de passe mis à jour avec succès !");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordError(result.error || "Erreur lors de la modification du mot de passe.");
    }
    setIsSavingPassword(false);
  };

  // Handle Photo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const updated = updateLearnerProfile({ avatarUrl: base64 });
      setProfile(updated);
      toast.success("Photo de profil mise à jour !");
    };
    reader.readAsDataURL(file);
  };

  // Select Preset Avatar
  const handleSelectPresetAvatar = (avatarEmoji: string) => {
    const dataUrl = `emoji:${avatarEmoji}`;
    const updated = updateLearnerProfile({ avatarUrl: dataUrl });
    setProfile(updated);
    toast.success(`Avatar ${avatarEmoji} sélectionné !`);
  };

  // Remove Avatar
  const handleRemoveAvatar = () => {
    const updated = updateLearnerProfile({ avatarUrl: "" });
    setProfile(updated);
    toast.info("Photo de profil retirée.");
  };

  // Logout
  const handleLogout = () => {
    logoutLearner();
    logoutAdmin();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setProfile(null);
    toast.info("Vous avez été déconnecté.");
    router.push("/connexion");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Not logged in view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar variant="app" showTestCta={true} />
        <main className="flex-1 max-w-lg mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner mb-6 border border-amber-200">
            👤
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-3">
            Espace Personnel Apprenant
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-3">
            Connectez-vous pour voir votre profil
          </h1>
          <p className="text-sm text-slate-600 mb-8 max-w-sm">
            Accédez à vos statistiques de progression, gérez vos abonnements Mobile Money SasPay, vos certificats et personnalisez votre compte.
          </p>

          <div className="w-full space-y-3">
            <Link
              href="/connexion"
              className="btn-3d-gold w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
            >
              <Lock className="w-4 h-4" />
              <span>Se Connecter</span>
            </Link>
            <Link
              href="/inscription"
              className="btn-3d-navy w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
            >
              <User className="w-4 h-4" />
              <span>Créer un Compte Gratuit</span>
            </Link>
            <button
              onClick={handleQuickDemoLogin}
              type="button"
              className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 underline transition"
            >
              Tester profil apprenant (Grace Mwamba)
            </button>
            <button
              onClick={handleAdminDemoLogin}
              type="button"
              className="w-full py-2 text-xs font-bold text-amber-700 hover:text-amber-900 underline transition flex items-center justify-center gap-1.5"
            >
              <span>👑 Tester profil administrateur (Coach David Liandja)</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Render avatar helper
  const renderAvatar = () => {
    if (profile?.avatarUrl) {
      if (profile.avatarUrl.startsWith("emoji:")) {
        const emoji = profile.avatarUrl.replace("emoji:", "");
        return (
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl sm:text-5xl shadow-md">
            {emoji}
          </div>
        );
      }
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-amber-400 shadow-md"
        />
      );
    }
    return (
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-navy to-slate-800 text-white flex items-center justify-center font-black text-2xl sm:text-3xl border-2 border-amber-400 shadow-md">
        {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "PA"}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar variant="app" showTestCta={false} showAdminBadge={isAdmin} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Top Header Card */}
        <section className="bg-gradient-to-br from-navy via-slate-900 to-navy text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
            {/* Avatar with quick edit trigger */}
            <div className="relative group shrink-0">
              {renderAvatar()}
              <button
                onClick={() => setActiveTab("avatar")}
                className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-2 rounded-xl shadow-lg hover:bg-amber-300 transition active:scale-95"
                title="Changer la photo de profil"
                aria-label="Changer la photo de profil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {profile?.name}
                </h1>
                {isAdmin ? (
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <span>👑</span>
                    <span>Admin • Coach David</span>
                  </span>
                ) : (
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Niveau {stats?.level || "A1"}
                  </span>
                )}
                <span className="text-base" title="République Démocratique du Congo">
                  🇨🇩
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  {profile?.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {profile?.city || "Kinshasa"}
                </span>
                {profile?.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-sky-400" />
                    {profile.phone}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 italic pt-1 max-w-xl">
                &ldquo;{profile?.bio || "Prêt(e) à parler anglais avec assurance !"}&rdquo;
              </p>
            </div>

            {/* Quick Actions (Dashboard, Admin & Logout) */}
            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl transition inline-flex items-center justify-center gap-1.5 shadow-md border border-amber-500/30 active:scale-95 animate-pop"
                  title="Accéder au panneau de contrôle administrateur"
                >
                  <Shield className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Portail Admin</span>
                </Link>
              )}
              <Link
                href="/tableau-de-bord"
                className="btn-3d-gold !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 border border-white/10"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "overview"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Ma Progression</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "settings"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4 text-sky-400" />
            <span>Paramètres du Compte</span>
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "subscription"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Abonnement &amp; SasPay</span>
          </button>

          <button
            onClick={() => setActiveTab("tokens")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "tokens"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Ticket className="w-4 h-4 text-amber-500" />
            <span>Tokens &amp; Niveaux</span>
          </button>

          <button
            onClick={() => setActiveTab("avatar")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "avatar"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Photo / Avatar</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === "security"
                ? "bg-navy text-white shadow-sm"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Mot de Passe</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW / PROGRESS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Niveau CECRL</span>
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-navy">
                  {stats?.level || "A1"}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Débutant Opérationnel
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Points XP</span>
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {stats?.xp || 60} XP
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Top 15 % des apprenants
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Série Active</span>
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-orange-500">
                  {stats?.streak || 3} Jours
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ne brisez pas la chaîne !
                </p>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Leçons Complétées</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {stats?.completedLessonsCount || 1}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sur le parcours Débutant
                </p>
              </div>
            </div>

            {/* Daily Goal & Plan Progress Banner */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-extrabold text-base sm:text-lg text-navy">
                    Objectif d&apos;Étude Quotidien
                  </h2>
                  <p className="text-xs text-slate-500">
                    {stats?.todayMinutes || 8} min complétées aujourd&apos;hui sur votre cible de {profile?.dailyGoalMin || 15} min
                  </p>
                </div>
                <span className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl self-start sm:self-auto border border-amber-200">
                  {Math.round(((stats?.todayMinutes || 8) / (profile?.dailyGoalMin || 15)) * 100)} % Réalisé
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((stats?.todayMinutes || 8) / (profile?.dailyGoalMin || 15)) * 100)
                    )}%`,
                  }}
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500">
                  Formule actuelle : <strong className="text-navy">{profile?.activePlan || "Accès Gratuit A1"}</strong>
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab("tokens")}
                    className="text-amber-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>🎟️ Réclamer un Token de Niveau</span>
                  </button>
                  <Link
                    href="/tarifs"
                    className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>SasPay Mobile Money</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Links & Certificates Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-navy">Mes Certificats Officiels</h3>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-slate-600">
                  Vos certificats d&apos;aptitude CECRL signés par le Coach David Liandja avec vérification QR Code.
                </p>
                <Link
                  href="/certificats"
                  className="btn-3d-navy !py-2.5 !px-4 text-xs font-bold inline-flex items-center gap-2 w-full justify-center"
                >
                  <span>Voir mes attestations &amp; certificats</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-navy">Badges &amp; Trophées Gagnés</h3>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-xs text-slate-600">
                  Débloquez des récompenses uniques en terminant des séries de leçons sans faute.
                </p>
                <Link
                  href="/badges"
                  className="btn-3d-gold !py-2.5 !px-4 text-xs font-bold inline-flex items-center gap-2 w-full justify-center"
                >
                  <span>Consulter ma vitrine de badges ({stats?.badgesCount || 3})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SETTINGS */}
        {activeTab === "settings" && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-navy">Paramètres du Profil</h2>
              <p className="text-xs text-slate-500">
                Mettez à jour vos informations personnelles pour adapter votre expérience d&apos;apprentissage.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>Nom complet</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition"
                  placeholder="Ex: Naomi Kabamba"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Adresse email</span>
                </label>
                <input
                  type="email"
                  value={profile?.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-base sm:text-sm font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Numéro de téléphone (Mobile Money)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition"
                  placeholder="Ex: +243 81 234 5678"
                />
                <span className="text-[10px] text-slate-400">
                  Utilisé pour la confirmation SMS des transactions SasPay
                </span>
              </div>

              {/* City in DRC */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Ville de résidence (RDC)</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition"
                >
                  {DRC_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio / Personal Goal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-primary" />
                <span>Objectif personnel / Bio</span>
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition resize-none"
                placeholder="Ex: Je souhaite améliorer mon expression orale pour décrocher un emploi dans une ONG internationale à Kinshasa."
              />
            </div>

            {/* Daily Goal Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Objectif d&apos;apprentissage quotidien</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { min: 5, label: "⚡ 5 min / jour", desc: "Découverte décontractée" },
                  { min: 15, label: "🎯 15 min / jour", desc: "Régulier (Recommandé)" },
                  { min: 30, label: "🔥 30 min / jour", desc: "Intensif & Pro" },
                ].map((g) => (
                  <button
                    key={g.min}
                    type="button"
                    onClick={() => setDailyGoalMin(g.min)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      dailyGoalMin === g.min
                        ? "border-amber-400 bg-amber-50 shadow-xs"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-extrabold text-xs sm:text-sm text-navy">{g.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Saver Mode */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-navy">
                  Mode Économie de Données (3G RDC)
                </div>
                <div className="text-xs text-slate-500">
                  Réduit la consommation de mégabytes en chargeant des audios compressés et des affiches légères.
                </div>
              </div>
              <input
                type="checkbox"
                checked={dataSaver}
                onChange={(e) => setDataSaver(e.target.checked)}
                className="w-5 h-5 text-amber-500 rounded accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="btn-3d-gold px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sauvegarder les modifications</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: SUBSCRIPTION & SASPAY PAYMENT INTERACTIVITIES */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Active Subscription Banner */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-navy text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-lg relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5">
                  <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Statut de l&apos;Abonnement
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">
                    {profile?.activePlan || "Accès Gratuit A1 (Palier Débutant)"}
                  </h2>
                  <p className="text-xs text-emerald-200">
                    Validité : <strong className="text-white">{profile?.activePlanExpiry || "Accès Illimité à Vie"}</strong>
                  </p>
                </div>

                <Link
                  href="/tarifs"
                  className="btn-3d-gold !py-3 !px-5 text-xs font-black inline-flex items-center gap-2 shrink-0 shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Gérer ou Changer de Pass</span>
                </Link>
              </div>
            </div>

            {/* Mobile Money Payment Interactivities */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-navy">
                  Paiements &amp; Réinscriptions Mobile Money
                </h3>
                <p className="text-xs text-slate-500">
                  Payez vos cours et vos examens certifiés en Francs Congolais (CDF) ou Dollars (USD) via SasPay.
                </p>
              </div>

              {/* Supported payment networks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: "M-Pesa", code: "Vodacom RDC", color: "border-red-200 bg-red-50 text-red-950" },
                  { name: "Orange Money", code: "Orange RDC", color: "border-orange-200 bg-orange-50 text-orange-950" },
                  { name: "Airtel Money", code: "Airtel RDC", color: "border-rose-200 bg-rose-50 text-rose-950" },
                  { name: "Afrimoney", code: "Africell RDC", color: "border-purple-200 bg-purple-50 text-purple-950" },
                ].map((m) => (
                  <div
                    key={m.name}
                    className={`p-3 rounded-2xl border text-center ${m.color}`}
                  >
                    <div className="font-black text-xs sm:text-sm">{m.name}</div>
                    <div className="text-[10px] opacity-80">{m.code}</div>
                  </div>
                ))}
              </div>

              {/* Interactive payment options */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-extrabold text-sm text-navy flex items-center justify-between">
                    <span>Pass Pro Kinshasa (CECRL A1 à B2)</span>
                    <span className="text-amber-600">25 $ / mois</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Accès illimité à tous les modules interactifs, capsules VOD en HD et 1 séance de pratique orale hebdomadaire avec Coach David.
                  </p>
                  <Link
                    href="/tarifs"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 pt-1"
                  >
                    <span>Activer ce pass via SasPay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-extrabold text-sm text-navy flex items-center justify-between">
                    <span>Attestation &amp; Examen Certifié</span>
                    <span className="text-emerald-600">10 $ unique</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Examen final surveillé en ligne, certification authentifiée avec QR code et validation directe pour vos dossiers d&apos;études et de travail.
                  </p>
                  <Link
                    href="/certificats"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1"
                  >
                    <span>En savoir plus sur la certification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Assistance & WhatsApp Helpdesk */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Besoin d&apos;assistance pour votre paiement ?</span>
                  </div>
                  <p className="text-[11px] text-amber-900">
                    Le Coach David Liandja et notre équipe à Kinshasa sont disponibles sur WhatsApp.
                  </p>
                </div>
                <a
                  href={BRAND.coach.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Contacter le Coach</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LEVEL TOKENS SECTION */}
        {activeTab === "tokens" && (
          <TokenSection
            initialProfile={profile}
            initialStats={stats}
            onStatsUpdate={(newStats) => setStats(newStats)}
          />
        )}

        {/* TAB 4: AVATAR / PHOTO UPLOAD */}
        {activeTab === "avatar" && (
          <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-navy">Photo de Profil &amp; Avatar</h2>
              <p className="text-xs text-slate-500">
                Ajoutez votre propre photo ou choisissez l&apos;un de nos avatars congolais exclusifs.
              </p>
            </div>

            {/* Current avatar preview */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="shrink-0">{renderAvatar()}</div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="font-extrabold text-sm text-navy">
                  Photo actuelle de {profile?.name}
                </div>
                <p className="text-xs text-slate-500 max-w-sm">
                  Formats acceptés : JPG, PNG, WEBP. Taille maximale : 2 Mo.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="btn-3d-gold !py-2 !px-4 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser une photo</span>
                  </button>
                  {profile?.avatarUrl && (
                    <button
                      onClick={handleRemoveAvatar}
                      type="button"
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3 py-2 rounded-xl transition border border-rose-200 cursor-pointer"
                    >
                      Supprimer la photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Preset Congolese Avatars */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-navy">
                Ou choisissez un avatar illustré :
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(av.emoji)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {av.emoji}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-amber-950">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY / PASSWORD CHANGE */}
        {activeTab === "security" && (
          <form
            onSubmit={handleChangePassword}
            className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-xl"
          >
            <div>
              <h2 className="text-lg font-black text-navy">Modifier Votre Mot de Passe</h2>
              <p className="text-xs text-slate-500">
                Choisissez un mot de passe robuste comportant au moins 6 caractères pour sécuriser votre compte.
              </p>
            </div>

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mot de passe actuel (optionnel si premier accès)</span>
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>Nouveau mot de passe</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition"
                  placeholder="Minimum 6 caractères"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>Confirmer le nouveau mot de passe</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:bg-white outline-none transition"
                  placeholder="Répétez le mot de passe"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingPassword}
                className="btn-3d-gold px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSavingPassword ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mise à jour...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mettre à jour le mot de passe</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
