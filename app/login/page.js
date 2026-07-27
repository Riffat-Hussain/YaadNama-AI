"use client";

<<<<<<< HEAD
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
=======
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
>>>>>>> 739d91392505da1464319e73b1bdc5aba28db2cd
import { signIn } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";

function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);

<<<<<<< HEAD
=======
    // Demo Mode
>>>>>>> 739d91392505da1464319e73b1bdc5aba28db2cd
    if (DEMO_MODE) {
      localStorage.setItem(
        "yaadnama_demo_user",
        JSON.stringify({
          email,
          loginTime: new Date().toISOString(),
        })
      );

      router.push("/dashboard");
      return;
    }

<<<<<<< HEAD
=======
    // Production Mode
>>>>>>> 739d91392505da1464319e73b1bdc5aba28db2cd
    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
<<<<<<< HEAD
    <main className="page-fade flex min-h-screen items-center justify-center bg-background px-6 py-12 text-ink">
      <div className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2.5rem] border border-surface-2 bg-surface/90 p-6 shadow-glow backdrop-blur-xl sm:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-7 px-4 py-8 sm:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal-dark">
              Welcome back
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-ink">Sign in to YaadNama</h1>
            <p className="max-w-md text-base leading-7 text-muted">
              Enter your credentials to access your memory vault, mood tracker, and AI companion.
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-surface-2 bg-white/90 p-6 shadow-card dark:bg-surface">
            <div className="space-y-3">
              <p className="text-base font-semibold">Why users love YaadNama</p>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Smart memory search for people, places, and routines</li>
                <li>• Calm mood logging and personal insights</li>
                <li>• Secure local storage, gentle UI, and mobile-friendly flow</li>
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-teal/10 p-4 text-sm font-semibold text-teal-dark">Memory-first</div>
              <div className="rounded-[1.5rem] bg-gold/10 p-4 text-sm font-semibold text-gold-dark">Warm visuals</div>
              <div className="rounded-[1.5rem] bg-surface/80 p-4 text-sm font-semibold text-muted">Fast access</div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Secure Access</p>
              <h2 className="text-2xl font-semibold text-ink">Sign in</h2>
            </div>
            <Link href="/register" className="rounded-full border border-surface-2 bg-white/90 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-teal/10">
              Create account
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" aria-describedby="login-help">
            {successMessage && (
              <div className="rounded-3xl bg-teal/15 px-4 py-3 text-sm text-teal-dark">
                {successMessage}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="field-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
=======
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-16 text-ink">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-teal-dark hover:underline"
        >
          ← Back
        </Link>

        <div className="keepsake-card mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-keepsake shadow-keepsake">
          <span className="font-display text-3xl text-teal-dark">Y</span>
        </div>

        <h1 className="text-center font-display text-3xl font-semibold">
          Sign In
        </h1>

        <p className="mt-2 text-center text-inkfaint">
          Access your memory vault
        </p>

        <form
          onSubmit={handleSubmit}
          className="keepsake-card mt-8 space-y-4 rounded-keepsake p-6 shadow-keepsake"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border-2 border-paper2 bg-white px-4 py-2 text-ink outline-none transition-colors focus:border-teal-dark dark:border-white/20 dark:bg-white/10 dark:text-white/90"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border-2 border-paper2 bg-white px-4 py-2 text-ink outline-none transition-colors focus:border-teal-dark dark:border-white/20 dark:bg-white/10 dark:text-white/90"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-dark px-4 py-2 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
>>>>>>> 739d91392505da1464319e73b1bdc5aba28db2cd

            {error && <p className="text-sm text-rose-dark">{error}</p>}

<<<<<<< HEAD
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div id="login-help" className="mt-6 text-sm text-muted">
            Need an account? <Link href="/register" className="text-teal-dark font-semibold hover:text-teal-dark/80">Create one</Link>
          </div>
        </section>
=======
        <p className="mt-6 text-center text-sm text-inkfaint">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-teal-dark hover:underline"
          >
            Create one
          </Link>
        </p>
>>>>>>> 739d91392505da1464319e73b1bdc5aba28db2cd
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
