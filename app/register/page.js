"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signUp } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email to begin.");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password needs at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don’t match.");
      return;
    }

    setLoading(true);

    if (DEMO_MODE) {
      localStorage.setItem("yaadnama_demo_user", JSON.stringify({ email, loginTime: new Date().toISOString() }));
      router.push("/login?registered=true");
      return;
    }

    const { error: authError } = await signUp(email, password);
    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <main className="page-fade min-h-screen bg-background px-6 py-12 text-ink">
      <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[2.5rem] border border-surface-2 bg-surface/90 p-6 shadow-glow backdrop-blur-xl sm:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-7 px-4 py-8 sm:px-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-sm font-semibold text-gold-dark">
              Start your memory journey
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-ink">Create your account</h1>
            <p className="max-w-md text-base leading-7 text-muted">
              Join YaadNama and begin capturing memories, moods, and meaningful moments with modern clarity.
            </p>
          </div>

          <div className="grid gap-4 rounded-[2rem] border border-surface-2 bg-white/90 p-6 shadow-card dark:bg-surface">
            <div className="space-y-3">
              <p className="text-base font-semibold">What you’ll get</p>
              <ul className="space-y-2 text-sm text-muted">
                <li>• Elegant journaling and memory organization</li>
                <li>• AI-powered recap summaries</li>
                <li>• Quick mood check-ins and insights</li>
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-gold/10 p-4 text-sm font-semibold text-gold-dark">Thoughtful design</div>
              <div className="rounded-[1.5rem] bg-teal/10 p-4 text-sm font-semibold text-teal-dark">Private by default</div>
              <div className="rounded-[1.5rem] bg-surface/80 p-4 text-sm font-semibold text-muted">Fast setup</div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Account setup</p>
              <h2 className="text-2xl font-semibold text-ink">Sign up</h2>
            </div>
            <Link href="/login" className="rounded-full border border-surface-2 bg-white/90 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-gold/10">
              Already have one
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" aria-describedby="register-help">
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

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="field-label">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && <p className="text-sm text-rose-dark">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p id="register-help" className="mt-6 text-sm text-muted">
            Password must be at least 6 characters and kept safe.
          </p>
        </section>
      </div>
    </main>
  );
}
