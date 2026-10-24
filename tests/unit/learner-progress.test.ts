import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordLessonCompletion,
  recordAssessmentCompletion,
  getLearnerDetailedProgress,
  getAllLearnersProgress,
  clearAllProgressForTesting,
  setCurrentLearnerIdentity,
} from '../../src/lib/domain/learner-progress';
import { SAMPLE_LESSONS } from '../../src/lib/domain/lessons-data';

describe('Learner Progress & Curriculum Verification', () => {
  beforeEach(() => {
    clearAllProgressForTesting();
  });

  describe('Full Curriculum: A1 to B2 Lessons', () => {
    it('contains comprehensive lessons spanning all CEFR levels (A1, A2, B1, B2)', () => {
      const lessons = Object.values(SAMPLE_LESSONS);
      expect(lessons.length).toBeGreaterThanOrEqual(20);

      const a1Lessons = lessons.filter((l) => l.lesson.slug.startsWith('a1-'));
      const a2Lessons = lessons.filter((l) => l.lesson.slug.startsWith('a2-'));
      const b1Lessons = lessons.filter((l) => l.lesson.slug.startsWith('b1-'));
      const b2Lessons = lessons.filter((l) => l.lesson.slug.startsWith('b2-'));

      expect(a1Lessons.length).toBeGreaterThanOrEqual(8);
      expect(a2Lessons.length).toBeGreaterThanOrEqual(5);
      expect(b1Lessons.length).toBeGreaterThanOrEqual(5);
      expect(b2Lessons.length).toBeGreaterThanOrEqual(5);
    });

    it('verifies every lesson has required instructional fields and valid exercises', () => {
      const lessons = Object.values(SAMPLE_LESSONS);
      for (const item of lessons) {
        expect(item.lesson.slug).toBeTruthy();
        expect(item.lesson.title_fr).toBeTruthy();
        expect(item.lesson.title_en).toBeTruthy();
        expect(item.lesson.objective_fr).toBeTruthy();
        expect(item.lesson.pass_mark).toBeGreaterThanOrEqual(60);
        expect(item.lesson.xp_reward).toBeGreaterThanOrEqual(15);
        expect(item.vocabulary.length).toBeGreaterThanOrEqual(3);
        expect(item.exercises.length).toBeGreaterThanOrEqual(3);

        // Every lesson must include valid interactive exercises (multiple_choice, speaking, fill_blank, word_order)
        const exerciseTypes = item.exercises.map((e) => e.exercise.type);
        expect(exerciseTypes.length).toBeGreaterThanOrEqual(3);
        for (const type of exerciseTypes) {
          expect(['multiple_choice', 'qcm', 'fill_blank', 'matching', 'word_order', 'listen_choose', 'speaking']).toContain(type);
        }
      }
    });
  });

  describe('Lesson Completion & Progression Recording', () => {
    it('records a passed lesson, awards XP, and adds to completed lessons', () => {
      setCurrentLearnerIdentity('test.learner@speakup.cd', 'Test Learner', 'Kinshasa');

      const initial = getLearnerDetailedProgress('test.learner@speakup.cd');
      const initialXp = initial.totalXp;

      const res = recordLessonCompletion('a1-salutations', 85, 20);
      expect(res.success).toBe(true);

      const progress = getLearnerDetailedProgress('test.learner@speakup.cd');
      expect(progress.lessons.length).toBe(1);
      expect(progress.lessons[0].slug).toBe('a1-salutations');
      expect(progress.lessons[0].score).toBe(85);
      expect(progress.lessons[0].passed).toBe(true);
      expect(progress.lessons[0].xpEarned).toBe(20);
      expect(progress.totalXp).toBe(initialXp + 20);
    });

    it('records a failed lesson attempt (score < pass mark) without marking passed', () => {
      setCurrentLearnerIdentity('test.learner2@speakup.cd', 'Learner Two', 'Goma');

      const res = recordLessonCompletion('b2-negociation-affaires', 55, 35);
      expect(res.success).toBe(true);

      const progress = getLearnerDetailedProgress('test.learner2@speakup.cd');
      expect(progress.lessons.length).toBe(1);
      expect(progress.lessons[0].passed).toBe(false);
      expect(progress.lessons[0].score).toBe(55);
      expect(progress.lessons[0].xpEarned).toBe(Math.round(35 * 0.3));
    });

    it('records multiple lessons across A1, A2, B1, and B2 levels', () => {
      setCurrentLearnerIdentity('multi.progress@speakup.cd', 'Multi Progress', 'Lubumbashi');

      recordLessonCompletion('a1-se-presenter', 90, 20);
      recordLessonCompletion('a2-au-restaurant', 80, 25);
      recordLessonCompletion('b1-entretien-embauche', 85, 30);
      recordLessonCompletion('b2-reunion-leadership', 75, 35);

      const progress = getLearnerDetailedProgress('multi.progress@speakup.cd');
      expect(progress.lessons.length).toBe(4);
      const passedCount = progress.lessons.filter((l) => l.passed).length;
      expect(passedCount).toBe(4);
    });
  });

  describe('Diagnostic Assessment / Placement Recording', () => {
    it('records diagnostic assessment result, skill breakdown, and updates learner level', () => {
      setCurrentLearnerIdentity('eval.learner@speakup.cd', 'Eval Learner', 'Bukavu');

      const mockResult = {
        cefrLevel: 'B1' as const,
        titleFr: 'Niveau B1 — Intermédiaire',
        descriptionFr: 'Description B1',
        recommendedStartingLevel: 'B1' as const,
        totalQuestions: 25,
        totalCorrect: 20,
        overallPercentage: 80,
        skillScores: {
          grammar: { skill: 'grammar' as const, labelFr: 'Grammaire', total: 10, correct: 8, percentage: 80 },
          vocabulary: { skill: 'vocabulary' as const, labelFr: 'Vocabulaire', total: 5, correct: 4, percentage: 80 },
          reading: { skill: 'reading' as const, labelFr: 'Lecture', total: 5, correct: 4, percentage: 80 },
          listening: { skill: 'listening' as const, labelFr: 'Écoute', total: 5, correct: 4, percentage: 80 },
          speaking: { skill: 'speaking' as const, labelFr: 'Expression', total: 0, correct: 0, percentage: 0 },
        },
        levelScores: {
          A1: { level: 'A1' as const, total: 6, correct: 6, percentage: 100 },
          A2: { level: 'A2' as const, total: 6, correct: 5, percentage: 83 },
          B1: { level: 'B1' as const, total: 7, correct: 6, percentage: 85 },
          B2: { level: 'B2' as const, total: 6, correct: 3, percentage: 50 },
        },
        strengths: ['Vocabulaire pro', 'Grammaire solide'],
        weaknesses: ['Compréhension orale rapide'],
      };

      const res = recordAssessmentCompletion(mockResult);
      expect(res.success).toBe(true);

      const progress = getLearnerDetailedProgress('eval.learner@speakup.cd');
      expect(progress.assessments.length).toBe(1);
      expect(progress.assessments[0].recommendedLevel).toBe('B1');
      expect(progress.assessments[0].scorePct).toBe(80);
      expect(progress.currentLevel).toBe('B1');
    });
  });
});
