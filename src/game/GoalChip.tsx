import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { useGoalReward } from '../state/selectors';


export const GoalChip: React.FC = () => {
  const goalId = useAppStore(state => state.goalId);
  const balance = useAppStore(state => state.balance);
  const variant = useAppStore(state => state.ui.variant);
  
  // HUD Goal Chip is a Goal variant feature only
  const goalReward = useAppStore(state => useGoalReward(state));

  if (variant === 'classic' || !goalId || !goalReward) {
    return null;
  }

  const remaining = Math.max(0, goalReward.priceCoins - balance);
  const progress = Math.min(100, (balance / goalReward.priceCoins) * 100);

  return (
    <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-surface cursor-pointer"
         onClick={() => useAppStore.getState().navigate('store_home')}>
      <div 
        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
        style={{ backgroundColor: goalReward.brandColor }}
      >
        {goalReward.brand.charAt(0)}
      </div>
      <div className="flex flex-col gap-0.5 min-w-[60px]">
        <div className="text-[10px] text-muted leading-none">Goal</div>
        {remaining > 0 ? (
          <div className="text-xs font-bold text-text leading-none">{remaining} to go</div>
        ) : (
          <div className="text-xs font-bold text-success leading-none">Ready!</div>
        )}
      </div>
      <div className="w-8 h-1.5 bg-background rounded-full overflow-hidden shrink-0">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
