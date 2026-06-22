import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Difficulty, QuizMode, Question, UserAnswer } from "../types/quiz";

export type TimerState = {
  remainingSeconds: number;
  startedAt?: number;
  isActive: boolean;
  totalElapsed?: number;
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
  attemptId?: string;
  quizStatus?: "started" | "completed" | "abandoned";
  startQuiz: (quizId: string, title: string, topic: string, questions: Question[], mode: QuizMode, difficulty: Difficulty, initialTimeLimit: number) => void;
  answerQuestion: (questionId: string, selectedAnswer: number, isCorrect: boolean, timeSpent: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishQuiz: (router: any) => Promise<void>;
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
      attemptId: undefined,
      quizStatus: undefined,

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
            totalElapsed: 0,
          },
          mode,
          difficulty,
          isLoading: false,
          explanations: {},
          streamingExplanation: "",
          quizStatus: "started",
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

      finishQuiz: async (router) => {
        const state = get();
        if (!state.currentQuizId) {
          throw new Error("No quiz in progress");
        }

        try {
          set({ isLoading: true });

          // Calculate total time taken
          const totalTimeTaken = state.timerState.startedAt
            ? Math.floor((Date.now() - state.timerState.startedAt) / 1000)
            : state.timerState.totalElapsed ?? 0;

          // Prepare answers payload
          const answers = state.userAnswers.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            timeSpent: a.timeSpent,
          }));

          // Submit quiz attempt
          const response = await fetch(
            `/api/quiz/${state.currentQuizId}/submit`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                answers,
                totalTimeTaken,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to submit quiz");
          }

          const { data } = await response.json();

          // Update state with attempt ID
          set({
            attemptId: data.attemptId,
            quizStatus: "completed",
            timerState: {
              ...state.timerState,
              isActive: false,
            },
          });

          // Navigate to results page
          router.push(
            `/quiz/${state.currentQuizId}/results?attemptId=${data.attemptId}`
          );
        } catch (error) {
          console.error("Error finishing quiz:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
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

