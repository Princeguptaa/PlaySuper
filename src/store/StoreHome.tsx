import React, { useEffect, useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';
import { rankWithinReach } from '../lib/economy';
import { GoalCard } from '../components/GoalCard';
import { RewardCard } from '../components/RewardCard';
import { CategoryChips } from '../components/CategoryChips';
import { RewardCategory } from '../state/types';
import { WalletPill } from '../components/WalletPill';
import { VariantToggle } from './VariantToggle';

export const StoreHome: React.FC = () => {
  const { balance, goalId, navigate, logEvent, orders, ui } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'All'>('All');
  const [openTime] = useState(Date.now());

  useEffect(() => {
    logEvent({
      event_name: 'store_opened',
      entry_point: ui.screen,
      has_goal: !!goalId,
      source: 'user',
    });

    return () => {
      const timeInStoreSec = Math.floor((Date.now() - openTime) / 1000);
      logEvent({
        event_name: 'store_closed',
        return_to_game: true,
        time_in_store_sec: timeInStoreSec,
        source: 'user',
      });
    };
  }, []);

  const handleClose = () => {
    navigate('game');
  };

  const goalReward = goalId ? SEED_CATALOGUE.find((r) => r.id === goalId) || null : null;

  const handleGoalSelect = () => {
    if (goalReward) {
      useAppStore.setState({ ui: { ...useAppStore.getState().ui, selectedRewardId: goalId } });
      navigate('reward_detail');
    }
  };

  const handleRewardClick = (id: string) => {
    logEvent({
      event_name: 'reward_impression',
      reward_id: id,
      source: 'user',
    });
    logEvent({
      event_name: 'reward_clicked',
      reward_id: id,
      source: 'user',
    });
    useAppStore.setState({ ui: { ...useAppStore.getState().ui, selectedRewardId: id } });
    navigate('reward_detail');
  };

  const withinReachRewards = rankWithinReach(
    SEED_CATALOGUE,
    balance,
    goalReward ? goalReward.category : null,
    []
  );

  const quickWinRewards = SEED_CATALOGUE.filter((r) => r.tag === 'quick_win');

  const filteredGrid = selectedCategory === 'All'
    ? SEED_CATALOGUE
    : SEED_CATALOGUE.filter((r) => r.category === selectedCategory);

  const hasRedemptions = orders.length > 0;

  const renderRail = (title: string, rewards: typeof SEED_CATALOGUE) => {
    if (rewards.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-[var(--text)] font-bold mb-3 px-4">{title}</h3>
        <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar">
          {rewards.map((reward) => (
            <div key={reward.id} className="w-[140px] shrink-0">
              <RewardCard reward={reward} onClick={handleRewardClick} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)] overflow-hidden">
      <header className="flex justify-between items-center p-4 border-b border-[var(--muted)]/20">
        <WalletPill />
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--muted)]/30 flex items-center justify-center text-[var(--text)]"
        >
          ✕
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-10">
        <VariantToggle />
        <div className="p-4">
          <GoalCard reward={goalReward} onSelect={handleGoalSelect} />
        </div>

        {selectedCategory === 'All' && (
          <>
            {hasRedemptions ? (
              <>
                {renderRail('Within Reach', withinReachRewards)}
                {renderRail('Quick Wins', quickWinRewards)}
              </>
            ) : (
              <>
                {renderRail('Quick Wins', quickWinRewards)}
                {renderRail('Within Reach', withinReachRewards)}
              </>
            )}
          </>
        )}

        <div className="sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-10 border-b border-[var(--muted)]/20 pb-2 mb-4">
          <CategoryChips selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="px-4">
          <h3 className="text-[var(--text)] font-bold mb-3">All Rewards</h3>
          <div className="grid grid-cols-2 gap-3">
            {filteredGrid.map((reward) => (
              <RewardCard key={reward.id} reward={reward} onClick={handleRewardClick} />
            ))}
          </div>
        </div>
        
        <div className="px-4 py-8 text-center opacity-60">
          <p className="text-[10px] text-[var(--muted)]">Brand names are illustrative only. This is a prototype.</p>
        </div>
      </main>
    </div>
  );
};
