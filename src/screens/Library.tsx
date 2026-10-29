import { useMemo, useRef, useState } from 'react';
import { STORIES } from '../data/stories';
import { deleteCard, exportData, importData, resetData, useStore } from '../store';
import { navigate } from '../router';
import { StoryCard } from '../components/StoryCard';

type Tab = 'words' | 'stories' | 'settings';

export function Library() {
  const [tab, setTab] = useState<Tab>('words');
  const cards = useStore((s) => s.cards);
  const progress = useStore((s) => s.progress);
  const [query, setQuery] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const words = useMemo(
    () =>
      Object.values(cards)
        .filter((c) => `${c.front} ${c.back}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => b.createdAt - a.createdAt),
    [cards, query],
  );
  const read = STORIES.filter((s) => progress[s.id]).sort((a, b) => progress[b.id].lastReadAt - progress[a.id].lastReadAt);
  const learnedCount = STORIES.filter((s) => progress[s.id]?.learned).length;
  const mastered = Object.values(cards).filter((c) => c.interval >= 21).length;

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `studygermany-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const upload = async (file: File) => {
    try {
      importData(await file.text());
      alert('Backup restored.');
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <>
      <header className="page-header"><h1>My library</h1></header>

      <div className="stats">
        <div><strong>{learnedCount}</strong><span>stories learned</span></div>
        <div><strong>{Object.keys(cards).length}</strong><span>words saved</span></div>
        <div><strong>{mastered}</strong><span>words mastered</span></div>
      </div>

      <div className="chips">
        {(['words', 'stories', 'settings'] as const).map((t) => (
          <button key={t} className={tab === t ? 'chip active' : 'chip'} onClick={() => setTab(t)}>
            {t === 'words' ? 'Words' : t === 'stories' ? 'Stories' : 'Settings'}
          </button>
        ))}
      </div>

      {tab === 'words' && (
        <section>
          <input className="search" placeholder="Search saved words…" value={query} onChange={(e) => setQuery(e.target.value)} />
          {words.length === 0 && <p className="empty">{query ? 'No matches.' : 'Tap words while reading to save them here.'}</p>}
          <ul className="word-list">
            {words.map((c) => (
              <li key={c.id}>
                <div>
                  <strong>{c.front}</strong>
                  <span className="muted"> — {c.back}</span>
                  <div className="muted small">
                    {c.due <= Date.now() ? 'due now' : `next review ${new Date(c.due).toLocaleDateString()}`}
                  </div>
                </div>
                <button className="icon-btn" aria-label={`Delete ${c.front}`} onClick={() => deleteCard(c.id)}>✕</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === 'stories' && (
        <section className="story-list">
          {read.length === 0 && <p className="empty">Stories you open will show up here.</p>}
          {read.map((s) => (
            <StoryCard key={s.id} story={s} learned={!!progress[s.id]?.learned} variant="row" />
          ))}
        </section>
      )}

      {tab === 'settings' && (
        <section className="settings">
          <p className="muted">
            Everything is stored only on this device. Make a backup now and then, especially before clearing browser data.
          </p>
          <button className="primary" onClick={download}>Download backup</button>
          <button className="secondary" onClick={() => fileInput.current?.click()}>Restore from backup</button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <button
            className="danger"
            onClick={() => {
              if (confirm('Delete all progress and flashcards? This cannot be undone.')) {
                resetData();
                navigate('/');
              }
            }}
          >
            Reset all data
          </button>
          <p className="muted small">{STORIES.length} stories available offline.</p>
        </section>
      )}
    </>
  );
}
