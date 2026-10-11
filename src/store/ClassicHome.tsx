import React, { useEffect, useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';
import { RewardCard } from '../components/RewardCard';
import { CategoryChips } from '../components/CategoryChips';
import { RewardCategory } from '../state/types';
import { WalletPill } from '../components/WalletPill';
import { BannerCarousel } from './BannerCarousel';

export const ClassicHome: React.FC = () => {
  const { navigate, logEvent, ui } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'All'>('All');
  const [openTime] = useState(Date.now());

  useEffect(() => {
    logEvent({
      event_name: 'store_opened',
      entry_point: ui.screen,
      has_goal: false,
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

  const filteredGrid = selectedCategory === 'All'
    ? SEED_CATALOGUE
    : SEED_CATALOGUE.filter((r) => r.category === selectedCategory);

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
        <BannerCarousel />

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
