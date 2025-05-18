import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function ChallengeResults() {
  const { id: sessionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const { data, error } = await supabase
        .from("challenge_answers")
        .select("player_id, is_correct")
        .eq("session_id", sessionId);

      if (error) {
        console.error("❌ Error fetching results:", error);
        return;
      }

      const scores: Record<string, number> = {};
      data.forEach((answer) => {
        if (!scores[answer.player_id]) scores[answer.player_id] = 0;
        if (answer.is_correct) scores[answer.player_id]++;
      });

      setResults(scores);
      setLoading(false);
    };

    fetchResults();
  }, [sessionId]);

  if (loading)
    return <p className="text-center mt-10 text-white text-lg">🔄 Calculating scores...</p>;

  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const currentUser = localStorage.getItem("uid");

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-10">
        <h1 className="text-5xl font-bold text-center drop-shadow-lg">🏆 Challenge Results</h1>

        <ul className="space-y-4">
          {sorted.map(([player, score], i) => {
            const isCurrent = player === currentUser;
            return (
              <li
                key={player}
                className={`flex items-center justify-between px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md bg-white/5 ${
                  i === 0 ? "border border-yellow-400 ring-2 ring-yellow-500" : ""
                }`}
              >
                <span
                  className={`font-semibold text-lg ${
                    isCurrent ? "text-orange-400" : "text-white"
                  }`}
                >
                  #{i + 1} {isCurrent ? "You" : player.slice(0, 8)}
                </span>
                <span className="text-xl font-bold text-[#2fb2ff]">{score} pts</span>
              </li>
            );
          })}
        </ul>

        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-gradient-to-tr from-orange-400 to-orange-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            🔁 Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
