// Lists every word in every story that has no translation (story glossary or
// common dictionary), plus basic sanity checks. Run: npm run check:content
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Story } from '../src/types';
import { lookup, tokenize } from '../src/tokenize';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/data/stories');
let problems = 0;

for (const file of readdirSync(dir).filter((f) => f !== 'index.ts')) {
  const { story } = (await import(join(dir, file))) as { story: Story };
  const missing = new Set<string>();
  for (const s of story.sentences)
    for (const t of tokenize(s.de)) if (t.kind === 'word' && !lookup(story, t.key)) missing.add(t.key);
  const errors: string[] = [];
  if (missing.size) errors.push(`no gloss for: ${[...missing].join(', ')}`);
  for (const g of story.grammar)
    if (g.sentence < 0 || g.sentence >= story.sentences.length) errors.push(`grammar note "${g.title}" points to missing sentence ${g.sentence}`);
  for (const q of story.quiz)
    if (q.answer < 0 || q.answer >= q.options.length) errors.push(`quiz "${q.q}" has invalid answer index`);
  if (`${story.id}.ts` !== file) errors.push(`id "${story.id}" does not match file name`);
  problems += errors.length;
  console.log(`${errors.length ? '✗' : '✓'} ${file}${errors.map((e) => `\n    ${e}`).join('')}`);
}
process.exit(problems ? 1 : 0);
