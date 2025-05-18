import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Sparkles, Users, Brain } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const navigate = useNavigate();

  const goToSingleplayer = () => navigate("/singleplayer");

  const goToMultiplayer = async () => {
    const sessionId = uuidv4();
    const userId = localStorage.getItem("uid") || uuidv4();
    localStorage.setItem("uid", userId);

    const { error } = await supabase.rpc("create_challenge_session", {
      session_id: sessionId,
      user_id: userId,
    });

    if (error) {
      console.error("Failed to create session", error);
      alert("Failed to start challenge. Please try again.");
      return;
    }

    navigate(`/challenge/${sessionId}/lobby`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a23] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow layer */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-[#004aad]/30 via-[#2fb2ff]/10 to-[#002f6e]/40 opacity-30 blur-2xl animate-[pulse_20s_ease-in-out_infinite]" />

      {/* Card container */}
      <div className="z-10 w-full max-w-md px-8 py-10 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 text-center">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-3 animate-pulse text-[#2fb2ff]">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-wide">Welcome to</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow">VibeCards</h1>
          <p className="text-sm text-slate-300 mt-2">
            Learn faster. Play smarter. Challenge friends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-6">
          <button
            onClick={goToSingleplayer}
            className="group flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <Brain className="w-5 h-5 group-hover:animate-pulse" />
            <span className="text-lg">Singleplayer Mode</span>
          </button>

          <button
            onClick={goToMultiplayer}
            className="group flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <Users className="w-5 h-5 group-hover:animate-ping" />
            <span className="text-lg">Multiplayer Arena</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-slate-500">
          Built with ❤️ at Hackathon
        </p>
      </div>
    </div>
  );
}
