'use client';

import React, { useState, useEffect } from 'react';
import {
  LevelToken,
  TokenType,
  TokenStatus,
  CefrTargetLevel,
  getStoredTokens,
  saveStoredTokens,
  createToken,
  updateToken,
  bulkGenerateTokens,
  resetTokenRedemptions,
  toggleTokenStatus,
  deleteToken,
  generateRandomTokenCode,
  INITIAL_LEVEL_TOKENS,
} from '@/lib/domain/tokens';
import { convertUsdToCdf } from '@/lib/domain/platform-settings';
import { toast } from 'sonner';

export function TokenManagement() {
  const [tokens, setTokens] = useState<LevelToken[]>(INITIAL_LEVEL_TOKENS);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Generator modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Edit Token Modal State (Full CRUD Update)
  const [editingToken, setEditingToken] = useState<LevelToken | null>(null);
  const [editFormData, setEditFormData] = useState<{
    code: string;
    title: string;
    description: string;
    type: TokenType;
    targetLevel: CefrTargetLevel;
    bonusXp: number;
    priceUsd: number;
    priceCdf: number;
    isPurchasable: boolean;
    maxRedemptions: number;
    status: TokenStatus;
    note: string;
    expiresAt: string;
  }>({
    code: '',
    title: '',
    description: '',
    type: 'level_grant',
    targetLevel: 'A2',
    bonusXp: 500,
    priceUsd: 15,
    priceCdf: 42000,
    isPurchasable: true,
    maxRedemptions: 1,
    status: 'active',
    note: '',
    expiresAt: '',
  });

  // Bulk Generation Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCount, setBulkCount] = useState(5);
  const [bulkPrefix, setBulkPrefix] = useState('PA3-A2');
  const [bulkTitle, setBulkTitle] = useState('Bourse Étudiant A2');
  const [bulkTargetLevel, setBulkTargetLevel] = useState<CefrTargetLevel>('A2');
  const [bulkBonusXp, setBulkBonusXp] = useState(500);
  const [bulkNote, setBulkNote] = useState('Lot attribué par la direction');
  const [bulkGeneratedCodes, setBulkGeneratedCodes] = useState<string[]>([]);

  // Create Form State
  const [formData, setFormData] = useState<{
    code: string;
    useRandomCode: boolean;
    title: string;
    description: string;
    type: TokenType;
    targetLevel: CefrTargetLevel;
    bonusXp: number;
    priceUsd: number;
    priceCdf: number;
    isPurchasable: boolean;
    maxRedemptions: number;
    note: string;
  }>({
    code: '',
    useRandomCode: true,
    title: 'Passe Niveau A2 - Élémentaire',
    description: 'Débloque immédiatement le niveau et ajoute des XP bonus.',
    type: 'level_grant',
    targetLevel: 'A2',
    bonusXp: 500,
    priceUsd: 15,
    priceCdf: 42000,
    isPurchasable: true,
    maxRedemptions: 1,
    note: 'Généré par la direction pédagogique',
  });

  useEffect(() => {
    setIsMounted(true);
    setTokens(getStoredTokens());
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copié dans le presse-papier !`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleShareWhatsApp = (token: LevelToken) => {
    const text = encodeURIComponent(
      `🎉 Félicitations ! Coach David Liandja vous a octroyé un Token de Niveau PA³ English Academy :\n\n` +
      `🎟️ Code : *${token.code}*\n` +
      `⭐ Avantage : ${token.title} (+${token.bonusXp} XP)\n\n` +
      `Pour débloquer votre niveau :\n` +
      `1. Rendez-vous sur votre profil : https://speakup.cd/profil\n` +
      `2. Allez dans l'onglet "Tokens & Niveaux"\n` +
      `3. Collez votre code pour l'activer immédiatement !\n\n` +
      `Speak with confidence!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // CREATE TOKEN SUBMIT
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const codeToUse = formData.useRandomCode
        ? generateRandomTokenCode(`PA3-${formData.type === 'xp_boost' ? 'XP' : formData.targetLevel}`)
        : formData.code.trim().toUpperCase();

      if (!codeToUse) {
        toast.error('Veuillez spécifier un code de token.');
        return;
      }

      const created = createToken({
        code: codeToUse,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        targetLevel: formData.type === 'xp_boost' ? undefined : formData.targetLevel,
        bonusXp: Number(formData.bonusXp) || 0,
        priceUsd: Number(formData.priceUsd) || 0,
        priceCdf: Number(formData.priceCdf) || convertUsdToCdf(Number(formData.priceUsd) || 0),
        isPurchasable: formData.isPurchasable,
        maxRedemptions: Number(formData.maxRedemptions) || 1,
        note: formData.note,
      });

      setTokens(getStoredTokens());
      setIsModalOpen(false);
      handleCopyCode(created.code);
      toast.success(`🎉 Token "${created.code}" généré avec succès !`);

      // Reset create form
      setFormData({
        code: '',
        useRandomCode: true,
        title: 'Passe Niveau A2 - Élémentaire',
        description: 'Débloque immédiatement le niveau et ajoute des XP bonus.',
        type: 'level_grant',
        targetLevel: 'A2',
        bonusXp: 500,
        priceUsd: 15,
        priceCdf: 42000,
        isPurchasable: true,
        maxRedemptions: 1,
        note: '',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la création.';
      toast.error(msg);
    }
  };

  // OPEN EDIT TOKEN MODAL
  const handleOpenEdit = (token: LevelToken) => {
    setEditingToken(token);
    setEditFormData({
      code: token.code,
      title: token.title,
      description: token.description,
      type: token.type,
      targetLevel: token.targetLevel || 'A2',
      bonusXp: token.bonusXp,
      priceUsd: token.priceUsd,
      priceCdf: token.priceCdf,
      isPurchasable: token.isPurchasable,
      maxRedemptions: token.maxRedemptions,
      status: token.status,
      note: token.note || '',
      expiresAt: token.expiresAt ? token.expiresAt.slice(0, 10) : '',
    });
  };

  // SAVE EDITED TOKEN (CRUD UPDATE)
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingToken) return;

    try {
      updateToken(editingToken.id, {
        code: editFormData.code.trim().toUpperCase(),
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        type: editFormData.type,
        targetLevel: editFormData.type === 'xp_boost' ? undefined : editFormData.targetLevel,
        bonusXp: Number(editFormData.bonusXp),
        priceUsd: Number(editFormData.priceUsd),
        priceCdf: Number(editFormData.priceCdf),
        isPurchasable: editFormData.isPurchasable,
        maxRedemptions: Number(editFormData.maxRedemptions),
        status: editFormData.status,
        note: editFormData.note,
        expiresAt: editFormData.expiresAt ? new Date(editFormData.expiresAt).toISOString() : null,
      });

      setTokens(getStoredTokens());
      setEditingToken(null);
      toast.success(`✏️ Token "${editFormData.code}" mis à jour avec succès !`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la mise à jour.';
      toast.error(msg);
    }
  };

  // BULK GENERATE HANDLER
  const handleBulkGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generated = bulkGenerateTokens({
        count: bulkCount,
        prefix: bulkPrefix,
        title: bulkTitle,
        type: 'level_grant',
        targetLevel: bulkTargetLevel,
        bonusXp: bulkBonusXp,
        maxRedemptions: 1,
        note: bulkNote,
      });

      const codes = generated.map((t) => t.code);
      setBulkGeneratedCodes(codes);
      setTokens(getStoredTokens());
      toast.success(`📦 Lot de ${generated.length} tokens généré avec succès !`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur génération en lot.';
      toast.error(msg);
    }
  };

  // RESET REDEMPTIONS COUNTER
  const handleResetRedemptions = (token: LevelToken) => {
    if (confirm(`Voulez-vous réinitialiser le compteur d’utilisations du token "${token.code}" à 0 ?`)) {
      resetTokenRedemptions(token.id);
      setTokens(getStoredTokens());
      toast.success(`Compteur du token "${token.code}" remis à zéro.`);
    }
  };

  const handleToggleStatus = (tokenId: string, currentStatus: TokenStatus) => {
    const nextStatus = currentStatus === 'active' ? 'revoked' : 'active';
    toggleTokenStatus(tokenId, nextStatus);
    setTokens(getStoredTokens());
    toast.info(`Statut du token mis à jour : ${nextStatus.toUpperCase()}`);
  };

  const handleDelete = (tokenId: string, code: string) => {
    if (confirm(`Confirmez-vous la suppression définitive du token "${code}" ?`)) {
      deleteToken(tokenId);
      setTokens(getStoredTokens());
      toast.success(`Token "${code}" supprimé.`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Voulez-vous réinitialiser tous les tokens aux paramètres par défaut ?')) {
      saveStoredTokens(INITIAL_LEVEL_TOKENS);
      setTokens(INITIAL_LEVEL_TOKENS);
      toast.success('Tokens réinitialisés aux valeurs d’origine.');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Code',
      'Titre',
      'Type',
      'Niveau Cible',
      'XP Bonus',
      'Prix USD',
      'Prix CDF',
      'Utilisations',
      'Max Utilisations',
      'Statut',
      'Créé Le',
      'Expire Le',
      'Note/Bénéficiaire',
    ];
    const rows = tokens.map((t) => [
      `"${t.id}"`,
      `"${t.code}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.targetLevel || 'N/A'}"`,
      t.bonusXp,
      t.priceUsd,
      t.priceCdf,
      t.redemptionCount,
      t.maxRedemptions,
      `"${t.status}"`,
      `"${t.createdAt}"`,
      `"${t.expiresAt || 'Permanent'}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pa3_tokens_niveaux_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export CSV des tokens téléchargé !');
  };

  // Filtered list
  const filteredTokens = tokens.filter((t) => {
    const term = search.toLowerCase();
    const matchesSearch =
      t.code.toLowerCase().includes(term) ||
      t.title.toLowerCase().includes(term) ||
      (t.note && t.note.toLowerCase().includes(term)) ||
      t.redemptions.some((r) => r.userEmail.toLowerCase().includes(term));

    const matchesLevel =
      levelFilter === 'ALL' ||
      (t.targetLevel && t.targetLevel === levelFilter) ||
      (levelFilter === 'BOOST' && t.type === 'level_boost') ||
      (levelFilter === 'XP' && t.type === 'xp_boost');

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const totalRedemptions = tokens.reduce((acc, t) => acc + t.redemptionCount, 0);
  const activeCount = tokens.filter((t) => t.status === 'active').length;
  const claimedCount = tokens.filter((t) => t.status === 'redeemed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-15 text-9xl select-none pointer-events-none">
          🎟️
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-bold backdrop-blur-md">
            <span>⚡ Gamification &amp; Progression Accélérée</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            CRUD &amp; Générateur de Tokens / Vouchers de Niveau
          </h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Créez, modifiez (CRUD complet), générez en lot et distribuez des tokens de niveau (A1 ➔ A2, B1, B2) pour vos apprenants. Permet également d&apos;ajuster les prix de vente en <strong>Francs Congolais (CDF)</strong> et <strong>USD</strong> avec paiement Mobile Money (<strong>Afrimoney</strong>, <strong>M-Pesa</strong>).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-white text-amber-950 font-black text-sm shadow-md hover:bg-amber-50 active:scale-98 transition flex items-center gap-2 cursor-pointer"
            >
              <span>✨</span>
              <span>Créer un Nouveau Token</span>
            </button>
            <button
              onClick={() => {
                setBulkGeneratedCodes([]);
                setIsBulkModalOpen(true);
              }}
              className="py-2.5 px-4 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-black text-xs backdrop-blur-sm border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <span>📦</span>
              <span>Générer un Lot en Masse (Bulk)</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="py-2.5 px-4 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-xs backdrop-blur-sm transition flex items-center gap-2 cursor-pointer"
            >
              <span>📥</span>
              <span>Exporter CSV</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="py-2.5 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer"
              title="Restaurer les tokens de démonstration"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tokens</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {isMounted ? tokens.length : 5}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Vouchers dans le système</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tokens Actifs</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
            {isMounted ? activeCount : 4}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Prêts à être réclamés</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-200 bg-blue-50/20 shadow-2xs">
          <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Réclamations</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-1">
            {isMounted ? totalRedemptions : 16}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">Niveaux &amp; XP débloqués</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-purple-200 bg-purple-50/20 shadow-2xs">
          <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Tokens Épuisés</div>
          <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-1">
            {isMounted ? claimedCount : 1}
          </div>
          <div className="text-[11px] text-purple-600 mt-1">Quota maximal atteint</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par code (PA3-A2...), titre, apprenant ou note..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tous les Niveaux</option>
            <option value="A1">Niveau A1</option>
            <option value="A2">Niveau A2</option>
            <option value="B1">Niveau B1</option>
            <option value="B2">Niveau B2</option>
            <option value="C1">Niveau C1</option>
            <option value="BOOST">+1 Niveau Boost</option>
            <option value="XP">Booster XP</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tous les Statuts</option>
            <option value="active">Actif</option>
            <option value="redeemed">Épuisé / Utilisé</option>
            <option value="revoked">Révoqué</option>
          </select>
        </div>
      </div>

      {/* Tokens List / Grid */}
      <div className="space-y-3">
        {filteredTokens.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <span className="text-4xl">🎟️</span>
            <h3 className="text-base font-bold text-slate-900 mt-2">Aucun token trouvé</h3>
            <p className="text-xs text-slate-500 mt-1">Modifiez vos critères de recherche ou générez un nouveau token.</p>
          </div>
        ) : (
          filteredTokens.map((token) => {
            const isFullyRedeemed = token.redemptionCount >= token.maxRedemptions;
            return (
              <div
                key={token.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-2xs ${
                  token.status === 'revoked'
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : isFullyRedeemed
                    ? 'border-purple-200 bg-purple-50/10'
                    : 'border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Code Badge with Click-to-copy */}
                      <button
                        onClick={() => handleCopyCode(token.code)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 font-mono font-black text-xs sm:text-sm text-amber-950 hover:bg-amber-500/25 transition cursor-pointer active:scale-95"
                        title="Cliquer pour copier le code"
                      >
                        <span>🎟️</span>
                        <span>{token.code}</span>
                        <span className="text-[10px] text-amber-700 font-sans font-bold">
                          {copiedCode === token.code ? '✓ Copié !' : 'Copier'}
                        </span>
                      </button>

                      {/* Level Badge */}
                      {token.type === 'level_grant' && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200">
                          🎯 Palier {token.targetLevel}
                        </span>
                      )}
                      {token.type === 'level_boost' && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200">
                          🚀 +1 Niveau CEFR
                        </span>
                      )}
                      {token.type === 'xp_boost' && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-yellow-100 text-yellow-950 font-bold text-xs border border-yellow-200">
                          ⭐ +{token.bonusXp} XP
                        </span>
                      )}

                      {/* Status Badge */}
                      {token.status === 'active' && !isFullyRedeemed && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-[11px] border border-emerald-500/20">
                          ● Actif
                        </span>
                      )}
                      {isFullyRedeemed && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 font-bold text-[11px] border border-purple-500/20">
                          ● Quota Atteint ({token.redemptionCount}/{token.maxRedemptions})
                        </span>
                      )}
                      {token.status === 'revoked' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 font-bold text-[11px] border border-rose-500/20">
                          ● Révoqué
                        </span>
                      )}

                      {token.isPurchasable && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
                          💳 En vente ({token.priceUsd}$ / {token.priceCdf.toLocaleString()} CDF)
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{token.title}</h4>
                    <p className="text-xs text-slate-500">{token.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="font-semibold text-slate-700">
                        Utilisations : <strong>{token.redemptionCount}</strong> sur <strong>{token.maxRedemptions}</strong>
                      </span>
                      {token.expiresAt && (
                        <span className="text-amber-800">
                          Expire le : {new Date(token.expiresAt).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>

                    {token.note && (
                      <div className="text-[11px] text-amber-900/80 bg-amber-50/80 px-2.5 py-1 rounded-lg inline-block border border-amber-200/60 mt-1">
                        <strong>Note :</strong> {token.note}
                      </div>
                    )}
                  </div>

                  {/* Right Actions Toolbar (Full CRUD Controls) */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* EDIT BUTTON (CRUD UPDATE) */}
                    <button
                      onClick={() => handleOpenEdit(token)}
                      className="px-3 py-1.5 rounded-xl bg-navy/10 hover:bg-navy/15 text-navy font-bold text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
                      title="Modifier ce token (titre, niveau, code, quotas, prix)"
                    >
                      <span>✏️</span>
                      <span>Modifier</span>
                    </button>

                    {/* RESET USES BUTTON */}
                    {token.redemptionCount > 0 && (
                      <button
                        onClick={() => handleResetRedemptions(token)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition cursor-pointer"
                        title="Remettre le quota à zéro"
                      >
                        🔄 Réinitialiser
                      </button>
                    )}

                    {/* Share WhatsApp */}
                    <button
                      onClick={() => handleShareWhatsApp(token)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
                      title="Envoyer ce code à un élève sur WhatsApp"
                    >
                      <span>💬</span>
                      <span>WhatsApp</span>
                    </button>

                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(token.id, token.status)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                        token.status === 'active'
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {token.status === 'active' ? 'Désactiver' : 'Réactiver'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(token.id, token.code)}
                      className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-slate-200 text-xs transition cursor-pointer"
                      title="Supprimer définitivement ce token"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Redemptions Drawer */}
                {token.redemptions && token.redemptions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <span>👥 Apprenants ayant réclamé ce token ({token.redemptions.length}) :</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {token.redemptions.map((r, i) => (
                        <div
                          key={i}
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 flex items-center gap-1.5"
                        >
                          <span className="font-semibold text-slate-900">{r.userEmail}</span>
                          <span className="text-amber-700 font-bold">({r.previousLevel} ➔ {r.newLevel})</span>
                          <span className="text-slate-400">
                            • {new Date(r.claimedAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================================================================= */}
      {/* MODAL 1: CREATE NEW TOKEN */}
      {/* ================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-amber-500 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100">
                  Administration PA³
                </span>
                <h3 className="text-lg font-black">Générer un Token de Niveau</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type d’Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        type: 'level_grant',
                        title: `Passe Niveau ${p.targetLevel} - Accès Officiel`,
                        bonusXp: 500,
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      formData.type === 'level_grant'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🎯 Palier Fixe
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        type: 'level_boost',
                        title: 'Booster +1 Niveau Supérieur',
                        bonusXp: 400,
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      formData.type === 'level_boost'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    🚀 +1 Niveau
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        type: 'xp_boost',
                        title: 'Pack Super Booster +1000 XP',
                        bonusXp: 1000,
                      }))
                    }
                    className={`p-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      formData.type === 'xp_boost'
                        ? 'border-amber-500 bg-amber-50 text-amber-950 font-black'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ⭐ Bonus XP
                  </button>
                </div>
              </div>

              {formData.type === 'level_grant' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Palier CEFR Accordé
                  </label>
                  <select
                    value={formData.targetLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as CefrTargetLevel;
                      setFormData((p) => ({
                        ...p,
                        targetLevel: lvl,
                        title: `Passe Niveau ${lvl} - Accès Officiel`,
                      }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="A1">Palier A1 - Débutant Fondamental</option>
                    <option value="A2">Palier A2 - Élémentaire Quotidien</option>
                    <option value="B1">Palier B1 - Intermédiaire Professionnel</option>
                    <option value="B2">Palier B2 - Avancé &amp; Affaires</option>
                    <option value="C1">Palier C1 - Expert &amp; Bilinguisme</option>
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Code du Token</label>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, useRandomCode: !p.useRandomCode }))}
                    className="text-[11px] text-amber-700 hover:underline font-bold"
                  >
                    {formData.useRandomCode ? 'Saisir un code personnalisé' : 'Générer un code aléatoire'}
                  </button>
                </div>
                {formData.useRandomCode ? (
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between">
                    <span>Code automatique : PA3-{formData.type === 'xp_boost' ? 'XP' : formData.targetLevel}-XXXX</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">Auto</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    placeholder="Ex: VIP-GOMA-A2, BOURSE-NAOMI"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 uppercase"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre Public</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">XP Bonus Accordé</label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.bonusXp}
                    onChange={(e) => setFormData((p) => ({ ...p, bonusXp: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre d’Utilisations</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.maxRedemptions}
                    onChange={(e) => setFormData((p) => ({ ...p, maxRedemptions: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPurchasable}
                    onChange={(e) => setFormData((p) => ({ ...p, isPurchasable: e.target.checked }))}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Proposer à l’achat aux étudiants (SasPay / Afrimoney)
                  </span>
                </label>

                {formData.isPurchasable && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500">Prix USD ($)</span>
                      <input
                        type="number"
                        min="1"
                        value={formData.priceUsd}
                        onChange={(e) => {
                          const usd = Number(e.target.value);
                          setFormData((p) => ({ ...p, priceUsd: usd, priceCdf: convertUsdToCdf(usd) }));
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500">Prix CDF (Francs)</span>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={formData.priceCdf}
                        onChange={(e) => setFormData((p) => ({ ...p, priceCdf: Number(e.target.value) }))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Interne ou Nom de l’Élève Bénéficiaire
                </label>
                <input
                  type="text"
                  value={formData.note}
                  onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
                  placeholder="Ex: Offert à Junior Ilunga pour résultats du test"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🎟️</span>
                  <span>Générer &amp; Activer le Token</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: EDIT TOKEN (FULL CRUD UPDATE) */}
      {/* ================================================================= */}
      {editingToken && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-navy text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  Modification de Token (CRUD)
                </span>
                <h3 className="text-lg font-black">Modifier le Token {editingToken.code}</h3>
              </div>
              <button
                onClick={() => setEditingToken(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Code du Token</label>
                  <input
                    type="text"
                    required
                    value={editFormData.code}
                    onChange={(e) => setEditFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Statut Actuel</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData((p) => ({ ...p, status: e.target.value as TokenStatus }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="active">Actif (Utilisable)</option>
                    <option value="redeemed">Épuisé (Quota atteint)</option>
                    <option value="revoked">Révoqué (Bloqué)</option>
                    <option value="expired">Expiré</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Palier</label>
                  <select
                    value={editFormData.targetLevel}
                    onChange={(e) => setEditFormData((p) => ({ ...p, targetLevel: e.target.value as CefrTargetLevel }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bonus XP</label>
                  <input
                    type="number"
                    step="50"
                    value={editFormData.bonusXp}
                    onChange={(e) => setEditFormData((p) => ({ ...p, bonusXp: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quota Max</label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.maxRedemptions}
                    onChange={(e) => setEditFormData((p) => ({ ...p, maxRedemptions: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prix USD ($)</label>
                  <input
                    type="number"
                    value={editFormData.priceUsd}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      setEditFormData((p) => ({ ...p, priceUsd: usd, priceCdf: convertUsdToCdf(usd) }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prix CDF (Francs)</label>
                  <input
                    type="number"
                    step="1000"
                    value={editFormData.priceCdf}
                    onChange={(e) => setEditFormData((p) => ({ ...p, priceCdf: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date d’Expiration (Optionnel)</label>
                <input
                  type="date"
                  value={editFormData.expiresAt}
                  onChange={(e) => setEditFormData((p) => ({ ...p, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Note / Bénéficiaire</label>
                <input
                  type="text"
                  value={editFormData.note}
                  onChange={(e) => setEditFormData((p) => ({ ...p, note: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingToken(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-slate-800 text-gold font-black text-xs shadow-md transition active:scale-98 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>💾 Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: BULK GENERATOR (LOT EN MASSE) */}
      {/* ================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Générateur Multiple en Lot
                </span>
                <h3 className="text-lg font-black">Générer un Lot de Tokens</h3>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBulkGenerateSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de Tokens</label>
                  <select
                    value={bulkCount}
                    onChange={(e) => setBulkCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value={5}>5 Tokens</option>
                    <option value={10}>10 Tokens</option>
                    <option value={20}>20 Tokens</option>
                    <option value={50}>50 Tokens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Préfixe du Code</label>
                  <input
                    type="text"
                    required
                    value={bulkPrefix}
                    onChange={(e) => setBulkPrefix(e.target.value.toUpperCase())}
                    placeholder="Ex: UPC-A2, GOMA-B1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Niveau Accordé</label>
                  <select
                    value={bulkTargetLevel}
                    onChange={(e) => setBulkTargetLevel(e.target.value as CefrTargetLevel)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value="A1">Palier A1</option>
                    <option value="A2">Palier A2</option>
                    <option value="B1">Palier B1</option>
                    <option value="B2">Palier B2</option>
                    <option value="C1">Palier C1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bonus XP</label>
                  <input
                    type="number"
                    step="50"
                    value={bulkBonusXp}
                    onChange={(e) => setBulkBonusXp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre du Lot</label>
                <input
                  type="text"
                  required
                  value={bulkTitle}
                  onChange={(e) => setBulkTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Note pour ce groupe</label>
                <input
                  type="text"
                  value={bulkNote}
                  onChange={(e) => setBulkNote(e.target.value)}
                  placeholder="Ex: Bourses pour étudiants UPC Kinshasa"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                />
              </div>

              {/* Display generated batch if available */}
              {bulkGeneratedCodes.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>✨ {bulkGeneratedCodes.length} codes générés :</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(bulkGeneratedCodes.join('\n'));
                        toast.success('Tous les codes copiés dans le presse-papier !');
                      }}
                      className="text-[11px] underline text-emerald-800 font-extrabold cursor-pointer"
                    >
                      Copier tous les codes
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto p-2 bg-white rounded-xl border border-emerald-200 text-xs font-mono text-emerald-950 space-y-1">
                    {bulkGeneratedCodes.map((c, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{c}</span>
                        <span className="text-[10px] text-slate-400">Palier {bulkTargetLevel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <span>📦</span>
                  <span>Lancer la Génération ({bulkCount} Tokens)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
