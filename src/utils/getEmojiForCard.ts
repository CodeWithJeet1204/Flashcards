import { Card } from "../algorithms/spacedRepetition";

/**
 * Returns an emoji representing the mastery level of a flashcard based on its interval.
 *
 * @param card - The flashcard object with interval property
 * @returns Emoji string reflecting the card's learning progress
 */
export function getEmojiForCard(card: Card): string {
  if (card.interval >= 20) return "🧠";   // Mastered
  if (card.interval >= 10) return "📚";   // Learned
  if (card.interval >= 5)  return "🔥";   // On fire
  if (card.interval >= 2)  return "✨";   // Improving
  if (card.interval >= 1)  return "🌀";   // Started
  return "💤";                           // Unseen / New
}
