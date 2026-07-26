"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // DEMO MODE: Allow registration with any email/password (for testing without Supabase)
    if (DEMO_MODE) {
      localStorage.setItem("yaadnama_demo_user", JSON.stringify({ email, loginTime: new Date().toISOString() }));
      router.push("/login?registered=true");
      return;
    }

    // Production mode: use Supabase
    const { data, error: authError } = await signUp(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-16 text-ink">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center text-sm text-teal-dark hover:underline">
          ← Back
        </Link>

        <div className="keepsake-card mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-keepsake shadow-keepsake">
          <span className="font-display text-3xl text-teal-dark">Y</span>
        </div>

        <h1 className="font-display text-3xl font-semibold text-center">
          Create Your Account
        </h1>
        <p className="mt-2 text-center text-inkfaint">
          Join YaadNama and start building your memory vault
        </p>

        <form
          onSubmit={handleSubmit}
          className="keepsake-card mt-8 rounded-keepsake p-6 shadow-keepsake space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
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
            <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
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
            <p className="mt-1 text-xs text-inkfaint">At least 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-ink mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              className="w-full rounded-lg border-2 border-paper2 bg-white px-4 py-2 text-ink outline-none transition-colors focus:border-teal-dark dark:border-white/20 dark:bg-white/10 dark:text-white/90"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-dark px-4 py-2 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-inkfaint">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal-dark hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
