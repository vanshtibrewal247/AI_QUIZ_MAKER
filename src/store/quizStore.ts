import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Difficulty, QuizMode, Question, UserAnswer } from "../types/quiz";

export type TimerState = {
  remainingSeconds: number;
  startedAt?: number;
  isActive: boolean;
};

export type ExplanationMap = Record<string, string>;

export type QuizStoreState = {
  currentQuizId?: string;
  currentQuizTitle?: string;
  currentQuizTopic?: string;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  timerState: TimerState;
  mode: QuizMode;
  difficulty: Difficulty;
  isLoading: boolean;
  explanations: ExplanationMap;
  streamingExplanation: string;
  currentQuestions: Question[];
  startQuiz: (quizId: string, title: string, topic: string, questions: Question[], mode: QuizMode, difficulty: Difficulty, initialTimeLimit: number) => void;
  answerQuestion: (questionId: string, selectedAnswer: number, isCorrect: boolean, timeSpent: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishQuiz: () => void;
  fetchExplanation: (questionId: string, explanation: string) => void;
  adjustDifficulty: (newDifficulty: Difficulty) => void;
};

const defaultTimerState: TimerState = {
  remainingSeconds: 0,
  isActive: false,
};

export const useQuizStore = create<QuizStoreState>()(
  persist(
    (set, get) => ({
      currentQuizId: undefined,
      currentQuizTitle: undefined,
      currentQuizTopic: undefined,
      currentQuestionIndex: 0,
      currentQuestions: [],
      userAnswers: [],
      timerState: defaultTimerState,
      mode: QuizMode.PRACTICE,
      difficulty: Difficulty.EASY,
      isLoading: false,
      explanations: {},
      streamingExplanation: "",

      startQuiz: (quizId, title, topic, questions, mode, difficulty, initialTimeLimit) => {
        set({
          currentQuizId: quizId,
          currentQuizTitle: title,
          currentQuizTopic: topic,
          currentQuestionIndex: 0,
          currentQuestions: questions,
          userAnswers: [],
          timerState: {
            remainingSeconds: initialTimeLimit,
            startedAt: Date.now(),
            isActive: true,
          },
          mode,
          difficulty,
          isLoading: false,
          explanations: {},
          streamingExplanation: "",
        });
      },

      answerQuestion: (questionId, selectedAnswer, isCorrect, timeSpent) => {
        const existing = get().userAnswers.filter((answer) => answer.questionId !== questionId);
        set({
          userAnswers: [
            ...existing,
            {
              id: `${questionId}-${Date.now()}`,
              attemptId: get().currentQuizId ?? "",
              questionId,
              selectedAnswer,
              isCorrect,
              timeSpent,
            },
          ],
        });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, currentQuestions } = get();
        if (currentQuestionIndex < currentQuestions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      finishQuiz: () => {
        set({
          timerState: {
            ...get().timerState,
            isActive: false,
          },
        });
      },

      fetchExplanation: (questionId, explanation) => {
        set((state) => ({
          explanations: {
            ...state.explanations,
            [questionId]: explanation,
          },
          streamingExplanation: explanation,
        }));
      },

      adjustDifficulty: (newDifficulty) => {
        set({ difficulty: newDifficulty });
      },
    }),
    {
      name: "quiz-store",
      storage: createJSONStorage<QuizStoreState>(() => localStorage),
    },
  ),
);
