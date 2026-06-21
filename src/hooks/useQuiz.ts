import { useCallback, useState } from "react";
import { useQuizStore } from "@/store/quizStore";
import { Question, QuizMode, Difficulty } from "@/types/quiz";

export interface UseQuizReturn {
  // State
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  isLastQuestion: boolean;
  
  // Actions
  answerQuestion: (selectedAnswer: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  selectAnswer: (answerIndex: number) => void;
  resetAnswer: () => void;
  
  // Helpers
  getCorrectAnswer: () => number;
  getExplanation: () => string | undefined;
}

export function useQuiz(): UseQuizReturn {
  const {
    currentQuestionIndex,
    currentQuestions,
    userAnswers,
    answerQuestion: storeAnswerQuestion,
    nextQuestion: storeNextQuestion,
    previousQuestion: storePreviousQuestion,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = currentQuestions[currentQuestionIndex] || null;

  const isAnswered = selectedAnswer !== null;

  const score = (() => {
    const correctCount = userAnswers.filter((answer) => answer.isCorrect).length;
    return currentQuestions.length > 0 ? (correctCount / currentQuestions.length) * 100 : 0;
  })();

  const selectAnswer = useCallback(
    (answerIndex: number) => {
      setSelectedAnswer(answerIndex);
    },
    []
  );

  const resetAnswer = useCallback(() => {
    setSelectedAnswer(null);
  }, []);

  const answerQuestion = useCallback(
    (selectedAnswerIndex: number) => {
      if (!currentQuestion) return;

      const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;
      const timeSpent = 5; // Placeholder - should be tracked per question

      storeAnswerQuestion(currentQuestion.id, selectedAnswerIndex, isCorrect, timeSpent);
      setSelectedAnswer(null);
    },
    [currentQuestion, storeAnswerQuestion]
  );

  const nextQuestion = useCallback(() => {
    storeNextQuestion();
    setSelectedAnswer(null);
  }, [storeNextQuestion]);

  const previousQuestion = useCallback(() => {
    storePreviousQuestion();
    // Reset selected answer when going back
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0 && prevIndex < currentQuestions.length) {
      const prevQuestion = currentQuestions[prevIndex];
      const prevAnswer = userAnswers.find((a) => a.questionId === prevQuestion.id);
      setSelectedAnswer(prevAnswer?.selectedAnswer ?? null);
    }
  }, [currentQuestionIndex, currentQuestions, userAnswers, storePreviousQuestion]);

  const getCorrectAnswer = useCallback((): number => {
    return currentQuestion?.correctAnswer ?? -1;
  }, [currentQuestion]);

  const getExplanation = useCallback((): string | undefined => {
    return currentQuestion?.explanation;
  }, [currentQuestion]);

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: currentQuestions.length,
    score,
    selectedAnswer,
    isAnswered,
    isLastQuestion: currentQuestionIndex === currentQuestions.length - 1,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    selectAnswer,
    resetAnswer,
    getCorrectAnswer,
    getExplanation,
  };
}
