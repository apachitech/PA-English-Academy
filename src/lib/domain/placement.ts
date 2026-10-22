import { CefrLevel, Skill } from "@/lib/supabase/database.types";
import { PLACEMENT_QUESTIONS, PlacementQuestion } from "./placement-bank";

export interface AnswerRecord {
  questionId: string;
  level: CefrLevel;
  skill: Skill;
  chosenIndex: number;
  isCorrect: boolean;
  answeredAt: string;
}

export interface SkillScore {
  skill: Skill;
  labelFr: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface LevelScore {
  level: CefrLevel;
  total: number;
  correct: number;
  percentage: number;
}

export interface PlacementResult {
  cefrLevel: CefrLevel;
  titleFr: string;
  descriptionFr: string;
  recommendedStartingLevel: CefrLevel;
  totalQuestions: number;
  totalCorrect: number;
  overallPercentage: number;
  skillScores: Record<Skill, SkillScore>;
  levelScores: Record<CefrLevel, LevelScore>;
  strengths: string[];
  weaknesses: string[];
}

export const CEFR_ORDER: CefrLevel[] = ["A1", "A2", "B1", "B2"];

export const LEVEL_DESCRIPTIONS: Record<
  CefrLevel,
  { titleFr: string; descriptionFr: string }
> = {
  A1: {
    titleFr: "Niveau A1 — Débutant",
    descriptionFr:
      "Vous découvrez l'anglais ou vous avez quelques souvenirs scolaires. Vous allez apprendre à saluer avec naturel, vous présenter, compter, décrire votre entourage et vous débrouiller au marché.",
  },
  A2: {
    titleFr: "Niveau A2 — Élémentaire",
    descriptionFr:
      "Vous comprenez des phrases isolées et des expressions fréquentes. Vous savez déjà vous débrouiller dans des situations concrètes du quotidien et parler de votre travail ou de votre ville.",
  },
  B1: {
    titleFr: "Niveau B1 — Intermédiaire",
    descriptionFr:
      "Vous êtes autonome dans la plupart des situations. Vous pouvez exprimer votre opinion, raconter un événement et communiquer dans un cadre professionnel ou d'études.",
  },
  B2: {
    titleFr: "Niveau B2 — Intermédiaire Avancé",
    descriptionFr:
      "Vous comprenez l'essentiel de sujets complexes, participez à des débats sans blocage et êtes prêt(e) pour des entretiens d'embauche internationaux et des bourses.",
  },
};

export const SKILL_LABELS_FR: Record<Skill, string> = {
  vocabulary: "Vocabulaire",
  grammar: "Grammaire",
  reading: "Compréhension écrite",
  listening: "Compréhension orale",
  speaking: "Expression orale",
};

/**
 * Selects the next adaptive question based on answers history.
 * - Max target: 16 questions (4 per candidate level on average)
 * - Selects from questions not yet answered
 * - Shifts level based on recent performance
 */
export function getNextAdaptiveQuestion(
  answers: AnswerRecord[],
  questionBank: PlacementQuestion[] = PLACEMENT_QUESTIONS,
  maxQuestions = 16,
): PlacementQuestion | null {
  if (answers.length >= maxQuestions) {
    return null;
  }

  const answeredIds = new Set(answers.map((a) => a.questionId));
  const availableQuestions = questionBank.filter((q) => !answeredIds.has(q.id));

  if (availableQuestions.length === 0) {
    return null;
  }

  // Determine current target level
  let targetLevel: CefrLevel = "A1";

  if (answers.length === 0) {
    // First question: start at A1 to build immediate confidence
    targetLevel = "A1";
  } else {
    // Look at last 2-3 answers to adaptively step up or down
    const lastAnswers = answers.slice(-3);
    const correctCount = lastAnswers.filter((a) => a.isCorrect).length;
    const lastLevel = answers[answers.length - 1].level;
    const lastLevelIndex = CEFR_ORDER.indexOf(lastLevel);

    if (correctCount >= 2 && lastLevelIndex < CEFR_ORDER.length - 1) {
      targetLevel = CEFR_ORDER[lastLevelIndex + 1];
    } else if (correctCount === 0 && lastLevelIndex > 0) {
      targetLevel = CEFR_ORDER[lastLevelIndex - 1];
    } else {
      targetLevel = lastLevel;
    }
  }

  // Try to pick a question for targetLevel, balancing skills
  const skillsCount: Record<Skill, number> = {
    vocabulary: 0,
    grammar: 0,
    reading: 0,
    listening: 0,
    speaking: 0,
  };
  for (const a of answers) {
    skillsCount[a.skill] = (skillsCount[a.skill] || 0) + 1;
  }

  // Find candidate questions at targetLevel, sort by least-used skill
  const candidateTarget = availableQuestions.filter((q) => q.level === targetLevel);

  if (candidateTarget.length > 0) {
    candidateTarget.sort((a, b) => skillsCount[a.skill] - skillsCount[b.skill]);
    return candidateTarget[0];
  }

  // Fallback: pick any available question closest to target level
  availableQuestions.sort((a, b) => {
    const diffA = Math.abs(CEFR_ORDER.indexOf(a.level) - CEFR_ORDER.indexOf(targetLevel));
    const diffB = Math.abs(CEFR_ORDER.indexOf(b.level) - CEFR_ORDER.indexOf(targetLevel));
    return diffA - diffB;
  });

  return availableQuestions[0];
}

/**
 * Calculates CEFR placement result and skill breakdown from answer records.
 */
export function calculatePlacementResult(answers: AnswerRecord[]): PlacementResult {
  const totalQuestions = answers.length;
  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const overallPercentage =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Initialize level stats
  const levelScores: Record<CefrLevel, LevelScore> = {
    A1: { level: "A1", total: 0, correct: 0, percentage: 0 },
    A2: { level: "A2", total: 0, correct: 0, percentage: 0 },
    B1: { level: "B1", total: 0, correct: 0, percentage: 0 },
    B2: { level: "B2", total: 0, correct: 0, percentage: 0 },
  };

  // Initialize skill stats
  const skillScores: Record<Skill, SkillScore> = {
    vocabulary: { skill: "vocabulary", labelFr: SKILL_LABELS_FR.vocabulary, total: 0, correct: 0, percentage: 0 },
    grammar: { skill: "grammar", labelFr: SKILL_LABELS_FR.grammar, total: 0, correct: 0, percentage: 0 },
    reading: { skill: "reading", labelFr: SKILL_LABELS_FR.reading, total: 0, correct: 0, percentage: 0 },
    listening: { skill: "listening", labelFr: SKILL_LABELS_FR.listening, total: 0, correct: 0, percentage: 0 },
    speaking: { skill: "speaking", labelFr: SKILL_LABELS_FR.speaking, total: 0, correct: 0, percentage: 0 },
  };

  for (const a of answers) {
    levelScores[a.level].total++;
    if (a.isCorrect) levelScores[a.level].correct++;

    skillScores[a.skill].total++;
    if (a.isCorrect) skillScores[a.skill].correct++;
  }

  // Calculate percentages
  for (const lvl of CEFR_ORDER) {
    const s = levelScores[lvl];
    s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }
  for (const sk of Object.keys(skillScores) as Skill[]) {
    const s = skillScores[sk];
    s.percentage = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }

  // CEFR Determination algorithm:
  // Requires >= 60% on level tests attempted to confirm placement
  let determinedLevel: CefrLevel = "A1";

  if (levelScores.B2.total >= 2 && levelScores.B2.percentage >= 60) {
    determinedLevel = "B2";
  } else if (levelScores.B1.total >= 2 && levelScores.B1.percentage >= 60) {
    determinedLevel = "B1";
  } else if (levelScores.A2.total >= 2 && levelScores.A2.percentage >= 60) {
    determinedLevel = "A2";
  } else {
    determinedLevel = "A1";
  }

  // Strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const validSkills = (Object.keys(skillScores) as Skill[]).filter(
    (sk) => skillScores[sk].total > 0,
  );

  validSkills.sort((a, b) => skillScores[b].percentage - skillScores[a].percentage);

  if (validSkills.length > 0 && skillScores[validSkills[0]].percentage >= 60) {
    strengths.push(
      `Point fort : ${skillScores[validSkills[0]].labelFr} (${skillScores[validSkills[0]].percentage}%)`,
    );
  }
  if (validSkills.length > 1 && skillScores[validSkills[1]].percentage >= 60) {
    strengths.push(
      `Bonne maîtrise : ${skillScores[validSkills[1]].labelFr} (${skillScores[validSkills[1]].percentage}%)`,
    );
  }

  const lowestSkill = validSkills[validSkills.length - 1];
  if (lowestSkill && skillScores[lowestSkill].percentage < 60) {
    weaknesses.push(
      `À renforcer : ${skillScores[lowestSkill].labelFr} (${skillScores[lowestSkill].percentage}%)`,
    );
  }

  if (strengths.length === 0) {
    strengths.push("Prêt(e) à assimiler les bases de l'anglais avec Coach David");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Profil équilibré, prêt(e) pour le niveau supérieur");
  }

  const desc = LEVEL_DESCRIPTIONS[determinedLevel];

  return {
    cefrLevel: determinedLevel,
    titleFr: desc.titleFr,
    descriptionFr: desc.descriptionFr,
    recommendedStartingLevel: determinedLevel,
    totalQuestions,
    totalCorrect,
    overallPercentage,
    skillScores,
    levelScores,
    strengths,
    weaknesses,
  };
}
