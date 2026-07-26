"use client";

import { useEffect, useRef, useState } from "react";
import RequireProfile from "@/components/RequireProfile";
import { getSession } from "@/lib/auth";
import { DEMO_MODE } from "@/lib/demo";
import { getMemories, getChatHistory, addChatMessage } from "@/lib/storage";

const SUGGESTIONS = [
  "Who is Ahmed?",
  "Where did I leave my glasses?",
  "What medicine do I take?",
  "Show me my recent memories about family.",
];

function CompanionContent() {
  const [userEmail, setUserEmail] = useState(null);
  const [memories, setMemories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

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
        setMessages(getChatHistory(email));
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(q) {
    const text = q.trim();
    if (!text || loading || !userEmail) return;
    setError("");
    setQuestion("");

    const userMsg = { role: "user", text, at: new Date().toISOString() };
    const withUser = addChatMessage(userEmail, userMsg);
    setMessages(withUser);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "companion",
          question: text,
          memories,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      const botMsg = { role: "assistant", text: data.answer, at: new Date().toISOString() };
      setMessages(addChatMessage(userEmail, botMsg));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="font-display text-3xl font-semibold">AI Companion</h1>
        <p className="mt-1 text-inkfaint">
          Ask about anything you've saved. I'll only answer from your Memory
          Vault — I won't guess or make things up.
        </p>
      </section>

      {memories.length === 0 ? (
        <div className="keepsake-card rounded-keepsake p-6 text-center shadow-keepsake">
          You haven't saved any memories yet, so I don't have much to answer
          from. Visit the Memory Vault to add some first.
        </div>
      ) : null}

      <div className="keepsake-card flex h-[50vh] min-h-[320px] flex-col rounded-keepsake p-4 shadow-keepsake">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="p-2 text-inkfaint">
              Try asking: "{SUGGESTIONS[0]}"
            </p>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-base ${
                  m.role === "user"
                    ? "ml-auto bg-teal text-white"
                    : "bg-paper2 text-ink dark:bg-white/10 dark:text-white"
                }`}
              >
                {m.text}
              </div>
            ))
          )}
          {loading ? (
            <div className="max-w-[85%] rounded-2xl bg-paper2 px-4 py-2.5 text-inkfaint dark:bg-white/10">
              Thinking…
            </div>
          ) : null}
          <div ref={scrollRef} />
        </div>
      </div>

      {error ? <p className="text-sm text-rose-dark">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="rounded-full bg-paper2 px-3 py-1.5 text-sm text-ink/70 hover:bg-paper2/70 dark:bg-white/10 dark:text-white/70"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex gap-3"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything you've saved…"
          className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-lg outline-none focus:border-teal dark:bg-white/5"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-teal px-6 py-3 font-semibold text-white hover:bg-teal-dark disabled:opacity-60"
        >
          Ask
        </button>
      </form>
    </div>
  );
}

export default function CompanionPage() {
  return (
    <RequireProfile>
      <CompanionContent />
    </RequireProfile>
  );
}
