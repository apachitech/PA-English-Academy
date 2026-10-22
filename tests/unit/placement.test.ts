import { describe, it, expect } from "vitest";
import {
  getNextAdaptiveQuestion,
  calculatePlacementResult,
  AnswerRecord,
} from "../../src/lib/domain/placement";
import { PLACEMENT_QUESTIONS } from "../../src/lib/domain/placement-bank";

describe("Adaptive Placement Engine", () => {
  it("should return an A1 question for the first prompt", () => {
    const nextQ = getNextAdaptiveQuestion([], PLACEMENT_QUESTIONS);
    expect(nextQ).not.toBeNull();
    expect(nextQ?.level).toBe("A1");
  });

  it("should step up difficulty after consecutive correct answers", () => {
    const answers: AnswerRecord[] = [
      {
        questionId: "pq-a1-1",
        level: "A1",
        skill: "vocabulary",
        chosenIndex: 0,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: "pq-a1-2",
        level: "A1",
        skill: "grammar",
        chosenIndex: 0,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: "pq-a1-3",
        level: "A1",
        skill: "grammar",
        chosenIndex: 2,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
    ];

    const nextQ = getNextAdaptiveQuestion(answers, PLACEMENT_QUESTIONS);
    expect(nextQ).not.toBeNull();
    expect(nextQ?.level).toBe("A2");
  });

  it("should calculate A1 placement for beginner answers", () => {
    const answers: AnswerRecord[] = [
      {
        questionId: "pq-a1-1",
        level: "A1",
        skill: "vocabulary",
        chosenIndex: 1,
        isCorrect: false,
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: "pq-a1-2",
        level: "A1",
        skill: "grammar",
        chosenIndex: 0,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
    ];

    const result = calculatePlacementResult(answers);
    expect(result.cefrLevel).toBe("A1");
    expect(result.recommendedStartingLevel).toBe("A1");
    expect(result.overallPercentage).toBe(50);
  });

  it("should calculate B1 placement when B1 questions have high success", () => {
    const answers: AnswerRecord[] = [
      {
        questionId: "pq-a2-1",
        level: "A2",
        skill: "grammar",
        chosenIndex: 2,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: "pq-a2-2",
        level: "A2",
        skill: "grammar",
        chosenIndex: 1,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: "pq-b1-1",
        level: "B1",
        skill: "grammar",
        chosenIndex: 2,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
      {
        questionId: "pq-b1-2",
        level: "B1",
        skill: "grammar",
        chosenIndex: 1,
        isCorrect: true,
        answeredAt: new Date().toISOString(),
      },
    ];

    const result = calculatePlacementResult(answers);
    expect(result.cefrLevel).toBe("B1");
    expect(result.recommendedStartingLevel).toBe("B1");
    expect(result.levelScores.B1.percentage).toBe(100);
  });
});
