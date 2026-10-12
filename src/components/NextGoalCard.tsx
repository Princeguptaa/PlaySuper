import React from 'react';
import { Reward } from '../state/types';
import { useAppStore } from '../state/useAppStore';
import { EffortLabel } from './EffortLabel';
import { useAvgCoinsPerRound } from '../state/selectors';

interface NextGoalCardProps {
  reward: Reward;
  rank: number;
}

export const NextGoalCard: React.FC<NextGoalCardProps> = ({ reward, rank }) => {
  const balance = useAppStore((s) => s.balance);
  const avgPerRound = useAppStore(useAvgCoinsPerRound);
  const pinGoal = useAppStore((s) => s.pinGoal);
  const logEvent = useAppStore((s) => s.logEvent);
  
  const handlePin = () => {
    pinGoal(reward.id);
    logEvent({
      event_name: 'next_goal_selected',
      reward_id: reward.id,
      suggestion_rank: rank,
      source: 'user',
    });
  };

  return (
    <div 
      className="bg-[var(--surface)] p-3 rounded-xl shadow-sm border border-[var(--border)] flex gap-3 items-center cursor-pointer active:scale-95 transition-transform"
      onClick={handlePin}
    >
      <div 
        className="w-12 h-12 rounded-lg flex shrink-0 items-center justify-center text-white font-bold text-xl"
        style={{ backgroundColor: reward.brandColor }}
      >
        {reward.brand.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[var(--text)] font-bold text-sm truncate">{reward.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-[var(--accent-coin)] text-xs">🪙 {reward.priceCoins}</span>
          <span className="text-[var(--muted)] text-[10px]">•</span>
          <EffortLabel price={reward.priceCoins} balance={balance} avgPerRound={avgPerRound} />
        </div>
      </div>
    </div>
  );
};
