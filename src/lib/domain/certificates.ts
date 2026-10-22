import { CefrLevel } from "@/lib/supabase/database.types";
import { BRAND } from "@/lib/brand";

export interface CertificateCompetence {
  skill: string;
  skillFr: string;
  score: number;
}

export interface CertificateData {
  code: string;
  learnerName: string;
  levelCode: CefrLevel;
  levelTitleFr: string;
  levelTitleEn: string;
  score: number;
  mention: string;
  issuedAt: string;
  academyName: string;
  sloganFr: string;
  coachName: string;
  coachTitle: string;
  serialNumber: string;
  verificationHash: string;
  qrUrl: string;
  competences: CertificateCompetence[];
}

/**
 * Generate a friendly unique public certificate code:
 * Format: PA3-[LEVEL]-[RANDOM4]-[RANDOM4]
 * Example: PA3-A1-8RF2-9KL4
 */
export function generateCertificateCode(level: CefrLevel): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // No confusing 0/O, 1/I
  const rand4 = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `PA3-${level}-${rand4()}-${rand4()}`;
}

export const LEVEL_METADATA: Record<
  CefrLevel,
  { titleFr: string; titleEn: string; defaultScore: number }
> = {
  A1: {
    titleFr: "Niveau A1 — Débutant (Breakthrough)",
    titleEn: "Level A1 — Elementary & Daily Communication",
    defaultScore: 88,
  },
  A2: {
    titleFr: "Niveau A2 — Élémentaire (Waystage)",
    titleEn: "Level A2 — Practical Conversation & Routine",
    defaultScore: 91,
  },
  B1: {
    titleFr: "Niveau B1 — Intermédiaire (Threshold)",
    titleEn: "Level B1 — Professional & Autonomous Fluency",
    defaultScore: 89,
  },
  B2: {
    titleFr: "Niveau B2 — Intermédiaire Avancé (Vantage)",
    titleEn: "Level B2 — Advanced Debate, Interview & Business",
    defaultScore: 93,
  },
};

/**
 * Base mock/seed certificates repository
 */
export const SAMPLE_CERTIFICATES: Record<string, CertificateData> = {
  "PA3-A1-DEMO-2026": {
    code: "PA3-A1-DEMO-2026",
    learnerName: "Patrick Kalonji",
    levelCode: "A1",
    levelTitleFr: "Niveau A1 — Débutant (Breakthrough)",
    levelTitleEn: "Level A1 — Elementary & Daily Communication",
    score: 88,
    mention: "Mention Très Bien • With High Honors",
    issuedAt: "21 Octobre 2026",
    academyName: BRAND.name,
    sloganFr: BRAND.slogan,
    coachName: BRAND.coach.name,
    coachTitle: "Fondateur & Head Coach",
    serialNumber: "CD-PA3-2026-A1-884102",
    verificationHash: "8F3E-92BC-71DA-A44F",
    qrUrl: "https://pa-english-academy.vercel.app/verify/PA3-A1-DEMO-2026",
    competences: [
      { skill: "Listening", skillFr: "Compréhension Orale", score: 90 },
      { skill: "Speaking", skillFr: "Production Orale & Prononciation", score: 86 },
      { skill: "Reading", skillFr: "Lecture & Vocabulaire Pratique", score: 89 },
      { skill: "Grammar", skillFr: "Structure & Grammaire Anglaise", score: 87 },
    ],
  },
  "PA3-A2-SAMPLE-99": {
    code: "PA3-A2-SAMPLE-99",
    learnerName: "Grâce Mwamba",
    levelCode: "A2",
    levelTitleFr: "Niveau A2 — Élémentaire (Waystage)",
    levelTitleEn: "Level A2 — Practical Conversation & Routine",
    score: 92,
    mention: "Mention Excellente • With Highest Honors",
    issuedAt: "15 Octobre 2026",
    academyName: BRAND.name,
    sloganFr: BRAND.slogan,
    coachName: BRAND.coach.name,
    coachTitle: "Fondateur & Head Coach",
    serialNumber: "CD-PA3-2026-A2-990541",
    verificationHash: "4D1B-77FA-90EE-B31C",
    qrUrl: "https://pa-english-academy.vercel.app/verify/PA3-A2-SAMPLE-99",
    competences: [
      { skill: "Listening", skillFr: "Compréhension Orale", score: 94 },
      { skill: "Speaking", skillFr: "Expression & Fluidité Orale", score: 91 },
      { skill: "Reading", skillFr: "Lecture & Assimilation de Textes", score: 93 },
      { skill: "Grammar", skillFr: "Structure du Passé & Conjugaison", score: 90 },
    ],
  },
};

/**
 * Resolves a certificate with dynamic name substitution if available
 */
export function resolveCertificate(
  certificateId: string,
  preferredName?: string | null
): CertificateData {
  const upper = certificateId.toUpperCase();
  const base = SAMPLE_CERTIFICATES[upper];

  const effectiveName =
    preferredName && preferredName.trim()
      ? preferredName.trim()
      : base?.learnerName || "Apprenant PA³ Academy";

  if (base) {
    return {
      ...base,
      learnerName: effectiveName,
      qrUrl: `https://pa-english-academy.vercel.app/verify/${upper}`,
    };
  }

  // Derive level from code if pattern matches PA3-[LEVEL]-...
  const parts = upper.split("-");
  const parsedLevel: CefrLevel = ["A1", "A2", "B1", "B2"].includes(parts[1])
    ? (parts[1] as CefrLevel)
    : "A1";

  const meta = LEVEL_METADATA[parsedLevel];

  return {
    code: upper,
    learnerName: effectiveName,
    levelCode: parsedLevel,
    levelTitleFr: meta.titleFr,
    levelTitleEn: meta.titleEn,
    score: 87,
    mention: "Mention Bien • Validé avec Succès",
    issuedAt: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    academyName: BRAND.name,
    sloganFr: BRAND.slogan,
    coachName: BRAND.coach.name,
    coachTitle: "Fondateur & Head Coach",
    serialNumber: `CD-PA3-2026-${parsedLevel}-${Math.floor(100000 + Math.random() * 900000)}`,
    verificationHash: Array.from({ length: 4 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase()
    ).join("-"),
    qrUrl: `https://pa-english-academy.vercel.app/verify/${upper}`,
    competences: [
      { skill: "Listening", skillFr: "Compréhension Orale", score: 88 },
      { skill: "Speaking", skillFr: "Prononciation & Aisance", score: 86 },
      { skill: "Reading", skillFr: "Compréhension Écrite", score: 87 },
      { skill: "Grammar", skillFr: "Maîtrise Linguistique", score: 87 },
    ],
  };
}

/**
 * Returns certificates attributed to the current student
 */
export function getLearnerCertificates(
  learnerName: string,
  currentLevel: string = "A1"
): CertificateData[] {
  const name = learnerName && learnerName.trim() ? learnerName.trim() : "Apprenant PA³";

  const certs: CertificateData[] = [
    {
      code: "PA3-A1-DEMO-2026",
      learnerName: name,
      levelCode: "A1",
      levelTitleFr: "Niveau A1 — Débutant (Breakthrough)",
      levelTitleEn: "Level A1 — Elementary & Daily Communication",
      score: 88,
      mention: "Mention Très Bien • With High Honors",
      issuedAt: "21 Octobre 2026",
      academyName: BRAND.name,
      sloganFr: BRAND.slogan,
      coachName: BRAND.coach.name,
      coachTitle: "Fondateur & Head Coach",
      serialNumber: "CD-PA3-2026-A1-884102",
      verificationHash: "8F3E-92BC-71DA-A44F",
      qrUrl: `https://pa-english-academy.vercel.app/verify/PA3-A1-DEMO-2026?name=${encodeURIComponent(name)}`,
      competences: [
        { skill: "Listening", skillFr: "Compréhension Orale", score: 90 },
        { skill: "Speaking", skillFr: "Production Orale & Prononciation", score: 86 },
        { skill: "Reading", skillFr: "Lecture & Vocabulaire Pratique", score: 89 },
        { skill: "Grammar", skillFr: "Structure & Grammaire Anglaise", score: 87 },
      ],
    },
  ];

  if (currentLevel === "A2" || currentLevel === "B1" || currentLevel === "B2") {
    certs.push({
      code: "PA3-A2-SAMPLE-99",
      learnerName: name,
      levelCode: "A2",
      levelTitleFr: "Niveau A2 — Élémentaire (Waystage)",
      levelTitleEn: "Level A2 — Practical Conversation & Routine",
      score: 92,
      mention: "Mention Excellente • With Highest Honors",
      issuedAt: "15 Octobre 2026",
      academyName: BRAND.name,
      sloganFr: BRAND.slogan,
      coachName: BRAND.coach.name,
      coachTitle: "Fondateur & Head Coach",
      serialNumber: "CD-PA3-2026-A2-990541",
      verificationHash: "4D1B-77FA-90EE-B31C",
      qrUrl: `https://pa-english-academy.vercel.app/verify/PA3-A2-SAMPLE-99?name=${encodeURIComponent(name)}`,
      competences: [
        { skill: "Listening", skillFr: "Compréhension Orale", score: 94 },
        { skill: "Speaking", skillFr: "Expression & Fluidité Orale", score: 91 },
        { skill: "Reading", skillFr: "Lecture & Assimilation de Textes", score: 93 },
        { skill: "Grammar", skillFr: "Structure du Passé & Conjugaison", score: 90 },
      ],
    });
  }

  return certs;
}
