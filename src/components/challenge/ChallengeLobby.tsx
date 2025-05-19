import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient, RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { ClipboardCopy, Check, ChevronLeft } from "lucide-react";

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function ChallengeLobby() {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);

  // Unique Player ID
  const [userId] = useState(() => {
    let uid = localStorage.getItem("uid");
    if (!uid) {
      uid = crypto.randomUUID();
      localStorage.setItem("uid", uid);
    }
    return uid;
  });

  // Fetch session & players
  useEffect(() => {
    const fetchLobbyData = async () => {
      if (!sessionId || !userId) return;

      await supabase
        .from("challenge_players")
        .upsert({ session_id: sessionId, user_id: userId }, { onConflict: "session_id,user_id" });

      const { data: sessionData } = await supabase
        .from("challenge_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      // Assign random deck if none set and user is host
      if (sessionData && !sessionData.deck && sessionData.host_id === userId) {
        const { data: decks } = await supabase.from("shared_decks").select("id");
        const randomDeckId = decks?.[Math.floor(Math.random() * decks.length)]?.id;
        if (randomDeckId) {
          await supabase.from("challenge_sessions")
            .update({ deck: randomDeckId })
            .eq("id", sessionId);
        }
      }

      // Refresh session & players after any potential update
      const { data: refreshedSession } = await supabase
        .from("challenge_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      const { data: playerData } = await supabase
        .from("challenge_players")
        .select("*")
        .eq("session_id", sessionId);

      setSession(refreshedSession);
      setPlayers(playerData || []);
      setIsHost(refreshedSession?.host_id === userId);

      // Redirect if game already running
      if (refreshedSession.status === "running") {
        navigate(`/challenge/${sessionId}/game`);
      }
    };

    fetchLobbyData();

    // Realtime updates
    const channel = supabase.channel(`realtime:lobby:${sessionId}`);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "challenge_players",
        filter: `session_id=eq.${sessionId}`,
      },
      async () => {
        const { data: updatedPlayers } = await supabase
          .from("challenge_players")
          .select("*")
          .eq("session_id", sessionId);
        setPlayers(updatedPlayers || []);
      }
    );

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "challenge_sessions",
        filter: `id=eq.${sessionId}`,
      },
      async () => {
        const { data: updatedSession } = await supabase
          .from("challenge_sessions")
          .select("status")
          .eq("id", sessionId)
          .single();

        if (updatedSession?.status === "running") {
          navigate(`/challenge/${sessionId}/game`);
        }
      }
    );

    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, userId, navigate]);

  // Start the game
  const startGame = async () => {
    if (players.length < 2) {
      alert("⚠️ Need at least 2 players to start!");
      return;
    }

    const { error } = await supabase.functions.invoke("startChallenge", {
      body: { session_id: sessionId },
    });

    if (error) {
      console.error("❌ Start Challenge failed:", error.message);
      alert("Something went wrong");
    }
  };

  // Copy invite link
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)] text-slate-800 dark:bg-[radial-gradient(ellipse_at_center,_#1a1a40,_#0a0a23)] dark:text-white flex flex-col items-center justify-center px-6 py-10 transition-colors duration-300">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-10 left-4 hover:scale-105 transition-transform"
      >
        <ChevronLeft size={28} />
      </button>
        {/* Title */}
        <h1 className="text-4xl font-bold drop-shadow-lg">⚔️ Challenge Lobby</h1>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/10 backdrop-blur px-5 py-2 rounded-full hover:scale-105 transition-all font-medium shadow-lg"
        >
          {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
          {copied ? "Copied!" : "Copy Invite Link"}
        </button>

        {/* Players */}
        <p className="text-slate-1000 text-lg">
          👥 {players.length} player{players.length !== 1 && "s"} joined
        </p>

        <ul className="space-y-3">
          {players.map((p, i) => (
            <li
              key={p.id}
              className="px-5 py-3 rounded-2xl bg-[radial-gradient(ellipse_at_center,_#e3f5ff,_#ffffff)]/5 backdrop-blur-lg flex justify-between items-center shadow-md"
            >
              <span className="font-semibold/90">
                {p.username || `Player #${i + 1}`}
              </span>
              {p.user_id === session?.host_id && (
                <span className="text-sm font-semibold text-orange-400">👑 Host</span>
              )}
            </li>
          ))}
        </ul>

        {/* Start Game (Only Host) */}
        {isHost && session?.deck ? (
          <button
            onClick={startGame}
            disabled={players.length < 2}
            className={`px-6 py-3 rounded-full text-lg font-bold transition-all shadow-xl ${
              players.length >= 2
                ? "bg-gradient-to-tr from-orange-400 to-orange-600 hover:scale-105"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Start Game
          </button>
        ) : isHost && !session?.deck ? (
          <p className="text-sm text-red-500">❌ No deck assigned</p>
        ) : null}
      </div>
    </div>
  );
}
