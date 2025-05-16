import { useState, useEffect } from "react";
import { Card, nextDue } from "./algorithms/spacedRepetition";
import { sampleDeck } from "../data/sampleDeck";
import Flashcard from "./components/Flashcard";
import Stats from "./components/Stats";
import DarkModeToggle from "./components/DarkModeToggle";
import IntroModal from "./components/IntroModal";

export default function App() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : sampleDeck;
  });

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const dueCard = nextDue(cards.filter((c) => c.due <= Date.now()));

  function handleReview(updated: Card) {
    setCards(cards.map((c) => (c.id === updated.id ? updated : c)));
  }

  function resetProgress() {
    localStorage.removeItem("cards");
    location.reload();
  }

  function exportDeck() {
    const blob = new Blob([JSON.stringify(cards, null, 2)], {
      type: "application/json",
    });
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white transition-all">
      <div className="container max-w-screen-sm mx-auto px-4 py-8">
        <DarkModeToggle />
        <IntroModal />
        <div className="text-2xl font-bold text-pink-500 mb-2">🧠 VibeCards</div>
        {/* <h1 className="text-4xl font-extrabold mb-4">VibeCards</h1> */}

        <div className="my-4">
          <Stats cards={cards} />
        </div>

        <div className="my-4 flex gap-2 justify-center flex-wrap text-sm">
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
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={importDeck}
            />
          </label>
        </div>

        {dueCard ? (
          <div key={dueCard.id} className="transition-opacity duration-300 animate-fadeIn">
            <Flashcard card={dueCard} onReview={handleReview} />
          </div>
        ) : (
          <p className="mt-12 text-xl text-center">All done for now ✨</p>
        )}
      </div>
    </div>
  );
}
