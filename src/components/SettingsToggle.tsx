import { useEffect, useState } from "react";

export default function SettingsToggle() {
  const [glass, setGlass] = useState(() => localStorage.getItem("glass") === "true");
  const [sound, setSound] = useState(() => localStorage.getItem("sound") !== "false");

  useEffect(() => {
    const sync = () => {
      setGlass(localStorage.getItem("glass") === "true");
      setSound(localStorage.getItem("sound") !== "false");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggleGlass = () => {
    const next = !glass;
    localStorage.setItem("glass", next.toString());
    setGlass(next);
    window.dispatchEvent(new Event("settings-updated")); // 🔄 instant sync
  };

  const toggleSound = () => {
    const next = !sound;
    localStorage.setItem("sound", next.toString());
    setSound(next);
    window.dispatchEvent(new Event("settings-updated")); // 🔄 instant sync
  };

  return (
    <div className="absolute top-4 left-4 z-50 flex gap-3 px-3 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow-md text-sm font-medium items-center backdrop-blur">
      <button onClick={toggleGlass} className="flex items-center gap-1 hover:scale-105 transition-transform">
        🧊 Blur: <span>{glass ? "ON" : "OFF"}</span>
      </button>
      <button onClick={toggleSound} className="flex items-center gap-1 hover:scale-105 transition-transform">
        {sound ? "🔊" : "🔇"} Sound: <span>{sound ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
