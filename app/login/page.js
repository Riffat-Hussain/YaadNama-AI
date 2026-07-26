"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    // Demo Mode
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

    // Production Mode
    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
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

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 border-t border-paper2"></div>
          <span className="text-sm text-inkfaint">or</span>
          <div className="flex-1 border-t border-paper2"></div>
        </div>

        <p className="mt-6 text-center text-sm text-inkfaint">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-teal-dark hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
