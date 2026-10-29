import type { Topic } from './types';

export const TOPICS: Record<Topic, { label: string; emoji: string; colors: [string, string] }> = {
  travel: { label: 'Travel', emoji: '✈️', colors: ['#2b6cb0', '#63b3ed'] },
  history: { label: 'History', emoji: '📜', colors: ['#7b4a1e', '#d69e2e'] },
  food: { label: 'Food', emoji: '🥨', colors: ['#c05621', '#f6ad55'] },
  culture: { label: 'Culture', emoji: '🎭', colors: ['#6b46c1', '#b794f4'] },
  everyday: { label: 'Everyday', emoji: '🏠', colors: ['#2c7a7b', '#81e6d9'] },
  tech: { label: 'Tech', emoji: '📱', colors: ['#2d3748', '#718096'] },
  environment: { label: 'Environment', emoji: '🌿', colors: ['#276749', '#68d391'] },
  society: { label: 'Society', emoji: '🏛️', colors: ['#9b2c2c', '#fc8181'] },
  fiction: { label: 'Fiction', emoji: '✨', colors: ['#1a202c', '#553c9a'] },
  health: { label: 'Health', emoji: '🩺', colors: ['#b83280', '#f687b3'] },
  sport: { label: 'Sport', emoji: '⚽', colors: ['#22543d', '#48bb78'] },
  science: { label: 'Science', emoji: '🔬', colors: ['#2a4365', '#7f9cf5'] },
  nature: { label: 'Nature', emoji: '🏔️', colors: ['#285e61', '#4fd1c5'] },
  work: { label: 'Work', emoji: '💼', colors: ['#44337a', '#9f7aea'] },
};
