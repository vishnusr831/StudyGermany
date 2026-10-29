import { STORIES } from '../data/stories';
import { LEVELS, type Story } from '../types';
import { updateSettings, useStore } from '../store';
import { StoryCard } from '../components/StoryCard';
import { CheckIcon } from '../components/Icons';

export function Discover({ type }: { type: Story['type'] }) {
  const settings = useStore((s) => s.settings);
  const progress = useStore((s) => s.progress);
  const isLearned = (id: string) => !!progress[id]?.learned;

  const ofType = STORIES.filter((s) => s.type === type);
  const featured = ofType.filter((s) => !isLearned(s.id) && (settings.level === 'All' || s.level === settings.level));
  const list = ofType.filter(
    (s) => (settings.level === 'All' || s.level === settings.level) && !(settings.hideLearned && isLearned(s.id)),
  );

  return (
    <>
      <header className="page-header">
        <h1>{type === 'story' ? 'Discover' : 'Flash Fiction'}</h1>
      </header>

      {type === 'story' && featured.length > 0 && (
        <section>
          <h2 className="section-title">
            Up next <span className="count-pill">{featured.length}</span>
          </h2>
          <div className="carousel">
            {featured.map((s) => (
              <StoryCard key={s.id} story={s} learned={false} variant="featured" />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="filter-row">
          <h2 className="section-title">Explore by level: {settings.level}</h2>
          <button
            className={settings.hideLearned ? 'toggle on' : 'toggle'}
            onClick={() => updateSettings({ hideLearned: !settings.hideLearned })}
          >
            Hide learned <CheckIcon />
          </button>
        </div>
        <div className="chips">
          {(['All', ...LEVELS] as const).map((l) => (
            <button key={l} className={settings.level === l ? 'chip active' : 'chip'} onClick={() => updateSettings({ level: l })}>
              {l}
            </button>
          ))}
        </div>
        <div className="story-list">
          {list.map((s) => (
            <StoryCard key={s.id} story={s} learned={isLearned(s.id)} variant="row" />
          ))}
          {list.length === 0 && <p className="empty">No stories here yet. Try another level.</p>}
        </div>
      </section>
    </>
  );
}
