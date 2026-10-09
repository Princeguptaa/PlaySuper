import React from 'react';
import { effortETA } from '../lib/economy';

interface EffortLabelProps {
  price: number;
  balance: number;
  avgPerRound: number;
  id?: string;
}

export const EffortLabel: React.FC<EffortLabelProps> = ({ price, balance, avgPerRound, id }) => {
  const etaString = effortETA(price, balance, avgPerRound);

  return (
    <span id={id} className="text-xs font-medium text-[var(--muted)]">
      {etaString}
    </span>
  );
};
