import { VideoProvider } from "@/lib/supabase/database.types";

/**
 * Automatically detects the video provider from any pasted video URL.
 */
export function detectVideoProvider(url: string): VideoProvider {
  if (!url || typeof url !== "string") return "mp4";
  const trimmed = url.trim().toLowerCase();

  if (trimmed.includes("cloudinary.com") || trimmed.includes("res.cloudinary.com")) {
    return "cloudinary";
  }
  if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
    return "youtube";
  }
  if (trimmed.includes("vimeo.com")) {
    return "vimeo";
  }
  if (trimmed.endsWith(".m3u8") || trimmed.includes("/hls/")) {
    return "hls";
  }
  return "mp4";
}

/**
 * Checks if a Cloudinary URL is an interactive player / iframe embed URL.
 */
export function isCloudinaryEmbed(url: string): boolean {
  if (!url) return false;
  return url.includes("player.cloudinary.com") || url.includes("/embed/");
}

/**
 * Automatically creates an eco/low-bandwidth URL for Cloudinary videos (ideal for 3G in RDC).
 */
export function getCloudinaryEcoUrl(url: string): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) {
    return url;
  }
  // If transformations already exist, return as is
  if (url.includes("/video/upload/q_auto:eco")) return url;
  return url.replace("/video/upload/", "/video/upload/q_auto:eco,w_480,vc_auto/");
}

/**
 * Automatically generates a poster/thumbnail URL from a Cloudinary video URL.
 */
export function getCloudinaryPosterUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) {
    return null;
  }
  return url
    .replace("/video/upload/", "/video/upload/so_0,w_800,q_auto,f_jpg/")
    .replace(/\.[a-zA-Z0-9]+$/, ".jpg");
}

/**
 * Automatically generates an audio-only stream from a Cloudinary video URL for maximum data saving.
 */
export function getCloudinaryAudioUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) {
    return null;
  }
  return url
    .replace("/video/upload/", "/video/upload/f_mp3,q_auto:eco/")
    .replace(/\.[a-zA-Z0-9]+$/, ".mp3");
}
