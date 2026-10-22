"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Download,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  PricingPlan,
  PaymentMethodConfig,
  getStoredPricingPlans,
  savePricingPlans,
  getStoredPaymentMethods,
  savePaymentMethods,
  resetPricingPlansToDefault,
  INITIAL_PRICING_PLANS,
  DEFAULT_PAYMENT_METHODS,
} from "@/lib/domain/pricing";

interface PlanFormData {
  title: string;
  levelBadge: string;
  priceUsd: number;
  priceCdf: string;
  isPopular: boolean;
  isFree: boolean;
  active: boolean;
  duration: string;
  description: string;
  featuresText: string;
  ctaLabel: string;
}

const EMPTY_FORM: PlanFormData = {
  title: "",
  levelBadge: "Nouveau",
  priceUsd: 10,
  priceCdf: "28 000 FC",
  isPopular: false,
  isFree: false,
  active: true,
  duration: "Paiement Unique • À vie",
  description: "",
  featuresText: "Accès complet aux leçons\nExercices interactifs & écoute audio\nCertificat officiel de réussite",
  ctaLabel: "Souscrire maintenant",
};

export function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>(INITIAL_PRICING_PLANS);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(DEFAULT_PAYMENT_METHODS);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(EMPTY_FORM);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setPlans(getStoredPricingPlans());
    setPaymentMethods(getStoredPaymentMethods());
  }, []);

  // Save plans helper
  const updateAndSavePlans = (newPlans: PricingPlan[]) => {
    setPlans(newPlans);
    savePricingPlans(newPlans);
  };

  // Save payment methods helper
  const updateAndSavePaymentMethods = (newMethods: PaymentMethodConfig[]) => {
    setPaymentMethods(newMethods);
    savePaymentMethods(newMethods);
  };

  // Toggle active status of a plan
  const handleTogglePlanActive = (planId: string) => {
    const updated = plans.map((p) =>
      p.id === planId ? { ...p, active: p.active === false ? true : false } : p
    );
    updateAndSavePlans(updated);
    toast.success("Statut de visibilité du plan mis à jour.");
  };

  // Toggle payment provider (Afrimoney, M-Pesa, etc.)
  const handleTogglePaymentMethod = (methodId: string) => {
    const updated = paymentMethods.map((m) =>
      m.id === methodId ? { ...m, enabled: !m.enabled } : m
    );
    updateAndSavePaymentMethods(updated);
    const target = updated.find((m) => m.id === methodId);
    toast.success(`${target?.name} (${target?.operator}) : ${target?.enabled ? "Activé" : "Désactivé"}`);
  };

  // Open Edit Modal
  const handleOpenEdit = (plan: PricingPlan) => {
    setEditingPlanId(plan.id);
    setFormData({
      title: plan.title,
      levelBadge: plan.levelBadge,
      priceUsd: plan.priceUsd,
      priceCdf: plan.priceCdf,
      isPopular: !!plan.isPopular,
      isFree: !!plan.isFree,
      active: plan.active !== false,
      duration: plan.duration || "Paiement Unique",
      description: plan.description,
      featuresText: plan.features.join("\n"),
      ctaLabel: plan.ctaLabel,
    });
  };

  // Submit Create Plan
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPlan: PricingPlan = {
      id,
      title: formData.title.trim(),
      levelBadge: formData.levelBadge.trim(),
      priceUsd: Number(formData.priceUsd),
      priceCdf: formData.priceCdf.trim(),
      isPopular: formData.isPopular,
      isFree: formData.isFree,
      active: formData.active,
      duration: formData.duration.trim(),
      description: formData.description.trim(),
      features: formData.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      ctaLabel: formData.ctaLabel.trim() || `Souscrire (${formData.priceUsd} $)`,
    };

    const updated = [...plans, newPlan];
    updateAndSavePlans(updated);
    setIsCreateOpen(false);
    setFormData(EMPTY_FORM);
    toast.success(`Le plan « ${newPlan.title} » a été créé avec succès !`);
  };

  // Submit Edit Plan
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanId) return;

    const updated = plans.map((p) => {
      if (p.id !== editingPlanId) return p;
      return {
        ...p,
        title: formData.title.trim(),
        levelBadge: formData.levelBadge.trim(),
        priceUsd: Number(formData.priceUsd),
        priceCdf: formData.priceCdf.trim(),
        isPopular: formData.isPopular,
        isFree: formData.isFree,
        active: formData.active,
        duration: formData.duration.trim(),
        description: formData.description.trim(),
        features: formData.featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        ctaLabel: formData.ctaLabel.trim(),
      };
    });

    updateAndSavePlans(updated);
    setEditingPlanId(null);
    toast.success("Prix et caractéristiques du plan modifiés avec succès !");
  };

  // Confirm Delete Plan
  const handleDeletePlan = () => {
    if (!deletingPlanId) return;
    const target = plans.find((p) => p.id === deletingPlanId);
    const updated = plans.filter((p) => p.id !== deletingPlanId);
    updateAndSavePlans(updated);
    setDeletingPlanId(null);
    toast.success(`Le plan « ${target?.title} » a été supprimé.`);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm("Réinitialiser tous les plans et prix aux valeurs par défaut de l'Académie ?")) {
      const reset = resetPricingPlansToDefault();
      setPlans(reset);
      savePaymentMethods(DEFAULT_PAYMENT_METHODS);
      setPaymentMethods(DEFAULT_PAYMENT_METHODS);
      toast.success("Tarifs et passerelles réinitialisés avec succès !");
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ["ID", "Titre", "Badge", "Prix USD", "Prix CDF", "Durée", "Actif", "Description"];
    const rows = plans.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.levelBadge}"`,
      p.priceUsd,
      `"${p.priceCdf}"`,
      `"${p.duration || ""}"`,
      p.active !== false ? "OUI" : "NON",
      `"${p.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tarifs_pa3_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Catalogue des prix exporté en CSV !");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm">
              💳
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-navy tracking-tight">
              Gestion des Prix &amp; Passerelles SasPay (RDC)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Modifiez en temps réel les prix en <strong>USD ($)</strong> et <strong>Francs Congolais (CDF)</strong>. Les modifications sont immédiatement appliquées sur la page publique des tarifs et lors du paiement mobile money.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setFormData(EMPTY_FORM);
              setIsCreateOpen(true);
            }}
            className="btn-3d-gold !py-2.5 !px-4 text-xs font-black inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Plan</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
            title="Exporter la grille tarifaire"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
            title="Restaurer les prix d'origine"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: MOBILE MONEY PROVIDERS (FEATURING AFRIMONEY) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-base text-navy flex items-center gap-2">
              <span>📱 Opérateurs Mobile Money Pris en Charge</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-full">
                Nouveau : Afrimoney inclus 🟣
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Activez ou désactivez les opérateurs disponibles pour les apprenants lors de leur checkout SasPay (sapay.me).
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {paymentMethods.filter((m) => m.enabled).length} / {paymentMethods.length} actifs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-2xl border transition-all ${
                method.enabled
                  ? `${method.color} shadow-xs`
                  : "border-slate-200 bg-slate-100/70 text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm">{method.name}</span>
                <button
                  type="button"
                  onClick={() => handleTogglePaymentMethod(method.id)}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md transition cursor-pointer ${
                    method.enabled
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {method.enabled ? "Actif" : "Inactif"}
                </button>
              </div>

              <div className="text-xs font-semibold">{method.operator}</div>
              <div className="text-[10px] font-mono mt-1 opacity-80">
                Code : {method.networkCode}
              </div>

              {method.phonePrefixes.length > 0 && (
                <div className="text-[10px] mt-2 pt-2 border-t border-black/10 font-medium">
                  Préfixes : <strong>{method.phonePrefixes.join(", ")}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: PRICING PLANS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-navy">
            Plans &amp; Grille Tarifaire Actuelle ({plans.length})
          </h3>
          <span className="text-xs font-bold text-slate-500">
            {plans.filter((p) => p.active !== false).length} formules en ligne
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isActive = plan.active !== false;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-5 border flex flex-col justify-between transition-all relative ${
                  isActive
                    ? plan.isPopular
                      ? "bg-navy text-white border-amber-400 shadow-md ring-2 ring-amber-400/30"
                      : "bg-white text-slate-900 border-slate-200 shadow-sm"
                    : "bg-slate-50 text-slate-400 border-dashed border-slate-300 opacity-70"
                }`}
              >
                {/* Status pill & Popular badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      plan.isPopular
                        ? "bg-amber-400 text-slate-950 font-black"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {plan.levelBadge}
                  </span>

                  <button
                    onClick={() => handleTogglePlanActive(plan.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                    title={isActive ? "Plan en ligne" : "Plan masqué"}
                  >
                    {isActive ? "🟢 En ligne" : "⚪ Masqué"}
                  </button>
                </div>

                {/* Title & Price */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-black text-lg leading-snug">{plan.title}</h4>
                  <div>
                    <div className="text-2xl font-black text-amber-500">
                      {plan.isFree ? "0 $" : `${plan.priceUsd} $`}
                    </div>
                    <div className="text-xs font-bold text-slate-400">
                      {plan.priceCdf} • {plan.duration || "Paiement Unique"}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-1.5 py-3 border-t border-slate-100/50 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Avantages inclus :
                  </div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Modifier le Prix</span>
                  </button>

                  <button
                    onClick={() => setDeletingPlanId(plan.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                    title="Supprimer ce plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODAL: CREATE PRICING PLAN */}
      {/* ================================================================= */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h3 className="font-black text-lg text-navy">Créer un Nouveau Plan Tarifaire</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 overflow-y-auto flex-1 pt-4 pr-1 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Titre du Plan *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Pass Spécial Vacances B1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge (ex: Populaire, Promo) *</label>
                  <input
                    type="text"
                    required
                    value={formData.levelBadge}
                    onChange={(e) => setFormData({ ...formData, levelBadge: e.target.value })}
                    placeholder="Ex: Offre Limitée"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix USD ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={formData.priceUsd}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      const approxCdf = `${(usd * 2800).toLocaleString("fr-FR")} FC`;
                      setFormData({
                        ...formData,
                        priceUsd: usd,
                        priceCdf: usd === 0 ? "0 FC" : approxCdf,
                        isFree: usd === 0,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-black text-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix Francs (CDF) *</label>
                  <input
                    type="text"
                    required
                    value={formData.priceCdf}
                    onChange={(e) => setFormData({ ...formData, priceCdf: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durée *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: À vie, / mois"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description courte *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Débloquez toutes les leçons et profitez d'un accompagnement personnalisé."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Avantages Inclus (1 avantage par ligne) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-mono text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                  />
                  <span>Mettre en avant (&laquo; Meilleure Offre &raquo;)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>Publier immédiatement (En ligne)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-3d-gold !py-2 !px-5 text-xs font-black shadow-xs cursor-pointer"
                >
                  Créer le Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: EDIT PRICING PLAN */}
      {/* ================================================================= */}
      {editingPlanId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-black text-lg text-navy">Modifier le Plan &amp; le Prix</h3>
                <span className="text-xs text-slate-400">ID: {editingPlanId}</span>
              </div>
              <button
                onClick={() => setEditingPlanId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 overflow-y-auto flex-1 pt-4 pr-1 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Titre du Plan *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge de Niveau *</label>
                  <input
                    type="text"
                    required
                    value={formData.levelBadge}
                    onChange={(e) => setFormData({ ...formData, levelBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix USD ($) *</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={formData.priceUsd}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      const approxCdf = `${(usd * 2800).toLocaleString("fr-FR")} FC`;
                      setFormData({
                        ...formData,
                        priceUsd: usd,
                        priceCdf: usd === 0 ? "0 FC" : approxCdf,
                        isFree: usd === 0,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-black text-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix Francs (CDF) *</label>
                  <input
                    type="text"
                    required
                    value={formData.priceCdf}
                    onChange={(e) => setFormData({ ...formData, priceCdf: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durée *</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description courte *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Avantages Inclus (1 avantage par ligne) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 resize-none font-mono text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                  />
                  <span>Mettre en avant (&laquo; Meilleure Offre &raquo;)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>En ligne (Visible aux apprenants)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingPlanId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-3d-gold !py-2 !px-5 text-xs font-black shadow-xs cursor-pointer"
                >
                  Enregistrer les Changements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ================================================================= */}
      {deletingPlanId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
              🗑️
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Supprimer ce Plan Tarifaire ?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Êtes-vous sûr de vouloir supprimer cette formule ? Les apprenants ne pourront plus y souscrire.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPlanId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-xs hover:bg-slate-100 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeletePlan}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition"
              >
                Confirmer la Suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
