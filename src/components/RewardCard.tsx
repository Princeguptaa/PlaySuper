import React from 'react';
import { Reward } from '../state/types';
import { EffortLabel } from './EffortLabel';
import { StateBadge } from './StateBadge';
import { rewardState } from '../lib/economy';
import { useAppStore } from '../state/useAppStore';
import { useAvgCoinsPerRound } from '../state/selectors';

interface RewardCardProps {
  reward: Reward;
  onClick: (id: string) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onClick }) => {
  const balance = useAppStore((s) => s.balance);
  const avgPerRound = useAppStore(useAvgCoinsPerRound);
  const variant = useAppStore((s) => s.ui.variant);
  
  const state = rewardState(reward.priceCoins, balance);

  return (
    <div 
      className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--muted)]/20 shadow-sm cursor-pointer flex flex-col gap-2 relative overflow-hidden"
      onClick={() => onClick(reward.id)}
    >
      {variant === 'goal' && (
        <div className="absolute top-2 right-2">
          <StateBadge state={state} />
        </div>
      )}
      
      <div 
        className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold mb-1"
        style={{ backgroundColor: reward.brandColor }}
      >
        {reward.brand.charAt(0)}
      </div>
      
      <div>
        <h4 className="text-[var(--text)] font-bold text-sm leading-tight">{reward.title}</h4>
        <p className="text-[var(--muted)] text-[10px]">{reward.brand}</p>
      </div>
      
      <div className="flex items-center gap-1 mt-auto pt-2">
        <span className="font-bold text-[var(--accent-coin)] text-sm">🪙 {reward.priceCoins}</span>
      </div>
      
      {variant === 'goal' && (
        <div className="mt-1">
          <EffortLabel price={reward.priceCoins} balance={balance} avgPerRound={avgPerRound} />
        </div>
      )}
    </div>
  );
};
