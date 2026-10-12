import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const LensFAB: React.FC = () => {
  const setLensOpen = useAppStore(state => state.setLensOpen);
  const lensOpen = useAppStore(state => state.ui.lensOpen);

  if (lensOpen) return null;

  return (
    <button
      id="tour-step-4"
      onClick={() => setLensOpen(true)}
      className="lg:hidden fixed bottom-5 right-5 px-4 py-2.5 bg-[var(--lens-primary)] text-white font-bold text-sm rounded-full shadow-2xl flex items-center gap-2 z-40 hover:scale-105 active:scale-95 transition-transform border border-[var(--lens-border)]"
      aria-label="Open PM Lens"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
      <span>PM Lens</span>
    </button>
  );
};
