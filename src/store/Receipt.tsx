import React, { useEffect, useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';
import { nextGoalSuggestions } from '../lib/economy';
import { NextGoalCard } from '../components/NextGoalCard';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';

export const Receipt: React.FC = () => {
  const { orders, navigate, logEvent, session } = useAppStore();
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomBarRef = React.useRef<HTMLDivElement>(null);
  const [bottomBarHeight, setBottomBarHeight] = useState(80);

  const lastOrder = orders[orders.length - 1];
  const reward = SEED_CATALOGUE.find(r => r.id === lastOrder?.rewardId);

  useEffect(() => {
    if (bottomBarRef.current) {
      setBottomBarHeight(bottomBarRef.current.offsetHeight);
    }
  }, []);
  
  useEffect(() => {
    if (!lastOrder) {
      navigate('store_home');
    }
  }, [lastOrder, navigate]);
  
  if (!reward || !lastOrder) return null;
  
  const suggestions = nextGoalSuggestions(
    SEED_CATALOGUE, 
    reward, 
    session.redemptionsThisSession
  );
  
  const handleReveal = () => {
    if (!codeRevealed) {
      setCodeRevealed(true);
      logEvent({
        event_name: 'reward_revealed',
        reward_id: reward.id,
        source: 'user',
      });
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(lastOrder.code);
    setCopied(true);
    logEvent({
      event_name: 'coupon_copied',
      reward_id: reward.id,
      source: 'user',
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleBackToGame = () => {
    logEvent({
      event_name: 'store_closed',
      return_to_game: true,
      source: 'user',
    });
    navigate('game');
  };
  
  return (
    <div className="relative flex flex-col h-full bg-[var(--bg)] overflow-hidden">
      <div 
        className="flex-1 overflow-y-auto p-6"
        style={{ paddingBottom: `${bottomBarHeight + 16}px` }}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent-coin)] p-1 rounded-2xl mb-8"
        >
          <div className="bg-[var(--surface)] rounded-[14px] p-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-[var(--text)] font-bold text-xl mb-1">Reward Unlocked!</h2>
            <p className="text-[var(--muted)] text-sm mb-6">You've spent 🪙 {lastOrder.priceCoins}</p>
            
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3" style={{ backgroundColor: reward.brandColor }}>
              {reward.brand.charAt(0)}
            </div>
            <p className="text-[var(--muted)] text-sm font-medium">{reward.brand}</p>
            <h3 className="text-[var(--text)] font-bold text-lg mb-6">{reward.title}</h3>
            
            <div 
              className={`relative border-2 border-dashed ${codeRevealed ? 'border-[var(--success)] bg-[var(--success)]/10' : 'border-[var(--muted)] bg-[var(--muted)]/10'} rounded-xl h-16 flex items-center justify-center overflow-hidden cursor-pointer`}
              onClick={handleReveal}
            >
              {!codeRevealed ? (
                <span className="text-[var(--text)] font-bold">Tap to reveal code</span>
              ) : (
                <div className="flex items-center gap-3 w-full px-4">
                  <span className="text-[var(--text)] font-mono font-bold tracking-wider flex-1 text-center truncate">
                    {lastOrder.code}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                    className="shrink-0 bg-[var(--surface)] p-2 rounded-lg text-sm font-bold text-[var(--primary)]"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            {/* Collapsible How to use and Terms */}
            <div className="mt-4 space-y-2 text-left text-xs border-t border-[var(--border)] pt-3">
              {reward.howToUse && reward.howToUse.length > 0 && (
                <details className="group rounded-lg bg-[var(--bg)]/50 border border-[var(--border)] overflow-hidden">
                  <summary className="cursor-pointer p-2.5 font-bold text-[var(--text)] flex justify-between items-center select-none hover:text-[var(--primary)] transition-colors">
                    <span>How to use</span>
                    <span className="text-[var(--muted)] text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-3 pb-3 pt-1 text-[var(--muted)]">
                    <ul className="list-disc pl-4 space-y-1">
                      {reward.howToUse.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}

              {reward.terms && reward.terms.length > 0 && (
                <details className="group rounded-lg bg-[var(--bg)]/50 border border-[var(--border)] overflow-hidden">
                  <summary className="cursor-pointer p-2.5 font-bold text-[var(--text)] flex justify-between items-center select-none hover:text-[var(--primary)] transition-colors">
                    <span>Terms</span>
                    <span className="text-[var(--muted)] text-[10px] group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-3 pb-3 pt-1 text-[var(--muted)]">
                    <ul className="list-disc pl-4 space-y-1">
                      {reward.terms.map((term, idx) => (
                        <li key={idx}>{term}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}
            </div>
            
            <p className="text-[var(--muted)] text-xs mt-4">Expires in {reward.validityDays} days</p>
          </div>
        </motion.div>
        
        {suggestions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[var(--text)] font-bold mb-4 text-center">What are you playing for next?</h3>
            <div className="space-y-3">
              {suggestions.map((s, idx) => (
                <NextGoalCard key={s.id} reward={s} rank={idx + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div 
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg)] border-t border-[var(--border)] z-10"
      >
        <div className="w-full mx-auto">
          <Button className="w-full" onClick={handleBackToGame}>Back to game</Button>
        </div>
      </div>
    </div>
  );
};
