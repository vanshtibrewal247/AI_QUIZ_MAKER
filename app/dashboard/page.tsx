"use client";

import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

const attemptData = [
  { label: "Mon", score: 78, time: 22 },
  { label: "Tue", score: 84, time: 18 },
  { label: "Wed", score: 92, time: 15 },
  { label: "Thu", score: 70, time: 28 },
  { label: "Fri", score: 88, time: 20 },
];

const recentAttempts = [
  { quiz: "Algebra Warmup", score: 92, time: "12m", status: "Strong" },
  { quiz: "World History", score: 81, time: "18m", status: "Improving" },
  { quiz: "Vocabulary Drill", score: 74, time: "14m", status: "Needs focus" },
];

const insights = {
  summary: "You are consistently strong on core concepts, but the AI recommends targeting time-based recall and weaker topics to improve your performance.",
  strengths: ["Equation solving", "Reading comprehension"],
  weaknesses: ["Timed recall", "Advanced vocabulary"],
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">Recent performance</h1>
                <p className="mt-2 text-sm text-slate-600">See your latest quiz summaries, progress trends, and AI-generated recommendations.</p>
              </div>
              <Link href="/quiz/create" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Start new quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Weekly score trend</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">Steady improvement</h2>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm">+8.4%</div>
                  </div>

                  <div className="mt-6 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attemptData} margin={{ top: 10, right: 18, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} />
                        <YAxis domain={[60, 100]} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Practice session score</p>
                    <p className="mt-3 text-4xl font-semibold text-slate-900">88%</p>
                    <p className="mt-2 text-sm text-slate-600">Your latest set shows strong accuracy across core topics.</p>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Average response time</p>
                    <p className="mt-3 text-4xl font-semibold text-slate-900">18m</p>
                    <p className="mt-2 text-sm text-slate-600">Faster recall is improving, especially for timed quizzes.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 text-slate-900">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-lg font-semibold">AI Insights</h2>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{insights.summary}</p>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Strengths</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {insights.strengths.map((item) => (
                        <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Recommended focus</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {insights.weaknesses.map((item) => (
                        <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Recent quiz attempts</h2>
                  <p className="mt-1 text-sm text-slate-600">Review your latest completed quizzes and performance breakdown.</p>
                </div>
                <Link href="/quiz/create" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  Create new quiz
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {recentAttempts.map((item) => (
                  <div key={item.quiz} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{item.quiz}</p>
                        <p className="text-sm text-slate-600">{item.time} • {item.status}</p>
                      </div>
                      <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">{item.score}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">Quick win</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Focus on weaker topics</h2>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">The AI recommends a short targeted drill on low-confidence subjects after your next quiz.</p>
              <Link href="/quiz/create" className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Build a custom review quiz
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
