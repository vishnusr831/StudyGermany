import { useMemo, useState } from 'react';
import { putCard, useStore } from '../store';
import { isDue, previewInterval, review, type Card, type Grade } from '../srs';
import { navigate } from '../router';

const GRADES: { grade: Grade; label: string }[] = [
  { grade: 'again', label: 'Again' },
  { grade: 'hard', label: 'Hard' },
  { grade: 'good', label: 'Good' },
  { grade: 'easy', label: 'Easy' },
];

export function Training() {
  const cards = useStore((s) => s.cards);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  // Set when practising all cards outside the schedule.
  const [extra, setExtra] = useState<Card[] | null>(null);

  const all = useMemo(() => Object.values(cards), [cards]);
  // Cards answered "again" are due in 10 minutes, so they drop out of the queue for now.
  const due = useMemo(() => all.filter((c) => isDue(c)).sort((a, b) => a.due - b.due), [all]);
  const queue = extra ?? due;
  const card = queue[0];

  const answer = (grade: Grade) => {
    putCard(review(card, grade));
    if (extra) setExtra(extra.length > 1 ? extra.slice(1) : null);
    setRevealed(false);
    setReviewed((n) => n + 1);
  };

  if (all.length === 0) {
    return (
      <>
        <header className="page-header"><h1>Training</h1></header>
        <div className="empty-state">
          <p className="big-emoji">🏋️</p>
          <p>No flashcards yet.</p>
          <p className="muted">Tap any word while reading a story and choose “Save to flashcards”.</p>
          <button className="primary" onClick={() => navigate('/')}>Find a story</button>
        </div>
      </>
    );
  }

  if (!card) {
    const next = all.reduce((m, c) => Math.min(m, c.due), Infinity);
    const hours = Math.max(0, Math.round((next - Date.now()) / 3_600_000));
    return (
      <>
        <header className="page-header"><h1>Training</h1></header>
        <div className="empty-state">
          <p className="big-emoji">🎉</p>
          <p>{reviewed > 0 ? `Done! You reviewed ${reviewed} card${reviewed === 1 ? '' : 's'}.` : 'Nothing due right now.'}</p>
          <p className="muted">Next card due {hours < 1 ? 'within the hour' : `in about ${hours} h`}. {all.length} cards in total.</p>
          <button className="secondary" onClick={() => setExtra([...all].sort(() => Math.random() - 0.5))}>
            Practise all cards anyway
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>Training</h1>
        <span className="count-pill">{queue.length} left</span>
      </header>
      <div className="flashcard" onClick={() => setRevealed(true)}>
        <p className="card-front">{card.front}</p>
        {revealed ? (
          <>
            <hr />
            <p className="card-back">{card.back}</p>
            {card.note && <p className="muted small">{card.note}</p>}
            <p className="card-example">{card.example}</p>
            <p className="muted small">{card.exampleEn}</p>
          </>
        ) : (
          <p className="muted tap-hint">Tap to show the answer</p>
        )}
      </div>
      {revealed && (
        <div className="grades">
          {GRADES.map(({ grade, label }) => (
            <button key={grade} className={`grade ${grade}`} onClick={() => answer(grade)}>
              <span>{label}</span>
              <span className="small">{previewInterval(card, grade)}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
