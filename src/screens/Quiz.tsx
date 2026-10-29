import { useState } from 'react';
import { getStory } from '../data/stories';
import { setLearned } from '../store';
import { navigate } from '../router';
import { BackIcon } from '../components/Icons';

export function Quiz({ id }: { id: string }) {
  const story = getStory(id);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (!story) return null;
  const done = index >= story.quiz.length;
  const q = story.quiz[index];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    const last = index + 1 >= story.quiz.length;
    if (last) {
      // Passing (≥ 50%) marks the story as learned.
      const total = story.quiz.length;
      setLearned(story.id, score * 2 >= total, { score, total });
    }
    setPicked(null);
    setIndex(index + 1);
  };

  return (
    <div className="app reader">
      <header className="reader-header">
        <button className="icon-btn" onClick={() => navigate(`/story/${story.id}`)} aria-label="Back to story">
          <BackIcon />
        </button>
        <span className="muted">{story.titleDe}</span>
      </header>

      <div className="quiz">
        {!done ? (
          <>
            <div className="progress-bar"><div style={{ width: `${(index / story.quiz.length) * 100}%` }} /></div>
            <p className="muted">Question {index + 1} of {story.quiz.length}</p>
            <h2 className="quiz-q">{q.q}</h2>
            <div className="options">
              {q.options.map((o, i) => {
                const state = picked === null ? '' : i === q.answer ? 'correct' : i === picked ? 'wrong' : 'dim';
                return (
                  <button key={i} className={`option ${state}`} onClick={() => pick(i)}>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <button className="primary" onClick={next}>
                {index + 1 >= story.quiz.length ? 'See result' : 'Next'}
              </button>
            )}
          </>
        ) : (
          <div className="quiz-result">
            <div className="big-score">{score}/{story.quiz.length}</div>
            <p>
              {score * 2 >= story.quiz.length
                ? 'Well done! The story is marked as learned.'
                : 'Not quite – read the story again and retry.'}
            </p>
            <button className="primary" onClick={() => { setIndex(0); setScore(0); }}>Retry quiz</button>
            <button className="secondary" onClick={() => navigate(`/story/${story.id}`)}>Back to story</button>
            <button className="secondary" onClick={() => navigate(story.type === 'story' ? '/' : '/flash')}>More stories</button>
          </div>
        )}
      </div>
    </div>
  );
}
