import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, nextDue } from "../algorithms/spacedRepetition";
import { sampleDeck } from "../data/sampleDeck";
import Flashcard from "../components/Flashcard";
import OnboardingScreens from "../components/OnboardingScreens";
import DarkModeToggle from "../components/DarkModeToggle";
import ParallaxBackground from "../components/ParallaxBackground";
import SettingsToggle from "../components/SettingsToggle";
import DeckGenerator from "../components/DeckGenerator";
import XPBar from "../components/XPBar";

export default function Singleplayer() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : sampleDeck;
  });

  const [showGenerator, setShowGenerator] = useState(false);
  const [exited, setExited] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const dueCard = exited
    ? undefined
    : nextDue(cards.filter((c) => c.due <= Date.now() && !c.lastReviewed));

  const reviewed = cards.filter((c) => c.lastReviewed);

  const handleReview = (updated: Card) => {
    setCards(cards.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleReset = () => {
    const reset = cards.map((card) => ({
      ...card,
      due: Date.now() - 1000,
      lastReviewed: undefined,
    }));
    setCards(reset);
    setExited(false);
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-[#0a0a23] text-white relative transition-colors duration-700">
      <ParallaxBackground />
      <DarkModeToggle />
      <SettingsToggle />
      <XPBar progress={reviewed.length} total={cards.length} />
      <OnboardingScreens />

      {/* Deck Generator Overlay */}
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
            <h2 className="text-3xl font-extrabold mb-3">🎉 All Done!</h2>
            <p className="text-slate-300 mb-6">
              You’ve completed today’s deck. Keep the streak going!
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
