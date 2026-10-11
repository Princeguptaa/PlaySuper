import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../state/useAppStore';
import { Button } from '../components/Button';
import { NudgeResult } from './NudgeEngine';

interface NudgeCardProps {
  nudge: NudgeResult;
  onDismiss: () => void;
  inline?: boolean;
}

export const NudgeCard: React.FC<NudgeCardProps> = ({ nudge, onDismiss, inline = false }) => {
  const logEvent = useAppStore(state => state.logEvent);
  const navigate = useAppStore(state => state.navigate);
  const shownLogged = useRef(false);

  useEffect(() => {
    if (!shownLogged.current) {
      // Log nudge shown
      logEvent({
        event_name: 'nudge_shown',
        nudge_type: nudge.type,
        goal_id: nudge.reward.id,
        remaining_coins: Math.max(0, nudge.reward.priceCoins - useAppStore.getState().balance),
        source: 'user',
      });

      // Increment shown counter
      useAppStore.setState(state => ({
        session: {
          ...state.session,
          nudgesShown: state.session.nudgesShown + 1
        }
      }));
      shownLogged.current = true;
    }
  }, [nudge, logEvent]);

  const handleDismiss = () => {
    logEvent({
      event_name: 'nudge_dismissed',
      nudge_type: nudge.type,
      goal_id: nudge.reward.id,
      remaining_coins: Math.max(0, nudge.reward.priceCoins - useAppStore.getState().balance),
      source: 'user',
    });

    useAppStore.setState(state => ({
      session: {
        ...state.session,
        nudgesDismissed: state.session.nudgesDismissed + 1
      }
    }));
    onDismiss();
  };

  const handlePrimaryClick = () => {
    logEvent({
      event_name: 'nudge_clicked',
      nudge_type: nudge.type,
      goal_id: nudge.reward.id,
      remaining_coins: Math.max(0, nudge.reward.priceCoins - useAppStore.getState().balance),
      source: 'user',
    });

    if (nudge.type === 'N1_NEAR_GOAL') {
      // Play again -> dismisses nudge, starts round
      onDismiss();
      useAppStore.setState({ ui: { ...useAppStore.getState().ui, screen: 'game' } });
    } else if (nudge.type === 'N2_UNLOCK') {
      // Claim -> opens RewardDetail
      useAppStore.setState({ ui: { ...useAppStore.getState().ui, selectedRewardId: nudge.reward.id } });
      navigate('reward_detail');
    } else if (nudge.type === 'N3_FIRST_GOAL') {
      // Browse rewards -> opens Store Home on the Quick wins rail
      navigate('store_home');
      setTimeout(() => {
        const el = document.getElementById('rail-quick-wins');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSecondaryClick = () => {
    logEvent({
      event_name: 'nudge_clicked',
      nudge_type: nudge.type,
      goal_id: nudge.reward.id,
      remaining_coins: Math.max(0, nudge.reward.priceCoins - useAppStore.getState().balance),
      source: 'user',
    });

    if (nudge.type === 'N1_NEAR_GOAL') {
      // Open store
      navigate('store_home');
    } else if (nudge.type === 'N2_UNLOCK') {
      // Keep playing
      onDismiss();
      useAppStore.setState({ ui: { ...useAppStore.getState().ui, screen: 'game' } });
    }
  };

  const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { y: inline ? 10 : 20, opacity: 0 }}
      animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
      style={{ position: inline ? 'relative' : 'absolute' }}
      className={
        inline
          ? "relative w-full bg-[var(--bg)] p-3.5 rounded-xl border border-[var(--primary)]/50 z-10 flex flex-col gap-2.5 mb-3"
          : "absolute bottom-6 left-4 right-4 bg-[var(--surface)] p-4 rounded-xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] border border-[var(--primary)]/50 z-50 flex flex-col gap-3"
      }
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-md flex shrink-0 items-center justify-center text-white font-bold"
            style={{ backgroundColor: nudge.reward.brandColor }}
          >
            {nudge.reward.brand.charAt(0)}
          </div>
          <p className="text-[var(--text)] font-medium text-sm leading-snug">
            {nudge.message}
          </p>
        </div>
        <button 
          onClick={handleDismiss}
          className="w-6 h-6 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] shrink-0"
        >
          ✕
        </button>
      </div>
      
      <div className="flex gap-2 mt-1">
        {nudge.type === 'N1_NEAR_GOAL' && (
          <>
            <Button variant="primary" className="flex-1 py-2 text-sm" onClick={handlePrimaryClick}>Play again</Button>
            <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={handleSecondaryClick}>Open store</Button>
          </>
        )}
        {nudge.type === 'N2_UNLOCK' && (
          <>
            <Button variant="primary" className="flex-1 py-2 text-sm" onClick={handlePrimaryClick}>Claim</Button>
            <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={handleSecondaryClick}>Keep playing</Button>
          </>
        )}
        {nudge.type === 'N3_FIRST_GOAL' && (
          <Button variant="primary" className="w-full py-2 text-sm" onClick={handlePrimaryClick}>Pick a goal</Button>
        )}
      </div>
    </motion.div>
  );
};
