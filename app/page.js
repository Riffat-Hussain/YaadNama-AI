"use client";

import Link from "next/link";

export default function FrontPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-16 text-ink">
      <div className="w-full max-w-md text-center">
        <div className="keepsake-card mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-keepsake shadow-keepsake">
          <span className="font-display text-4xl text-teal-dark">Y</span>
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight text-ink">
          YaadNama <span className="text-gold-dark">AI</span>
        </h1>
        <p className="mt-3 text-lg text-inkfaint">
          Your intelligent memory companion. A gentle place to keep the
          people, places, and moments that matter — and ask for them back
          whenever you need to.
        </p>

        <div className="mt-10 space-y-3">
          <Link
            href="/register"
            className="keepsake-card block rounded-keepsake bg-teal-light px-6 py-3 text-center font-semibold text-teal-dark shadow-keepsake transition-transform hover:-translate-y-0.5"
          >
            Create Account
          </Link>

          <Link
            href="/login"
            className="keepsake-card block rounded-keepsake border-2 border-teal-dark px-6 py-3 text-center font-semibold text-teal-dark shadow-keepsake transition-transform hover:-translate-y-0.5"
          >
            Sign In
          </Link>

          <Link
            href="/mood/guest"
            className="keepsake-card block rounded-keepsake bg-paper2 px-6 py-3 text-center font-semibold text-teal-dark transition-transform hover:-translate-y-0.5"
          >
            Continue as Guest
          </Link>
        </div>

        <p className="mt-8 text-sm text-inkfaint">
          Try YaadNama without creating an account to see how it works.
        </p>
      </div>
    </main>
  );
}
