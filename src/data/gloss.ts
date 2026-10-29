import type { Gender, Gloss } from '../types';

/** Noun: n('Stadt', 'f', 'Städte', 'city') */
export const n = (lemma: string, gender: Gender, plural: string | undefined, en: string, note?: string): Gloss =>
  ({ lemma, gender, plural, en, note });

/** Verb form: v('lebten', 'leben', 'lived') – lemma is the infinitive. */
export const v = (lemma: string, en: string, note?: string): Gloss => ({ lemma, en, note });

/** Any other word (adjective, adverb, ...): w('klein', 'small') */
export const w = (lemma: string, en: string, note?: string): Gloss => ({ lemma, en, note });
