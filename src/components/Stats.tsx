import React from "react";
import { Card } from "../algorithms/spacedRepetition";
import { getEmojiForCard } from "../utils/getEmojiForCard";


type Props = { cards: Card[] };

export default function Stats({ cards }: Props) {
  const dueToday = cards.filter(c => c.due < Date.now()).length;
  const learned = cards.filter(c => c.interval >= 10).length;
  const reviewedToday = cards.filter(c => c.interval >= 1).length;

  return (
    <div className="mt-8 grid grid-cols-3 gap-4 text-center w-full max-w-xl mx-auto">
      <div className="p-4 bg-white dark:bg-slate-800 dark:text-white rounded shadow">
        <p className="text-3xl font-bold">{dueToday}</p>
        <p className="text-sm">Due</p>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 dark:text-white rounded shadow">
        <p className="text-3xl font-bold">{learned}</p>
        <p className="text-sm">Mastered</p>
      </div>
      <div className="p-4 bg-white dark:bg-slate-800 dark:text-white rounded shadow">
        <p className="text-3xl font-bold">{reviewedToday}</p>
        <p className="text-sm">Reviewed</p>
      </div>
      <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        {cards.map((c) => getEmojiForCard(c)).join(" ")}
      </div>
    </div>
  );
}