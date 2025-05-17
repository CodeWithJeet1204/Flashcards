import React, { useState } from "react";
import { Card } from "../algorithms/spacedRepetition";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);



type Props = {
  onSave: (newDeck: Card[]) => void;
  onCancel: () => void;
};

export default function DeckGenerator({ onSave, onCancel }: Props) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [deck, setDeck] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateDeck = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");

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
      const parsed = JSON.parse(data.choices?.[0]?.message?.content || "[]");

      const cards: Card[] = parsed.map((item: any) => ({
        id: uuidv4(),
        front: item.front,
        back: item.back,
        due: Date.now(),
        lastReviewed: undefined,
      }));

      setDeck(cards);
      await supabase.from("shared_decks").insert({
          topic,
          difficulty,
          cards: cards.map(({ front, back }) => ({ front, back })),
      });

    } catch (err) {
      console.error(err);
      setError("Failed to generate deck. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-xl bg-[#bae2ff] dark:bg-[#002f6e] rounded-2xl shadow-xl p-8 space-y-6 text-black dark:text-white transition-colors duration-500">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">🧠 AI Deck Generator</h2>
          <button onClick={onCancel} className="text-sm text-red-500 hover:text-red-600 font-medium">
            ✖ Close
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter topic (e.g., Machine Learning)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 rounded-md border-none outline-none bg-white/90 text-black placeholder-gray-500"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-3 rounded-md bg-white/90 text-black"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium (default)</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={generateDeck}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-black/80 dark:bg-white/90 text-white dark:text-black hover:opacity-90 transition font-semibold"
        >
          {loading ? "Generating..." : "Generate Flashcards"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {deck.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview:</h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {deck.map((card, i) => (
                <div key={i} className="bg-white/90 text-black p-3 rounded-md text-sm shadow">
                  <p><strong>Q:</strong> {card.front}</p>
                  <p><strong>A:</strong> {card.back}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => onSave(deck)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              ✅ Save & Start Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
