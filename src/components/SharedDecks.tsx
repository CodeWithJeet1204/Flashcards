import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Card } from "../algorithms/spacedRepetition";
import DarkModeToggle from "./DarkModeToggle";
import { useNavigate, Link } from "react-router-dom";

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

export default function SharedDecks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<SharedDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("shared_decks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Failed to load decks");
      } else {
        setDecks(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const importDeck = (sharedDeck: SharedDeck) => {
    const now = Date.now();
    const newDeck: Card[] = sharedDeck.cards.map((c, i) => ({
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
    <div className="min-h-screen bg-[#0a0a23] text-white px-6 py-10 relative overflow-x-hidden">
      <DarkModeToggle />

      {/* Ambient Parallax Glow */}
      <div className="fixed inset-0 -z-10 bg-gradient-radial from-[#004aad]/30 via-[#2fb2ff]/15 to-[#002f6e]/40 opacity-30 blur-2xl animate-[pulse_20s_ease-in-out_infinite]" />

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <Link
          to="/"
          className="px-4 py-2 bg-white/10 backdrop-blur rounded-full hover:scale-105 transition-transform text-white font-medium shadow-md"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-center flex-1 -ml-6 drop-shadow">
          Explore Shared Decks
        </h1>
        <div className="w-20" /> {/* Spacer for layout balance */}
      </div>

      {/* Deck List */}
      {loading ? (
        <p className="text-center text-sm text-slate-400">Loading decks...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-sm">{error}</p>
      ) : decks.length === 0 ? (
        <p className="text-center text-slate-500 mt-12 text-lg">No Decks Available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="group p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-orange-500 hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.015] shadow-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold truncate">{deck.topic}</h2>
                <span className="text-xs uppercase bg-white/10 px-2 py-1 rounded-full tracking-wider">
                  {deck.difficulty}
                </span>
              </div>

              <ul className="text-sm max-h-28 overflow-y-auto space-y-2 pr-1 text-white/90">
                {deck.cards.slice(0, 3).map((c, i) => (
                  <li key={i}>
                    <strong className="text-orange-300">Q:</strong> {c.front} <br />
                    <strong className="text-blue-300">A:</strong> {c.back}
                  </li>
                ))}
                {deck.cards.length > 3 && (
                  <li className="text-xs italic text-slate-400">
                    ...and {deck.cards.length - 3} more
                  </li>
                )}
              </ul>

              <button
                onClick={() => importDeck(deck)}
                className="w-full py-2 bg-gradient-to-tr from-green-500 to-green-700 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform"
              >
                Import & Start
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
