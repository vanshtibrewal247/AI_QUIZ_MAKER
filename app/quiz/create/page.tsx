"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Difficulty, QuizMode } from "@/types/quiz";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useQuizStore } from "@/store/quizStore";

const topicOptions = ["Algebra", "Geometry", "Vocabulary", "History", "Science"];

const modeOptions = [
  { value: QuizMode.PRACTICE, label: "Practice" },
  { value: QuizMode.TIMED, label: "Timed" },
  { value: QuizMode.TOPIC, label: "Topic focus" },
];

const difficultyOptions = [
  { value: Difficulty.EASY, label: "Easy" },
  { value: Difficulty.MEDIUM, label: "Medium" },
  { value: Difficulty.HARD, label: "Hard" },
  { value: Difficulty.ADAPTIVE, label: "Adaptive" },
];

export default function CreateQuizPage() {
  const router = useRouter();
  const [topic, setTopic] = useState(topicOptions[0]);
  const [questionCount, setQuestionCount] = useState(8);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [mode, setMode] = useState<QuizMode>(QuizMode.PRACTICE);
  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quizPreviewLabel = useMemo(() => `${topic} • ${difficulty.toLowerCase()} • ${mode.toLowerCase()}`, [topic, difficulty, mode]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const newId = `${topic.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty, count: questionCount }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.data?.questions) {
        throw new Error(payload?.error || "Unable to generate questions.");
      }

      const questions = payload.data.questions.map((question: any, index: number) => ({
        id: `${newId}-q-${index}`,
        quizId: newId,
        text: question.text ?? `Question ${index + 1}`,
        options: Array.isArray(question.options) ? question.options : [],
        correctAnswer: Number(question.correctAnswer ?? 0),
        explanation: question.explanation ?? "",
        difficulty: question.difficulty ?? difficulty,
        timeLimit: Number(question.timeLimit ?? 30),
        order: question.order ?? index + 1,
      }));

      useQuizStore.getState().startQuiz(
        newId,
        `${topic} practice quiz`,
        topic,
        questions,
        mode,
        difficulty,
        120,
      );

      setCreatedQuizId(newId);
      router.push(`/quiz/${newId}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Unknown error generating the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Create a quiz</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Build a new study experience</h1>
                <p className="mt-2 text-sm text-slate-600">Choose a topic, difficulty, mode, and question count to generate a quiz tailored to your learners.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">Preview: {quizPreviewLabel}</div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-900">Topic</span>
                <select value={topic} onChange={(event) => setTopic(event.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500">
                  {topicOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-900">Difficulty</span>
                <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500">
                  {difficultyOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-900">Mode</span>
                <select value={mode} onChange={(event) => setMode(event.target.value as QuizMode)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500">
                  {modeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-900">Question count</span>
                <input
                  type="number"
                  min={5}
                  max={20}
                  value={questionCount}
                  onChange={(event) => setQuestionCount(Number(event.target.value))}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                />
              </label>

              <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Quiz description</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">Your quiz will be generated with questions tailored for the selected topic and difficulty. Adjust the count for shorter practice or a longer challenge.</p>
              </div>

              {error && (
                <div className="md:col-span-2 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? "Generating quiz…" : "Create Quiz"}
                </button>
                {createdQuizId && (
                  <Link href={`/quiz/${createdQuizId}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                    Open your quiz draft
                  </Link>
                )}
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
