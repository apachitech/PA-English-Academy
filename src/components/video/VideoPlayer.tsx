"use client";

import { useState, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  WifiOff,
  Video,
  FileText,
  Subtitles,
} from "lucide-react";
import { CaptionTrack, VideoProvider } from "@/lib/supabase/database.types";
import {
  isCloudinaryEmbed,
  getCloudinaryEcoUrl,
  getCloudinaryPosterUrl,
  getCloudinaryAudioUrl,
} from "@/lib/video-helpers";

interface VideoPlayerProps {
  provider: VideoProvider;
  url: string;
  lowUrl?: string | null;
  audioUrl?: string | null;
  posterUrl?: string | null;
  title?: string;
  captions?: CaptionTrack[];
  transcriptFr?: string | null;
  dataSaverDefault?: boolean;
}

export function VideoPlayer({
  provider,
  url,
  lowUrl,
  audioUrl,
  posterUrl = "/images/posters/salutations.webp",
  title = "Vidéo du cours",
  captions = [],
  transcriptFr,
  dataSaverDefault = false,
}: VideoPlayerProps) {
  const [dataSaver, setDataSaver] = useState(dataSaverDefault);
  const [audioOnly, setAudioOnly] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Compute effective URLs with Cloudinary smart optimizations
  const isCloudinary = provider === "cloudinary" || url.includes("cloudinary.com");
  const effectiveLowUrl = lowUrl || (isCloudinary ? getCloudinaryEcoUrl(url) : null);
  const effectiveAudioUrl = audioUrl || (isCloudinary ? getCloudinaryAudioUrl(url) : null);
  const effectivePosterUrl = posterUrl || (isCloudinary ? getCloudinaryPosterUrl(url) : null);

  // If data saver is active and lowUrl is provided (or auto-generated for Cloudinary), choose lowUrl
  const activeVideoUrl = dataSaver && effectiveLowUrl ? effectiveLowUrl : url;

  // Render Cloudinary interactive embed if provided as embed player
  if ((provider === "cloudinary" || url.includes("cloudinary.com")) && isCloudinaryEmbed(url)) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900 text-slate-300 p-2.5 rounded-xl">
          <span className="font-bold text-white flex items-center gap-1.5 truncate">
            <Video className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">{title}</span>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30 font-semibold">
              Cloudinary Player
            </span>
          </span>
          {transcriptFr && (
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Résumé FR</span>
            </button>
          )}
        </div>
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-800">
          <iframe
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
        {showTranscript && transcriptFr && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed animate-pop">
            <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-1">
              Résumé & Contexte de la vidéo (en Français)
            </p>
            <p>{transcriptFr}</p>
          </div>
        )}
      </div>
    );
  }

  // Render Vimeo embed
  if (provider === "vimeo" || url.includes("vimeo.com")) {
    const vimeoMatches = url.match(/(?:vimeo\.com\/)(\d+)/);
    const vimeoId = vimeoMatches ? vimeoMatches[1] : url.replace(/[^0-9]/g, "");

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900 text-slate-300 p-2.5 rounded-xl">
          <span className="font-bold text-white flex items-center gap-1.5 truncate">
            <Video className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">{title}</span>
          </span>
          {transcriptFr && (
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Résumé FR</span>
            </button>
          )}
        </div>
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-800">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
            allowFullScreen
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
        {showTranscript && transcriptFr && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed animate-pop">
            <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-1">
              Résumé & Contexte de la vidéo (en Français)
            </p>
            <p>{transcriptFr}</p>
          </div>
        )}
      </div>
    );
  }

  // Render YouTube embed
  if (provider === "youtube") {
    // Extract video ID from URL or code
    const videoId = url.includes("v=")
      ? url.split("v=")[1].split("&")[0]
      : url.includes("youtu.be/")
      ? url.split("youtu.be/")[1]
      : url;

    return (
      <div className="space-y-3">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900 text-slate-300 p-2.5 rounded-xl">
          <span className="font-bold text-white flex items-center gap-1.5 truncate">
            <Video className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">{title}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDataSaver(!dataSaver)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                dataSaver
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:text-white"
              }`}
              title="Baisse la résolution pour économiser vos mégabytes"
            >
              {dataSaver ? "Éco Données : Actif" : "Éco Données : Off"}
            </button>

            {transcriptFr && (
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Résumé FR</span>
              </button>
            )}
          </div>
        </div>

        {/* Video / Audio container */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-800">
          {audioOnly ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-navy text-center text-white space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Volume2 className="w-8 h-8" />
              </div>
              <p className="font-bold text-sm">Mode Audio Uniquement (Économie maximale)</p>
              <button
                type="button"
                onClick={() => setAudioOnly(false)}
                className="btn-3d-gold px-4 py-2 rounded-xl text-xs font-bold"
              >
                Afficher l'image vidéo
              </button>
            </div>
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              loading="lazy"
            />
          )}
        </div>

        {/* Transcript drawer */}
        {showTranscript && transcriptFr && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed animate-pop">
            <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-1">
              Résumé & Contexte de la vidéo (en Français)
            </p>
            <p>{transcriptFr}</p>
          </div>
        )}
      </div>
    );
  }

  // Render MP4 or direct video
  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900 text-slate-300 p-2.5 rounded-xl">
        <span className="font-bold text-white flex items-center gap-1.5 truncate">
          <Video className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">{title}</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Audio-only toggle */}
          <button
            type="button"
            onClick={() => setAudioOnly(!audioOnly)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
              audioOnly
                ? "bg-amber-500 text-amber-950 font-black"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
            title="Coupe la vidéo et lit uniquement l'audio pour économiser le forfait"
          >
            {audioOnly ? "Audio seul (Éco Max)" : "Audio seul"}
          </button>

          {/* Low-data toggle */}
          <button
            type="button"
            onClick={() => setDataSaver(!dataSaver)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
              dataSaver
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
            title="Passe en qualité allégée 240p/360p"
          >
            {dataSaver ? "3G Éco" : "Qualité normale"}
          </button>

          {transcriptFr && (
            <button
              type="button"
              onClick={() => setShowTranscript(!showTranscript)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Résumé
            </button>
          )}
        </div>
      </div>

      {/* HTML5 Video Element */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-800">
        {audioOnly ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-navy text-center text-white space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center animate-pulse">
              <Volume2 className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-sm">Mode Audio Uniquement (Faible conso)</p>
              <p className="text-xs text-slate-300 mt-0.5">
                Écoutez la prononciation sans charger les images.
              </p>
            </div>
            <audio controls src={effectiveAudioUrl || activeVideoUrl || undefined} className="w-full max-w-xs mt-2" />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={activeVideoUrl || undefined}
            poster={effectivePosterUrl || undefined}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            {captions
              .filter((cap) => Boolean(cap && cap.url && cap.url.trim().length > 0))
              .map((cap) => (
                <track
                  key={cap.lang}
                  src={cap.url}
                  kind="subtitles"
                  srcLang={cap.lang}
                  label={cap.label}
                  default={cap.lang === "fr"}
                />
              ))}
            Votre navigateur ne supporte pas la balise vidéo.
          </video>
        )}
      </div>

      {/* Transcript drawer */}
      {showTranscript && transcriptFr && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 leading-relaxed animate-pop">
          <p className="font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-1">
            Résumé & Contexte de la leçon (en Français)
          </p>
          <p>{transcriptFr}</p>
        </div>
      )}
    </div>
  );
}
