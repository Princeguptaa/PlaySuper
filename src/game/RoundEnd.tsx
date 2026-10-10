import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../state/useAppStore';
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

    const evaluatedNudge = evaluateNudge(useAppStore.getState());
    if (evaluatedNudge) {
      setNudge(evaluatedNudge);
    }
  }, [hits, combo, coinsEarned]);

  return (
    <motion.div 
      initial={reducedMotion ? { opacity: 1 } : { y: '100%' }}
      animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
      className="absolute bottom-0 inset-x-0 bg-[var(--surface)] rounded-t-[32px] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50 flex flex-col"
    >
      <div className="w-12 h-1.5 bg-[var(--muted)]/30 rounded-full mx-auto mb-6" />
      
      <h2 className="text-2xl font-display font-bold text-[var(--text)] text-center mb-6">Round Over!</h2>
      
      <div className="flex justify-between items-center bg-[var(--bg)] rounded-2xl p-4 mb-6">
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
      
      <div className="text-center mb-8">
        <span className="text-[var(--muted)] text-sm block mb-2">You earned</span>
        <div className="text-5xl font-display font-bold text-[var(--accent-coin)]">
          +{coinsEarned}
        </div>
      </div>
      
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

      {nudge && (
        <NudgeCard nudge={nudge} onDismiss={() => setNudge(null)} />
      )}
    </motion.div>
  );
};

