import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { Button } from '../components/Button';
import { SEED_CATALOGUE } from '../lib/seed';

export const ClassicConfirmation: React.FC = () => {
  const { navigate, orders, ui, logEvent } = useAppStore();
  
  const lastOrder = [...orders].reverse().find(o => o.rewardId === ui.selectedRewardId);
  const reward = SEED_CATALOGUE.find(r => r.id === ui.selectedRewardId);

  if (!lastOrder || !reward) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[var(--bg)] text-[var(--text)] p-4">
        <p>No order found</p>
        <Button onClick={() => navigate('game')} className="mt-4">Back</Button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(lastOrder.code).catch(() => {});
    logEvent({
      event_name: 'coupon_copied',
      reward_id: reward.id,
      source: 'user',
    });
  };

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg)] overflow-hidden text-[var(--text)]">
      <header className="p-4 flex justify-between items-center border-b border-[var(--muted)]/20">
        <h2 className="font-bold">Confirmation</h2>
        <button
          onClick={() => navigate('store_home')}
          className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center"
        >
          ✕
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center pb-24">
        <div className="w-16 h-16 rounded-full bg-[var(--success)] flex items-center justify-center text-white mb-6">
          ✓
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Redemption Successful!</h1>
        <p className="text-[var(--muted)] mb-8 text-center">
          You have redeemed {reward.title} from {reward.brand}.
        </p>

        <div className="w-full bg-[var(--surface)] rounded-xl p-6 flex flex-col items-center border border-[var(--muted)]/20">
          <p className="text-sm text-[var(--muted)] mb-2">Your Coupon Code</p>
          <div className="text-2xl font-mono font-bold tracking-wider mb-4">
            {lastOrder.code}
          </div>
          <Button variant="secondary" onClick={handleCopy}>
            Copy Code
          </Button>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg)] border-t border-[var(--muted)]/20 z-10">
        <div className="w-full mx-auto">
          <Button variant="primary" className="w-full" onClick={() => navigate('game')}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
