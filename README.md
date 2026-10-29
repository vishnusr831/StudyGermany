# StudyGermany – German stories

A personal, offline-first app for learning German by reading short graded stories, inspired by Readle.
It's a PWA: open it once in Chrome on Android, choose **Add to Home screen / Install app**, and it runs like a normal app,
fully offline. No account and no server; all progress lives on the phone.

## Features

- **Stories** and **Flash Fiction** tabs, with level filter (A1–C1), an "Up next" carousel and "Hide learned".
- **Reader**: tap any word to see its translation, article (colour-coded der/die/das), plural and notes, plus the English
  translation of the sentence. Toggle English translations under every sentence. 💡 marks sentences with grammar notes.
- **Quiz** after every story; scoring at least 50 % marks the story as learned.
- **Training**: words you save become flashcards with spaced repetition (SM-2, like Anki). The tab badge shows cards due.
- **My library**: saved words, stories you've read, stats, and backup/restore of your data as a JSON file.

## Develop

```bash
npm install
npm run dev            # http://localhost:5173
npm run check:content  # every word in every story has a translation, quiz answers are valid, ...
npm run build          # production build in dist/
```

## Install on Android

The app is deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `master`
(one-time setup: repo **Settings → Pages → Source: GitHub Actions**). Then open
<https://vishnusr831.github.io/StudyGermany/> in Chrome on the phone → ⋮ menu → **Install app**.
After the first visit everything is cached and works offline. New versions install automatically the next time
the app is opened with internet.

## Adding stories

Each story is one file in `src/data/stories/` (copy an existing one). The file name must match the story `id`.

- `sentences`: German text with its English translation.
- `glossary`: every word in the text, keyed by its lower-case form as it appears. Use `n()` for nouns
  (lemma, gender, plural, English), `v()` for verb forms (infinitive, English) and `w()` for everything else.
  Common words (articles, pronouns, prepositions, sein/haben, …) are already in `src/data/common.ts`.
- `grammar`: notes attached to a sentence index.
- `quiz`: multiple-choice questions; `answer` is the index of the correct option.

Run `npm run check:content` afterwards; it lists any word without a translation.
