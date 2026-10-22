import { CefrLevel } from "@/lib/supabase/database.types";

export interface CertificateData {
  code: string;
  learnerName: string;
  levelCode: CefrLevel;
  levelTitleFr: string;
  score: number;
  issuedAt: string;
  academyName: string;
  sloganFr: string;
  coachName: string;
  coachTitle: string;
  qrUrl: string;
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

/**
 * Mock/seed certificates store for public verification demo.
 */
export const SAMPLE_CERTIFICATES: Record<string, CertificateData> = {
  "PA3-A1-DEMO-2026": {
    code: "PA3-A1-DEMO-2026",
    learnerName: "Patrick Ilunga",
    levelCode: "A1",
    levelTitleFr: "Niveau A1 — Débutant",
    score: 88,
    issuedAt: "2026-10-21",
    academyName: "PA³ English Academy",
    sloganFr: "Parler Anglais Avec Assurance",
    coachName: "Coach David Liandja",
    coachTitle: "Head Coach & Fondateur",
    qrUrl: "http://localhost:3000/verify/PA3-A1-DEMO-2026",
  },
  "PA3-A2-SAMPLE-99": {
    code: "PA3-A2-SAMPLE-99",
    learnerName: "Grâce Mwamba",
    levelCode: "A2",
    levelTitleFr: "Niveau A2 — Élémentaire",
    score: 92,
    issuedAt: "2026-10-15",
    academyName: "PA³ English Academy",
    sloganFr: "Parler Anglais Avec Assurance",
    coachName: "Coach David Liandja",
    coachTitle: "Head Coach & Fondateur",
    qrUrl: "http://localhost:3000/verify/PA3-A2-SAMPLE-99",
  },
};
