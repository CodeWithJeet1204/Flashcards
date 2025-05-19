import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  // Initialize dark mode from local storage
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
  
    // No theme set → default to dark
    localStorage.setItem("theme", "dark");
    return true;
  });


  const [animating, setAnimating] = useState(false);

  // Toggle dark mode
  const toggle = () => {
    setAnimating(true);
    setDark(prev => {
      const next = !prev;
      console.log("🌗 Toggling theme:", next ? "dark" : "light");
      return next;
    });
    setTimeout(() => setAnimating(false), 800);
  };

  // Apply theme when `dark` changes
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      console.log("🌓 Applying dark mode");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      console.log("🌞 Applying light mode");
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <>
      {/* Toggle Button (Top Right) */}
      <div className="absolute top-12 right-4 z-50">
        <button
          onClick={toggle}
          aria-label="Toggle Dark Mode"
          title="Toggle Dark Mode"
          className="w-11 h-11 flex items-center justify-center rounded-full bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/20 dark:bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/10 text-slate-800 dark:text-white shadow-xl backdrop-blur-lg hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <span className="text-xl">{dark ? "☀️" : "🌙"}</span>
        </button>
      </div>

      {/* Visual pulse feedback */}
      {animating && (
        <div className="fixed top-3 right-3 w-20 h-20 rounded-full bg-orange-400/20 dark:bg-blue-400/20 backdrop-blur-xl z-40 pointer-events-none animate-ping" />
      )}
    </>
  );
}
