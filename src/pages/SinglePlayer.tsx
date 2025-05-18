import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, nextDue } from "../algorithms/spacedRepetition";
import Flashcard from "../components/flashcard/Flashcard";
import OnboardingScreens from "../components/flashcard/OnboardingScreens";
import DarkModeToggle from "../components/common/DarkModeToggle";
import ParallaxBackground from "../components/common/ParallaxBackground";
import SettingsToggle from "../components/common/SettingsToggle";
import DeckGenerator from "../components/deck/DeckGenerator";
import XPBar from "../components/common/XPBar";

export default function Singleplayer() {
  // Load cards from localStorage or fallback to empty array (safe)
  const [cards, setCards] = useState<Card[]>(() => {
    try {
      const saved = localStorage.getItem("cards");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showGenerator, setShowGenerator] = useState(false);
  const [exited, setExited] = useState(false);
  const navigate = useNavigate();

  // Persist cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  // Find the next due card that is not reviewed yet unless exited
  const dueCard = exited
    ? undefined
    : nextDue(cards.filter((c) => c.due <= Date.now() && !c.lastReviewed));

  // Cards that have been reviewed at least once
  const reviewed = cards.filter((c) => c.lastReviewed);

  // Update card after review
  const handleReview = (updated: Card) => {
    setCards(cards.map((c) => (c.id === updated.id ? updated : c)));
  };

  // Reset deck for replay (sets all cards due immediately and clears review state)
  const handleReset = () => {
    const resetDeck = cards.map((card) => ({
      ...card,
      due: Date.now() - 1000,
      lastReviewed: undefined,
    }));
    setCards(resetDeck);
    setExited(false);
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#0a0a23] text-white relative transition-colors duration-700">

      {/* Background and global toggles */}
      <ParallaxBackground />
      <DarkModeToggle />
      <SettingsToggle />
      <XPBar progress={reviewed.length} total={cards.length} />
      <OnboardingScreens />

      {/* Main content */}
      {showGenerator ? (
        <DeckGenerator
          onSave={(newDeck) => {
            setCards(newDeck);
            setShowGenerator(false);
            setExited(false);
          }}
          onCancel={() => setShowGenerator(false)}
        />
      ) : dueCard ? (
        <Flashcard
          card={dueCard}
          onReview={handleReview}
          onExit={() => setExited(true)}
        />
      ) : (
        <div className="h-screen flex items-center justify-center px-6">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-3xl font-extrabold mb-3">All Done!</h2>
            <p className="text-slate-300 mb-6">
              You’ve completed this deck. Keep the streak going!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gradient-to-tr from-orange-500 to-red-600 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform"
              >
                Replay Deck
              </button>
              <button
                onClick={() => setShowGenerator(true)}
                className="px-6 py-3 bg-gradient-to-tr from-green-500 to-green-700 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform"
              >
                Generate New Deck
              </button>
              <button
                onClick={() => navigate("/singleplayer")}
                className="px-6 py-3 bg-gradient-to-tr from-purple-500 to-purple-700 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform"
              >
                Explore Shared Decks
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-tr from-blue-500 to-blue-700 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
