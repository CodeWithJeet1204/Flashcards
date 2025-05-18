export async function explainCard(topic: string): Promise<string> {
  const key = import.meta.env.VITE_OPENAI_KEY;

  // Prompt to get simple explanation with definition, example, and memory trick
  const prompt = `Explain "${topic}" in simple terms.
1. Start with a one-line definition.
2. Give a real-world example.
3. Add a memory trick to remember it.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Invalid response from OpenAI");
  }

  return data.choices[0].message.content.trim();
}
