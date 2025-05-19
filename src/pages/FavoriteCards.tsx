import { useEffect, useState } from "react";
import { Card } from "../algorithms/spacedRepetition";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ParallaxBackground from "../components/common/ParallaxBackground";

export default function FavoriteCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const navigate = useNavigate();

    useEffect(() => {
      const load = () => {
        const saved = localStorage.getItem("cards");
        if (saved) {
          const parsed: Card[] = JSON.parse(saved);
          setCards(parsed.filter((c) => c.favorite));
        }
      };
    
      window.addEventListener("favorites-updated", load);
      load(); // Initial load
    
      return () => window.removeEventListener("favorites-updated", load);
    }, []);


  const isEmpty = cards.length === 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)] text-slate-800 dark:bg-[radial-gradient(ellipse_at_center,_#1a1a40,_#0a0a23)] dark:text-white px-4 py-10 relative transition-colors duration-300">

      {/* Background */}
      <ParallaxBackground />

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-4 hover:scale-105 transition-transform"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-6">⭐ Favorite Cards</h1>

      {/* If no favorites */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 text-center">
          No favorites yet.
        </div>
      ) : (
        <div className="space-y-4 max-w-xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/10 p-4 rounded-xl backdrop-blur shadow-md"
            >
              <p className="font-bold mb-2">{card.front}</p>
              <p className="text-sm text-slate-300">{card.back}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
