import React from 'react';
import { RewardCategory } from '../state/types';
import { useAppStore } from '../state/useAppStore';

interface CategoryChipsProps {
  selectedCategory: RewardCategory | 'All';
  onSelect: (category: RewardCategory | 'All') => void;
}

const CATEGORIES: (RewardCategory | 'All')[] = [
  'All', 'Food', 'Entertainment', 'Gaming', 'Shopping', 'Fashion', 'Gadgets'
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({ selectedCategory, onSelect }) => {
  const logEvent = useAppStore((s) => s.logEvent);

  const handleSelect = (cat: RewardCategory | 'All') => {
    onSelect(cat);
    logEvent({
      event_name: 'category_selected',
      category: cat,
      source: 'user',
    });
  };

  return (
    <div className="flex overflow-x-auto gap-2 py-2 no-scrollbar px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
            selectedCategory === cat 
              ? 'bg-[var(--primary)] text-white' 
              : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--muted)]/30'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
