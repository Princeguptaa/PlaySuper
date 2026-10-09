import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const VariantToggle: React.FC = () => {
  const { ui, switchVariant } = useAppStore();

  return (
    <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--muted)]/20 w-fit mx-auto my-2">
      <button
        onClick={() => switchVariant('goal')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          ui.variant === 'goal'
            ? 'bg-[var(--primary)] text-white shadow-sm'
            : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`}
      >
        Goal Store
      </button>
      <button
        onClick={() => switchVariant('classic')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          ui.variant === 'classic'
            ? 'bg-[var(--primary)] text-white shadow-sm'
            : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`}
      >
        Classic Store
      </button>
    </div>
  );
};
