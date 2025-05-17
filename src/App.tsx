import { useState, useEffect } from "react";
import { Card, nextDue } from "./algorithms/spacedRepetition";
import { sampleDeck } from "./data/sampleDeck";
import Flashcard from "./components/Flashcard";
import OnboardingScreens from "./components/OnboardingScreens";
import DarkModeToggle from "./components/DarkModeToggle";
import XPProgressRing from "./components/XPProgressRing";
import ParallaxBackground from "./components/ParallaxBackground";
import SettingsToggle from "./components/SettingsToggle";

export default function App() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : sampleDeck;
  });

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const dueCard = nextDue(cards.filter((c) => c.due <= Date.now()));
  const reviewed = cards.filter((c) => c.lastReviewed);

  function handleReview(updated: Card) {
    setCards(cards.map((c) => (c.id === updated.id ? updated : c)));
  }

  return (
    <div className="min-h-screen w-screen overflow-hidden transition-colors duration-700 bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white relative">
      <DarkModeToggle />
      <SettingsToggle />
      <ParallaxBackground />
      <XPProgressRing progress={reviewed.length} total={cards.length} />
      <OnboardingScreens />

      {dueCard ? (
        <Flashcard card={dueCard} onReview={handleReview} />
      ) : (
        <div className="h-screen flex flex-col items-center justify-center text-center text-xl text-slate-600 dark:text-slate-400">
          <p className="mb-6">You’ve completed today’s reviews ✨</p>
          <button
            onClick={() => {
              const reset = cards.map((card) => ({
                ...card,
                due: Date.now() - 1000,
              }));
              setCards(reset);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg transition"
          >
            🔁 Restart
          </button>
        </div>
      )}
    </div>
  );
}
