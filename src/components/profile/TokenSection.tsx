'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  CreditCard,
  Phone,
  Flame,
  Award,
  AlertCircle,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LevelToken,
  getStoredTokens,
  claimToken,
  purchaseAndClaimToken,
  getUserClaimedTokensHistory,
  getNextCefrLevel,
  CefrTargetLevel,
} from '@/lib/domain/tokens';
import { getLearnerProfile, getLearnerProgressStats, LearnerProfile, LearnerProgressStats } from '@/lib/auth-learner';
import { formatDrcPhoneNumber } from '@/lib/saspay';

interface TokenSectionProps {
  initialProfile: LearnerProfile | null;
  initialStats: LearnerProgressStats | null;
  onStatsUpdate?: (updatedStats: LearnerProgressStats) => void;
}

export function TokenSection({ initialProfile, initialStats, onStatsUpdate }: TokenSectionProps) {
  const [profile, setProfile] = useState<LearnerProfile | null>(initialProfile);
  const [stats, setStats] = useState<LearnerProgressStats | null>(initialStats);
  const [tokens, setTokens] = useState<LevelToken[]>([]);
  const [claimHistory, setClaimHistory] = useState<
    Array<{
      tokenId: string;
      code: string;
      title: string;
      claimedAt: string;
      previousLevel: string;
      newLevel: string;
      xpGranted: number;
    }>
  >([]);

  // Claim Form State
  const [inputCode, setInputCode] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastClaimSuccess, setLastClaimSuccess] = useState<{
    message: string;
    previousLevel?: string;
    newLevel?: string;
    xpGranted?: number;
  } | null>(null);

  // Buy Modal State
  const [selectedTokenToBuy, setSelectedTokenToBuy] = useState<LevelToken | null>(null);
  const [buyProvider, setBuyProvider] = useState<'afrimoney' | 'mpesa' | 'airtel' | 'orange' | 'card'>('afrimoney');
  const [buyPhone, setBuyPhone] = useState('0901234567');
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const p = getLearnerProfile();
    const s = getLearnerProgressStats();
    setProfile(p);
    setStats(s);
    setTokens(getStoredTokens().filter((t) => t.isPurchasable && t.status === 'active'));
    setClaimHistory(getUserClaimedTokensHistory());
    if (onStatsUpdate && s) {
      onStatsUpdate(s);
    }
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputCode.trim();
    if (!trimmed) {
      toast.error('Veuillez saisir un code de token.');
      return;
    }

    if (!profile) {
      toast.error('Vous devez être connecté pour réclamer un token.');
      return;
    }

    setIsClaiming(true);

    setTimeout(() => {
      const res = claimToken(trimmed, {
        email: profile.email,
        name: profile.name,
        currentLevel: stats?.level || 'A1',
        currentXp: stats?.xp || 60,
      });

      setIsClaiming(false);

      if (res.success) {
        toast.success(res.message);
        setLastClaimSuccess({
          message: res.message,
          previousLevel: res.previousLevel,
          newLevel: res.newLevel,
          xpGranted: res.xpGranted,
        });
        setInputCode('');
        refreshData();
      } else {
        toast.error(res.message);
      }
    }, 400);
  };

  const handleOpenBuyModal = (token: LevelToken) => {
    setSelectedTokenToBuy(token);
    // Default phone suggestions based on provider
    if (buyProvider === 'afrimoney') setBuyPhone('0900000000');
    else if (buyProvider === 'mpesa') setBuyPhone('0810000000');
    else if (buyProvider === 'airtel') setBuyPhone('0990000000');
    else if (buyProvider === 'orange') setBuyPhone('0890000000');
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTokenToBuy || !profile) return;

    if (buyProvider !== 'card' && (!buyPhone || buyPhone.trim().length < 9)) {
      toast.error('Veuillez saisir un numéro de téléphone valide pour le paiement mobile.');
      return;
    }

    setIsProcessingBuy(true);

    setTimeout(() => {
      const formattedPhone = buyProvider !== 'card' ? formatDrcPhoneNumber(buyPhone) : undefined;
      const res = purchaseAndClaimToken({
        tokenPackageId: selectedTokenToBuy.id,
        paymentMethod: buyProvider,
        phoneNumber: formattedPhone,
        user: {
          email: profile.email,
          name: profile.name,
          currentLevel: stats?.level || 'A1',
          currentXp: stats?.xp || 60,
        },
      });

      setIsProcessingBuy(false);

      if (res.success) {
        toast.success(`🎉 Félicitations ! Votre paiement ${buyProvider.toUpperCase()} a été validé !`);
        setLastClaimSuccess({
          message: res.message,
          previousLevel: res.previousLevel,
          newLevel: res.newLevel,
          xpGranted: res.xpGranted,
        });
        setSelectedTokenToBuy(null);
        refreshData();
      } else {
        toast.error(res.message);
      }
    }, 800);
  };

  const currentLevel = stats?.level || 'A1';
  const nextLevel = getNextCefrLevel(currentLevel);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Current Level & Progression */}
      <div className="bg-gradient-to-r from-navy via-slate-900 to-navy text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Ticket className="w-3.5 h-3.5" />
              <span>Système de Tokens &amp; Passes de Niveau PA³</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Passez au Niveau Supérieur avec vos Tokens
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Débloquez instantanément vos leçons des paliers supérieurs (A2, B1, B2) ou gagnez des points d’expérience grâce aux codes promotionnels générés par le <strong>Coach David Liandja</strong> ou en achetant un passe via <strong>Afrimoney</strong> et <strong>Mobile Money RDC</strong>.
            </p>
          </div>

          {/* Level Badge Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-md">
              {currentLevel}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Niveau Actuel
              </div>
              <div className="text-lg font-black text-white">Palier {currentLevel} CECRL</div>
              <div className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3" />
                <span>Prochaine cible : Palier {nextLevel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Success Celebration Callout */}
      {lastClaimSuccess && (
        <div className="p-5 rounded-3xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
              🚀
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Mise à Niveau Réussie !
              </div>
              <div className="text-base font-extrabold text-emerald-950">
                {lastClaimSuccess.message}
              </div>
              {lastClaimSuccess.previousLevel && lastClaimSuccess.newLevel && (
                <div className="text-xs text-emerald-700 mt-0.5">
                  Promotion validée : <strong>{lastClaimSuccess.previousLevel}</strong> ➔{' '}
                  <strong className="text-emerald-900 underline">{lastClaimSuccess.newLevel}</strong> (+{lastClaimSuccess.xpGranted} XP)
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setLastClaimSuccess(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-xl bg-emerald-200/50 hover:bg-emerald-200 transition shrink-0"
          >
            Fermer
          </button>
        </div>
      )}

      {/* SECTION 1: CLAIM A TOKEN VOUCHER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-navy flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-500" />
              <span>Réclamer un Token de Niveau</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vous avez reçu un code promotionnel ou une bourse d’étude de la part du Coach David Liandja ? Entrez-le ci-dessous.
            </p>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            ⚡ Validation instantanée
          </span>
        </div>

        <form onSubmit={handleClaimSubmit} className="pt-2">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Ex : PA3-A2-LEOPARD, PA3-LEVEL-UP, PA3-XP-1000..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-navy outline-none focus:border-amber-500 focus:bg-white uppercase tracking-wider transition"
              />
            </div>
            <button
              type="submit"
              disabled={isClaiming || !inputCode.trim()}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {isClaiming ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Validation en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Débloquer mon Niveau</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mise à niveau immédiate de votre profil</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Accès illimité aux leçons du niveau débloqué</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bonus d’expérience XP crédité</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: BUY LEVEL PASSES / TOKEN STORE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-navy flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Acheter un Passe de Niveau (Boutique SasPay &amp; Afrimoney)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choisissez votre formule de progression accélérée. Paiement simple et direct via Afrimoney, M-Pesa, Airtel ou Orange Money.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Tarifs en USD &amp; Francs Congolais (CDF)
          </span>
        </div>

        {/* Tokens Store Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokens.map((token) => {
            const isTargetHigher =
              token.targetLevel && token.targetLevel !== currentLevel;
            return (
              <div
                key={token.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 font-mono font-bold text-xs">
                    {token.code}
                  </span>
                  {token.bonusXp > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-900 font-black text-[11px]">
                      +{token.bonusXp} XP
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-navy">{token.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {token.description}
                  </p>
                </div>

                {/* Pricing & Buy Button */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-navy">{token.priceUsd} $</span>
                      <span className="text-xs text-slate-500 font-bold ml-1.5">
                        / {token.priceCdf.toLocaleString()} CDF
                      </span>
                    </div>
                    {token.targetLevel && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                        Objectif : {token.targetLevel}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenBuyModal(token)}
                    className="w-full py-2.5 px-4 rounded-xl bg-navy hover:bg-slate-800 text-gold font-black text-xs transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Acheter avec Afrimoney / SasPay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: CLAIMED TOKENS HISTORY */}
      {claimHistory.length > 0 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-navy flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Historique de vos Passes &amp; Niveaux Débloqués</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {claimHistory.length} token(s) utilisé(s)
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {claimHistory.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                      {item.code}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Activé le {new Date(item.claimedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-bold text-emerald-600">
                    {item.previousLevel} ➔ {item.newLevel}
                  </div>
                  <div className="text-[11px] text-slate-500">+{item.xpGranted} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: BUY TOKEN WITH SASPAY & AFRIMONEY */}
      {/* ================================================================= */}
      {selectedTokenToBuy && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-navy to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  Paiement SasPay Sécurisé
                </span>
                <h4 className="text-base font-black">Acheter votre Passe de Niveau</h4>
              </div>
              <button
                onClick={() => setSelectedTokenToBuy(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmPurchase} className="p-5 sm:p-6 space-y-4">
              {/* Product summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-navy">{selectedTokenToBuy.title}</h5>
                  <span className="text-base font-black text-amber-600">
                    {selectedTokenToBuy.priceUsd} $
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Montant en Francs :</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTokenToBuy.priceCdf.toLocaleString()} CDF
                  </span>
                </div>
                {selectedTokenToBuy.targetLevel && (
                  <div className="text-xs text-emerald-700 font-bold pt-1">
                    ✨ Débloque immédiatement le Palier {selectedTokenToBuy.targetLevel} (+{selectedTokenToBuy.bonusXp} XP)
                  </div>
                )}
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Choisissez votre moyen de paiement :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBuyProvider('afrimoney');
                      setBuyPhone('0900000000');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                      buyProvider === 'afrimoney'
                        ? 'border-red-500 bg-red-50/70 text-red-950 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] flex items-center justify-center">
                      A
                    </span>
                    <div>
                      <div className="font-bold">Afrimoney</div>
                      <div className="text-[10px] text-slate-500">Africell RDC</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBuyProvider('mpesa');
                      setBuyPhone('0810000000');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                      buyProvider === 'mpesa'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center">
                      M
                    </span>
                    <div>
                      <div className="font-bold">M-Pesa</div>
                      <div className="text-[10px] text-slate-500">Vodacom RDC</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBuyProvider('airtel');
                      setBuyPhone('0990000000');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                      buyProvider === 'airtel'
                        ? 'border-red-500 bg-red-50/70 text-red-950 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white font-black text-[10px] flex items-center justify-center">
                      Air
                    </span>
                    <div>
                      <div className="font-bold">Airtel Money</div>
                      <div className="text-[10px] text-slate-500">Airtel RDC</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBuyProvider('orange');
                      setBuyPhone('0890000000');
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center gap-2 ${
                      buyProvider === 'orange'
                        ? 'border-orange-500 bg-orange-50/70 text-orange-950 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-black text-[10px] flex items-center justify-center">
                      O
                    </span>
                    <div>
                      <div className="font-bold">Orange Money</div>
                      <div className="text-[10px] text-slate-500">Orange RDC</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Phone number input */}
              {buyProvider !== 'card' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Numéro {buyProvider.toUpperCase()} en RDC
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +243
                    </span>
                    <input
                      type="tel"
                      required
                      value={buyPhone}
                      onChange={(e) => setBuyPhone(e.target.value)}
                      placeholder={buyProvider === 'afrimoney' ? '090... ou 091...' : '081...'}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {buyProvider === 'afrimoney'
                      ? 'Composez *111# pour approuver le push de paiement Africell.'
                      : 'Un prompt USSD apparaîtra sur votre téléphone pour valider le code PIN.'}
                  </span>
                </div>
              )}

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTokenToBuy(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessingBuy}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition active:scale-98 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessingBuy ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Traitement SasPay...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Payer {selectedTokenToBuy.priceUsd} $ &amp; Débloquer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
