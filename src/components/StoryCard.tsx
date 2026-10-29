import type { Story } from '../types';
import { TOPICS } from '../topics';
import { navigate } from '../router';

interface Props {
  story: Story;
  learned: boolean;
  variant: 'featured' | 'row';
}

export function StoryCard({ story, learned, variant }: Props) {
  const [c1, c2] = TOPICS[story.topics[0]].colors;
  const teaser = story.sentences.map((s) => s.de).join(' ');
  return (
    <button
      className={`story-card ${variant}`}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      onClick={() => navigate(`/story/${story.id}`)}
    >
      <div className="card-top">
        <span className="level-badge">{story.level}</span>
        <span className="card-tags">
          {story.topics.map((t) => (
            <span key={t} className="tag">
              {TOPICS[t].emoji} {TOPICS[t].label}
            </span>
          ))}
        </span>
      </div>
      <div className="card-emoji" aria-hidden>{TOPICS[story.topics[0]].emoji}</div>
      <div className="card-body">
        <h3>
          {story.titleEn}
          {learned && <span className="learned-mark" title="Learned"> ✓</span>}
        </h3>
        <p className="teaser">{teaser}</p>
      </div>
    </button>
  );
}
