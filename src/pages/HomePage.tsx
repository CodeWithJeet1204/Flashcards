import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";
import { Sparkles, Users, Brain } from "lucide-react";
import DarkModeToggle from "../components/common/DarkModeToggle";
import ParallaxBackground from "../components/common/ParallaxBackground";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const navigate = useNavigate();

  // Navigate to Singleplayer page
  const goToSingleplayer = () => navigate("/singleplayer");

  // Initialize multiplayer challenge session and navigate to lobby
  const goToMultiplayer = async () => {
    const sessionId = uuidv4();
    let userId = localStorage.getItem("uid");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("uid", userId);
    }

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
    <> 
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)] text-slate-800 dark:bg-[radial-gradient(ellipse_at_center,_#1a1a40,_#0a0a23)] dark:text-white flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      {/* Background */}
      <ParallaxBackground />
      
      <DarkModeToggle />


      {/* Main Card */}
      <div className="z-10 w-full max-w-md px-8 py-10 bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 text-center">

        {/* Header Section */}
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
            className="group flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 font-bold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <Brain className="w-5 h-5 group-hover:animate-pulse" />
            <span className="text-lg">Singleplayer Mode</span>
          </button>

          <button
            onClick={goToMultiplayer}
            className="group flex items-center justify-center gap-3 py-3 px-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 font-bold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
          >
            <Users className="w-5 h-5 group-hover:animate-ping" />
            <span className="text-lg">Multiplayer Arena</span>
          </button>
          <button
            onClick={() => navigate("/favorites")}
            className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-full font-bold shadow"
            >
            ⭐ View Favorites
          </button>

        </div>

        {/* Footer Note */}
        <p className="mt-6 text-xs text-slate-500 select-none">
          Built with ❤️ at Hackathon
        </p>
      </div>
    </div>
  </>
  );
}
