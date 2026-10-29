// SM-2 style spaced repetition (the classic Anki algorithm, simplified).

export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface Card {
  id: string;
  front: string;
  back: string;
  note?: string;
  example: string;
  exampleEn: string;
  storyId: string;
  createdAt: number;
  due: number;
  /** Days until next review after the last successful one. */
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
}

const MIN = 60_000;
const DAY = 86_400_000;

export function newCard(fields: Omit<Card, 'createdAt' | 'due' | 'interval' | 'ease' | 'reps' | 'lapses'>, now = Date.now()): Card {
  return { ...fields, createdAt: now, due: now, interval: 0, ease: 2.5, reps: 0, lapses: 0 };
}

export function review(card: Card, grade: Grade, now = Date.now()): Card {
  let { interval, ease, reps, lapses } = card;

  if (grade === 'again') {
    return { ...card, reps: 0, interval: 0, lapses: lapses + 1, ease: Math.max(1.3, ease - 0.2), due: now + 10 * MIN };
  }

  if (grade === 'hard') {
    interval = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    ease = Math.max(1.3, ease - 0.15);
  } else if (grade === 'good') {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ease);
  } else {
    interval = reps === 0 ? 4 : Math.round(Math.max(interval, 1) * ease * 1.3);
    ease += 0.15;
  }

  return { ...card, interval, ease, reps: reps + 1, lapses, due: now + interval * DAY };
}

/** Human-readable preview of the next interval for a grade button. */
export function previewInterval(card: Card, grade: Grade, now = Date.now()): string {
  const ms = review(card, grade, now).due - now;
  if (ms < DAY) return `${Math.round(ms / MIN)} min`;
  const days = Math.round(ms / DAY);
  return days < 30 ? `${days} d` : `${Math.round(days / 30)} mo`;
}

export const isDue = (card: Card, now = Date.now()) => card.due <= now;
