import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [animating, setAnimating] = useState(false);

  const toggle = () => {
    setAnimating(true);
    setDark(!dark);
    setTimeout(() => setAnimating(false), 800);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggle}
          aria-label="Toggle Dark Mode"
          title="Toggle Dark Mode"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 dark:bg-white/10 text-black dark:text-white shadow-xl backdrop-blur-lg hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <span className="text-xl">{dark ? "☀️" : "🌙"}</span>
        </button>
      </div>

      {animating && (
        <div className="fixed top-3 right-3 w-20 h-20 rounded-full bg-orange-400/20 dark:bg-blue-400/20 backdrop-blur-xl z-40 pointer-events-none animate-ping" />
      )}
    </>
  );
}
