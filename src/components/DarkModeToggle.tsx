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
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md text-xl"
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Blur light flash on toggle */}
      {animating && (
        <div className="fixed top-4 right-4 w-72 h-72 rounded-full bg-white/10 dark:bg-slate-500/10 backdrop-blur-sm z-40 pointer-events-none animate-blurFade origin-top-right" />
      )}
    </>
  );
}
