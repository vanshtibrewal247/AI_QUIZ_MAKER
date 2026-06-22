"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { RefreshCw, ArrowRight } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  mode: string;
}

interface Attempt {
  id: string;
  quizId: string;
  quiz: Quiz;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: string | null;
}

const topicEmojis: Record<string, string> = {
  math: "📐",
  science: "🔬",
  history: "📚",
  geography: "🌍",
  language: "🗣️",
  coding: "💻",
  biology: "🧬",
  chemistry: "⚗️",
  physics: "⚛️",
  literature: "📖",
  default: "📝",
};

function getTopicEmoji(topic: string): string {
  const lowerTopic = topic.toLowerCase();
  for (const [key, emoji] of Object.entries(topicEmojis)) {
    if (lowerTopic.includes(key)) {
      return emoji;
    }
  }
  return topicEmojis.default;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function getRelativeTime(date: string | null): string {
  if (!date) return "Unknown";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return then.toLocaleDateString();
}

function getScoreColor(score: number): string {
  if (score >= 70) return "bg-emerald-50 text-emerald-700";
  if (score >= 40) return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="h-6 w-32 rounded-lg bg-slate-200 animate-pulse" />
          <div className="h-4 w-48 rounded-lg bg-slate-200 animate-pulse" />
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </div>
        <div className="h-16 w-16 rounded-full bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/quiz/history");
        if (!response.ok) {
          throw new Error("Failed to fetch quiz history");
        }
        const { data } = await response.json();
        setAttempts(data.attempts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">
                  History
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                  Quiz attempts
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                  Review all your completed quizzes and performance history.
                </p>
              </div>
              <Link
                href="/quiz/create"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                New quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center">
                <p className="text-lg font-semibold text-slate-900">
                  No quizzes taken yet
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Start your first quiz to see your history here.
                </p>
                <Link
                  href="/quiz/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Create Quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">
                            {getTopicEmoji(attempt.quiz.topic)}
                          </span>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {attempt.quiz.topic}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {attempt.quiz.title}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {attempt.quiz.difficulty}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {attempt.quiz.mode}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {attempt.totalQuestions} questions
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {formatTime(attempt.timeTaken)}
                          </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-500">
                          {getRelativeTime(attempt.completedAt)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-4 md:flex-col md:items-end">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-200 text-xl font-bold ${getScoreColor(
                            attempt.score
                          )}`}
                        >
                          {Math.round(attempt.score)}%
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/quiz/${attempt.quizId}/results?attemptId=${attempt.id}`}
                            className="rounded-full border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                          >
                            Results
                          </Link>
                          <Link
                            href={`/quiz/create?topic=${encodeURIComponent(
                              attempt.quiz.topic
                            )}`}
                            className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-200"
                          >
                            Retake
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
