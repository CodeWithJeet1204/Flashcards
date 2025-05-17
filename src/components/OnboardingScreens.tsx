import { useState, useEffect } from "react";

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

  function next() {
    if (index === screens.length - 1) {
      localStorage.setItem("vibecards_onboarded", "true");
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  if (done) return null;

  const screen = screens[index];

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0d1117] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-bold mb-3 text-blue-600 dark:text-blue-400 animate-fadeIn">
        {screen.title}
      </h1>
      <p className="text-md text-slate-600 dark:text-slate-300 max-w-md mb-6 animate-fadeIn">
        {screen.subtitle}
      </p>
      <button
        onClick={next}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-lg transition"
      >
        {index === screens.length - 1 ? "Start" : "Next"}
      </button>
    </div>
  );
}
