export interface Card {
  id: number;
  front: string;
  back: string;
  ease: number;
  interval: number;
  due: number;
  lastReviewed?: number;
  favorite?: boolean;
}

export function initCard(id: number, front: string, back: string): Card {
  return { id, front, back, ease: 2500, interval: 0, due: Date.now() };
}

export function review(card: Card, quality: number): Card {
  const now = Date.now();
  const newEase = Math.max(1.3, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  const newInterval = quality < 3 ? 1 : Math.round(card.interval * newEase);

  return {
    ...card,
    ease: newEase,
    interval: newInterval,
    due: now + newInterval * 24 * 60 * 60 * 1000,
    lastReviewed: now,
  };
}


export function nextDue(cards: Card[]): Card | undefined {
  return cards.sort((a, b) => a.due - b.due)[0];
}