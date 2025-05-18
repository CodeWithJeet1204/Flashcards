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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div className="relative bg-white/10 backdrop-blur-xl text-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white/10 scale-95 animate-fadeIn">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">
          🎉 Welcome to{" "}
          <span className="bg-gradient-to-tr from-orange-400 to-orange-600 text-transparent bg-clip-text">
            VibeCards
          </span>
          !
        </h2>

        <p className="text-base text-slate-300 mb-6 leading-relaxed">
          Your memory upgrade starts now. Flip flashcards. Track your brain. Train smarter. 💡
        </p>

        <button
          onClick={() => setShow(false)}
          className="px-6 py-3 rounded-full bg-gradient-to-tr from-orange-400 to-orange-600 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all"
        >
          Let’s Go 🚀
        </button>

        <div className="absolute top-0 left-0 w-full h-full rounded-3xl border border-white/10 pointer-events-none" />
      </div>
    </div>
  );
}
