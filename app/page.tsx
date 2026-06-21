import Link from "next/link";
import { ArrowRight, Sparkles, BarChart3, BrainCircuit } from "lucide-react";

const features = [
  {
    title: "AI-powered quizzes",
    description: "Generate custom quizzes from any topic in seconds with intelligent question selection.",
  },
  {
    title: "Adaptive difficulty",
    description: "Automatically adjust challenge level based on learner performance and progress.",
  },
  {
    title: "Performance insights",
    description: "Track strengths, weaknesses, and improvement areas with easy-to-read analytics.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-12 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Launch your next quiz in minutes
            </div>
            <div className="space-y-6">
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Build smarter quizzes with AI-driven insights.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Create, practice, and improve with adaptive quizzes designed for focused learning. Perfect for students, teachers, and lifelong learners.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Go to dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/quiz/create"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Create a quiz
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="mb-5 flex items-center justify-between text-slate-400">
                <span className="text-sm">Live practice session</span>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Active</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl bg-slate-900 p-5 shadow-inner shadow-slate-950/30">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Current quiz</p>
                      <p className="mt-1 text-lg font-semibold text-white">Algebra mastery</p>
                    </div>
                    <div className="rounded-2xl bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">Medium</div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-300">
                    <div className="rounded-3xl bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score</p>
                      <p className="mt-2 text-2xl font-semibold text-white">88%</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/80 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Time left</p>
                      <p className="mt-2 text-2xl font-semibold text-white">12m 30s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
                {feature.title.includes("AI") ? <BrainCircuit className="h-6 w-6" /> : feature.title.includes("difficulty") ? <BarChart3 className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
              </div>
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
