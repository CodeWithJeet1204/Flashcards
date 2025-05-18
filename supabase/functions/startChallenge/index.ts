/// <reference types="https://deno.land/x/supabase@1.6.0/types/supabase-edge-functions.d.ts" />
import { serve } from "https://deno.land/std@0.203.0/http/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  console.log("⚡️ startChallenge function invoked");

  if (req.method === "OPTIONS") {
    console.log("🟡 CORS preflight handled");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    console.log("🧪 Raw body:", rawBody);

    const parsed = JSON.parse(rawBody);
    const session_id = parsed.session_id;
    if (!session_id) throw new Error("❌ Missing session_id in request");

    console.log("✅ Parsed session_id:", session_id);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1️⃣ Get session
    console.log("🔍 Fetching session from DB...");
    const { data: session, error: sessionError } = await supabase
      .from("challenge_sessions")
      .select("id, host_id, deck")
      .eq("id", session_id)
      .maybeSingle();

    if (sessionError) throw sessionError;
    if (!session) throw new Error("❌ Session not found");
    if (!session.deck) throw new Error("❌ Session has no deck assigned");

    console.log("✅ Session fetched:", session);

    // 2️⃣ Validate deck UUID
    if (typeof session.deck !== "string" || !session.deck.match(/^[0-9a-fA-F-]{36}$/)) {
      throw new Error("❌ Invalid deck UUID format: " + session.deck);
    }

    console.log("🎯 Deck UUID is valid:", session.deck);

    // 3️⃣ Fetch deck cards
    console.log("📦 Fetching cards from shared_decks...");
    const { data: hostDeck, error: deckError } = await supabase
      .from("shared_decks")
      .select("cards")
      .eq("id", session.deck)
      .maybeSingle();

    if (deckError) throw deckError;
    if (!hostDeck || !hostDeck.cards || !hostDeck.cards.length) {
      throw new Error("❌ Deck not found or contains no cards");
    }

    console.log(`✅ Deck retrieved with ${hostDeck.cards.length} cards`);

    // 4️⃣ Prepare 10 random cards with distractors
    console.log("🎲 Generating quiz deck...");
    const cards = hostDeck.cards.sort(() => 0.5 - Math.random()).slice(0, 10);

    const augmented = cards.map((c: any, i: number) => {
      const distractors = hostDeck.cards
        .filter((d: any) => d.back !== c.back)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((d: any) => d.back);

      const final = {
        front: c.front,
        back: c.back,
        options: [...distractors, c.back].sort(() => 0.5 - Math.random()),
      };

      console.log(`🧠 Q${i + 1}:`, final.front, "→", final.options);
      return final;
    });

    // 5️⃣ Save to DB
    console.log("💾 Saving session update...");
    const { error: updateError } = await supabase
      .from("challenge_sessions")
      .update({
        deck_runtime: augmented,
        current_index: 0,
        card_end_time: new Date(Date.now() + 10000).toISOString(),
        status: "running",
      })
      .eq("id", session_id);

    if (updateError) throw updateError;

    console.log("✅ Session updated successfully — Game Started!");

    return new Response(JSON.stringify({ status: "started" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🔥 Edge Function Error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
