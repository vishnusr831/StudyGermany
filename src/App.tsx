import { useEffect, useState } from 'react';
import { navigate, useRoute } from './router';
import { useStore } from './store';
import { isDue } from './srs';
import { Discover } from './screens/Discover';
import { Reader } from './screens/Reader';
import { Quiz } from './screens/Quiz';
import { Training } from './screens/Training';
import { Library } from './screens/Library';
import { BookIcon, DumbbellIcon, GlobeIcon, LibraryIcon } from './components/Icons';

const TABS = [
  { path: '', label: 'Stories', icon: <GlobeIcon /> },
  { path: 'flash', label: 'Flash Fiction', icon: <BookIcon /> },
  { path: 'training', label: 'Training', icon: <DumbbellIcon /> },
  { path: 'library', label: 'My library', icon: <LibraryIcon /> },
];

export function App() {
  const [section = '', id, sub] = useRoute();
  const cards = useStore((s) => s.cards);
  // Re-render every minute so the due badge picks up cards becoming due.
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);
  const due = Object.values(cards).filter((c) => isDue(c)).length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [section, id, sub]);

  if (section === 'story' && id) return sub === 'quiz' ? <Quiz id={id} /> : <Reader id={id} />;

  return (
    <div className="app">
      <main className="screen">
        {section === '' && <Discover type="story" />}
        {section === 'flash' && <Discover type="flash_fiction" />}
        {section === 'training' && <Training />}
        {section === 'library' && <Library />}
      </main>
      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.path} className={section === t.path ? 'tab active' : 'tab'} onClick={() => navigate(`/${t.path}`)}>
            <span className="tab-icon">
              {t.icon}
              {t.path === 'training' && due > 0 && <span className="badge">{due}</span>}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
