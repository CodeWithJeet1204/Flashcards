import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Card } from "../algorithms/spacedRepetition";
import { Sparkles, FolderPlus } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type SharedDeck = {
  id: string;
  topic: string;
  difficulty: string;
  cards: { front: string; back: string }[];
};

export default function SelectDeck() {
  const [decks, setDecks] = useState<SharedDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("shared_decks")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setDecks(data || []);
      setLoading(false);
    })();
  }, []);

  const useDeck = (deck: SharedDeck) => {
    const now = Date.now();
    const newDeck: Card[] = deck.cards.map((c, i) => ({
      id: now + i,
      front: c.front,
      back: c.back,
      ease: 2500,
      interval: 0,
      due: now,
      lastReviewed: undefined,
    }));
    localStorage.setItem("cards", JSON.stringify(newDeck));
    navigate("/singleplayer/session");
  };

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white px-4 py-12 relative">
      {/* Ambient Glow Layer */}
      <div className="fixed inset-0 -z-10 bg-gradient-radial from-[#004aad]/30 via-[#2fb2ff]/10 to-[#002f6e]/40 opacity-40 blur-2xl animate-[pulse_20s_ease-in-out_infinite]" />

      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2fb2ff]/20 text-[#2fb2ff] text-xl shadow-inner">
          <Sparkles />
        </div>
        <h1 className="text-4xl font-extrabold mt-4 tracking-tight drop-shadow">
          Choose Your Deck
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Curated flashcards from the community — or make your own!
        </p>
      </div>

      {/* Deck Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
        {loading ? (
          <p className="text-center text-sm col-span-full">Loading...</p>
        ) : decks.length === 0 ? (
          <p className="col-span-full text-center text-slate-500">No decks found.</p>
        ) : (
          decks.map((deck) => (
            <div
              key={deck.id}
              className="group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-orange-500 hover:shadow-orange-500/20 transition-all duration-300 hover:scale-[1.02] shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{deck.topic}</h3>
                <span className="text-xs uppercase bg-white/10 px-2 py-1 rounded-full text-white tracking-wide">
                  {deck.difficulty}
                </span>
              </div>
              <ul className="text-sm text-white/80 max-h-28 overflow-y-auto space-y-1 mb-5">
                {deck.cards.slice(0, 3).map((c, i) => (
                  <li key={i}>
                    <strong className="text-orange-300">Q:</strong> {c.front} <br />
                    <strong className="text-blue-300">A:</strong> {c.back}
                  </li>
                ))}
                {deck.cards.length > 3 && <li className="opacity-50">...and more</li>}
              </ul>
              <button
                onClick={() => useDeck(deck)}
                className="w-full py-2 bg-gradient-to-tr from-green-500 to-green-700 text-white font-bold rounded-full hover:scale-105 transition-all"
              >
                📥 Use Deck
              </button>
            </div>
          ))
        )}
      </div>

      {/* CTA Generate New Deck */}
      <div className="fixed bottom-6 left-6 right-6 sm:left-10 sm:right-10 md:left-20 md:right-20 z-50">
        <button
          onClick={() => navigate("/singleplayer/generator")}
          className="w-full py-4 bg-gradient-to-tr from-orange-400 to-orange-600 text-white rounded-full shadow-xl hover:scale-105 transition-all text-lg font-bold flex items-center justify-center gap-2"
        >
          <FolderPlus className="w-5 h-5" /> ✨ Generate New Deck
        </button>
      </div>
    </div>
  );
}
