"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle, Sparkles } from "lucide-react";
import { useQuizStore } from "@/store/quizStore";
import { ResultsSummary } from "@/components/quiz/ResultsSummary";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

interface PerformanceInsights {
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
}

export default function QuizResultsPage() {
  const {
    currentQuestions,
    userAnswers,
    timerState,
  } = useQuizStore();

  const [insights, setInsights] = useState<PerformanceInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const correctCount = useMemo(() => userAnswers.filter((answer) => answer.isCorrect).length, [userAnswers]);

  const score = useMemo(() => {
    return currentQuestions.length ? Math.round((correctCount / currentQuestions.length) * 100) : 0;
  }, [currentQuestions, correctCount]);

  const timeTaken = useMemo(() => {
    const start = timerState.startedAt ?? Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
    return elapsedSeconds;
  }, [timerState.startedAt]);

  const generateInsights = async () => {
    if (!currentQuestions.length) return;

    setInsightsError(null);
    setIsLoadingInsights(true);

    const performanceSummary = `Score: ${score}%. Correct: ${correctCount}. Incorrect: ${userAnswers.length - correctCount}. Time taken: ${timeTaken} seconds.`;
    const topic = currentQuestions[0]?.difficulty ?? "General";

    try {
      const response = await fetch("/api/ai/performance-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "guest",
          topic,
          performanceSummary,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.data) {
        throw new Error(payload?.error || "Unable to generate insights.");
      }

      setInsights({
        strengths: payload.data.strengths ?? [],
        weaknesses: payload.data.weaknesses ?? [],
        recommendedTopics: payload.data.recommendedTopics ?? [],
      });
    } catch (error: unknown) {
      setInsightsError(error instanceof Error ? error.message : "Unknown insights error.");
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Quiz results</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Your summary</h1>
                <p className="mt-2 text-sm text-slate-600">Review your performance and explore AI-driven feedback to improve your next attempt.</p>
              </div>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Back to dashboard
              </Link>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <ResultsSummary
                userAnswers={userAnswers}
                questions={currentQuestions}
                score={score}
                timeTaken={timeTaken}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-900">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">AI Insights</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">Generate a tailored explanation of your quiz performance and get personalized review recommendations from AI.</p>

              <button
                onClick={generateInsights}
                disabled={isLoadingInsights}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoadingInsights ? "Generating insights…" : "Generate insights"}
              </button>

              {insightsError && (
                <p className="mt-4 text-sm text-red-600">{insightsError}</p>
              )}

              {insights && (
                <div className="mt-6 space-y-4 rounded-3xl bg-white p-4 text-sm text-slate-700">
                  <div>
                    <h3 className="font-semibold text-slate-900">Strengths</h3>
                    <ul className="mt-2 list-disc pl-5">
                      {insights.strengths.map((item, index) => (
                        <li key={`strength-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Weaknesses</h3>
                    <ul className="mt-2 list-disc pl-5">
                      {insights.weaknesses.map((item, index) => (
                        <li key={`weakness-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Recommended topics</h3>
                    <ul className="mt-2 list-disc pl-5">
                      {insights.recommendedTopics.map((item, index) => (
                        <li key={`recommend-${index}`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
