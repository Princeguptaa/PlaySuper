import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const LensFAB: React.FC = () => {
  const { setLensOpen, lensOpen } = useAppStore(state => ({
    setLensOpen: state.setLensOpen,
    lensOpen: state.ui.lensOpen
  }));

  if (lensOpen) return null;

  return (
    <button
      id="tour-step-4"
      onClick={() => setLensOpen(true)}
      className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-background rounded-full shadow-xl flex justify-center items-center z-30 hover:scale-105 active:scale-95 transition-transform"
      aria-label="Open PM Lens"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    </button>
  );
};
