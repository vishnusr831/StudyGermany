import type { ReactNode } from 'react';

/** Bottom sheet overlay; tapping the backdrop closes it. */
export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}
