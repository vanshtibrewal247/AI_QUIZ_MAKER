"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">Account access</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Sign in to your dashboard</h1>
          <p className="mt-3 text-sm text-slate-600">Use your existing account to access AI-powered insights and quiz creation tools.</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
            className="flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Continue with email
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Not ready yet? <Link href="/dashboard" className="font-semibold text-indigo-600 hover:text-indigo-700">Continue as guest</Link>
        </p>
      </div>
    </div>
  );
}
