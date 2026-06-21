import Link from "next/link";
import { BarChart3, BookOpen, PlusCircle, Sparkles } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden h-[calc(100vh-72px)] w-72 flex-col gap-6 border-r border-slate-200 bg-slate-50 px-4 py-6 lg:flex">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-900">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">Workspace</span>
        </div>
        <p className="text-sm text-slate-600">Manage quizzes, analyze progress, and keep AI insights within reach.</p>
      </div>

      <nav className="space-y-2 text-sm font-medium text-slate-700">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white hover:text-slate-900">
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Link>
        <Link href="/quiz/create" className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white hover:text-slate-900">
          <PlusCircle className="h-4 w-4" />
          Create Quiz
        </Link>
        <Link href="/quiz/placeholder" className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white hover:text-slate-900">
          <BookOpen className="h-4 w-4" />
          Take Quiz
        </Link>
      </nav>
    </aside>
  );
}
