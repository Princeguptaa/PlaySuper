import React, { useEffect, useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';
import { rankWithinReach } from '../lib/economy';
import { GoalCard } from '../components/GoalCard';
import { RewardCard } from '../components/RewardCard';
import { CategoryChips } from '../components/CategoryChips';
import { RewardCategory } from '../state/types';
import { WalletPill } from '../components/WalletPill';

export const StoreHome: React.FC = () => {
  const { balance, goalId, navigate, logEvent, ui } = useAppStore();
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

  const session = useAppStore((s) => s.session);

  // Track rewards shown in rails above All Rewards grid to prevent duplicates across rails
  const shownIds = new Set<string>();
  if (goalReward) {
    shownIds.add(goalReward.id);
  }

  // Quick wins: exclude goal, redeemed rewards in this session, and anything already shown
  const quickWinRewards = SEED_CATALOGUE.filter(
    (r) => r.tag === 'quick_win' && !shownIds.has(r.id) && !session.redemptionsThisSession.includes(r.id)
  );
  quickWinRewards.forEach((r) => shownIds.add(r.id));

  // Within reach: exclude goal, quick wins, redeemed rewards in this session, and anything already shown
  const allWithinReach = rankWithinReach(
    SEED_CATALOGUE,
    balance,
    goalReward ? goalReward.category : null,
    []
  );
  const withinReachRewards = allWithinReach.filter(
    (r) => !shownIds.has(r.id) && !session.redemptionsThisSession.includes(r.id)
  );
  withinReachRewards.forEach((r) => shownIds.add(r.id));

  const filteredGrid = selectedCategory === 'All'
    ? SEED_CATALOGUE
    : SEED_CATALOGUE.filter((r) => r.category === selectedCategory);

  const renderRail = (title: string, rewards: typeof SEED_CATALOGUE) => {
    if (rewards.length === 0) return null;
    const railId = title === 'Quick Wins' ? 'rail-quick-wins' : undefined;
    return (
      <div id={railId} className="mb-6 scroll-mt-4">
        <h3 className="text-[var(--text)] font-bold mb-3 px-4">{title}</h3>
        <div 
          className="flex items-stretch overflow-x-auto gap-3 px-4 pb-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {rewards.map((reward) => (
            <div key={reward.id} className="w-[140px] shrink-0 flex flex-col">
              <RewardCard reward={reward} onClick={handleRewardClick} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-full bg-[var(--bg)] overflow-hidden">
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
        <div className="p-4">
          <GoalCard reward={goalReward} onSelect={handleGoalSelect} />
        </div>

        {selectedCategory === 'All' && (
          <>
            {renderRail('Quick Wins', quickWinRewards)}
            {renderRail('Within Reach', withinReachRewards)}
          </>
        )}

        <div className="sticky top-0 bg-[var(--bg)]/90 backdrop-blur z-10 border-b border-[var(--muted)]/20 pb-2 mb-4">
          <CategoryChips selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        <div className="px-4">
          <h3 className="text-[var(--text)] font-bold mb-3">All Rewards</h3>
          <div className="grid grid-cols-2 gap-3 items-stretch">
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
