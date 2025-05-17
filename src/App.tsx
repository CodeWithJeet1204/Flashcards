import { useState, useEffect } from "react";
import { Card, nextDue } from "./algorithms/spacedRepetition";
import { sampleDeck } from "./data/sampleDeck";
import Flashcard from "./components/Flashcard";
import OnboardingScreens from "./components/OnboardingScreens";
import DarkModeToggle from "./components/DarkModeToggle";
import XPProgressRing from "./components/XPProgressRing";
import ParallaxBackground from "./components/ParallaxBackground";
import SettingsToggle from "./components/SettingsToggle";
import DeckGenerator from "./components/DeckGenerator";

export default function App() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : sampleDeck;
  });

  const [showGenerator, setShowGenerator] = useState(false);

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
          <div className="flex gap-4">
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
            <button
              onClick={() => setShowGenerator(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg transition"
            >
              📥 Generate New Deck
            </button>
          </div>
        </div>
      )}

      {showGenerator && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <DeckGenerator
            onSave={(newDeck: Card[]) => {
              setCards(newDeck);
              setShowGenerator(false);
            }}
            onCancel={() => setShowGenerator(false)}
          />
        </div>
      )}
    </div>
  );
}
