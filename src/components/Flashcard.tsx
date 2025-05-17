import { useState, useEffect } from "react";
import { Card, review } from "../algorithms/spacedRepetition";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import { Howl } from "howler";

type Props = {
  card: Card;
  onReview: (updated: Card) => void;
};

const sounds = {
  flip: new Howl({ src: ["/sounds/flip.mp3"] }),
  success: new Howl({ src: ["/sounds/success.mp3"] }),
  fail: new Howl({ src: ["/sounds/fail.mp3"] }),
};

export default function Flashcard({ card, onReview }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [glow, setGlow] = useState("");
  const [rewarded, setRewarded] = useState(false);

  const [glass, setGlass] = useState(() => localStorage.getItem("glass") === "true");
  const [sound, setSound] = useState(() => localStorage.getItem("sound") !== "false");

  useEffect(() => {
    function syncPreferences() {
      setGlass(localStorage.getItem("glass") === "true");
      setSound(localStorage.getItem("sound") !== "false");
    }

    syncPreferences();
    window.addEventListener("storage", syncPreferences);
    window.addEventListener("settings-updated", syncPreferences);

    return () => {
      window.removeEventListener("storage", syncPreferences);
      window.removeEventListener("settings-updated", syncPreferences);
    };
  }, []);

  const [style, api] = useSpring(() => ({
    x: 0,
    scale: 1,
    config: { tension: 210, friction: 20 },
  }));

  let longPressTimer: ReturnType<typeof setTimeout>;

  const bind = useGesture(
    {
      onDrag: ({ offset: [x], down, swipe: [swipeX] }) => {
        api.start({ x: down ? x : 0, scale: down ? 1.05 : 1 });
        if (!down && swipeX) {
          handleReview(swipeX > 0);
        }
      },
      onDoubleClick: () => {
        if (revealed) handleReview(true);
      },
      onPointerDown: () => {
        longPressTimer = setTimeout(() => {
          playSound("flip");
          setRevealed(true);
        }, 600);
      },
      onPointerUp: () => {
        clearTimeout(longPressTimer);
      },
    },
    { drag: { threshold: 50 } }
  );

  function playSound(type: keyof typeof sounds) {
    if (sound) sounds[type].play();
  }

  function handleReview(remembered: boolean) {
    const quality = remembered ? 5 : 2;
    const updated = review(card, quality);

    setGlow(remembered ? "glow-green" : "glow-red");

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
      onReview(updated);
    }, 500);
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-screen px-4 overflow-hidden">
      {glow && (
        <div
          className={`absolute z-10 w-[30rem] h-[30rem] blur-2xl rounded-full opacity-40 transition-all duration-500 ${glow}`}
        />
      )}

      {rewarded && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: -100 }}
          exit={{ opacity: 0 }}
          className="absolute z-20 text-5xl animate-bounce-up"
        >
          🌟
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <animated.div
          key={card.id + (revealed ? "-back" : "-front")}
          {...bind()}
          style={style}
          className={`z-20 w-full max-w-xl h-80 sm:h-96 md:h-[28rem] flex items-center justify-center text-2xl font-semibold text-center p-6 rounded-xl shadow-xl
            ${glass ? "bg-white/10 backdrop-blur-lg dark:bg-slate-200/10" : "bg-white dark:bg-slate-800"}
            transition-colors duration-700 hover:animate-tilt`}
        >
          {revealed ? card.back : card.front}
        </animated.div>
      </AnimatePresence>

      {!revealed ? (
        <button
          onClick={() => {
            playSound("flip");
            setRevealed(true);
          }}
          className="z-30 mt-10 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-lg"
        >
          Reveal
        </button>
      ) : (
        <div className="z-30 flex gap-4 mt-10">
          <button
            onClick={() => handleReview(false)}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg animate-bounce-up"
          >
            Not Remembered
          </button>
          <button
            onClick={() => handleReview(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg animate-bounce-up"
          >
            Remembered
          </button>
        </div>
      )}
    </div>
  );
}
