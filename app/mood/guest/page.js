"use client";

import { useState } from "react";
import Link from "next/link";
import { getMoods, addMood, MOODS } from "@/lib/storage";

export default function GuestMoodPage() {
  const [moods, setMoods] = useState(() => getMoods("guest"));
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  function logMood(moodKey) {
    const entry = addMood("guest", moodKey, note);
    setMoods((prev) => [entry, ...prev]);
    setNote("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }

  const last7 = moods.slice(0, 7);
  const counts = MOODS.map((m) => ({
    ...m,
    count: last7.filter((e) => e.mood === m.key).length,
  }));
  const maxCount = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-[#1c2321] dark:text-[#f1ece0]">
      {/* Header */}
      <div className="border-b border-paper2 bg-paper2/30 dark:border-white/10">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">Guest Mood Tracker</h1>
          <Link href="/" className="text-sm text-teal-dark hover:underline">
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-6 py-8 space-y-8">
        <section>
          <h2 className="font-display text-2xl font-semibold">How are you feeling right now?</h2>
          <p className="mt-1 text-inkfaint">No account needed — just track how you're feeling</p>
        </section>

        {/* Success Message */}
        {showSuccess && (
          <div className="rounded-lg bg-teal-dark/20 border border-teal-dark px-4 py-3 text-teal-dark">
            Mood logged! 💜
          </div>
        )}

        {/* Mood Selector */}
        <div className="keepsake-card rounded-keepsake p-6 shadow-keepsake">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => logMood(m.key)}
                className="flex flex-col items-center gap-1 rounded-xl bg-paper2 py-4 text-center transition-transform hover:-translate-y-0.5 hover:bg-paper2/70 dark:bg-white/10"
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note Section */}
        <div className="keepsake-card rounded-keepsake p-6 shadow-keepsake">
          <label htmlFor="note" className="block text-sm font-medium text-ink mb-2">
            Add a note (optional)
          </label>
          <textarea
            id="note"
            placeholder="What's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-24 rounded-lg border-2 border-paper2 bg-white px-3 py-2 text-ink outline-none transition-colors focus:border-teal-dark resize-none dark:border-white/20 dark:bg-white/10 dark:text-white/90"
          />
        </div>

        {/* Chart Section */}
        {moods.length > 0 && (
          <div className="keepsake-card rounded-keepsake p-6 shadow-keepsake">
            <h3 className="font-semibold text-lg mb-4">Last 7 Moods</h3>
            <div className="space-y-3">
              {counts.map((m) => (
                <div key={m.key} className="flex items-center gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="w-20 text-sm font-medium">{m.label}</span>
                  <div className="flex-1 h-6 bg-paper2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-dark transition-all"
                      style={{ width: `${(m.count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-inkfaint w-6 text-right">{m.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Moods */}
        {moods.length > 0 && (
          <div className="keepsake-card rounded-keepsake p-6 shadow-keepsake">
            <h3 className="font-semibold text-lg mb-4">Recent Entries</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {moods.slice(0, 10).map((mood) => {
                const moodInfo = MOODS.find((m) => m.key === mood.mood);
                return (
                  <div key={mood.id} className="pb-3 border-b border-paper2 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{moodInfo?.emoji}</span>
                      <span className="font-medium">{moodInfo?.label}</span>
                      <span className="text-xs text-inkfaint ml-auto">
                        {new Date(mood.date).toLocaleDateString()} {new Date(mood.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {mood.note && <p className="mt-1 text-sm text-inkfaint ml-9">{mood.note}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Account CTA */}
        <div className="keepsake-card rounded-keepsake p-6 shadow-keepsake bg-paper2/30 border-2 border-teal-dark/30">
          <p className="text-sm text-inkfaint mb-3">
            Want to save memories and access them anytime?
          </p>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-teal-dark px-6 py-2 font-semibold text-paper transition-transform hover:-translate-y-0.5"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
