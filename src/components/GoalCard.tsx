import React from 'react';
import { Reward } from '../state/types';
import { ProgressRing } from './ProgressRing';
import { EffortLabel } from './EffortLabel';
import { useAppStore } from '../state/useAppStore';
import { useAvgCoinsPerRound } from '../state/selectors';

interface GoalCardProps {
  reward: Reward | null;
  onSelect: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ reward, onSelect }) => {
  const balance = useAppStore((s) => s.balance);
  const avgPerRound = useAppStore(useAvgCoinsPerRound);

  if (!reward) {
    return (
      <div id="tour-step-2" className="bg-[var(--surface)] p-4 rounded-xl border border-dashed border-[var(--muted)] flex items-center justify-center h-32 cursor-pointer" onClick={onSelect}>
        <p className="text-[var(--text)] font-medium text-sm">Pick a goal to play towards</p>
      </div>
    );
  }

  const remaining = Math.max(reward.priceCoins - balance, 0);

  return (
    <div 
      id="tour-step-2"
      className="bg-[var(--surface)] p-4 rounded-xl shadow-md border border-[var(--primary)] cursor-pointer flex flex-col gap-3"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: reward.brandColor }}
          >
            {reward.brand.charAt(0)}
          </div>
          <div>
            <h3 className="text-[var(--text)] font-bold">{reward.title}</h3>
            <p className="text-[var(--muted)] text-sm">{reward.brand}</p>
          </div>
        </div>
        <div className="relative">
          <ProgressRing current={balance} total={reward.priceCoins} size={48} strokeWidth={4} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-[var(--text)]">
              {Math.floor(Math.min((balance / reward.priceCoins) * 100, 100))}%
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 border-t border-[var(--border)] pt-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-bold">Remaining</span>
          <span className="text-sm font-bold text-[var(--accent-coin)] flex items-center gap-1">
            🪙 {remaining}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-bold">ETA</span>
          <EffortLabel price={reward.priceCoins} balance={balance} avgPerRound={avgPerRound} />
        </div>
      </div>
    </div>
  );
};
