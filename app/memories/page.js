"use client";

import { useEffect, useState } from "react";
import { BookHeart, CalendarDays, Plus, Search, Sparkles, Tags, Trash2 } from "lucide-react";
import RequireProfile from "@/components/RequireProfile";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMemories, addMemory, deleteMemory, CATEGORIES } from "@/lib/storage";

const CATEGORY_TONES = {
  Family: "teal", Friends: "gold", "Important Events": "rose", Places: "teal", Medications: "rose",
  "Personal Notes": "gold", "Important Dates": "rose", "Favorite Things": "gold", "Lost Items": "teal",
};

function emptyForm() {
  return { title: "", category: CATEGORIES[0], description: "", date: new Date().toISOString().slice(0, 10), tags: "" };
}

function MemoriesContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [memories, setMemories] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      if (email) setMemories(getMemories(email));
    }
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.description.trim()) {
      setError("Please fill in at least a title and description.");
      return;
    }
    setSaving(true);
    let summary = "";
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "summarize", title: form.title, description: form.description, category: form.category }) });
      const data = await res.json();
      if (res.ok) summary = data.summary;
    } catch {
      // Saving remains available if the optional AI summary cannot be created.
    }
    const newMemory = addMemory(userEmail, { title: form.title.trim(), category: form.category, description: form.description.trim(), date: form.date, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean), summary });
    setMemories((prev) => [newMemory, ...prev]);
    setForm(emptyForm());
    setSaving(false);
  }

  function handleDelete(id) {
    deleteMemory(userEmail, id);
    setMemories((prev) => prev.filter((memory) => memory.id !== id));
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = memories.filter((memory) => {
    const matchesCategory = filter === "All" || memory.category === filter;
    const matchesQuery = !normalizedQuery || [memory.title, memory.description, memory.summary, ...(memory.tags || [])].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark"><BookHeart aria-hidden="true" className="h-4 w-4" /> Your Memory Vault</div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl dark:text-white">Keep what matters close.</h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted">Save people, places, medications, and moments in words that feel familiar to you.</p>
        </div>
        <a href="#new-memory" className="btn-primary min-h-12 self-start sm:self-auto"><Plus aria-hidden="true" className="h-5 w-5" /> Add a memory</a>
      </section>

      <Card className="p-0">
        <details id="new-memory" open className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none sm:px-6">
            <span><span className="block font-display text-xl font-semibold text-ink dark:text-white">Save a new memory</span><span className="mt-1 block text-sm text-muted">Start with one detail. You can add more when it feels helpful.</span></span>
            <span className="rounded-full bg-teal/10 px-3 py-1.5 text-sm font-semibold text-teal-dark group-open:hidden">Open</span>
            <span className="hidden rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold text-muted group-open:inline dark:bg-white/10">Close</span>
          </summary>
          <form onSubmit={handleSubmit} className="grid gap-5 border-t border-surface-2 px-5 py-6 sm:grid-cols-2 sm:px-6">
            <div className="sm:col-span-2"><label htmlFor="memory-title" className="field-label">What would you like to remember?</label><input id="memory-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="For example: Ahmed, my son" className="input-field text-base" /></div>
            <div><label htmlFor="memory-category" className="field-label">Choose a category</label><select id="memory-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-base">{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></div>
            <div><label htmlFor="memory-date" className="field-label">When was this?</label><input id="memory-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field text-base" /></div>
            <div className="sm:col-span-2"><label htmlFor="memory-description" className="field-label">Tell the story in your own words</label><textarea id="memory-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="For example: He visits every Sunday and brings mangoes." rows={4} className="input-field resize-y text-base" /></div>
            <div className="sm:col-span-2"><label htmlFor="memory-tags" className="field-label">Helpful tags <span className="font-normal text-muted">(optional)</span></label><input id="memory-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="family, Sunday, favorite" className="input-field text-base" /></div>
            {error ? <p className="sm:col-span-2 text-sm font-medium text-rose-dark">{error}</p> : null}
            <div className="sm:col-span-2"><button type="submit" disabled={saving} className="btn-primary min-h-12 w-full sm:w-auto">{saving ? "Saving…" : <><Sparkles aria-hidden="true" className="h-5 w-5" /> Save this memory</>}</button></div>
          </form>
        </details>
      </Card>

      <section aria-labelledby="memory-list-title">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 id="memory-list-title" className="font-display text-2xl font-semibold text-ink dark:text-white">Your saved memories</h2><p className="mt-1 text-sm text-muted">{memories.length === 1 ? "1 memory" : `${memories.length} memories`} in your vault.</p></div>
          <label className="relative block w-full lg:w-80"><span className="sr-only">Search your memories</span><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people, places, or tags" className="input-field pl-11" /></label>
        </div>
        <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:px-0" aria-label="Memory categories">
          {["All", ...CATEGORIES].map((category) => <button key={category} onClick={() => setFilter(category)} className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition ${filter === category ? "bg-teal text-white shadow-sm" : "bg-surface-2 text-ink/75 hover:bg-teal/10 hover:text-teal-dark dark:bg-white/10 dark:text-white/80"}`}>{category}</button>)}
        </div>
        {filtered.length === 0 ? <EmptyState icon={Search} title={memories.length ? "No matching memories" : "Your memory vault is ready"} description={memories.length ? "Try a different word or category." : "Save a first memory whenever you feel ready."} /> : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((memory) => <Card key={memory.id} interactive className="flex min-h-64 flex-col">
              <div className="flex items-start justify-between gap-3"><Badge tone={CATEGORY_TONES[memory.category] || "neutral"}>{memory.category}</Badge><button onClick={() => handleDelete(memory.id)} aria-label={`Delete memory: ${memory.title}`} className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-rose-dark transition hover:bg-rose/10"><Trash2 aria-hidden="true" className="h-4 w-4" /> Delete</button></div>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink dark:text-white">{memory.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{memory.description}</p>
              {memory.summary ? <div className="mt-3 rounded-xl bg-teal/10 px-3 py-2 text-sm leading-6 text-teal-dark dark:bg-teal/15 dark:text-teal-light"><Sparkles aria-hidden="true" className="mr-1 inline h-4 w-4" />{memory.summary}</div> : null}
              {memory.tags?.length ? <div className="mt-3 flex flex-wrap gap-1.5">{memory.tags.map((tag) => <Badge key={tag} tone="neutral"><Tags aria-hidden="true" className="h-3 w-3" />{tag}</Badge>)}</div> : null}
              <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium text-muted"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />{new Date(memory.date || memory.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p>
            </Card>)}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MemoriesPage() { return <RequireProfile><MemoriesContent /></RequireProfile>; }
