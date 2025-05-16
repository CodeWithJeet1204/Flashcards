import React, { useState, useRef } from "react";
import { Card, review } from "../algorithms/spacedRepetition";
import confetti from "canvas-confetti";
import XPPopup from "./XPPopup";

type Props = {
  card: Card;
  onReview: (updated: Card) => void;
};

const chime = new Audio("/chime.mp3");

export default function Flashcard({ card, onReview }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [toast, setToast] = useState("");

  function triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#004aad", "#2fb2ff", "#bae2ff"],
    });
  }

  function randomFeedback(q: number) {
    if (q === 5) return "🔥 Great recall!";
    if (q === 4) return "💪 You got this!";
    if (q === 3) return "🌀 Keep practicing!";
    if (q <= 2) return "📌 Don’t worry, we’ll repeat it!";
    return "";
  }

  function rate(quality: number) {
    setFlipped(false);
    setToast(randomFeedback(quality));

    if (quality >= 3) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 800);
    }

    if (quality === 5) {
      triggerConfetti();
      chime.play();
    }

    const updated = review(card, quality);
    setTimeout(() => {
      onReview(updated);
      setToast("");
    }, 500);
  }

  return (
    <div className="relative w-full max-w-xl mx-auto mt-8 animate-fadeIn">
      {showXP && <XPPopup />}

      <div
        className="relative cursor-pointer select-none perspective-1000 h-64"
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center text-2xl font-semibold rounded-lg shadow-lg transition-transform duration-500 preserve-3d
          bg-white dark:bg-slate-800 dark:text-white ${flipped ? "rotate-y-180" : ""} hover:scale-[1.01] hover:shadow-xl`}
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

      {flipped && (
        <div className="flex justify-center gap-4 mt-6">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              type="button"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition"
              onClick={() => rate(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {toast && (
        <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400 animate-fadeIn">
          {toast}
        </div>
      )}
    </div>
  );
}
