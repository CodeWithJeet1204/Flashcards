export interface Card {
  id: number;
  front: string;
  back: string;
  ease: number;    // ease factor *1000 (e.g., 2.5 = 2500)
  interval: number; // days until review
  due: number;      // epoch ms due date
}

export function initCard(id: number, front: string, back: string): Card {
  return { id, front, back, ease: 2500, interval: 0, due: Date.now() };
}

// Quality: 0–5 (Anki‑style). Lower resets, higher lengthens interval.
export function review(card: Card, quality: number): Card {
  const ease = Math.max(1300, card.ease + (quality - 3) * 100);
  const interval = quality < 3 ? 1 : Math.max(1, Math.round((card.interval || 1) * ease / 1000));
  const due = Date.now() + interval * 86_400_000; // ms in a day
  return { ...card, ease, interval, due };
}

export function nextDue(cards: Card[]): Card | undefined {
  return cards.sort((a, b) => a.due - b.due)[0];
}