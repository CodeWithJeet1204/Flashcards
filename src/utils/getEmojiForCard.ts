import { Card } from "../algorithms/spacedRepetition";

export function getEmojiForCard(card: Card): string {
  if (card.interval >= 20) return "🧠";       // Master
  if (card.interval >= 10) return "📚";       // Learned
  if (card.interval >= 5) return "🔥";        // On fire
  if (card.interval >= 2) return "✨";        // Improving
  if (card.interval >= 1) return "🌀";        // Started
  return "💤";                                // Unseen
}
