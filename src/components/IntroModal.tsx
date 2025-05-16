import { useState, useEffect } from "react";

export default function IntroModal() {
  const [show, setShow] = useState(() => {
    return localStorage.getItem("vibecards_intro") !== "seen";
  });

  useEffect(() => {
    if (!show) localStorage.setItem("vibecards_intro", "seen");
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 dark:text-white max-w-md w-full p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-2">🧠 Welcome to VibeCards!</h2>
        <p className="text-sm mb-4">
          Learn smarter, not harder. Tap a card to flip it, then rate how well
          you remembered. The app adapts to boost your retention!
        </p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={() => setShow(false)}
        >
          Let’s Go 🚀
        </button>
      </div>
    </div>
  );
}
