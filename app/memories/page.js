"use client";

import { useEffect, useState } from "react";
import RequireProfile from "@/components/RequireProfile";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMemories, addMemory, deleteMemory, CATEGORIES } from "@/lib/storage";

function emptyForm() {
  return {
    title: "",
    category: CATEGORIES[0],
    description: "",
    date: new Date().toISOString().slice(0, 10),
    tags: "",
  };
}

function MemoriesContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [memories, setMemories] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [filter, setFilter] = useState("All");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "summarize",
          title: form.title,
          description: form.description,
          category: form.category,
        }),
      });
      const data = await res.json();
      if (res.ok) summary = data.summary;
    } catch {
      // Summary is a nice-to-have; saving the memory should not fail because of it.
    }

    const newMemory = addMemory(userEmail, {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      date: form.date,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      summary,
    });

    setMemories((prev) => [newMemory, ...prev]);
    setForm(emptyForm());
    setSaving(false);
  }

  function handleDelete(id) {
    deleteMemory(userEmail, id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }

  const filtered =
    filter === "All" ? memories : memories.filter((m) => m.category === filter);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="font-display text-3xl font-semibold">Memory Vault</h1>
        <p className="mt-1 text-inkfaint">
          Save the people, places, medications, and moments you want to keep close.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="keepsake-card grid gap-4 rounded-keepsake p-6 shadow-keepsake sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="mb-1 block font-medium">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Ahmed, my son"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-teal dark:bg-white/5"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-teal dark:bg-white/5"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-medium">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-teal dark:bg-white/5"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. My son. He visits every Sunday and brings mangoes."
            rows={3}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-teal dark:bg-white/5"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block font-medium">Tags (comma separated, optional)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="e.g. family, sunday, favorite"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-lg outline-none focus:border-teal dark:bg-white/5"
          />
        </div>

        {error ? <p className="text-sm text-rose-dark sm:col-span-2">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-dark disabled:opacity-60 sm:col-span-2"
        >
          {saving ? "Saving…" : "Save memory"}
        </button>
      </form>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("All")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === "All" ? "bg-teal text-white" : "bg-paper2 text-ink/70"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                filter === c ? "bg-teal text-white" : "bg-paper2 text-ink/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="keepsake-card rounded-keepsake p-8 text-center shadow-keepsake">
            <p className="text-lg">No memories in this category yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((m) => (
              <div key={m.id} className="keepsake-card rounded-keepsake p-5 shadow-keepsake">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                      {m.category}
                    </p>
                    <p className="mt-1 font-display text-lg">{m.title}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    aria-label={`Delete memory: ${m.title}`}
                    className="text-sm text-rose-dark hover:underline"
                  >
                    Delete
                  </button>
                </div>
                <p className="mt-2 text-sm text-inkfaint">{m.description}</p>
                {m.summary ? (
                  <p className="mt-2 rounded-lg bg-paper2 px-3 py-2 text-sm italic text-teal-dark dark:bg-white/5 dark:text-gold-light">
                    ✨ {m.summary}
                  </p>
                ) : null}
                {m.tags?.length ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-paper2 px-2.5 py-1 text-xs text-ink/60 dark:bg-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
                <p className="mt-3 text-xs text-inkfaint">
                  {new Date(m.date || m.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function MemoriesPage() {
  return (
    <RequireProfile>
      <MemoriesContent />
    </RequireProfile>
  );
}
