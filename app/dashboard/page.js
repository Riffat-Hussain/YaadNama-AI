"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireProfile from "@/components/RequireProfile";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMemories, getMoods, MOODS } from "@/lib/storage";

function timeOfDayGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [memories, setMemories] = useState([]);
  const [moods, setMoods] = useState([]);

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
      if (email) {
        setMemories(getMemories(email));
        setMoods(getMoods(email));
      }
    }
    loadData();
  }, []);

  const latestMood = moods[0];
  const moodInfo = latestMood ? MOODS.find((m) => m.key === latestMood.mood) : null;
  const recentMemories = memories.slice(0, 3);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-semibold">
          {timeOfDayGreeting()}, friend.
        </h1>
        <p className="mt-1 text-inkfaint">
          Here is everything you've saved, gathered in one calm place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/memories"
          className="keepsake-card rounded-keepsake p-5 shadow-keepsake transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-inkfaint">Memory Vault</p>
          <p className="mt-1 font-display text-3xl text-teal-dark">{memories.length}</p>
          <p className="mt-1 text-sm text-inkfaint">memories saved</p>
        </Link>

        <Link
          href="/mood"
          className="keepsake-card rounded-keepsake p-5 shadow-keepsake transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-inkfaint">Today's mood</p>
          <p className="mt-1 font-display text-3xl">
            {moodInfo ? `${moodInfo.emoji} ${moodInfo.label}` : "Not logged yet"}
          </p>
          <p className="mt-1 text-sm text-inkfaint">Tap to check in</p>
        </Link>

        <Link
          href="/companion"
          className="keepsake-card rounded-keepsake p-5 shadow-keepsake transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-inkfaint">AI Companion</p>
          <p className="mt-1 font-display text-3xl text-gold-dark">Ask me</p>
          <p className="mt-1 text-sm text-inkfaint">"Who is Ahmed?" · "Where are my keys?"</p>
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent memories</h2>
          <Link href="/memories" className="text-sm font-medium text-teal-dark hover:underline">
            View all
          </Link>
        </div>

        {recentMemories.length === 0 ? (
          <div className="keepsake-card rounded-keepsake p-8 text-center shadow-keepsake">
            <p className="text-lg">You haven't saved any memories yet.</p>
            <Link
              href="/memories"
              className="mt-4 inline-block rounded-full bg-teal px-5 py-2.5 font-semibold text-white hover:bg-teal-dark"
            >
              Save your first memory
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recentMemories.map((m) => (
              <div key={m.id} className="keepsake-card rounded-keepsake p-5 shadow-keepsake">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                  {m.category}
                </p>
                <p className="mt-1 font-display text-lg">{m.title}</p>
                <p className="mt-1 line-clamp-3 text-sm text-inkfaint">{m.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireProfile>
      <DashboardContent />
    </RequireProfile>
  );
}
