import React, { useState } from "react";
import { Card } from "../../algorithms/spacedRepetition";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

type Props = {
  onSave: (newDeck: Card[]) => void;
  onCancel: () => void;
};

export default function DeckGenerator({ onSave, onCancel }: Props) {
  // State: input + settings
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  // State: results + loading
  const [deck, setDeck] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate deck from OpenAI
  const generateDeck = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");

    // Prompt for GPT
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

      // Transform into Card[]
      const cards: Card[] = parsed.map((item: any) => ({
        id: uuidv4(),
        front: item.front,
        back: item.back,
        due: Date.now(),
        lastReviewed: undefined,
      }));

      setDeck(cards);

      // Store deck in shared_decks for multiplayer use
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-white text-black dark:bg-[#0a0a23] dark:text-white transition-colors duration-300">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold drop-shadow">AI Deck Generator</h2>
          <button
            onClick={onCancel}
            className="text-sm text-red-400 hover:text-red-500 font-semibold"
          >
            ✖ Close
          </button>
        </div>

        {/* Topic Input */}
        <input
          type="text"
          placeholder="Enter topic (e.g., Physics, AI, Marketing...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 placeholder-slate-400 outline-none focus:ring-2 focus:ring-orange-400 transition"
        />

        {/* Difficulty Selector */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-4 py-2 text-white bg-slate-800 border border-orange-400 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium (default)</option>
          <option value="hard">Hard</option>
        </select>

        {/* Generate Button */}
        <button
          onClick={generateDeck}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-tr from-orange-400 to-orange-600 font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          {loading ? "Generating..." : "⚡ Generate Flashcards"}
        </button>

        {/* Error Display */}
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        {/* Preview Cards */}
        {deck.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold">Preview</h3>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {deck.map((card, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-sm shadow hover:shadow-orange-500/30 transition"
                >
                  <p><strong className="text-orange-300">Q:</strong> {card.front}</p>
                  <p><strong className="text-blue-300">A:</strong> {card.back}</p>
                </div>
              ))}
            </div>

            {/* Save & Review Button */}
            <button
              onClick={() => onSave(deck)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-full font-bold transition-all"
            >
              Save & Start Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
