import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../state/useAppStore';
import { useGoalReward, useAvgCoinsPerRound } from '../state/selectors';
import { effortETA } from '../lib/economy';
import { motion } from 'framer-motion';
import { evaluateNudge, NudgeResult } from '../nudges/NudgeEngine';
import { NudgeCard } from '../nudges/NudgeCard';

interface RoundEndProps {
  hits: number;
  combo: number;
  coinsEarned: number;
  onPlayAgain: () => void;
  onOpenStore: () => void;
}

export const RoundEnd: React.FC<RoundEndProps> = ({ hits, combo, coinsEarned, onPlayAgain, onOpenStore }) => {
  const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const [nudge, setNudge] = useState<NudgeResult | null>(null);
  const hasLoggedRef = useRef(false);

  const balance = useAppStore((s) => s.balance);
  const goalReward = useAppStore(useGoalReward);
  const avgPerRound = useAppStore(useAvgCoinsPerRound);

  useEffect(() => {
    if (hasLoggedRef.current) return;
    hasLoggedRef.current = true;

    useAppStore.getState().logEvent({
      event_name: 'round_completed',
      source: 'user',
      hits,
      combo,
      coins_earned: coinsEarned
    });

    const evaluatedNudge = evaluateNudge(useAppStore.getState(), coinsEarned);
    if (evaluatedNudge) {
      if (coinsEarned === 0 && evaluatedNudge.type === 'N3_FIRST_GOAL') {
        setNudge(null);
      } else {
        setNudge(evaluatedNudge);
      }
    }
  }, [hits, combo, coinsEarned]);

  const remainingCoins = goalReward ? Math.max(0, goalReward.priceCoins - balance) : 0;
  const goalProgressPct = goalReward ? Math.min(100, Math.floor((balance / goalReward.priceCoins) * 100)) : 0;

  return (
    <motion.div 
      initial={reducedMotion ? { opacity: 1 } : { y: '100%' }}
      animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
      className="absolute bottom-0 inset-x-0 bg-[var(--surface)] rounded-t-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 flex flex-col max-h-[92%] overflow-y-auto"
    >
      <div className="w-12 h-1.5 bg-[var(--muted)]/30 rounded-full mx-auto mb-4" />
      
      <h2 className="text-2xl font-display font-bold text-[var(--text)] text-center mb-4">Round Over!</h2>
      
      <div className="flex justify-between items-center bg-[var(--bg)] rounded-2xl p-4 mb-4">
        <div className="flex flex-col items-center flex-1">
          <span className="text-[var(--muted)] text-sm mb-1">Hits</span>
          <span className="text-xl font-bold text-[var(--text)]">{hits}</span>
        </div>
        <div className="w-px h-8 bg-[var(--surface)]" />
        <div className="flex flex-col items-center flex-1">
          <span className="text-[var(--muted)] text-sm mb-1">Best Combo</span>
          <span className="text-xl font-bold text-[var(--text)]">x{combo}</span>
        </div>
      </div>
      
      <div className="text-center mb-4">
        {hits === 0 ? (
          <p className="text-base font-medium text-[var(--muted)] px-4 py-2">
            No hits this round. Tap the orbs to earn coins.
          </p>
        ) : (
          <>
            <span className="text-[var(--muted)] text-sm block mb-1">You earned</span>
            <div className="text-4xl font-display font-bold text-[var(--accent-coin)]">
              +{coinsEarned}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-[var(--muted)]">
        <span>Current balance:</span>
        <span className="font-bold text-[var(--accent-coin)]">🪙 {balance}</span>
      </div>

      {goalReward && (
        <div className="bg-[var(--bg)] rounded-xl p-3.5 mb-4 border border-[var(--muted)]/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ backgroundColor: goalReward.brandColor }}
              >
                {goalReward.brand.charAt(0)}
              </div>
              <span className="text-xs font-bold text-[var(--text)] truncate max-w-[150px]">
                {goalReward.title}
              </span>
            </div>
            <span className="text-xs font-bold text-[var(--accent-coin)]">
              {remainingCoins === 0 ? 'Ready to claim' : `${remainingCoins} coins left`}
            </span>
          </div>

          <div className="h-2 bg-[var(--surface)] rounded-full overflow-hidden mb-1.5">
            <div 
              className="h-full bg-[var(--primary)] transition-all"
              style={{ width: `${goalProgressPct}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-[var(--muted)] font-medium">
            <span>🪙 {balance} / {goalReward.priceCoins}</span>
            <span>{effortETA(goalReward.priceCoins, balance, avgPerRound)}</span>
          </div>
        </div>
      )}

      {nudge && (
        <NudgeCard nudge={nudge} inline onDismiss={() => setNudge(null)} />
      )}

      <div className="flex flex-col gap-3">
        <button 
          onClick={onPlayAgain}
          className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-bold text-lg active:scale-95 transition-transform"
        >
          Play Again
        </button>
        <button 
          onClick={onOpenStore}
          className="w-full py-4 rounded-xl bg-[var(--bg)] text-[var(--text)] font-bold text-lg border border-[var(--surface)] active:scale-95 transition-transform"
        >
          Open Store
        </button>
      </div>
    </motion.div>
  );
};

