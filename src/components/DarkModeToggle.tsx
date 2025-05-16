import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

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
    <button
      className="absolute top-4 right-4 px-2 py-1 rounded text-lg bg-white dark:bg-slate-800 dark:text-white"
      onClick={() => setDark(!dark)}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
