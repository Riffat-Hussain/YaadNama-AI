"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  BookHeart,
  MessageCircleHeart,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import RequireProfile from "@/components/RequireProfile";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
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
  const composerRef = useRef(null);

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
        setMessages(getChatHistory(email));
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const ask = useCallback(async (q) => {
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
        body: JSON.stringify({ mode: "companion", question: text, memories }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      const botMsg = {
        role: "assistant",
        text: data.answer,
        at: new Date().toISOString(),
      };
      setMessages(addChatMessage(userEmail, botMsg));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      composerRef.current?.focus();
    }
  }, [loading, userEmail, memories]);

  return (
    <div className="page-fade space-y-5">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1.5 text-sm font-semibold text-gold-dark dark:text-gold-light">
            <MessageCircleHeart aria-hidden="true" className="h-4 w-4" /> Your AI Companion
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl dark:text-white">
            Ask about what you&apos;ve saved.
          </h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted">
            A calm conversation to help you find the details that matter.
          </p>
        </div>
        <Badge tone="teal">
          <ShieldCheck aria-hidden="true" className="h-4 w-4" /> Answers only from your vault
        </Badge>
      </section>

      {memories.length === 0 ? (
        <EmptyState
          icon={BookHeart}
          title="Add a memory before asking"
          description="Your Companion only uses details from your Memory Vault, so it never has to guess."
        />
      ) : null}

      <Card className="flex h-[50vh] min-h-[360px] flex-col p-0 overflow-hidden">
        <div
          aria-live="polite"
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gold/15 text-gold-dark">
                <Bot aria-hidden="true" className="h-7 w-7" />
              </div>
              <p className="font-display text-xl font-semibold text-ink dark:text-white">
                What would you like to remember?
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted">
                Try a question below. I&apos;ll look only at the memories you have saved.
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const mine = message.role === "user";
              return (
                <div
                  key={`${message.at || index}-${index}`}
                  className={`flex items-end gap-2.5 ${mine ? "flex-row-reverse" : "flex-row"}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      mine ? "bg-teal text-white" : "bg-gold/15 text-gold-dark"
                    }`}
                  >
                    {mine ? (
                      <UserRound aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      <Bot aria-hidden="true" className="h-4 w-4" />
                    )}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-base leading-7 shadow-sm ${
                      mine
                        ? "bg-teal text-white rounded-br-md"
                        : "bg-surface-2 text-ink rounded-bl-md dark:bg-white/10 dark:text-white"
                    }`}
                  >
                    <p
                      className={`mb-1 text-[11px] font-semibold uppercase tracking-wide ${
                        mine ? "text-white/70" : "text-muted"
                      }`}
                    >
                      {mine ? "You" : "YaadNama"}
                    </p>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              );
            })
          )}

          {loading ? (
            <div className="flex items-end gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <Bot aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3 dark:bg-white/10">
                <span className="inline-flex gap-1.5" aria-label="YaadNama is thinking">
                  <span className="typing-dot" />
                  <span className="typing-dot [animation-delay:150ms]" />
                  <span className="typing-dot [animation-delay:300ms]" />
                </span>
                <span className="ml-3 text-sm font-medium text-muted">
                  Looking through your memories...
                </span>
              </div>
            </div>
          ) : null}

          <div ref={scrollRef} />
        </div>
      </Card>

      {error ? (
        <div className="rounded-2xl bg-rose/10 px-4 py-3 text-sm font-medium text-rose-dark">
          {error}
        </div>
      ) : null}

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" aria-label="Suggested questions">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => ask(suggestion)}
            className="min-h-11 shrink-0 rounded-full bg-surface-2 px-4 text-sm font-semibold text-ink/75 transition duration-200 ease-out hover:bg-gold/15 hover:text-gold-dark active:scale-[0.97] dark:bg-white/10 dark:text-white/80"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label className="sr-only" htmlFor="companion-question">
          Ask your Companion
        </label>
        <input
          id="companion-question"
          ref={composerRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about a memory you saved..."
          className="input-field flex-1 text-base"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="btn-primary min-h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send aria-hidden="true" className="h-5 w-5" />
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
