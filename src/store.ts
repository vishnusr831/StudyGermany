import { useSyncExternalStore } from 'react';
import type { Level } from './types';
import type { Card } from './srs';

export interface StoryProgress {
  learned: boolean;
  quizScore?: number;
  quizTotal?: number;
  lastReadAt: number;
}

export interface State {
  version: 1;
  progress: Record<string, StoryProgress>;
  cards: Record<string, Card>;
  settings: {
    level: Level | 'All';
    hideLearned: boolean;
    showTranslations: boolean;
  };
}

const KEY = 'studygermany.v1';

const initial: State = {
  version: 1,
  progress: {},
  cards: {},
  settings: { level: 'A1', hideLearned: false, showTranslations: false },
};

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as State;
    return { ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings } };
  } catch {
    return initial;
  }
}

let state = load();
const listeners = new Set<() => void>();

export function setState(update: (s: State) => State) {
  state = update(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: keep working in memory.
  }
  listeners.forEach((l) => l());
}

export function getState() {
  return state;
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => select(state),
  );
}

// ---- actions -------------------------------------------------------------

export const updateSettings = (patch: Partial<State['settings']>) =>
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));

export const markRead = (storyId: string) =>
  setState((s) => {
    const prev = s.progress[storyId];
    const now = Date.now();
    return { ...s, progress: { ...s.progress, [storyId]: prev ? { ...prev, lastReadAt: now } : { learned: false, lastReadAt: now } } };
  });

export const setLearned = (storyId: string, learned: boolean, quiz?: { score: number; total: number }) =>
  setState((s) => ({
    ...s,
    progress: {
      ...s.progress,
      [storyId]: {
        ...s.progress[storyId],
        learned,
        lastReadAt: Date.now(),
        ...(quiz && { quizScore: quiz.score, quizTotal: quiz.total }),
      },
    },
  }));

export const putCard = (card: Card) => setState((s) => ({ ...s, cards: { ...s.cards, [card.id]: card } }));

export const deleteCard = (id: string) =>
  setState((s) => {
    const { [id]: _removed, ...cards } = s.cards;
    return { ...s, cards };
  });

export function exportData(): string {
  return JSON.stringify(state, null, 2);
}

export function importData(json: string) {
  const parsed = JSON.parse(json) as State;
  if (parsed?.version !== 1 || typeof parsed.cards !== 'object' || typeof parsed.progress !== 'object')
    throw new Error('This is not a StudyGermany backup file.');
  setState(() => ({ ...initial, ...parsed, settings: { ...initial.settings, ...parsed.settings } }));
}

export const resetData = () => setState(() => initial);
