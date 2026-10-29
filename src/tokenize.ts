import type { Gloss, Story } from './types';
import { COMMON } from './data/common';

export type Token = { kind: 'word'; text: string; key: string } | { kind: 'space'; text: string };

const WORD = /[A-Za-zÄÖÜäöüßéÉ]+(?:-[A-Za-zÄÖÜäöüßéÉ]+)*/g;

/** Splits a sentence into word tokens and everything in between (spaces, punctuation, numbers). */
export function tokenize(sentence: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  for (const m of sentence.matchAll(WORD)) {
    if (m.index > last) out.push({ kind: 'space', text: sentence.slice(last, m.index) });
    out.push({ kind: 'word', text: m[0], key: m[0].toLowerCase() });
    last = m.index + m[0].length;
  }
  if (last < sentence.length) out.push({ kind: 'space', text: sentence.slice(last) });
  return out;
}

export function lookup(story: Story, key: string): Gloss | undefined {
  return story.glossary[key] ?? COMMON[key];
}

const ARTICLE = { m: 'der', f: 'die', n: 'das' } as const;

/** Flashcard front: nouns get their article ("die Stadt"), everything else its base form. */
export function headword(gloss: Gloss, surface: string): string {
  const base = gloss.lemma ?? surface;
  return gloss.gender ? `${ARTICLE[gloss.gender]} ${base}` : base;
}
