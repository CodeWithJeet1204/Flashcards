import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function ChallengeResults() {
  const { id: sessionId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem("uid");

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("challenge_answers")
        .select("player_id, is_correct")
        .eq("session_id", sessionId);

      if (error) {
        console.error("Error fetching results:", error);
        return;
      }

      const scores: Record<string, number> = {};
      data.forEach(({ player_id, is_correct }) => {
        if (!scores[player_id]) scores[player_id] = 0;
        if (is_correct) scores[player_id]++;
      });

      setResults(scores);
      setLoading(false);
    };

    fetchResults();
  }, [sessionId]);

  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg">Calculating scores...</p>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)] text-slate-800 dark:bg-[radial-gradient(ellipse_at_center,_#1a1a40,_#0a0a23)] dark:text-white flex flex-col items-center justify-center px-6 py-12 transition-colors duration-300">
      <div className="w-full max-w-2xl space-y-10">
        <h1 className="text-5xl font-bold text-center drop-shadow-lg">
          🏆 Challenge Results
        </h1>

        <ul className="space-y-4">
          {sorted.map(([player, score], i) => {
            const isCurrent = player === currentUser;
            const isTop = i === 0;

            return (
              <li
                key={player}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md
                bg-white/30 dark:bg-white/5 transition-all duration-300
                ${isTop ? "border-2 border-yellow-400 ring-2 ring-yellow-500" : "border border-white/10"}
                ${isCurrent ? "text-orange-400 font-semibold" : "text-slate-700 dark:text-white/80"}`}
              >
                <span className="text-lg">
                  #{i + 1} {isCurrent ? "You" : player.slice(0, 8)}
                </span>
                <span className="text-[#2fb2ff] font-bold text-xl">
                  {score} pts
                </span>
              </li>
            );
          })}
        </ul>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-gradient-to-tr from-orange-400 to-orange-600 font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
