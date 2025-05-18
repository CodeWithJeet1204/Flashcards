import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const screens = [
  {
    title: "Welcome to VibeCards 🧠✨",
    subtitle: "Your brain’s favorite way to learn smarter.",
  },
  {
    title: "How It Works 🔁",
    subtitle: "Flip the card. Rate your memory. We’ll space your reviews to help it stick.",
  },
  {
    title: "Let’s Begin 🎯",
    subtitle: "Tap Start and begin your spaced repetition journey.",
  },
];

export default function OnboardingScreens() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("vibecards_onboarded") === "true") {
      setDone(true);
    }
  }, []);

  const next = () => {
    if (index === screens.length - 1) {
      localStorage.setItem("vibecards_onboarded", "true");
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  };

  if (done) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a23]/90 backdrop-blur-lg flex items-center justify-center px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl text-white p-8 sm:p-10 max-w-md w-full rounded-3xl shadow-2xl border border-white/10 text-center"
        >
          <h1 className="text-3xl font-bold mb-4 drop-shadow-md">
            {screens[index].title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mb-6 leading-relaxed">
            {screens[index].subtitle}
          </p>
          <button
            onClick={next}
            className="mt-2 px-6 py-3 bg-gradient-to-tr from-orange-400 to-orange-600 text-white rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform"
          >
            {index === screens.length - 1 ? "🚀 Start Learning" : "Next →"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
