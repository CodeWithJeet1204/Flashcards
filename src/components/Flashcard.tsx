import React, { useState, useRef } from "react";
import { Card, review } from "../algorithms/spacedRepetition";
import confetti from "canvas-confetti";

type Props = {
  card: Card;
  onReview: (updated: Card) => void;
};

export default function Flashcard({ card, onReview }: Props) {
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function triggerConfetti() {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#004aad", "#2fb2ff", "#bae2ff"],
    });
  }

  function rate(quality: number) {
    const updated = review(card, quality);
    onReview(updated);
    setFlipped(false);

    if (quality === 5) {
      triggerConfetti();
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-8" ref={containerRef}>
      <div
        className="relative cursor-pointer select-none perspective-1000 h-64"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg transition-transform duration-500 preserve-3d
            bg-white dark:bg-slate-800 dark:text-white ${flipped ? "rotate-y-180" : ""}`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 flex items-center justify-center backface-hidden p-4">
            {card.front}
          </div>
          
          {/* BACK */}
          <div className="absolute inset-0 flex items-center justify-center backface-hidden p-4 rotate-y-180">
            {card.back}
          </div>
        </div>
      </div>

      {/* Only show rating after flipped */}
      {flipped && (
        <div className="flex justify-center gap-4 mt-6">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              type="button"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-800 transition"
              onClick={() => rate(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
