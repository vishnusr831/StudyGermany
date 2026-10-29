import type { Story } from '../../types';

// Every file in this folder (except this one) exports `story`; adding a new
// story is just dropping a new file here.
const modules = import.meta.glob<{ story: Story }>('./*.ts', { eager: true });

const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const STORIES: Story[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/index.ts'))
  .map(([, m]) => m.story)
  .sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level) || a.titleEn.localeCompare(b.titleEn));

export const getStory = (id: string) => STORIES.find((s) => s.id === id);
