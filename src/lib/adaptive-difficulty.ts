import { Difficulty } from "@/types/quiz";

export type RecentAnswer = {
  questionId: string;
  isCorrect: boolean;
  timeSpent: number;
};

export type AttemptSummary = {
  attemptId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt?: string;
};

export class AdaptiveDifficultyEngine {
  calculateNextDifficulty(recentAnswers: RecentAnswer[]): Difficulty {
    if (recentAnswers.length === 0) {
      return Difficulty.MEDIUM;
    }

    const correctCount = recentAnswers.filter((answer) => answer.isCorrect).length;
    const averageTime =
      recentAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0) / recentAnswers.length;
    const accuracy = correctCount / recentAnswers.length;

    if (accuracy >= 0.85 && averageTime <= 25) {
      return Difficulty.HARD;
    }

    if (accuracy >= 0.6 && averageTime <= 40) {
      return Difficulty.MEDIUM;
    }

    return Difficulty.EASY;
  }

  shouldAdjust(attemptHistory: AttemptSummary[]): boolean {
    if (attemptHistory.length < 2) {
      return false;
    }

    const latest = attemptHistory[attemptHistory.length - 1];
    const previous = attemptHistory[attemptHistory.length - 2];

    const percentChange = (latest.score - previous.score) / Math.max(previous.score, 1);
    return Math.abs(percentChange) >= 0.15 || latest.timeTaken > previous.timeTaken * 1.15;
  }
}
