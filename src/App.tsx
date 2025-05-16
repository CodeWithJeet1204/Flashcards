import { useState, useEffect } from "react";
import { Card, nextDue } from "./algorithms/spacedRepetition";
import { sampleDeck } from "../data/sampleDeck";
import Flashcard from "./components/Flashcard";
import Stats from "./components/Stats";
import DarkModeToggle from "./components/DarkModeToggle";

export default function App() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : sampleDeck;
  });

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const dueCard = nextDue(cards.filter(c => c.due <= Date.now()));

  function handleReview(updated: Card) {
    setCards(cards.map(c => (c.id === updated.id ? updated : c)));
  }

  function resetProgress() {
    localStorage.removeItem("cards");
    location.reload();
  }

  function exportDeck() {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flashcards.json";
    a.click();
  }

  function importDeck(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (Array.isArray(parsed)) {
          setCards(parsed);
        } else {
          alert("Invalid deck format");
        }
      } catch {
        alert("Failed to load deck");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-white flex flex-col items-center p-6 relative">
      <DarkModeToggle />
      <h1 className="text-4xl font-bold mt-4">Flashcards</h1>

      <Stats cards={cards} />

      <div className="flex gap-2 mt-4 text-sm">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
          onClick={resetProgress}
        >
          🔄 Reset Progress
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
          onClick={exportDeck}
        >
          ⬇️ Export Deck
        </button>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer transition">
          ⬆️ Import Deck
          <input type="file" accept=".json" className="hidden" onChange={importDeck} />
        </label>
      </div>

      {dueCard ? (
        <Flashcard card={dueCard} onReview={handleReview} />
      ) : (
        <p className="mt-12 text-xl">All done for now ✨</p>
      )}
    </div>
  );
}
