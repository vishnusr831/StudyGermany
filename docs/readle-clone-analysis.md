# Building our own Readle-style German reading app: analysis

Goal: a personal app for learning German by reading short graded stories, so we don't pay ~€70/year for Readle.

## 1. What Readle does (from the screenshot and its store listing)

### Screens visible in the screenshot

| Area | What it shows | Do we need it? |
|---|---|---|
| **Header "Discover Readle"** | Title plus **cart** (subscription shop) and **profile** buttons | Profile/settings: yes. Cart: no |
| **"Free Stories 🎁 6"** | Horizontal carousel of story cards. Each card has a **CEFR level badge** (A1, A2), **topic tags** (✈️ Travel, 📜 History), cover image, **English title**, **German teaser** (first ~3 lines) | Yes. With no paywall, this becomes "Featured" or "New today" |
| **"Explore by level: A1"** | Level filter chips: All / A1 / A2 / B1 / B2 / C1 | Yes |
| **"Hide learned ✓"** | Toggle that hides stories you've already finished | Yes |
| **"Please rate us ★★★★★"** | App-store rating banner | No |
| **Bottom tabs** | **Stories** · **Flash Fiction** · **Training** (badge "1" = cards due) · **My library** | Yes, all four |

### Features behind the screens (from the store listing)

- **Graded stories and news**, A1 to C1, about 5 minutes each. Topics include Travel, Culture, Food, History, Tech and News.
- **Native-speaker audio** for every story.
- **Tap a word to translate it**, and save it to your vocabulary.
- **Grammar helpers** (about 170) linked from inside stories.
- **A quiz per story** covering vocabulary, grammar and articles (der/die/das). You can retake it.
- **Smart flashcards with spaced repetition** (Anki-like), built from the words you saved. This is the **Training** tab, and the badge counts cards due today.
- **Flash Fiction**: very short fiction pieces, kept in their own feed.
- **My library**: saved and bookmarked stories, finished stories, and your word list.
- Freemium: A1/A2 free with rotation; B1+ needs a subscription. **We drop all of this.**

## 2. What we actually build

### Core screens

1. **Discover (Stories tab)**: featured carousel, level chips, "hide learned" toggle, story list or grid, topic filter.
2. **Flash Fiction tab**: the same list component, filtered to `type = "flash_fiction"`.
3. **Story reader** (the most important screen):
   - German text split into sentences and tokens.
   - **Tap a word** to open a popup with its translation, base form (lemma), article and gender for nouns, plural, and a "Save to flashcards" button.
   - **Tap or long-press a sentence** to show its English translation.
   - **Audio player** with play/pause, speed control (0.75× / 1× / 1.25×) and **sentence highlighting** that follows the audio.
   - Inline **grammar notes** (for example "Perfekt with *sein*", "Dativ after *mit*").
   - A "Mark as learned" button, which opens the quiz.
4. **Quiz**: 5–8 questions per story: multiple-choice comprehension, vocabulary, and der/die/das.
5. **Training tab**: spaced-repetition review of saved words (front: German word or sentence; back: translation plus example from the story). Shows a due-count badge.
6. **My library**: saved stories, finished stories, all saved words (searchable, deletable), and simple stats such as streak and words learned.
7. **Settings/Profile**: my level, native language (English), audio speed, dark/light theme, export/import of data as a backup.

### Out of scope

Payments and cart, rating banner, accounts and login (at least at first), push notifications, social features.

## 3. The real work is content, not code

The UI is simple. The work is in **getting good graded German texts with translations, word glosses and audio**. We **cannot copy Readle's stories or news articles** (copyright), so we have to produce our own.

### Recommended pipeline (offline script, run once per batch)

```
topic + level + type  ─► LLM generates story (CEFR-constrained)
                       ─► LLM/NLP adds: sentence translations, per-token lemma + gloss,
                          noun gender/plural, grammar notes, quiz questions
                       ─► TTS generates audio + sentence timestamps
                       ─► validate (schema, level word-count, no missing glosses)
                       ─► write stories/<id>.json + audio/<id>.mp3
```

- **Text:** use an LLM (Claude via the API) with a strict JSON schema and level rules. For example, A1 means present tense and Perfekt only, about 120–200 words, and common vocabulary. C1 allows complex subordinate clauses and about 600+ words. News-style stories can be original write-ups about public events (facts aren't copyrighted), but should never be copies of articles.
- **Word data:** let the LLM produce lemma, gloss and gender per token in the same pass. Optionally cross-check with **spaCy `de_core_news`** for lemma and part of speech, and with a **Wiktionary-derived dictionary** (for example the kaikki.org extracts) as a fallback lookup for any word the reader taps.
- **Audio, three options:**
  1. **Browser/OS text-to-speech (Web Speech API)**: free and needs zero setup. Android's German voices are decent. Sentence highlighting is easy because we speak sentence by sentence.
  2. **Cloud neural TTS** (Azure, Google, ElevenLabs): much more natural. Free tiers likely cover a personal library; check current limits.
  3. **Piper TTS** (open source, runs locally, has German voices): free, generated offline as MP3s.

  **Recommendation:** start with option 1, then pre-generate MP3s with option 2 or 3 later.
- **Images:** free stock photos (Unsplash or Pexels API, with attribution), or skip images and use topic emoji or colored gradients.
- **Scale:** start with about **10 stories per level** (60 in total) plus 10 flash-fiction pieces. That's plenty to validate the app, and we can add more anytime with the script.

## 4. Data model (static JSON, no backend needed)

```jsonc
// content/stories/beijing-secret-garden.json
{
  "id": "beijing-secret-garden",
  "type": "story",                 // "story" | "news" | "flash_fiction"
  "level": "A1",
  "topics": ["travel", "history"],
  "titleEn": "Beijing's Secret Garden Is Now Open",
  "titleDe": "Pekings geheimer Garten ist jetzt offen",
  "image": "img/beijing.jpg",
  "audio": "audio/beijing-secret-garden.mp3",   // optional
  "sentences": [
    {
      "de": "Die Verbotene Stadt ist ein besonderer Ort in China.",
      "en": "The Forbidden City is a special place in China.",
      "audioStart": 0.0, "audioEnd": 3.2,
      "tokens": [
        { "t": "Die", "lemma": "die", "pos": "DET" },
        { "t": "Verbotene", "lemma": "verboten", "pos": "ADJ", "gloss": "forbidden" },
        { "t": "Stadt", "lemma": "Stadt", "pos": "NOUN", "gloss": "city",
          "gender": "f", "plural": "Städte" }
        // ...
      ]
    }
  ],
  "grammarNotes": [{ "sentence": 0, "title": "Adjective endings after 'die'", "body": "..." }],
  "quiz": [
    { "q": "Wo ist die Verbotene Stadt?", "options": ["In Japan", "In China", "In Korea"], "answer": 1 },
    { "q": "Artikel: ___ Stadt", "options": ["der", "die", "das"], "answer": 1 }
  ]
}
```

User data lives on the device (IndexedDB):

- `progress`: story id → `{ learned, quizScore, lastReadAt }`
- `cards`: saved words with SRS state (`due`, `stability`, `difficulty`, `reps`, `lapses`, plus source story and sentence)
- `settings`: level, theme, audio speed

**Spaced repetition:** use **FSRS** via the `ts-fsrs` npm package (the modern Anki algorithm), or a ~30-line SM-2 implementation if we want zero dependencies.

## 5. Tech stack options

The repo currently holds an **Angular 4 (2017) "Study in Germany" website** (home, search, about, contact pages). It isn't related to this app, and its toolchain is badly outdated. Angular CLI 1.0 / TypeScript 2.2 won't run on a current Node. We should either replace it or move it aside.

| Option | Pros | Cons |
|---|---|---|
| **A. PWA (React + Vite + TypeScript, or modern Angular)**, installable on the phone home screen | One codebase, free hosting (GitHub Pages, Netlify), works offline, fastest to build, no app store | Background audio and notifications are a bit weaker than native |
| **B. Expo / React Native** | Real Android/iOS app, better audio and notifications | More setup; iOS sideloading needs a developer account |
| **C. Flutter** | Polished native feel | New language (Dart), more work |

**Recommendation: A (PWA).** For a personal app it covers everything in the screenshot, it can be wrapped as an Android APK later with Capacitor, and the content pipeline (Node or Python script) can live in the same repo.

Suggested libraries: React Router, Tailwind (for the dark teal look), `idb` or Dexie (IndexedDB), `ts-fsrs`, `vite-plugin-pwa`.

## 6. Proposed repo layout

```
/app            PWA frontend (Vite + React + TS)
/content        generated story JSON, audio, images (served statically)
/pipeline       story-generation scripts (LLM + TTS + validation)
/docs           this analysis
```

## 7. Build plan (milestones)

1. **Skeleton**: new PWA project, dark theme, bottom tab navigation, 4 empty tabs.
2. **Discover + reader with hand-written sample data**: 3–4 stories in the JSON format, level chips, hide-learned toggle, tap-word popup, sentence translation.
3. **Audio**: Web Speech TTS sentence by sentence, with highlighting and speed control.
4. **Saving words + Training**: save from the popup, FSRS review screen, due badge.
5. **Quiz + progress + My library**.
6. **Content pipeline**: script that generates and validates stories, then a first batch of about 60 stories.
7. **Polish**: offline caching, export/import backup, optional pre-generated neural audio, Android APK via Capacitor.

Milestones 1–5 are a solid working app; milestone 6 is what makes it useful long-term.

## 8. Rough costs

- Hosting: **€0** (GitHub Pages or Netlify).
- Story generation: a few cents per story with an LLM API, so a library of a few hundred stories costs a few euros, one time.
- Audio: €0 with device TTS or Piper. Cloud TTS free tiers likely cover a personal library.

## 9. Decisions needed before we start

1. **Platform:** PWA (recommended), or a native app (Expo or Flutter)?
2. **Existing Angular code:** delete it, or keep it in a subfolder?
3. **Content generation:** OK to use an LLM API (needs an API key, a few euros)? Or start with hand-written and curated texts?
4. **Translation language:** English, as in Readle?
5. **Audio quality:** is device TTS fine to start with?
