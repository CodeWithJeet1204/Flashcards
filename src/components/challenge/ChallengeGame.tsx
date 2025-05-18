import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

export default function ChallengeGame() {
  const { id: sessionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = localStorage.getItem("uid") ?? "";

  const [deck, setDeck] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [cardEndTime, setCardEndTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playersOnline, setPlayersOnline] = useState<string[]>([]);

  const channelRef = useRef<any>(null);
  const cleanSessionId = sessionId?.split(":")[0] ?? "";

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase
        .from("challenge_sessions")
        .select("deck_runtime, current_index, card_end_time")
        .eq("id", cleanSessionId)
        .single();

      if (error || !data) return console.error("❌ Load failed:", error);

      setDeck(data.deck_runtime || []);
      setCurrentIndex(data.current_index);
      setCardEndTime(new Date(data.card_end_time));
    };

    fetchSession();
  }, [cleanSessionId]);

  // Setup Realtime Presence + Broadcast
  useEffect(() => {
    const setupChannel = async () => {
      const channel = supabase.channel(`challenge:${cleanSessionId}`, {
        config: { presence: { key: userId } },
      });

      channel
        .on("broadcast", { event: "answer_selected" }, ({ payload }) => {
          console.log("🎯 Answer from", payload.player_id);
        })
        .on("broadcast", { event: "next_card" }, ({ payload }) => {
          setCurrentIndex(payload.index);
          setCardEndTime(new Date(payload.card_end_time));
          setAnswered(false);
          setSelectedAnswer(null);
          setFeedback("");
        })
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          setPlayersOnline(Object.keys(state));
        })
        .subscribe();

      channelRef.current = channel;
    };

    setupChannel();
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [cleanSessionId, userId]);

  // Countdown Timer Logic
  useEffect(() => {
    if (!cardEndTime) return;

    const interval = setInterval(async () => {
      const remaining = Math.max(0, Math.floor((cardEndTime.getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        const nextIndex = currentIndex + 1;
        const nextEnd = new Date(Date.now() + 10000);

        await supabase
          .from("challenge_sessions")
          .update({ current_index: nextIndex, card_end_time: nextEnd.toISOString() })
          .eq("id", cleanSessionId);

        setCurrentIndex(nextIndex);
        setCardEndTime(nextEnd);
        setAnswered(false);
        setSelectedAnswer(null);
        setFeedback("");

        channelRef.current.send({
          type: "broadcast",
          event: "next_card",
          payload: { index: nextIndex, card_end_time: nextEnd.toISOString() },
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cardEndTime, currentIndex, cleanSessionId]);

  // Handle Answer Selection
  const handleAnswer = async (selected: string) => {
    if (answered || currentIndex >= deck.length || timeLeft <= 0) return;
    setAnswered(true);
    setSelectedAnswer(selected);

    const current = deck[currentIndex];
    const isCorrect = current.back === selected;

    setFeedback(isCorrect ? "" : "❌");

    const { error } = await supabase.from("challenge_answers").upsert(
      {
        session_id: sessionId,
        player_id: userId,
        card_index: currentIndex,
        is_correct: isCorrect,
        ms: 1000,
      },
      {
        onConflict: "session_id,player_id,card_index",
        ignoreDuplicates: true,
      }
    );

    if (error && error.code !== "409") {
      console.error("❌ Insert error:", error.message, error.details);
    }

    channelRef.current.send({
      type: "broadcast",
      event: "answer_selected",
      payload: { player_id: userId, selected, correct: isCorrect, card_index: currentIndex },
    });
  };

  // Redirect to results if deck completed
  useEffect(() => {
    if (deck.length && currentIndex >= deck.length) {
      navigate(`/challenge/${sessionId}/results`);
    }
  }, [currentIndex, deck.length, navigate, sessionId]);

  const current = deck[currentIndex];
  if (!current) {
    return <p className="text-center mt-10 text-lg">🔄 Loading game...</p>;
  }

  return (
<   div className="min-h-screen bg-white text-black dark:bg-[#0a0a23] dark:text-white flex flex-col items-center justify-center px-6 py-10 transition-colors duration-300">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-slate-400 text-lg">
            <Clock className="inline mr-2 w-5 h-5" />
            Card {currentIndex + 1} / {deck.length}
          </p>
          <p className="text-xl font-bold mt-2">
            ⏱ <span className="text-[#2fb2ff]">{timeLeft > 0 ? `${timeLeft}s` : "0s"}</span>
          </p>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl shadow-xl bg-white/5 backdrop-blur-lg p-8 text-center text-3xl font-bold leading-snug"
          >
            {current.front}
          </motion.div>
        </AnimatePresence>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {current.options.map((opt: string, i: number) => {
            const isCorrect = opt === current.back;
            const isWrongSelected = selectedAnswer === opt && !isCorrect;

            const base = "py-4 px-5 text-lg font-semibold rounded-full transition-all duration-200";
            const defaultStyle = "bg-white/10 hover:scale-105 hover:shadow-orange-500/50";
            const correctStyle = "bg-green-600";
            const wrongStyle = "bg-red-500";

            const className = answered
              ? isCorrect
                ? correctStyle
                : isWrongSelected
                ? wrongStyle
                : defaultStyle
              : defaultStyle;

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                disabled={answered}
                onClick={() => handleAnswer(opt)}
                className={`${base} ${className}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-center mt-6 text-5xl animate-bounce">{feedback}</div>
        )}
      </div>
    </div>
  );
}
