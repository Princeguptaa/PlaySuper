import React from 'react';

interface StateBadgeProps {
  state: 'affordable' | 'within_reach' | 'far';
}

export const StateBadge: React.FC<StateBadgeProps> = ({ state }) => {
  let bgColor = 'var(--muted)';
  let textColor = '#ffffff';
  let text = 'Far';

  if (state === 'affordable') {
    bgColor = 'var(--success)';
    text = 'Affordable';
  } else if (state === 'within_reach') {
    bgColor = 'var(--primary)';
    text = 'Within reach';
  }

  return (
    <span
      style={{ backgroundColor: bgColor, color: textColor }}
      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
    >
      {text}
    </span>
  );
};
