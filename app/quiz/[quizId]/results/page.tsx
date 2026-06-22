"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"

interface UserAnswer {
  id: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
  question: {
    id: string
    text: string
    options: Record<string, string> | string[]
    correctAnswer: number
  }
}

interface QuizAttempt {
  id: string
  score: number
  totalQuestions: number
  timeTaken: number
  completedAt: string
  userAnswers: UserAnswer[]
  quiz: {
    id: string
    title: string
  }
}

export default function QuizResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const attemptId = searchParams.get("attemptId")
  
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!attemptId) {
      setError("No attempt ID provided")
      setIsLoading(false)
      return
    }

    const fetchAttempt = async () => {
      try {
        const response = await fetch(`/api/quiz/attempts/${attemptId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch attempt")
        }
        const { data } = await response.json()
        setAttempt(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttempt()
  }, [attemptId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
          <Sidebar />
          <main className="flex-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="text-center text-slate-600">Loading results...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
          <Sidebar />
          <main className="flex-1">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <p className="text-center text-red-600">{error || "Results not found"}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const scorePercentage = Math.round(attempt.score)
  const correctCount = attempt.userAnswers.filter((a) => a.isCorrect).length
  const scoreColor =
    scorePercentage >= 70
      ? "text-green-600"
      : scorePercentage >= 40
        ? "text-amber-600"
        : "text-red-600"

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getOptionLabel = (options: Record<string, string> | string[], index: number): string => {
    if (Array.isArray(options)) {
      return options[index] || "Unknown"
    }
    const optionArray = Object.values(options)
    return optionArray[index] || "Unknown"
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          {/* Score Section */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <p className="text-sm uppercase tracking-widest text-indigo-600">
                  Quiz Results
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">
                  {attempt.quiz.title}
                </h1>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`text-6xl font-bold ${scoreColor}`}
                >
                  {scorePercentage}%
                </div>
                <p className="text-center text-sm text-slate-600">
                  {correctCount} of {attempt.totalQuestions} correct
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Time Taken</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {formatTime(attempt.timeTaken)}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Accuracy</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {attempt.totalQuestions > 0
                  ? Math.round((correctCount / attempt.totalQuestions) * 100)
                  : 0}
                %
              </p>
            </div>
          </section>

          {/* Answers Table */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Answer Review
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Question
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Your Answer
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900">
                      Correct Answer
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-900">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attempt.userAnswers.map((answer, idx) => (
                    <tr
                      key={answer.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-600">{idx + 1}</td>
                      <td className="px-4 py-3 max-w-xs text-slate-900">
                        {answer.question.text}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {getOptionLabel(
                          answer.question.options,
                          answer.selectedAnswer
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {getOptionLabel(
                          answer.question.options,
                          answer.question.correctAnswer
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {answer.isCorrect ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700">
                            ✗
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 rounded-3xl border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => router.push(`/quiz/${attempt.quiz.id}`)}
              className="flex-1 rounded-3xl bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
            >
              Try Again
            </button>
          </section>
        </main>
      </div>
    </div>
  )
}
