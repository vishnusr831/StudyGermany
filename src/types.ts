export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export type Topic =
  | 'travel' | 'history' | 'food' | 'culture' | 'everyday'
  | 'tech' | 'environment' | 'society' | 'fiction'
  | 'health' | 'sport' | 'science' | 'nature' | 'work';

export type Gender = 'm' | 'f' | 'n';

/** Dictionary entry for one surface form of a word. */
export interface Gloss {
  en: string;
  /** Base form shown on flashcards (infinitive, nominative singular, ...). */
  lemma?: string;
  gender?: Gender;
  plural?: string;
  note?: string;
}

export interface Sentence {
  de: string;
  en: string;
}

export interface GrammarNote {
  /** Index of the sentence the note belongs to. */
  sentence: number;
  title: string;
  body: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface Story {
  id: string;
  type: 'story' | 'flash_fiction';
  level: Level;
  topics: Topic[];
  titleEn: string;
  titleDe: string;
  sentences: Sentence[];
  /** Keys are lower-case surface forms as they appear in the text. */
  glossary: Record<string, Gloss>;
  grammar: GrammarNote[];
  quiz: QuizQuestion[];
}
