export async function explainCard(topic: string) {
  const key = import.meta.env.VITE_OPENAI_KEY;

  const prompt = `Explain "${topic}" in simple terms. 
1. Start with a one-line definition.
2. Give a real-world example.
3. Add a memory trick to remember it.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content.trim();
}
