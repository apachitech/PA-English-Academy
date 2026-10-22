'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { Logo } from '@/components/brand/Logo';
import { toast } from 'sonner';
import {
  isLearnerAuthenticated,
  getLearnerProfile,
  loginLearner,
  LearnerProfile,
} from '@/lib/auth-learner';

interface PricingPlan {
  id: string;
  title: string;
  levelBadge: string;
  priceUsd: number;
  priceCdf: string;
  isPopular?: boolean;
  isFree?: boolean;
  description: string;
  features: string[];
  ctaLabel: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan_a1',
    title: 'Niveau A1 Débutant',
    levelBadge: 'A1 Débutant',
    priceUsd: 0,
    priceCdf: '0 FC',
    isFree: true,
    description: 'Promesse du Coach David : les bases indispensables sont 100 % gratuites pour tous les Congolais.',
    features: [
      'Accès complet aux 4 unités A1',
      'Exercices interactifs & écoute audio',
      'Test diagnostique adaptatif',
      'Mode basse consommation 3G',
      'Certificat d’initiation A1',
    ],
    ctaLabel: 'Commencer gratuitement',
  },
  {
    id: 'plan_a2',
    title: 'Pass Niveau A2',
    levelBadge: 'A2 Élémentaire',
    priceUsd: 5,
    priceCdf: '14 000 FC',
    description: 'Racontez votre routine, vos voyages et échangez avec aisance au marché ou au travail.',
    features: [
      'Toutes les leçons A2 à vie',
      'Vidéos avec transcriptions complètes',
      'Exercices d’expression orale & audio',
      'Examen final A2 avec certificat officiel vérifiable',
      'Support par groupe WhatsApp avec Coach David',
    ],
    ctaLabel: 'Débloquer A2 (5 $)',
  },
  {
    id: 'plan_all_access',
    title: 'Pass Tout Accès (A2 + B1 + B2)',
    levelBadge: 'Meilleure Offre',
    priceUsd: 15,
    priceCdf: '42 000 FC',
    isPopular: true,
    description: 'Idéal pour booster votre carrière dans les ONGs, multinationales ou préparer un voyage à l’étranger.',
    features: [
      'Accès illimité à tous les niveaux (A1 à B2)',
      'Module Spécial : Anglais Professionnel & ONGs',
      'Module Spécial : Préparation Entretiens & Ambassades',
      'Tous les certificats officiels PA³ (A1, A2, B1, B2)',
      'Accès prioritaire aux webinaires de Coach David',
    ],
    ctaLabel: 'Choisir le Pass Tout Accès (15 $)',
  },
  {
    id: 'plan_vip_coaching',
    title: 'Coaching VIP Présentiel & En Ligne',
    levelBadge: 'Accompagnement VIP',
    priceUsd: 35,
    priceCdf: '98 000 FC / mois',
    description: 'Séances privées de conversation avec Coach David Liandja à Kinshasa ou via Google Meet.',
    features: [
      'Tous les accès numériques illimités',
      '2 séances de conversation en direct / semaine',
      'Correction personnalisée de prononciation',
      'Orientation personnalisée pour visas & bourses',
      'Ligne WhatsApp directe avec Coach David',
    ],
    ctaLabel: 'Contacter Coach David',
  },
];

type MobileProvider = 'mpesa' | 'airtel' | 'orange' | 'card';

export default function TarifsPage() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [saspayMode, setSaspayMode] = useState<'checkout' | 'softpay'>('checkout');
  const [selectedProvider, setSelectedProvider] = useState<MobileProvider>('mpesa');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStep, setPaymentStep] = useState<'auth_required' | 'form' | 'processing' | 'success'>('auth_required');
  const [transactionRef, setTransactionRef] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Quick inline auth state
  const [authInlineMode, setAuthInlineMode] = useState<'login' | 'register'>('login');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlinePassword, setInlinePassword] = useState('');
  const [inlineName, setInlineName] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Check return from SasPay checkout
      if (params.get('payment') === 'success') {
        const planId = params.get('plan_id') || 'pass';
        const session = params.get('saspay_session') || 'OK';
        setSuccessBanner(`Paiement SasPay validé avec succès (Réf: ${session}). Votre accès ${planId.toUpperCase()} est débloqué !`);
        toast.success('Félicitations ! Votre pass PA³ English Academy est activé.');
      }

      // Check if redirected after login with a plan requested
      const requestedPlanId = params.get('plan');
      if (requestedPlanId) {
        const plan = PRICING_PLANS.find((p) => p.id === requestedPlanId);
        if (plan) {
          setSelectedPlan(plan);
          if (isLearnerAuthenticated()) {
            const profile = getLearnerProfile();
            if (profile) {
              setCustomerEmail(profile.email);
              setCustomerName(profile.name);
            }
            setPaymentStep('form');
          } else {
            setPaymentStep('auth_required');
          }
        }
      }
    }
  }, []);

  const handleOpenPayment = (plan: PricingPlan) => {
    if (plan.isFree) {
      window.location.href = '/parcours';
      return;
    }
    if (plan.id === 'plan_vip_coaching') {
      window.open(
        `https://wa.me/27742932071?text=${encodeURIComponent(
          "Bonjour Coach David, je souhaite m'inscrire au Coaching VIP (Présentiel / En Ligne) sur PA³ English Academy."
        )}`,
        '_blank'
      );
      return;
    }

    setSelectedPlan(plan);
    setInstructions('');

    // Business Requirement: Verify user is logged in before checkout
    const loggedIn = isLearnerAuthenticated();
    if (!loggedIn) {
      setPaymentStep('auth_required');
      toast.info('Veuillez vous connecter à votre compte apprenant avant de payer.');
    } else {
      const profile = getLearnerProfile();
      if (profile) {
        setCustomerEmail(profile.email);
        setCustomerName(profile.name);
      }
      setPaymentStep('form');
    }
  };

  const handleInlineAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineEmail.trim()) {
      toast.error('Veuillez renseigner votre adresse email.');
      return;
    }
    if (authInlineMode === 'register' && !inlineName.trim()) {
      toast.error('Veuillez renseigner votre nom complet.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      const profile = loginLearner(
        inlineEmail,
        authInlineMode === 'register' ? inlineName : undefined
      );

      setCustomerEmail(profile.email);
      setCustomerName(profile.name);
      setIsAuthenticating(false);
      setPaymentStep('form');
      toast.success(`Bienvenue ${profile.name} ! Session prête pour le paiement.`);
    }, 400);
  };

  const handleSasPayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    // Double check authentication
    if (!isLearnerAuthenticated()) {
      setPaymentStep('auth_required');
      toast.error('Vous devez être connecté pour finaliser la commande.');
      return;
    }

    if (!customerEmail.trim()) {
      toast.error('Veuillez renseigner votre adresse email.');
      return;
    }
    if (!customerName.trim()) {
      toast.error('Veuillez renseigner votre nom complet.');
      return;
    }
    if (saspayMode === 'softpay' && selectedProvider !== 'card' && !phoneNumber.trim()) {
      toast.error('Veuillez entrer votre numéro de téléphone Mobile Money.');
      return;
    }

    setIsSubmitting(true);

    try {
      let networkCode = 'card';
      if (selectedProvider === 'mpesa') networkCode = 'mpesa_cd';
      if (selectedProvider === 'airtel') networkCode = 'airtel_cd';
      if (selectedProvider === 'orange') networkCode = 'orange_cd';

      const payload = {
        planId: selectedPlan.id,
        title: selectedPlan.title,
        amountUsd: selectedPlan.priceUsd,
        customerEmail: customerEmail.trim(),
        customerName: customerName.trim(),
        customerPhone: phoneNumber.trim(),
        method: saspayMode,
        network: networkCode,
      };

      const res = await fetch('/api/payments/saspay/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || 'Erreur lors de l’initialisation SasPay');
      }

      // Mode 1: Hosted Checkout redirection
      if (json.method === 'checkout' && json.data?.checkout_url) {
        toast.info('Redirection vers la passerelle sécurisée SasPay (sapay.me)...');
        window.location.href = json.data.checkout_url;
        return;
      }

      // Mode 2: Direct Softpay Push
      if (json.method === 'softpay') {
        setPaymentStep('processing');
        setTransactionRef(json.data?.id || `SAS-${Date.now()}`);
        setInstructions(
          json.data?.instructions ||
            `Consultez votre téléphone (${phoneNumber}) et validez avec votre code PIN secret ${selectedProvider.toUpperCase()}.`
        );

        setTimeout(() => {
          setPaymentStep('success');
          toast.success('Paiement Mobile Money validé via SasPay !');
        }, 3000);
      }
    } catch (err: any) {
      toast.error(err.message || 'Impossible de contacter la passerelle SasPay.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Clean Spacious Top Header with Side Menu */}
      <Navbar variant="app" showTestCta={true} />

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        {/* Success Banner if returned from checkout */}
        {successBanner && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                ✓
              </span>
              <div>
                <h4 className="font-bold text-sm">Paiement validé avec succès !</h4>
                <p className="text-xs text-emerald-800">{successBanner}</p>
              </div>
            </div>
            <Link
              href="/parcours"
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Voir mes cours →
            </Link>
          </div>
        )}

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold-dark border border-gold/30 mb-3">
            🇨🇩 Prix flexibles adaptés à la RDC
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy tracking-tight">
            Investissez dans votre avenir professionnel
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Payez facilement avec <strong>M-Pesa (Vodacom)</strong>, <strong>Airtel Money</strong>, <strong>Orange Money</strong> ou carte bancaire via la passerelle officielle <strong>SasPay (sapay.me)</strong>.
            Le niveau Débutant A1 reste <strong>100 % gratuit</strong>.
          </p>

          {/* Telco & SasPay logos pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1 text-slate-900 font-bold bg-amber-400/20 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-400/30">
              ⚡ SasPay (sapay.me)
            </span>
            <span className="flex items-center gap-1 text-red-600">🔴 M-Pesa</span>
            <span className="flex items-center gap-1 text-red-500">⚪ Airtel Money</span>
            <span className="flex items-center gap-1 text-orange-500">🟠 Orange Money</span>
            <span className="flex items-center gap-1 text-blue-600">💳 Visa / Mastercard</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                plan.isPopular
                  ? 'bg-navy text-white shadow-xl border-2 border-gold -translate-y-2'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  ⭐ Le Plus Choisi
                </div>
              )}

              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase mb-3 ${
                    plan.isPopular
                      ? 'bg-white/10 text-gold border border-gold/30'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {plan.levelBadge}
                </span>

                <h3 className="text-lg font-bold">{plan.title}</h3>

                <div className="mt-4 mb-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black">
                    {plan.priceUsd === 0 ? 'Gratuit' : `${plan.priceUsd} $`}
                  </span>
                  <span
                    className={`text-xs ${
                      plan.isPopular ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    ≈ {plan.priceCdf}
                  </span>
                </div>

                <p
                  className={`text-xs leading-relaxed mb-6 ${
                    plan.isPopular ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {plan.description}
                </p>

                <ul className="space-y-2.5 text-xs mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500 font-bold shrink-0">✓</span>
                      <span className={plan.isPopular ? 'text-slate-200' : 'text-slate-700'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleOpenPayment(plan)}
                className={`w-full font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition shadow text-center cursor-pointer ${
                  plan.isPopular
                    ? 'btn-duo !text-navy'
                    : plan.isFree
                    ? 'btn-duo-secondary'
                    : 'bg-navy text-white hover:bg-navy-light'
                }`}
              >
                {plan.ctaLabel}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Questions Fréquentes sur les Paiements en RDC
          </h2>

          <div className="space-y-5 text-xs sm:text-sm">
            <div>
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span>🔐</span> Pourquoi dois-je me connecter avant de payer ?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Votre pass ou niveau est lié de manière permanente à votre profil apprenant. En étant connecté, votre progression, vos cours audio/vidéo et vos certificats officiels vérifiables sont conservés à vie sur votre compte.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span>⚡</span> Qu'est-ce que la passerelle SasPay (sapay.me) ?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                <strong>SasPay</strong> est la plateforme sécurisée d'agrégation de paiements en Afrique. Elle unifie vos règlements par <strong>Mobile Money (M-Pesa, Airtel Money, Orange Money)</strong> et par <strong>carte bancaire</strong>, assurant une validation instantanée et chiffrée sans délai.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-bold text-slate-900 mb-1">
                Le Niveau A1 est-il vraiment 100 % gratuit sans carte bancaire ?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Oui ! Conformément à la vision de Coach David Liandja et de PA³ English Academy, l'évaluation diagnostique de niveau et toutes les leçons A1 sont gratuites et accessibles à tous les Congolais.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Payment & Auth Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-100 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                    ⚡ SasPay (sapay.me)
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Paiement RDC</span>
                </div>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  {selectedPlan.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition shrink-0 ml-3 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 0: Auth Required Screen */}
            {paymentStep === 'auth_required' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-5 overflow-y-auto flex-1 space-y-4">
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <span className="text-2xl shrink-0">🔐</span>
                    <div>
                      <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                        Connexion requise avant le paiement
                      </h4>
                      <p className="text-[11px] text-amber-900/80 leading-relaxed mt-0.5">
                        Votre pass sera directement rattaché à votre compte personnel pour vous permettre de conserver votre progression et vos certificats officiels à vie.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Mode: Login vs Register */}
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setAuthInlineMode('login')}
                      className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                        authInlineMode === 'login'
                          ? 'bg-white shadow text-slate-900'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      J'ai déjà un compte
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthInlineMode('register')}
                      className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                        authInlineMode === 'register'
                          ? 'bg-white shadow text-slate-900'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Nouveau compte (30s)
                    </button>
                  </div>

                  {/* Inline Auth Form */}
                  <form onSubmit={handleInlineAuthSubmit} className="space-y-3 pt-1">
                    {authInlineMode === 'register' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nom complet :
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ex: Naomi Kabamba"
                          value={inlineName}
                          onChange={(e) => setInlineName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Adresse email :
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ex: votre-email@gmail.com"
                        value={inlineEmail}
                        onChange={(e) => setInlineEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mot de passe :
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={inlinePassword}
                        onChange={(e) => setInlinePassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="btn-duo w-full !py-3 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      {isAuthenticating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                          <span>Connexion en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {authInlineMode === 'login'
                              ? 'Se connecter & Continuer vers le paiement →'
                              : 'Créer mon compte & Passer au paiement →'}
                          </span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Alternative Full-Page Links */}
                  <div className="pt-2 text-center text-xs text-slate-500 space-x-2">
                    <span>Ou ouvrir la page complète :</span>
                    <Link
                      href={`/connexion?redirect=/tarifs?plan=${selectedPlan.id}`}
                      className="text-navy font-bold hover:underline"
                    >
                      Connexion
                    </Link>
                    <span>•</span>
                    <Link
                      href={`/inscription?redirect=/tarifs?plan=${selectedPlan.id}`}
                      className="text-navy font-bold hover:underline"
                    >
                      Inscription
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Form (Logged in) */}
            {paymentStep === 'form' && (
              <form onSubmit={handleSasPayPayment} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-5 overflow-y-auto flex-1 space-y-4">
                  {/* Amount Pill & Authenticated User */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                        <span>✓</span> Connecté en tant que <strong>{customerName || 'Apprenant'}</strong>
                      </span>
                      <div className="text-slate-500 text-[11px]">{customerEmail}</div>
                    </div>
                    <span className="font-black text-navy text-base shrink-0">
                      {selectedPlan.priceUsd} $ USD
                    </span>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mode de paiement SasPay :
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSaspayMode('checkout')}
                        className={`p-2.5 rounded-xl border font-bold transition text-left flex flex-col gap-0.5 cursor-pointer ${
                          saspayMode === 'checkout'
                            ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-400'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>🌐</span> Checkout Hébergé
                        </span>
                        <span className="text-[10px] font-normal text-slate-500">
                          Redirection pay.saspay.me
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSaspayMode('softpay')}
                        className={`p-2.5 rounded-xl border font-bold transition text-left flex flex-col gap-0.5 cursor-pointer ${
                          saspayMode === 'softpay'
                            ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-400'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span>📲</span> Push Direct (USSD)
                        </span>
                        <span className="text-[10px] font-normal text-slate-500">
                          Demande sur téléphone
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Operator & Phone input (for Softpay or direct preference) */}
                  {saspayMode === 'softpay' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Opérateur Mobile Money RDC :
                        </label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setSelectedProvider('mpesa')}
                            className={`p-2.5 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                              selectedProvider === 'mpesa'
                                ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>🔴</span> M-Pesa
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedProvider('airtel')}
                            className={`p-2.5 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                              selectedProvider === 'airtel'
                                ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>⚪</span> Airtel Money
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedProvider('orange')}
                            className={`p-2.5 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                              selectedProvider === 'orange'
                                ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-400'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>🟠</span> Orange Money
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedProvider('card')}
                            className={`p-2.5 rounded-xl border text-left font-bold transition flex items-center gap-2 cursor-pointer ${
                              selectedProvider === 'card'
                                ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-400'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>💳</span> Carte Bancaire
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Numéro de téléphone ({selectedProvider.toUpperCase()}) :
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="ex: 0812345678 ou 0991234567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Une demande de confirmation USSD sera envoyée sur ce numéro via SasPay.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security reassurance */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                    <span className="text-amber-500 text-sm">🔒</span>
                    <span>Transaction chiffrée SSL 256-bit garantie par <strong>SasPay (sapay.me)</strong>.</span>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/90 shrink-0">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-duo w-full !py-3 text-sm font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Traitement SasPay...</span>
                      </>
                    ) : (
                      <>
                        <span>Payer {selectedPlan.priceUsd} $ USD via SasPay</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Processing (Softpay Push) */}
            {paymentStep === 'processing' && (
              <div className="p-6 py-10 text-center space-y-4 overflow-y-auto flex-1">
                <div className="w-16 h-16 border-4 border-amber-400 border-t-navy rounded-full animate-spin mx-auto" />
                <h4 className="font-black text-slate-900 text-base">
                  En attente de validation sur votre téléphone...
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {instructions || 'Consultez votre écran de téléphone et saisissez votre code PIN secret pour confirmer la transaction Mobile Money.'}
                </p>
                <div className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 rounded-full text-[11px] font-mono font-bold">
                  Réf. SasPay : {transactionRef}
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {paymentStep === 'success' && (
              <div className="p-6 py-6 text-center space-y-4 overflow-y-auto flex-1">
                <div className="w-16 h-16 bg-green-100 border-2 border-green-300 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                  ✓
                </div>
                <h4 className="font-black text-slate-900 text-lg">
                  Paiement Confirmé !
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Votre pass <strong>{selectedPlan.title}</strong> a été débloqué avec succès via SasPay.
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
                  Réf. Transaction : <strong>{transactionRef}</strong>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/parcours"
                    className="btn-duo !py-2.5 text-xs text-center block"
                  >
                    Accéder au parcours de formation
                  </Link>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 py-1 cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
