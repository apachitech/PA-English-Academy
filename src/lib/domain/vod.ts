import { VideoProvider } from "@/lib/supabase/database.types";

export type VodCategory =
  | "prononciation"
  | "grammaire"
  | "vocabulaire"
  | "business"
  | "expression_orale"
  | "masterclass";

export interface VodVideo {
  id: string;
  title: string;
  description: string;
  category: VodCategory;
  level: string; // "A1", "A2", "B1", "B2", "Tous"
  provider: VideoProvider;
  url: string; // Cloudinary, YouTube, Vimeo, MP4
  lowUrl?: string; // Eco 3G stream
  audioUrl?: string; // Audio-only stream
  posterUrl?: string; // Poster thumbnail
  durationMinutes: number;
  isFree: boolean;
  status: "published" | "draft";
  viewsCount: number;
  xpReward: number;
  coachNote?: string;
  createdAt: string;
  updatedAt: string;
}

export const VOD_CATEGORIES: { id: VodCategory; label: string; icon: string; description: string }[] = [
  {
    id: "prononciation",
    label: "Prononciation & Accent",
    icon: "🗣️",
    description: "Éliminez l'accent francophone et maîtrisez les sons difficiles (TH, R, voyelles courtes)",
  },
  {
    id: "business",
    label: "Anglais Professionnel & Business",
    icon: "💼",
    description: "Réunions, emails, négociations commerciales et entretiens d'embauche en RDC",
  },
  {
    id: "expression_orale",
    label: "Expression Orale & Spontanéité",
    icon: "⚡",
    description: "Parlez sans traduire dans votre tête, formules de conversation courante",
  },
  {
    id: "grammaire",
    label: "Grammaire Essentielle & Raccourcis",
    icon: "🧩",
    description: "Règles simples, temps verbaux utiles et pièges fréquents",
  },
  {
    id: "vocabulaire",
    label: "Vocabulaire Thématique",
    icon: "📚",
    description: "Lexique du travail, voyages, technologies et vie quotidienne",
  },
  {
    id: "masterclass",
    label: "Masterclasses & Conférences",
    icon: "🎓",
    description: "Séances approfondies enregistrées avec Coach David Liandja à Kinshasa",
  },
];

export const INITIAL_VOD_VIDEOS: VodVideo[] = [
  {
    id: "vod_prononciation_01",
    title: "Les 10 erreurs de prononciation typiques des francophones en RDC",
    description:
      "Comment prononcer le 'TH' (think vs this), différencier 'ship' et 'sheep', et arrêter d'ajouter un son 'e' devant 'speak'. Coaching concret avec phonétique simplifiée.",
    category: "prononciation",
    level: "A1",
    provider: "cloudinary",
    url: "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/samples/sea-turtle.mp4",
    lowUrl: "https://res.cloudinary.com/demo/video/upload/q_auto:eco,w_480/samples/sea-turtle.mp4",
    posterUrl: "https://res.cloudinary.com/demo/video/upload/so_0,w_800,f_jpg/samples/sea-turtle.jpg",
    durationMinutes: 14,
    isFree: true,
    status: "published",
    viewsCount: 1420,
    xpReward: 35,
    coachNote: "Répétez à voix haute chaque mot trois fois en observant la position de la langue.",
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "vod_business_01",
    title: "Réussir son entretien d'embauche en anglais à Kinshasa & Goma",
    description:
      "Les questions pièges des ONG internationales et multinationales (MONUSCO, Vodacom, Rawbank, agences ONU). Réponses modèles percutantes et vocabulaire de valorisation.",
    category: "business",
    level: "B1",
    provider: "cloudinary",
    url: "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/dog.mp4",
    lowUrl: "https://res.cloudinary.com/demo/video/upload/q_auto:eco,w_480/dog.mp4",
    posterUrl: "https://res.cloudinary.com/demo/video/upload/so_0,w_800,f_jpg/dog.jpg",
    durationMinutes: 28,
    isFree: false,
    status: "published",
    viewsCount: 2890,
    xpReward: 60,
    coachNote: "Téléchargez la fiche mémo des 5 verbes d'action les plus demandés par les recruteurs.",
    createdAt: "2026-03-05T14:30:00Z",
    updatedAt: "2026-03-05T14:30:00Z",
  },
  {
    id: "vod_masterclass_01",
    title: "Masterclass : Du Lingala/Français à l'Anglais courant sans blocage",
    description:
      "Session interactive complète sur les mécanismes psychologiques du blocage à l'oral et les passerelles syntaxiques directes pour penser en anglais dès aujourd'hui.",
    category: "masterclass",
    level: "A2",
    provider: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    durationMinutes: 45,
    isFree: true,
    status: "published",
    viewsCount: 3750,
    xpReward: 80,
    coachNote: "Prenez des notes sur la méthode des 3 piliers : Audition passive, Répétition ombrée, Production active.",
    createdAt: "2026-03-10T09:00:00Z",
    updatedAt: "2026-03-10T09:00:00Z",
  },
  {
    id: "vod_expression_01",
    title: "50 expressions idiomatiques indispensables pour les réunions Zoom",
    description:
      "Ne dites plus 'I propose to start', dites 'Let's kick things off'. Maîtrisez le jargon fluide des réunions professionnelles à distance.",
    category: "expression_orale",
    level: "B2",
    provider: "cloudinary",
    url: "https://res.cloudinary.com/demo/video/upload/q_auto,f_auto/samples/elephants.mp4",
    lowUrl: "https://res.cloudinary.com/demo/video/upload/q_auto:eco,w_480/samples/elephants.mp4",
    posterUrl: "https://res.cloudinary.com/demo/video/upload/so_0,w_800,f_jpg/samples/elephants.jpg",
    durationMinutes: 22,
    isFree: false,
    status: "published",
    viewsCount: 940,
    xpReward: 50,
    coachNote: "Astuce : utilisez au moins 2 de ces expressions lors de votre prochaine visio.",
    createdAt: "2026-03-15T16:00:00Z",
    updatedAt: "2026-03-15T16:00:00Z",
  },
  {
    id: "vod_grammaire_01",
    title: "Le Past Simple vs Present Perfect expliqué simplement",
    description:
      "La distinction qui pose le plus de problèmes aux Congolais francophones enfin clarifiée avec des exemples tirés de la vie quotidienne à Kinshasa.",
    category: "grammaire",
    level: "A2",
    provider: "mp4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80",
    durationMinutes: 16,
    isFree: true,
    status: "published",
    viewsCount: 1810,
    xpReward: 40,
    coachNote: "Faites le quiz d'application directement après avoir visionné cette leçon.",
    createdAt: "2026-03-18T11:00:00Z",
    updatedAt: "2026-03-18T11:00:00Z",
  },
];

const VOD_STORAGE_KEY = "pa3_admin_vod_videos";

export function getStoredVodVideos(): VodVideo[] {
  if (typeof window === "undefined") {
    return INITIAL_VOD_VIDEOS;
  }
  try {
    const raw = localStorage.getItem(VOD_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VOD_STORAGE_KEY, JSON.stringify(INITIAL_VOD_VIDEOS));
      return INITIAL_VOD_VIDEOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_VOD_VIDEOS;
  } catch (err) {
    console.error("Failed to load VOD videos from localStorage:", err);
    return INITIAL_VOD_VIDEOS;
  }
}

export function saveStoredVodVideos(videos: VodVideo[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOD_STORAGE_KEY, JSON.stringify(videos));
  } catch (err) {
    console.error("Failed to save VOD videos to localStorage:", err);
  }
}
