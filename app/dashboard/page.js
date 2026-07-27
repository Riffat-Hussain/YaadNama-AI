"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookHeart,
  BrainCircuit,
  CalendarDays,
  HeartPulse,
  MessageCircleHeart,
  Plus,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import RequireProfile from "@/components/RequireProfile";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import StatTile from "@/components/ui/StatTile";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMemories, getMoods, MOODS } from "@/lib/storage";

const CATEGORY_TONES = {
  Family: "teal",
  Friends: "gold",
  "Important Events": "rose",
  Places: "teal",
  Medications: "rose",
  "Personal Notes": "gold",
  "Important Dates": "rose",
  "Favorite Things": "gold",
  "Lost Items": "teal",
};

function timeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function relativeDate(dateString) {
  if (!dateString) return "Recently";
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(dateString).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dateKey(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function DashboardContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [memories, setMemories] = useState([]);
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    async function loadData() {
      let email;
      if (DEMO_MODE) {
        const demoUser = localStorage.getItem("yaadnama_demo_user");
        if (demoUser) email = JSON.parse(demoUser).email;
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

  const today = new Date();
  const todayMood = moods.find((entry) => dateKey(new Date(entry.date)) === dateKey(today));
  const todayMoodInfo = todayMood ? MOODS.find((mood) => mood.key === todayMood.mood) : null;
  const recentMemories = memories.slice(0, 4);
  const name = userEmail?.split("@")[0]?.split(/[._-]/)[0] || "friend";
  const firstName = name.charAt(0).toUpperCase() + name.slice(1);
  const activityDates = [
    ...memories.map((memory) => memory.createdAt || memory.date),
    ...moods.map((mood) => mood.date),
  ].filter(Boolean).map((value) => new Date(value).getTime());
  const firstActivity = activityDates.length ? Math.min(...activityDates) : Date.now();
  const daysUsing = Math.max(1, Math.floor((Date.now() - firstActivity) / 86400000) + 1);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(today.getDate() - (6 - index));
    const entry = moods.find((mood) => dateKey(new Date(mood.date)) === dateKey(date));
    return { date, info: entry ? MOODS.find((mood) => mood.key === entry.mood) : null };
  });

  return (
    <div className="page-fade space-y-6 lg:space-y-8">
      {/* Greeting Section */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-sm font-semibold text-gold-dark dark:text-gold-light">
            <Sparkles aria-hidden="true" className="h-4 w-4" /> Your calm place
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-white">
            {timeOfDayGreeting()}, {firstName}.
          </h1>
          <p className="mt-2 flex items-center gap-2 text-muted">
            <CalendarDays aria-hidden="true" className="h-5 w-5 text-teal-dark" />
            {today.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link href="/memories" className="btn-primary min-h-12 self-start sm:self-auto">
          <Plus aria-hidden="true" className="h-5 w-5" /> Save a memory
        </Link>
      </section>

      {/* Stat Cards — Varied Sizes for Visual Rhythm */}
      <section aria-label="Today at a glance" className="grid gap-4 md:grid-cols-3">
        <Link href="/memories" className="rounded-keepsake outline-offset-4 md:col-span-1">
          <StatTile
            icon={BookHeart}
            label="Memory Vault"
            value={memories.length}
            detail={memories.length === 1 ? "memory saved" : "memories saved"}
            className="min-h-[7.5rem]"
          />
        </Link>
        <Link href="/mood" className="rounded-keepsake outline-offset-4 md:col-span-1">
          <StatTile
            icon={HeartPulse}
            label="Today's mood"
            value={todayMoodInfo ? `${todayMoodInfo.emoji} ${todayMoodInfo.label}` : "Not logged"}
            detail={todayMoodInfo ? "Tap to update" : "Tap to log how you feel"}
            className="min-h-[7.5rem]"
          />
        </Link>
        <div className="md:col-span-1">
          <StatTile
            icon={BrainCircuit}
            label="Your journey"
            value={`Day ${daysUsing}`}
            detail={daysUsing === 1 ? "A gentle start" : "Days using YaadNama"}
            className="min-h-[7.5rem]"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/memories"
          className="btn-secondary min-h-14 justify-start gap-3 px-5"
        >
          <BookHeart aria-hidden="true" className="h-5 w-5 text-teal-dark" />
          Save a memory
        </Link>
        <Link
          href="/companion"
          className="btn-secondary min-h-14 justify-start gap-3 px-5"
        >
          <MessageCircleHeart aria-hidden="true" className="h-5 w-5 text-gold-dark" />
          Ask the Companion
        </Link>
        <Link
          href="/mood"
          className="btn-secondary min-h-14 justify-start gap-3 px-5"
        >
          <HeartPulse aria-hidden="true" className="h-5 w-5 text-teal-dark" />
          Log my mood
        </Link>
        <Link
          href="/emergency"
          className="inline-flex min-h-14 items-center justify-start gap-3 rounded-full bg-rose/10 px-5 font-semibold text-rose-dark transition duration-200 ease-out hover:bg-rose hover:text-white active:scale-[0.98] dark:bg-rose/20 dark:text-rose-light"
        >
          <ShieldAlert aria-hidden="true" className="h-5 w-5" />
          Emergency contacts
        </Link>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
        {/* Recent Memories */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">
                Recent memories
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                A few moments you saved recently.
              </p>
            </div>
            <Link
              href="/memories"
              className="shrink-0 text-sm font-semibold text-teal-dark transition hover:text-teal-dark/80 hover:underline"
            >
              View all &rarr;
            </Link>
          </div>
          {recentMemories.length === 0 ? (
            <EmptyState
              icon={BookHeart}
              title="Let's save your first memory"
              description="A name, a place, or a small moment is enough to begin."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentMemories.map((memory, i) => (
                <Card
                  key={memory.id}
                  interactive
                  className="card-reveal min-h-[11rem]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <Badge tone={CATEGORY_TONES[memory.category] || "neutral"}>
                      {memory.category}
                    </Badge>
                    <span className="shrink-0 text-xs font-medium text-muted">
                      {relativeDate(memory.createdAt || memory.date)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink dark:text-white">
                    {memory.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                    {memory.summary || memory.description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Mood */}
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink dark:text-white">
                Your week in moods
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                One gentle check-in at a time.
              </p>
            </div>
            <Link
              href="/mood"
              className="shrink-0 text-sm font-semibold text-teal-dark transition hover:text-teal-dark/80 hover:underline"
            >
              Log today
            </Link>
          </div>
          <Card className="h-full min-h-[15rem]">
            <div className="grid grid-cols-7 gap-2">
              {week.map(({ date, info }) => (
                <div
                  key={date.toISOString()}
                  className="flex min-w-0 flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold text-muted">
                    {date.toLocaleDateString(undefined, { weekday: "narrow" })}
                  </span>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl transition ${
                      info
                        ? "bg-gold/15 shadow-sm"
                        : "bg-surface-2 text-muted dark:bg-white/10"
                    }`}
                    aria-label={
                      info
                        ? `${info.label} on ${date.toLocaleDateString()}`
                        : `No mood logged on ${date.toLocaleDateString()}`
                    }
                  >
                    {info ? info.emoji : "\u00B7"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-teal/10 p-4 text-sm leading-6 text-teal-dark dark:bg-teal/15 dark:text-teal-light">
              {todayMoodInfo
                ? `Today you logged "${todayMoodInfo.label}." You can update it any time.`
                : "You haven't checked in today. There's no right answer\u2014just choose what feels closest."}
            </div>
          </Card>
        </div>
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
