export async function generateDeck(topic: string, difficulty: string = "medium") {
  const prompt = `
You are a smart tutor helping generate a flashcard deck.

Topic: ${topic}
Difficulty: ${difficulty}

Generate 10 flashcards in this format:
[
  { "front": "Question or term", "back": "Answer or explanation" },
  ...
]

Strictly return valid JSON array only.
  `.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "[]";
  return JSON.parse(text);
}
