const base = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const GlobeIcon = () => (
  <svg {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
);
export const BookIcon = () => (
  <svg {...base}><path d="M12 6c-2-1.5-5-2-8-1.5v14c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-14c-3-.5-6 0-8 1.5zM12 6v14" /></svg>
);
export const DumbbellIcon = () => (
  <svg {...base}><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" /></svg>
);
export const LibraryIcon = () => (
  <svg {...base}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h5" /></svg>
);
export const BackIcon = () => (
  <svg {...base}><path d="M15 5l-7 7 7 7" /></svg>
);
export const CheckIcon = () => (
  <svg {...base} width={20} height={20}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></svg>
);
