import React, { useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';
import { Button } from '../components/Button';

export const RedeemSheet: React.FC = () => {
  const { balance, redeemReward, navigate, ui } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const reward = SEED_CATALOGUE.find((r) => r.id === ui.selectedRewardId);
  
  if (!reward) return null;
  
  const balanceAfter = balance - reward.priceCoins;
  
  const handleConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    redeemReward(reward.id);
    navigate('receipt');
  };
  
  return (
    <div className="absolute inset-0 bg-black/60 flex items-end justify-center z-50">
      <div className="bg-[var(--bg)] w-full rounded-t-2xl p-6 pb-10 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[var(--text)] font-bold text-xl">Confirm Redeem</h2>
          <button onClick={() => navigate('reward_detail')} className="w-8 h-8 rounded-full bg-[var(--surface)] text-[var(--text)] font-bold flex items-center justify-center">✕</button>
        </div>
        
        <div className="bg-[var(--surface)] rounded-xl p-4 mb-6 border border-[var(--primary)]/50">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: reward.brandColor }}>
              {reward.brand.charAt(0)}
            </div>
            <div>
              <p className="text-[var(--muted)] text-sm">{reward.brand}</p>
              <h3 className="text-[var(--text)] font-bold text-lg">{reward.title}</h3>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mb-8 text-[var(--text)]">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Current Balance</span>
            <span className="font-bold">🪙 {balance}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Reward Price</span>
            <span className="font-bold text-red-400">- 🪙 {reward.priceCoins}</span>
          </div>
          <div className="h-px bg-[var(--border)] my-2" />
          <div className="flex justify-between">
            <span className="text-[var(--muted)] font-bold">Balance After</span>
            <span className="font-bold text-[var(--success)]">🪙 {balanceAfter}</span>
          </div>
        </div>
        
        {reward.type === 'physical' && (
          <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-sm font-medium text-center">
            Delivery details (coming soon)
          </div>
        )}
        
        <Button 
          className="w-full" 
          onClick={handleConfirm} 
          disabled={isProcessing}
          isLoading={isProcessing}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};
