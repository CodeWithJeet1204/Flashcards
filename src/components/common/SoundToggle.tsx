import { useState, useEffect } from "react";

export default function SoundToggle() {
  // Initialize sound setting from localStorage
  const [sound, setSound] = useState(() => localStorage.getItem("sound") !== "false");

  useEffect(() => {
    // Sync sound state across tabs or external changes
    const sync = () => setSound(localStorage.getItem("sound") !== "false");
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Toggle sound setting and broadcast update event
  const toggleSound = () => {
    const next = !sound;
    localStorage.setItem("sound", next.toString());
    setSound(next);
    window.dispatchEvent(new Event("settings-updated")); // Notify any listeners
  };

  return (
    <div className="fixed top-4 left-24 z-50">
      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md backdrop-blur-md
          ${
            sound
              ? "bg-green-500/20 text-green-200 ring-1 ring-green-400 animate-[pulse_10s_ease-in-out_infinite]"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
      >
        {sound ? "Sound: ON" : "Sound: OFF"}
      </button>
    </div>
  );
}
