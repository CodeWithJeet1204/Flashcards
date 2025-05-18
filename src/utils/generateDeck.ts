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

  try {
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

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("No content returned from OpenAI");
    }

    // Parse the JSON safely
    try {
      return JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      throw new Error("Failed to parse OpenAI response as JSON");
    }
  } catch (error) {
    console.error("Error generating deck:", error);
    throw error;
  }
}
