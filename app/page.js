"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function FrontPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-10 text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-teal/20 to-transparent opacity-80" />
      <div className="pointer-events-none absolute right-0 top-16 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="relative z-10 space-y-8 py-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-teal-dark shadow-sm">
            <Sparkles className="h-4 w-4" />
            Personal AI memory for Pakistan
          </div>

          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
              YaadNama AI
            </h1>
            <p className="max-w-2xl text-xl leading-8 text-muted sm:text-2xl">
              A polished memory companion for the moments, people, and routines that matter — built with trust, warmth, and modern intelligence.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:max-w-xl">
            <Link href="/register" className="btn-primary">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="glass-card rounded-[2rem] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Memories</p>
              <p className="mt-3 text-3xl font-semibold">Saved with care</p>
            </div>
            <div className="glass-card rounded-[2rem] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">AI Insights</p>
              <p className="mt-3 text-3xl font-semibold">Gentle reminders</p>
            </div>
            <div className="glass-card rounded-[2rem] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Mood</p>
              <p className="mt-3 text-3xl font-semibold">Daily check-ins</p>
            </div>
          </div>
        </section>

        <section className="relative rounded-[2.5rem] border border-surface-2 bg-surface/95 p-8 shadow-glow backdrop-blur-xl">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-teal/10 via-transparent to-gold/10" />
          <div className="relative space-y-5">
            <div className="rounded-[2rem] bg-white/95 p-6 shadow-card dark:bg-surface">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-dark">Why YaadNama?</p>
              <p className="mt-3 text-base leading-7 text-muted">
                Clean journaling, memory search, AI reminders, and mood tracking — designed for a gentle daily routine.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-teal/10 p-5">
                <p className="text-sm text-muted">Secure notes</p>
                <p className="mt-3 text-2xl font-semibold">Private & easy</p>
              </div>
              <div className="rounded-[1.75rem] bg-gold/10 p-5">
                <p className="text-sm text-muted">Thoughtful visuals</p>
                <p className="mt-3 text-2xl font-semibold">Modern and calm</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-surface-2 bg-surface/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">Launch trust</p>
              <p className="mt-3 text-lg font-semibold text-ink">Made for caring people who want a stronger memory system.</p>
            </div>
            <div className="rounded-[2rem] border border-surface-2 bg-white/90 p-5 text-sm text-muted">
              <div className="flex items-center gap-3 text-teal-dark">
                <ShieldCheck className="h-5 w-5" />
                <span>Built for privacy and ease of use.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
