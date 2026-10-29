import { useSyncExternalStore } from 'react';

// Hash-based routing: works offline and from any sub-path (e.g. GitHub Pages).
const subscribe = (l: () => void) => {
  window.addEventListener('hashchange', l);
  return () => window.removeEventListener('hashchange', l);
};

export function useRoute(): string[] {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

export const navigate = (path: string) => {
  window.location.hash = path;
};
