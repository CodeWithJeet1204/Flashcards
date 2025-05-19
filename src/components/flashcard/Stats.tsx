import React from "react";
import { Card } from "../../algorithms/spacedRepetition";
import { getEmojiForCard } from "../../utils/getEmojiForCard";

type Props = { cards: Card[] };

export default function Stats({ cards }: Props) {
  // Count cards due for review now or earlier
  const dueToday = cards.filter((c) => c.due <= Date.now()).length;

  // Count mastered cards (interval threshold 10)
  const learned = cards.filter((c) => c.interval >= 10).length;

  // Count cards reviewed at least once (interval >= 1)
  const reviewedToday = cards.filter((c) => c.interval >= 1).length;

  // Badge based on number reviewed today
  const badge =
    reviewedToday >= 50
      ? "Master Brain"
      : reviewedToday >= 20
      ? "Memory Hero"
      : reviewedToday >= 10
      ? "Quick Learner"
      : "Newbie";

  return (
    <div className="mt-12 max-w-xl mx-auto w-full px-4 text-center space-y-6 select-none">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: "Due", value: dueToday },
          { label: "Mastered", value: learned },
          { label: "Reviewed", value: reviewedToday },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 transition-transform hover:scale-105"
          >
            <p className="text-4xl font-extrabold">{value}</p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Emoji XP Trail */}
      <div className="text-sm whitespace-nowrap overflow-x-auto scrollbar-hide bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/10 backdrop-blur-md px-4 py-2 rounded-full text-slate-300 shadow-inner border border-white/10">
        {cards.map((c) => getEmojiForCard(c)).join(" ")}
      </div>

      {/* Badge */}
      <div className="inline-block mt-2 px-5 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-orange-400 to-pink-500 shadow-md animate-[pulse_6s_ease-in-out_infinite]">
        {badge}
      </div>
    </div>
  );
}
