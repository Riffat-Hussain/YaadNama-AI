"use client";

import { useEffect, useState } from "react";
import { CalendarDays, HeartPulse, MessageSquareText } from "lucide-react";
import RequireProfile from "@/components/RequireProfile";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMoods, addMood, MOODS } from "@/lib/storage";

function MoodContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [moods, setMoods] = useState([]);
  const [note, setNote] = useState("");
  useEffect(() => { async function loadData() { let email; if (DEMO_MODE) { const demoUser = localStorage.getItem("yaadnama_demo_user"); if (demoUser) email = JSON.parse(demoUser).email; } else { const { session } = await getSession(); email = session?.user?.email; } setUserEmail(email); if (email) setMoods(getMoods(email)); } loadData(); }, []);
  function logMood(moodKey) { const entry = addMood(userEmail, moodKey, note); setMoods((prev) => [entry, ...prev]); setNote(""); }
  const last7 = moods.slice(0, 7);
  const counts = MOODS.map((mood) => ({ ...mood, count: last7.filter((entry) => entry.mood === mood.key).length }));
  const maxCount = Math.max(1, ...counts.map((item) => item.count));
  return <div className="space-y-7"><section><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark"><HeartPulse aria-hidden="true" className="h-4 w-4" /> Daily check-in</div><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl dark:text-white">How are you feeling?</h1><p className="mt-2 leading-7 text-muted">There is no right answer. Choose the feeling that is closest right now.</p></section><Card><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{MOODS.map((mood) => <button key={mood.key} onClick={() => logMood(mood.key)} className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl bg-surface-2 px-2 py-4 text-center font-semibold text-ink transition hover:bg-teal/10 hover:text-teal-dark dark:bg-white/10 dark:text-white"><span className="text-3xl">{mood.emoji}</span><span className="text-sm">{mood.label}</span></button>)}</div><div className="mt-5"><label htmlFor="mood-note" className="field-label">A short note <span className="font-normal text-muted">(optional)</span></label><input id="mood-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What is on your mind?" className="input-field text-base" /><p className="mt-2 text-sm text-muted">Your note is saved with the mood you choose above.</p></div></Card><section className="grid gap-6 xl:grid-cols-2"><div><h2 className="mb-3 font-display text-2xl font-semibold text-ink dark:text-white">Your last 7 check-ins</h2><Card className="space-y-3">{counts.map((item) => <div key={item.key} className="flex items-center gap-3"><span className="w-24 shrink-0 text-sm font-medium">{item.emoji} {item.label}</span><div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2 dark:bg-white/10"><div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${(item.count / maxCount) * 100}%` }} /></div><span className="w-6 text-right text-sm font-semibold text-muted">{item.count}</span></div>)}</Card></div><div><h2 className="mb-3 font-display text-2xl font-semibold text-ink dark:text-white">Recent entries</h2>{moods.length === 0 ? <EmptyState icon={MessageSquareText} title="Your check-ins will appear here" description="Pick a mood above whenever you are ready." /> : <div className="space-y-3">{moods.slice(0, 8).map((entry) => { const info = MOODS.find((mood) => mood.key === entry.mood); return <Card key={entry.id} className="flex items-start justify-between gap-4 p-4"><p className="font-medium text-ink dark:text-white">{info?.emoji} {info?.label}{entry.note ? <span className="block pt-1 text-sm font-normal text-muted">{entry.note}</span> : null}</p><p className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />{new Date(entry.date).toLocaleDateString()}</p></Card>; })}</div>}</div></section></div>;
}

export default function MoodPage() { return <RequireProfile><MoodContent /></RequireProfile>; }
