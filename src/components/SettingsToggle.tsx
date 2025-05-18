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
    window.dispatchEvent(new Event("settings-updated"));
  };

  const toggleSound = () => {
    const next = !sound;
    localStorage.setItem("sound", next.toString());
    setSound(next);
    window.dispatchEvent(new Event("settings-updated"));
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold text-white shadow-xl border border-white/10 animate-[pulse_20s_ease-in-out_infinite]">
      <button
        onClick={toggleGlass}
        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-200 ${
          glass ? "bg-blue-500/20 ring-1 ring-blue-400" : "hover:bg-white/10"
        }`}
      >
        🧊 Blur: <span>{glass ? "ON" : "OFF"}</span>
      </button>

      <span className="w-[1px] h-5 bg-white/20" />

      <button
        onClick={toggleSound}
        className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-200 ${
          sound ? "bg-green-500/20 ring-1 ring-green-400" : "hover:bg-white/10"
        }`}
      >
        {sound ? "🔊" : "🔇"} Sound: <span>{sound ? "ON" : "OFF"}</span>
      </button>
    </div>
  );
}
