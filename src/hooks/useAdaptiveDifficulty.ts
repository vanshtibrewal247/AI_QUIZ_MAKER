import { useEffect, useCallback, useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { AdaptiveDifficultyEngine, RecentAnswer } from "@/lib/adaptive-difficulty";
import { Difficulty } from "@/types/quiz";

export interface UseAdaptiveDifficultyReturn {
  currentDifficulty: Difficulty;
  shouldAdjust: boolean;
  isDifficultyChanging: boolean;
  recentAccuracy: number;
  adjustDifficulty: () => void;
}

export function useAdaptiveDifficulty(): UseAdaptiveDifficultyReturn {
  const { difficulty, userAnswers, currentQuestions, adjustDifficulty: storeAdjustDifficulty } = useQuizStore();
  const [isDifficultyChanging, setIsDifficultyChanging] = useState(false);
  const engineRef = new AdaptiveDifficultyEngine();

  const recentAccuracy = (() => {
    if (userAnswers.length === 0) return 0;
    const correctCount = userAnswers.filter((answer) => answer.isCorrect).length;
    return (correctCount / userAnswers.length) * 100;
  })();

  const checkAndAdjust = useCallback(() => {
    if (userAnswers.length < 3) return;

    const recentAnswers: RecentAnswer[] = userAnswers.slice(-3).map((answer) => ({
      questionId: answer.questionId,
      isCorrect: answer.isCorrect,
      timeSpent: answer.timeSpent,
    }));

    const nextDifficulty = engineRef.calculateNextDifficulty(recentAnswers);

    if (nextDifficulty !== difficulty) {
      setIsDifficultyChanging(true);
      setTimeout(() => {
        storeAdjustDifficulty(nextDifficulty);
        setIsDifficultyChanging(false);
      }, 300);
    }
  }, [userAnswers, difficulty, storeAdjustDifficulty]);

  useEffect(() => {
    if (userAnswers.length % 3 === 0 && userAnswers.length > 0) {
      checkAndAdjust();
    }
  }, [userAnswers, checkAndAdjust]);

  return {
    currentDifficulty: difficulty,
    shouldAdjust: userAnswers.length >= 3,
    isDifficultyChanging,
    recentAccuracy,
    adjustDifficulty: checkAndAdjust,
  };
}
