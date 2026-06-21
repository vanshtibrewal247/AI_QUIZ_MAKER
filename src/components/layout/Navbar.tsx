import Link from "next/link";
import { LogIn, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <span>AI Quiz Maker</span>
        </Link>

        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Link href="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-slate-100">
            Dashboard
          </Link>
          <Link href="/quiz/create" className="rounded-full px-4 py-2 transition hover:bg-slate-100">
            Create Quiz
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2 font-medium text-slate-800 transition hover:bg-slate-100"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
