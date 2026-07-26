const COMPANION_SYSTEM_PROMPT = `You are YaadNama AI, a compassionate memory companion.

Your purpose is to help users remember people, places, appointments, medications, routines, and important life events.

Always prioritize information stored in the user's personal memory database, which will be provided to you as a list of saved memories before each question.

Never invent or assume memories. Only answer using what is explicitly present in the provided memories.

If information does not exist in the provided memories, politely explain that it has not yet been recorded and invite the user to save it.

Speak gently, respectfully, and clearly. Keep responses concise (2-4 sentences) and encouraging.

Do not provide medical diagnoses or replace professional healthcare advice.`;

const SUMMARY_SYSTEM_PROMPT = `You write very short, warm one-line summaries (under 18 words) of a personal memory entry, based only on the title and description given. Never invent details that are not present. Return only the summary sentence, nothing else.`;

async function callGroq(systemPrompt, userText) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GROQ_API_KEY environment variable. Add it in your hosting provider's environment variable settings."
    );
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      temperature: 0.4,
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  return text || "I couldn't generate a response just now. Please try again.";
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.mode === "summarize") {
      const { title, description, category } = body;
      const prompt = `Category: ${category}\nTitle: ${title}\nDescription: ${description}`;
      const summary = await callGroq(SUMMARY_SYSTEM_PROMPT, prompt);
      return Response.json({ summary: summary.trim() });
    }

    if (body.mode === "companion") {
      const { question, memories } = body;

      const memoryList =
        Array.isArray(memories) && memories.length > 0
          ? memories
              .map(
                (m, i) =>
                  `${i + 1}. [${m.category}] ${m.title} — ${m.description} (saved ${new Date(
                    m.date || m.createdAt
                  ).toLocaleDateString()})`
              )
              .join("\n")
          : "(No memories have been saved yet.)";

      const prompt = `Saved memories:\n${memoryList}\n\nUser question: ${question}`;
      const answer = await callGroq(COMPANION_SYSTEM_PROMPT, prompt);
      return Response.json({ answer: answer.trim() });
    }

    return Response.json({ error: "Unknown mode" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
