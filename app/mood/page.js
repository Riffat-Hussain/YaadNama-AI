"use client";

import { useEffect, useState } from "react";
import RequireProfile from "@/components/RequireProfile";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMoods, addMood, MOODS } from "@/lib/storage";

function MoodContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [moods, setMoods] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    async function loadData() {
      let email;
      
      // Check for demo mode
      if (DEMO_MODE) {
        const demoUser = localStorage.getItem("yaadnama_demo_user");
        if (demoUser) {
          email = JSON.parse(demoUser).email;
        }
      } else {
        const { session } = await getSession();
        email = session?.user?.email;
      }

      setUserEmail(email);
      if (email) setMoods(getMoods(email));
    }
    loadData();
  }, []);

  function logMood(moodKey) {
    const entry = addMood(userEmail, moodKey, note);
    setMoods((prev) => [entry, ...prev]);
    setNote("");
  }

  const last7 = moods.slice(0, 7);
  const counts = MOODS.map((m) => ({
    ...m,
    count: last7.filter((e) => e.mood === m.key).length,
  }));
  const maxCount = Math.max(1, ...counts.map((c) => c.count));

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-semibold">Mood Tracker</h1>
        <p className="mt-1 text-inkfaint">How are you feeling right now?</p>
      </section>

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
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a short note (optional)…"
          className="mt-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-teal dark:bg-white/5"
        />
        <p className="mt-2 text-sm text-inkfaint">
          Tap a mood above to log it — your note will be saved alongside it.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Last 7 check-ins</h2>
        <div className="keepsake-card space-y-2 rounded-keepsake p-6 shadow-keepsake">
          {counts.map((c) => (
            <div key={c.key} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm">{c.emoji} {c.label}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-paper2 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${(c.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm text-inkfaint">{c.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold">Recent entries</h2>
        {moods.length === 0 ? (
          <p className="text-inkfaint">No mood entries yet.</p>
        ) : (
          <div className="space-y-2">
            {moods.slice(0, 10).map((e) => {
              const info = MOODS.find((m) => m.key === e.mood);
              return (
                <div
                  key={e.id}
                  className="keepsake-card flex items-center justify-between rounded-keepsake p-4 shadow-keepsake"
                >
                  <span>
                    {info?.emoji} {info?.label}
                    {e.note ? <span className="text-inkfaint"> — {e.note}</span> : null}
                  </span>
                  <span className="text-sm text-inkfaint">
                    {new Date(e.date).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MoodPage() {
  return (
    <RequireProfile>
      <MoodContent />
    </RequireProfile>
  );
}
