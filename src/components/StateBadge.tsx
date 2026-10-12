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
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '10px',
        padding: '2px 6px',
        whiteSpace: 'nowrap',
      }}
      className="rounded-full text-[10px] font-bold uppercase tracking-wider inline-block text-center whitespace-nowrap shrink-0 leading-none"
    >
      {text}
    </span>
  );
};
