import { useEffect, useState } from 'react';
import { getStory } from '../data/stories';
import { headword, lookup, tokenize } from '../tokenize';
import { markRead, putCard, setLearned, updateSettings, useStore, deleteCard } from '../store';
import { newCard } from '../srs';
import { navigate } from '../router';
import { TOPICS } from '../topics';
import { Sheet } from '../components/Sheet';
import { BackIcon } from '../components/Icons';
import type { GrammarNote } from '../types';

const ARTICLE_CLASS = { m: 'gender-m', f: 'gender-f', n: 'gender-n' } as const;

export function Reader({ id }: { id: string }) {
  const story = getStory(id);
  const cards = useStore((s) => s.cards);
  const progress = useStore((s) => s.progress[id]);
  const showTranslations = useStore((s) => s.settings.showTranslations);
  const [selected, setSelected] = useState<{ sentence: number; key: string; text: string } | null>(null);
  const [note, setNote] = useState<GrammarNote[] | null>(null);

  useEffect(() => {
    if (story) markRead(story.id);
  }, [story]);

  if (!story) {
    return (
      <div className="app reader">
        <p className="empty">Story not found.</p>
        <button className="primary" onClick={() => navigate('/')}>Back to stories</button>
      </div>
    );
  }

  const savedFronts = new Set(Object.keys(cards));
  const gloss = selected ? lookup(story, selected.key) : undefined;
  const front = selected && gloss ? headword(gloss, selected.text) : '';
  const cardId = front.toLowerCase();
  const isSaved = !!cardId && savedFronts.has(cardId);

  const toggleSave = () => {
    if (!selected || !gloss) return;
    if (isSaved) return deleteCard(cardId);
    const s = story.sentences[selected.sentence];
    putCard(
      newCard({
        id: cardId,
        front,
        back: gloss.en,
        note: [gloss.plural && gloss.gender ? `Plural: die ${gloss.plural}` : '', gloss.note ?? ''].filter(Boolean).join(' · ') || undefined,
        example: s.de,
        exampleEn: s.en,
        storyId: story.id,
      }),
    );
  };

  return (
    <div className="app reader">
      <header className="reader-header">
        <button className="icon-btn" onClick={() => history.length > 1 ? history.back() : navigate('/')} aria-label="Back">
          <BackIcon />
        </button>
        <button
          className={showTranslations ? 'toggle on small' : 'toggle small'}
          onClick={() => updateSettings({ showTranslations: !showTranslations })}
        >
          EN translations
        </button>
      </header>

      <article className="reader-body">
        <div className="reader-meta">
          <span className="level-badge">{story.level}</span>
          {story.topics.map((t) => (
            <span key={t} className="tag dark">{TOPICS[t].emoji} {TOPICS[t].label}</span>
          ))}
        </div>
        <h1 className="reader-title">{story.titleDe}</h1>
        <p className="reader-subtitle">{story.titleEn}</p>

        <div className="text">
          {story.sentences.map((s, si) => {
            const notes = story.grammar.filter((g) => g.sentence === si);
            return (
              <span key={si} className={showTranslations ? 'sentence block' : 'sentence'}>
                {tokenize(s.de).map((t, ti) => {
                  if (t.kind === 'space') return <span key={ti}>{t.text}</span>;
                  const g = lookup(story, t.key);
                  const saved = g && savedFronts.has(headword(g, t.text).toLowerCase());
                  const active = selected?.sentence === si && selected.key === t.key;
                  return (
                    <span
                      key={ti}
                      className={['word', saved && 'saved', active && 'active'].filter(Boolean).join(' ')}
                      onClick={() => setSelected({ sentence: si, key: t.key, text: t.text })}
                    >
                      {t.text}
                    </span>
                  );
                })}
                {notes.length > 0 && (
                  <button className="note-btn" onClick={() => setNote(notes)} aria-label="Grammar note">💡</button>
                )}
                {showTranslations && <span className="translation">{s.en}</span>}{' '}
              </span>
            );
          })}
        </div>

        {story.grammar.length > 0 && (
          <section className="grammar">
            <h2>Grammar in this story</h2>
            {story.grammar.map((g, i) => (
              <details key={i}>
                <summary>{g.title}</summary>
                <p>{g.body}</p>
              </details>
            ))}
          </section>
        )}

        <div className="reader-actions">
          <button className="primary" onClick={() => navigate(`/story/${story.id}/quiz`)}>
            Take the quiz ({story.quiz.length} questions)
          </button>
          <button className="secondary" onClick={() => setLearned(story.id, !progress?.learned)}>
            {progress?.learned ? 'Mark as not learned' : 'Mark as learned'}
          </button>
          {progress?.quizTotal != null && (
            <p className="muted center">Last quiz: {progress.quizScore}/{progress.quizTotal}</p>
          )}
        </div>
      </article>

      {selected && (
        <Sheet onClose={() => setSelected(null)}>
          {gloss ? (
            <>
              <div className="word-head">
                <span className={`word-big ${gloss.gender ? ARTICLE_CLASS[gloss.gender] : ''}`}>{front}</span>
                {(gloss.lemma ?? selected.text).toLowerCase() !== selected.text.toLowerCase() && <span className="muted">({selected.text})</span>}
              </div>
              <p className="word-en">{gloss.en}</p>
              {gloss.plural && gloss.gender && <p className="muted">Plural: die {gloss.plural}</p>}
              {gloss.note && <p className="word-note">{gloss.note}</p>}
            </>
          ) : (
            <>
              <div className="word-head"><span className="word-big">{selected.text}</span></div>
              <p className="muted">No translation for this word yet.</p>
            </>
          )}
          <div className="sentence-tr">
            <p className="muted small">Sentence</p>
            <p>{story.sentences[selected.sentence].en}</p>
          </div>
          {gloss && (
            <button className={isSaved ? 'secondary' : 'primary'} onClick={toggleSave}>
              {isSaved ? '✓ Saved – tap to remove' : '+ Save to flashcards'}
            </button>
          )}
        </Sheet>
      )}

      {note && (
        <Sheet onClose={() => setNote(null)}>
          {note.map((g) => (
            <div key={g.title}>
              <h3>💡 {g.title}</h3>
              <p>{g.body}</p>
            </div>
          ))}
          <button className="secondary" onClick={() => setNote(null)}>Got it</button>
        </Sheet>
      )}
    </div>
  );
}
