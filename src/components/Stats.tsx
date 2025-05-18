import React from "react";
import { Card } from "../algorithms/spacedRepetition";
import { getEmojiForCard } from "../utils/getEmojiForCard";

type Props = { cards: Card[] };

export default function Stats({ cards }: Props) {
  const dueToday = cards.filter(c => c.due < Date.now()).length;
  const learned = cards.filter(c => c.interval >= 10).length;
  const reviewedToday = cards.filter(c => c.interval >= 1).length;

  const badge =
    reviewedToday >= 50
      ? "🏆 Master Brain"
      : reviewedToday >= 20
      ? "💡 Memory Hero"
      : reviewedToday >= 10
      ? "⚡ Quick Learner"
      : "🧠 Newbie";

  return (
    <div className="mt-12 w-full max-w-xl mx-auto px-4 text-center space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 transition-transform hover:scale-105">
          <p className="text-4xl font-extrabold text-white">{dueToday}</p>
          <p className="text-sm text-slate-400 mt-1">Due</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 transition-transform hover:scale-105">
          <p className="text-4xl font-extrabold text-white">{learned}</p>
          <p className="text-sm text-slate-400 mt-1">Mastered</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 transition-transform hover:scale-105">
          <p className="text-4xl font-extrabold text-white">{reviewedToday}</p>
          <p className="text-sm text-slate-400 mt-1">Reviewed</p>
        </div>
      </div>

      {/* Emoji XP Trail */}
      <div className="text-sm whitespace-nowrap overflow-x-auto scrollbar-hide bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-slate-300 shadow-inner border border-white/10">
        {cards.map(c => getEmojiForCard(c)).join(" ")}
      </div>

      {/* Badge Title */}
      <div className="inline-block mt-2 px-5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md animate-[pulse_6s_ease-in-out_infinite]">
        {badge}
      </div>
    </div>
  );
}
