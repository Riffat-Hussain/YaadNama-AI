"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="page-fade flex min-h-screen items-center justify-center bg-background px-6 py-12 text-ink">
      <div className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2.5rem] border border-surface-2 bg-surface/90 p-6 shadow-glow backdrop-blur-xl sm:grid-cols-[1.1fr_0.9fr]">

        <section className="space-y-7 px-4 py-8 sm:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal-dark">
              Welcome back
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-ink">
              Sign in to YaadNama
            </h1>

            <p className="max-w-md text-base leading-7 text-muted">
              Enter your credentials to access your memory vault, mood tracker,
              and AI companion.
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-surface-2 bg-white/90 p-6 shadow-card dark:bg-surface">
            <p className="text-base font-semibold">
              Why users love YaadNama
            </p>

            <ul className="space-y-2 text-sm text-muted">
              <li>• Smart memory search for people, places, and routines</li>
              <li>• Calm mood logging and personal insights</li>
              <li>• Secure local storage and mobile-friendly flow</li>
            </ul>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-teal/10 p-4 text-sm font-semibold text-teal-dark">
                Memory-first
              </div>

              <div className="rounded-[1.5rem] bg-gold/10 p-4 text-sm font-semibold text-gold-dark">
                Warm visuals
              </div>

              <div className="rounded-[1.5rem] bg-surface/80 p-4 text-sm font-semibold text-muted">
                Fast access
              </div>
            </div>
          </div>
        </section>


        <section className="px-4 py-8 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                Secure Access
              </p>

              <h2 className="text-2xl font-semibold text-ink">
                Sign in
              </h2>
            </div>

            <Link
              href="/register"
              className="rounded-full border border-surface-2 bg-white/90 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-teal/10"
            >
              Create account
            </Link>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">

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
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>


            {error && (
              <p className="text-sm text-rose-dark">
                {error}
              </p>
            )}


            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

          </form>


          <div className="mt-6 text-sm text-muted">
            Need an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-teal-dark hover:text-teal-dark/80"
            >
              Create one
            </Link>
          </div>

        </section>

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