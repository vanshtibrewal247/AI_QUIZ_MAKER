"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Difficulty, QuizMode, Question } from "@/types/quiz";
import { ExplanationPanel } from "@/components/quiz/ExplanationPanel";

const mockQuiz = {
  id: "sample-quiz",
  title: "Sample quiz",
  topic: "Math foundation",
  difficulty: Difficulty.MEDIUM,
  mode: QuizMode.TIMED,
  questions: [
    {
      id: "q1",
      quizId: "sample-quiz",
      text: "What is 7 + 6?",
      options: ["11", "12", "13", "14"],
      correctAnswer: 2,
      explanation: "Add the two numbers together.",
      difficulty: "MEDIUM",
      timeLimit: 30,
      order: 1,
    },
    {
      id: "q2",
      quizId: "sample-quiz",
      text: "Which shape has four equal sides?",
      options: ["Rectangle", "Square", "Triangle", "Circle"],
      correctAnswer: 1,
      explanation: "A square has four equal sides.",
      difficulty: "EASY",
      timeLimit: 30,
      order: 2,
    },
  ] as Question[],
};

function pluralize(value: number, label: string) {
  return `${value} ${label}${value === 1 ? "" : "s"}`;
}

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuizId,
    currentQuizTitle,
    currentQuizTopic,
    currentQuestionIndex,
    currentQuestions,
    userAnswers,
    timerState,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    finishQuiz,
    explanations,
    fetchExplanation,
  } = useQuizStore();

  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);
  const [isShowingAiExplanation, setIsShowingAiExplanation] = useState(false);

  useEffect(() => {
    if (!currentQuizId) {
      useQuizStore.getState().startQuiz(
        mockQuiz.id,
        mockQuiz.title,
        mockQuiz.topic,
        mockQuiz.questions,
        QuizMode.TIMED,
        Difficulty.MEDIUM,
        120,
      );
    }
  }, [currentQuizId]);

  const activeQuestions = currentQuestions.length ? currentQuestions : mockQuiz.questions;
  const question = activeQuestions[currentQuestionIndex] ?? activeQuestions[0];
  const selectedAnswer = userAnswers.find((answer) => answer.questionId === question.id)?.selectedAnswer;
  const totalQuestions = activeQuestions.length;

  const aiExplanation = question ? explanations[question.id] : undefined;

  const progress = useMemo(() => Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100), [currentQuestionIndex, totalQuestions]);

  const handleAnswer = (index: number) => {
    const isCorrect = index === question.correctAnswer;
    answerQuestion(question.id, index, isCorrect, 12);
  };

  const handleGenerateExplanation = async () => {
    if (!question || selectedAnswer === undefined || selectedAnswer === null) return;
    setExplanationError(null);
    setIsFetchingExplanation(true);
    setIsShowingAiExplanation(true);

    try {
      const selectedAnswerText = question.options[selectedAnswer] ?? "";
      const response = await fetch("/api/ai/explain-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionText: question.text,
          selectedAnswer: selectedAnswerText,
          explanationContext: `Selected answer: ${selectedAnswerText}`,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to generate AI explanation.");
      }

      const explanationText = await response.text();
      fetchExplanation(question.id, explanationText);
    } catch (error: unknown) {
      setExplanationError(error instanceof Error ? error.message : "Unknown explanation error.");
    } finally {
      setIsFetchingExplanation(false);
    }
  };

  const handleFinish = async () => {
    await finishQuiz(router);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Quiz in progress</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{currentQuizTitle ?? mockQuiz.title}</h1>
                <p className="mt-2 text-sm text-slate-600">Topic: {currentQuizTopic ?? mockQuiz.topic}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">
                Progress: {progress}%
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{question.text}</h2>
                </div>
                <div className="rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">
                  Timer: {Math.max(timerState.remainingSeconds, 0)}s
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {question.options.map((option, index) => {
                  const isSelected = index === selectedAnswer;
                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(index)}
                      className={`rounded-3xl border px-5 py-4 text-left text-sm transition ${
                        isSelected ? "border-indigo-600 bg-indigo-50 text-slate-900" : "border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                      }`}
                    >
                      <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== undefined && (
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateExplanation}
                    disabled={isFetchingExplanation || Boolean(aiExplanation)}
                    className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {aiExplanation
                      ? "AI explanation ready"
                      : isFetchingExplanation
                        ? "Generating explanation…"
                        : "Generate AI explanation"}
                  </button>

                  {explanationError && (
                    <p className="text-sm text-red-600">{explanationError}</p>
                  )}
                </div>
              )}

              <ExplanationPanel
                explanation={isShowingAiExplanation ? aiExplanation ?? "" : undefined}
                isStreaming={isFetchingExplanation}
                aiGenerated={Boolean(aiExplanation)}
                onClose={() => setIsShowingAiExplanation(false)}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-slate-600">
                  <p>{pluralize(totalQuestions - currentQuestionIndex - 1, "question")} remaining</p>
                  <p>{selectedAnswer !== undefined ? "Answer selected" : "Select an answer to continue"}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={previousQuestion}
                    className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Previous
                  </button>
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Finish Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
