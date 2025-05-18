import { useState, useEffect } from "react";
import { Card, review } from "../../algorithms/spacedRepetition";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { Howl } from "howler";

// Props from parent component
type Props = {
  card: Card;
  onReview: (updated: Card) => void;
  onExit?: () => void;
};

// Audio feedback using Howler
const sounds = {
  flip: new Howl({ src: ["/sounds/flip.mp3"] }),
  success: new Howl({ src: ["/sounds/success.mp3"] }),
  fail: new Howl({ src: ["/sounds/fail.mp3"] }),
};

export default function Flashcard({ card, onReview, onExit }: Props) {
  // 🔄 State: reveal, effects, sound, UX
  const [revealed, setRevealed] = useState(false);
  const [glow, setGlow] = useState("");
  const [rewarded, setRewarded] = useState(false);
  const [glass, setGlass] = useState(() => localStorage.getItem("glass") === "true");
  const [sound, setSound] = useState(() => localStorage.getItem("sound") !== "false");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(card.favorite ?? false);

  // 🧠 Sync blur/sound preferences on mount and updates
  useEffect(() => {
    const syncPreferences = () => {
      setGlass(localStorage.getItem("glass") === "true");
      setSound(localStorage.getItem("sound") !== "false");
    };
    syncPreferences();

    window.addEventListener("storage", syncPreferences);
    window.addEventListener("settings-updated", syncPreferences);
    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener("settings-updated", syncPreferences);
    };
  }, []);

  // 🎯 Card interaction animation
  const [style, api] = useSpring(() => ({
    x: 0,
    scale: 1,
    config: { mass: 1, tension: 170, friction: 20 },
  }));

  // 🤏 Gesture support: drag or tap to flip
  const bind = useGesture(
    {
      onClick: () => {
        if (!revealed) {
          playSound("flip");
          setRevealed(true);
        }
      },
    },
    { drag: { threshold: 40 } }
  );

  // 🔊 Play sound based on type
  function playSound(type: keyof typeof sounds) {
    if (sound) sounds[type].play();
  }

  // 🤖 Request GPT explanation for card
  async function getExplanation() {
    setLoading(true);
    const key = import.meta.env.VITE_OPENAI_KEY;
    const prompt = `Explain "${card.front}" in simple terms.\n1. Start with a one-line definition.\n2. Give a real-world example.\n3. Add a memory trick to remember it.`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setExplanation(data.choices[0].message.content.trim());
    } catch {
      setExplanation("Something went wrong while fetching explanation.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Handle rating response (remembered / not remembered)
  function handleReview(remembered: boolean) {
    const quality = remembered ? 5 : 2;
    const updated = review(card, quality);
    setGlow(remembered ? "bg-green-500/40" : "bg-red-500/40");

    if (remembered) {
      playSound("success");
      confetti();
      navigator.vibrate?.(100);
      setRewarded(true);
      setTimeout(() => setRewarded(false), 800);
    } else {
      playSound("fail");
    }

    setTimeout(() => {
      setRevealed(false);
      setGlow("");
      setExplanation("");
      onReview(updated);
    }, 500);
  }

  // ⭐ Toggle Favorite
  function toggleFavorite(cardId: Card["id"]) {
    setIsFavorite(!isFavorite);

    const saved = localStorage.getItem("cards");
    if (!saved) return;

    const parsed: Card[] = JSON.parse(saved);
    const updated = parsed.map((c) =>
      c.id === cardId ? { ...c, favorite: !c.favorite } : c
    );

    localStorage.setItem("cards", JSON.stringify(updated));
  }




  // 🧠 UI
  return (
    <div className="flex flex-col justify-start items-center h-full min-h-screen pt-24 px-4 relative bg-white dark:bg-[#0a0a23] text-black dark:text-white overflow-y-auto">
      {/* Background glow feedback */}
      {glow && (
        <div
          className={`absolute z-10 w-[30rem] h-[30rem] rounded-full blur-3xl transition-all duration-500 pointer-events-none ${glow}`}
        />
      )}

      {/* XP reward emoji */}
      {rewarded && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: -100 }}
          exit={{ opacity: 0 }}
          className="absolute z-30 text-6xl animate-bounce-up"
        >
          🌟
        </motion.div>
      )}

      {/* Exit Button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-12 left-4 z-40 px-5 py-2 text-sm bg-white/10 backdrop-blur-md hover:scale-105 transition rounded-full shadow-md"
        >
          ←
        </button>
      )}

      {/* Flashcard Animation */}
      <AnimatePresence mode="wait">
        <div className="relative w-full max-w-xl mt-24">
          {/* ⭐ Favorite Button */}
          <button
            onClick={() => toggleFavorite(card.id)}
            className="absolute -top-4 -right-4 z-30 text-yellow-400 hover:scale-110 active:scale-95 transition-transform bg-white/10 backdrop-blur rounded-full p-4 shadow"
            title={isFavorite ? "Unfavourite this Card" : "Favourite this Card"}
          >
            {isFavorite ? "⭐" : "☆"}
          </button>

          
          {/* Flashcard itself */}
          <animated.div
            key={card.id + (revealed ? "-back" : "-front")}
            {...bind()}
            style={style}
            className={`z-20 w-full h-80 sm:h-96 md:h-[28rem] flex items-center justify-center text-2xl font-semibold text-center p-6 overflow-y-auto max-h-full break-words scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent rounded-3xl transition-all duration-700 cursor-pointer hover:scale-105 shadow-2xl ${
              glass
                ? "bg-white/10 backdrop-blur-xl"
                : "bg-slate-900 border border-white/10"
            }`}
          >
            {revealed ? card.back : card.front}
          </animated.div>
        </div>
      </AnimatePresence>


      {/* Actions below card */}
      {revealed ? (
        <div className="z-30 flex flex-col gap-4 mt-10 items-center w-full max-w-xl">
          <div className="flex gap-4">
            <button
              onClick={() => handleReview(false)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full shadow-lg transition-all font-bold"
            >
              Wrong
            </button>
            <button
              onClick={() => handleReview(true)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all font-bold"
            >
              Right
            </button>
          </div>

          {/* GPT explanation trigger */}
          {!loading && !explanation && (
            <button
              onClick={getExplanation}
              className="mt-3 text-sm text-orange-400 hover:text-orange-500 underline underline-offset-4"
            >
              Explain This
            </button>
          )}

          {loading && <p className="text-sm text-slate-400 mt-2">Thinking...</p>}

          {explanation && (
            <div className="mt-4 max-h-40 overflow-y-auto px-4">
              <div className="bg-white/5 p-4 rounded-xl text-sm text-left shadow-md backdrop-blur">
                {explanation.split("\n").map((line, i) => (
                  <p key={i} className="mb-2 leading-snug">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            playSound("flip");
            setRevealed(true);
          }}
          className="z-30 mt-10 px-6 py-3 bg-gradient-to-tr from-blue-500 to-blue-700 font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Reveal
        </button>
      )}
    </div>
  );
}
