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
  const isRedeemed = useAppStore((s) => s.session.redemptionsThisSession.includes(reward.id));
  
  const state = rewardState(reward.priceCoins, balance);

  return (
    <div 
      className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--muted)]/20 shadow-sm cursor-pointer flex flex-col justify-between h-full relative overflow-visible"
      onClick={() => onClick(reward.id)}
    >
      <div>
        <div className="flex items-start justify-between gap-1 mb-2">
          <div 
            className="w-10 h-10 rounded-md shrink-0 flex items-center justify-center text-white font-bold mr-1"
            style={{ backgroundColor: reward.brandColor }}
          >
            {reward.brand.charAt(0)}
          </div>
          {isRedeemed ? (
            <div className="shrink-0 pt-0.5 overflow-visible">
              <span 
                style={{ fontSize: '10px', padding: '2px 6px', whiteSpace: 'nowrap' }}
                className="rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-600 text-zinc-200 inline-block text-center whitespace-nowrap shrink-0 leading-none"
              >
                Redeemed
              </span>
            </div>
          ) : variant === 'goal' ? (
            <div className="shrink-0 pt-0.5 overflow-visible">
              <StateBadge state={state} />
            </div>
          ) : null}
        </div>
        
        <div>
          <h4 className="text-[var(--text)] font-bold text-sm leading-tight">{reward.title}</h4>
          <p className="text-[var(--muted)] text-[10px] mt-0.5">{reward.brand}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-2 flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="font-bold text-[var(--accent-coin)] text-sm">🪙 {reward.priceCoins}</span>
        </div>
        
        {isRedeemed ? (
          <div className="mt-0.5 text-[10px] text-[var(--muted)] font-medium">
            Claimed in this session
          </div>
        ) : variant === 'goal' ? (
          <div className="mt-0.5">
            <EffortLabel price={reward.priceCoins} balance={balance} avgPerRound={avgPerRound} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
