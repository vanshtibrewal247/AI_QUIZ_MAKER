// "use client";
// export const dynamic = "force-dynamic";
// import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// type AuthMode = "signin" | "signup";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { isSignedIn, isLoaded } = useAuth();
//   const modeFromQuery = searchParams.get("mode") === "signup" ? "signup" : "signin";
//   const [mode, setMode] = useState<AuthMode>(modeFromQuery);

//   useEffect(() => {
//     setMode(modeFromQuery);
//   }, [modeFromQuery]);

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//       router.replace("/dashboard");
//     }
//   }, [isLoaded, isSignedIn, router]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
//       <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
//         <div className="mb-8 text-center">
//           <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">Account access</p>
//           <h1 className="mt-4 text-3xl font-semibold text-slate-900">
//             {mode === "signin" ? "Sign in to your dashboard" : "Create your account"}
//           </h1>
//           <p className="mt-3 text-sm text-slate-600">
//             {mode === "signin"
//               ? "Use your existing account to access AI-powered insights and quiz creation tools."
//               : "Create an account to save quizzes, track progress, and unlock personalized insights."}
//           </p>
//         </div>

//         <div className="mb-6 flex rounded-full border border-slate-200 bg-slate-100 p-1">
//           <button
//             type="button"
//             onClick={() => router.push("/login")}
//             className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
//               mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
//             }`}
//           >
//             Sign in
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push("/login?mode=signup")}
//             className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
//               mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
//             }`}
//           >
//             Create account
//           </button>
//         </div>

//         <div className="flex justify-center">
//           {mode === "signin" ? (
//             <SignIn
//               signUpUrl="/login?mode=signup"
//               forceRedirectUrl="/dashboard"
//               routing="hash"
//             />
//           ) : (
//             <SignUp
//               signInUrl="/login"
//               forceRedirectUrl="/dashboard"
//               routing="hash"
//             />
//           )}
//         </div>

//         <p className="mt-8 text-center text-sm text-slate-600">
//           Not ready yet? {" "}
//           <Link href="/dashboard" className="font-semibold text-indigo-600 hover:text-indigo-700">
//             Continue as guest
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type AuthMode = "signin" | "signup";

// ✅ Move all searchParams logic into a separate component
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();
  const modeFromQuery = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<AuthMode>(modeFromQuery);

  useEffect(() => {
    setMode(modeFromQuery);
  }, [modeFromQuery]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-indigo-600">Account access</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            {mode === "signin" ? "Sign in to your dashboard" : "Create your account"}
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {mode === "signin"
              ? "Use your existing account to access AI-powered insights and quiz creation tools."
              : "Create an account to save quizzes, track progress, and unlock personalized insights."}
          </p>
        </div>

        <div className="mb-6 flex rounded-full border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => router.push("/login?mode=signup")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create account
          </button>
        </div>

        <div className="flex justify-center">
          {mode === "signin" ? (
            <SignIn
              signUpUrl="/login?mode=signup"
              forceRedirectUrl="/dashboard"
              routing="hash"
            />
          ) : (
            <SignUp
              signInUrl="/login"
              forceRedirectUrl="/dashboard"
              routing="hash"
            />
          )}
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Not ready yet?{" "}
          <Link href="/dashboard" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}

// ✅ Wrap in Suspense in the default export
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}