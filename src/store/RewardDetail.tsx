import React, { useEffect } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';
import { EffortLabel } from '../components/EffortLabel';
import { useAvgCoinsPerRound } from '../state/selectors';
import { Button } from '../components/Button';

export const RewardDetail: React.FC = () => {
  const { balance, goalId, pinGoal, navigate, logEvent, ui } = useAppStore();
  const avgPerRound = useAppStore(useAvgCoinsPerRound);
  
  const reward = SEED_CATALOGUE.find((r) => r.id === ui.selectedRewardId);

  useEffect(() => {
    if (reward) {
      logEvent({
        event_name: 'pdp_viewed',
        reward_id: reward.id,
        source: 'user',
      });
    }
  }, [reward, logEvent]);

  if (!reward) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[var(--bg)] text-[var(--text)]">
        <p>Reward not found</p>
        <Button onClick={() => navigate('store_home')} className="mt-4">Back</Button>
      </div>
    );
  }

  const isRedeemed = useAppStore((s) => s.session.redemptionsThisSession.includes(reward.id));
  const isAffordable = balance >= reward.priceCoins;
  const isPinned = goalId === reward.id;

  const handleEarnMore = () => {
    const remaining = Math.max(reward.priceCoins - balance, 0);
    const roundsNeeded = Math.ceil(remaining / avgPerRound);
    logEvent({
      event_name: 'earn_cta_clicked',
      remaining_coins: remaining,
      rounds_needed: roundsNeeded,
      source: 'user',
    });
    navigate('game');
  };

  const handleRedeem = () => {
    // Navigate to RedeemSheet in phase 4. For now, just navigate back.
    navigate('redeem_sheet');
  };

  const togglePin = () => {
    pinGoal(isPinned ? null : reward.id);
  };

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg)] overflow-hidden">
      <header className="flex justify-between items-center p-4">
        <button
          onClick={() => navigate('store_home')}
          className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--text)]"
        >
          ←
        </button>
        <span className="font-bold text-[var(--accent-coin)]">🪙 {balance}</span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div 
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mb-4 mx-auto"
          style={{ backgroundColor: reward.brandColor }}
        >
          {reward.brand.charAt(0)}
        </div>
        
        <div className="text-center mb-6">
          <p className="text-[var(--muted)] text-sm">{reward.brand}</p>
          <h2 className="text-[var(--text)] font-bold text-2xl">{reward.title}</h2>
          <p className="text-[var(--success)] font-medium mt-1">Value: ₹{reward.valueInr}</p>
          {isRedeemed && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-600 text-zinc-200 mt-2">
              Redeemed
            </span>
          )}
        </div>

        <div className="bg-[var(--surface)] rounded-xl p-4 mb-4 border border-[var(--border)]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[var(--text)] font-bold">Price</span>
            <span className="text-[var(--accent-coin)] font-bold text-lg">🪙 {reward.priceCoins}</span>
          </div>
          <div className="h-2 bg-[var(--bg)] rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-[var(--primary)] transition-all"
              style={{ width: `${Math.min((balance / reward.priceCoins) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <EffortLabel id="tour-step-3" price={reward.priceCoins} balance={balance} avgPerRound={avgPerRound} />
          </div>
        </div>

        <div className="mb-4">
          <Button variant="secondary" className="w-full" onClick={togglePin}>
            {isPinned ? 'Unpin goal' : 'Pin as goal'}
          </Button>
        </div>

        <div className="text-[var(--text)] text-sm">
          <div className="mb-4">
            <h4 className="font-bold mb-1">Details</h4>
            <p className="text-[var(--muted)]">Type: <span className="capitalize">{reward.type}</span></p>
            <p className="text-[var(--muted)]">Validity: {reward.validityDays} days</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold mb-1">How to use</h4>
            <ul className="list-disc pl-5 text-[var(--muted)] space-y-1">
              {reward.howToUse.map((step, idx) => <li key={idx}>{step}</li>)}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-1">Terms & Conditions</h4>
            <ul className="list-disc pl-5 text-[var(--muted)] space-y-1">
              {reward.terms.map((term, idx) => <li key={idx}>{term}</li>)}
            </ul>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg)] border-t border-[var(--border)] z-10">
        <div className="w-full mx-auto">
          {isRedeemed ? (
            <Button variant="secondary" className="w-full opacity-50 cursor-not-allowed" disabled>
              Redeemed
            </Button>
          ) : isAffordable ? (
            <Button variant="primary" className="w-full" onClick={handleRedeem}>
              Redeem
            </Button>
          ) : (
            <Button variant="primary" className="w-full" onClick={handleEarnMore}>
              Earn {reward.priceCoins - balance} more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
