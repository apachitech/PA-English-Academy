"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Video,
  Play,
  Search,
  Sparkles,
  Zap,
  Lock,
  Clock,
  Eye,
  CheckCircle2,
  X,
  Volume2,
  ExternalLink,
  MessageCircle,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import {
  VodVideo,
  VodCategory,
  VOD_CATEGORIES,
  getStoredVodVideos,
} from "@/lib/domain/vod";
import { BRAND } from "@/lib/brand";
import { toast } from "sonner";

export default function VodPage() {
  const [videos, setVideos] = useState<VodVideo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [filterAccess, setFilterAccess] = useState<"all" | "free" | "member">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<VodVideo | null>(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setVideos(getStoredVodVideos());

    try {
      const storedWatched = localStorage.getItem("pa3_watched_vod_ids");
      if (storedWatched) {
        setWatchedVideoIds(JSON.parse(storedWatched));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleMarkWatched = (videoId: string, xpReward: number) => {
    if (watchedVideoIds.includes(videoId)) {
      toast.info("Vous avez déjà validé cette vidéo !");
      return;
    }
    const updated = [...watchedVideoIds, videoId];
    setWatchedVideoIds(updated);
    try {
      localStorage.setItem("pa3_watched_vod_ids", JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.success(`🎉 Bravo ! Vous avez gagné +${xpReward} XP pour cette vidéo !`);
  };

  const filteredVideos = videos.filter((v) => {
    if (v.status !== "published") return false;
    if (selectedCategory !== "all" && v.category !== selectedCategory) return false;
    if (selectedLevel !== "all" && v.level !== selectedLevel && v.level !== "Tous") return false;
    if (filterAccess === "free" && !v.isFree) return false;
    if (filterAccess === "member" && v.isFree) return false;
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchDesc = v.description.toLowerCase().includes(q);
      const matchNote = v.coachNote?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc && !matchNote) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-navy">
      {/* Top flag bar */}
      <div className="flag-badge h-1 w-full" />

      {/* Clean Spacious Navbar with Side Menu */}
      <Navbar variant="app" showTestCta={true} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-slate-900 to-navy-dark text-white p-6 sm:p-10 border border-amber-400/30 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold uppercase px-3.5 py-1.5 rounded-full border border-amber-400/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>VOD • Vidéos à la Demande HD & Éco 3G</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Regardez, écoutez et progressez à votre rythme
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Des capsules vidéo ciblées, cours de prononciation et masterclasses
              exclusives animées par <strong>Coach David Liandja</strong>. Compatible
              avec le streaming <strong>Cloudinary</strong> faible consommation de données.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Video className="w-4 h-4 text-amber-400" />
                <span>{videos.filter((v) => v.status === "published").length} Vidéos disponibles</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Cloudinary HD + 3G Éco</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Gagnez jusqu&apos;à 80 XP par vidéo</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher une vidéo (ex: prononciation, entretien, Zoom, TH...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-500 mr-1">Niveau :</span>
              {["all", "A1", "A2", "B1", "B2"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedLevel === lvl
                      ? "bg-navy text-white shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {lvl === "all" ? "Tous" : lvl}
                </button>
              ))}
            </div>

            {/* Access Selector */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-500 mr-1">Accès :</span>
              <button
                onClick={() => setFilterAccess("all")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterAccess === "all"
                    ? "bg-amber-400 text-slate-950 font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterAccess("free")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterAccess === "free"
                    ? "bg-emerald-600 text-white font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Gratuit
              </button>
              <button
                onClick={() => setFilterAccess("member")}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterAccess === "member"
                    ? "bg-purple-600 text-white font-black"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Pass Membre
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === "all"
                  ? "bg-amber-400 text-slate-950 shadow-2xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>🔥 Toutes les vidéos</span>
              <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">
                {videos.filter((v) => v.status === "published").length}
              </span>
            </button>

            {VOD_CATEGORIES.map((cat) => {
              const count = videos.filter(
                (v) => v.status === "published" && v.category === cat.id
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-navy text-white shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className="text-[10px] bg-slate-400/20 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <Video className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Aucune vidéo trouvée
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Essayez d&apos;élargir vos filtres ou de modifier votre terme de recherche.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLevel("all");
                setFilterAccess("all");
                setSearchQuery("");
              }}
              className="btn-3d-gold px-4 py-2 rounded-xl text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const isWatched = watchedVideoIds.includes(video.id);

              return (
                <div
                  key={video.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Thumbnail / Header */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {video.posterUrl ? (
                      <Image
                        src={video.posterUrl}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy to-slate-900 text-slate-500">
                        <Video className="w-12 h-12 text-amber-400/50" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Badges Top */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="bg-navy/90 text-amber-400 border border-amber-400/30 text-[10px] font-black px-2 py-0.5 rounded-md">
                        Niveau {video.level}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {video.provider === "cloudinary" && (
                          <span
                            className="bg-sky-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs"
                            title="Hébergé sur Cloudinary avec optimisation automatique de débit"
                          >
                            <span>Cloudinary</span>
                          </span>
                        )}

                        {video.isFree ? (
                          <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                            100% Gratuit
                          </span>
                        ) : (
                          <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Pass Membre</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setActiveVideo(video)}
                      className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer"
                      title="Lire la vidéo"
                    >
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </button>

                    {/* Bottom Badges */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-medium">
                      <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{video.durationMinutes} min</span>
                      </span>

                      <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>+{video.xpReward} XP</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                          {VOD_CATEGORIES.find((c) => c.id === video.category)?.label || video.category}
                        </span>

                        {isWatched && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Complété</span>
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setActiveVideo(video)}
                        className="font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer line-clamp-2 text-sm leading-snug"
                      >
                        {video.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{video.viewsCount.toLocaleString()} vues</span>
                      </span>

                      <button
                        onClick={() => setActiveVideo(video)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-400 hover:text-slate-950 text-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Regarder</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Interactive Theater Video Modal (Strictly Viewport-Bounded) */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Pinned Header with Close */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {activeVideo.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Niveau {activeVideo.level}</span>
                    <span>•</span>
                    <span>{activeVideo.durationMinutes} min</span>
                    {activeVideo.provider === "cloudinary" && (
                      <>
                        <span>•</span>
                        <span className="text-sky-600 font-bold">Cloudinary HD / 3G</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                aria-label="Fermer le lecteur vidéo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Video Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
              {/* Responsive Video Player */}
              <div className="rounded-2xl overflow-hidden shadow-md">
                <VideoPlayer
                  provider={activeVideo.provider}
                  url={activeVideo.url}
                  lowUrl={activeVideo.lowUrl}
                  audioUrl={activeVideo.audioUrl}
                  posterUrl={activeVideo.posterUrl}
                  title={activeVideo.title}
                  transcriptFr={activeVideo.coachNote}
                  dataSaverDefault={false}
                />
              </div>

              {/* Video Info & Summary */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-black text-slate-900 text-base">
                    Description de la leçon
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl">
                      <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>+{activeVideo.xpReward} XP accordés</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {activeVideo.description}
                </p>

                {activeVideo.coachNote && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                    <p className="font-black uppercase tracking-wider text-[11px] text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Note pédagogique du Coach David Liandja</span>
                    </p>
                    <p className="leading-relaxed">{activeVideo.coachNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pinned Footer with Actions */}
            <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 gap-3">
              <a
                href={BRAND.coach.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Poser une question au Coach</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Fermer
                </button>

                <button
                  type="button"
                  onClick={() => handleMarkWatched(activeVideo.id, activeVideo.xpReward)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition ${
                    watchedVideoIds.includes(activeVideo.id)
                      ? "bg-emerald-600 text-white"
                      : "btn-3d-gold"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {watchedVideoIds.includes(activeVideo.id)
                      ? "Visionné (+XP acquis)"
                      : "Marquer comme visionné (+XP)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
