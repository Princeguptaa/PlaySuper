import React, { useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { SEED_CATALOGUE } from '../lib/seed';

export const Simulator: React.FC = () => {
  const [coinsPerRound, setCoinsPerRound] = useState(70);
  const [priceMultiplier, setPriceMultiplier] = useState(1.0);
  const [roundsPerDay, setRoundsPerDay] = useState(15);
  
  const earnCoins = useAppStore(state => state.earnCoins);
  const logEvent = useAppStore(state => state.logEvent);

  // Derive outputs
  const dailyEarn = coinsPerRound * roundsPerDay;
  
  const cheapestPrice = Math.min(...SEED_CATALOGUE.map(r => r.priceCoins));
  const everydayPrices = SEED_CATALOGUE
    .map(r => r.priceCoins)
    .filter(p => p >= 400 && p <= 900)
    .sort((a, b) => a - b);
  
  const mid = Math.floor(everydayPrices.length / 2);
  const medianEverydayPrice = everydayPrices.length === 0
    ? 650
    : everydayPrices.length % 2 !== 0
      ? everydayPrices[mid]
      : (everydayPrices[mid - 1] + everydayPrices[mid]) / 2;

  const n = Math.ceil((cheapestPrice * priceMultiplier) / coinsPerRound);
  const timeToFirstReward = `${n} rounds (~${n * 0.5} min)`;
  const daysToEverydayTier = ((medianEverydayPrice * priceMultiplier) / (coinsPerRound * roundsPerDay)).toFixed(1);
  
  // Simulation uses actual economy params but allows testing "what if"
  const handleSimulateRound = () => {
    earnCoins(coinsPerRound, 'simulated_round');
    logEvent({
      event_name: 'round_completed',
      source: 'simulated',
      hits: 0,
      longest_combo: 0,
      coins_earned: coinsPerRound,
      goal_id: null,
      rounds_needed: 0
    });
  };

  return (
    <div className="bg-[var(--lens-surface)] border border-[var(--lens-border)] text-[var(--lens-text)] rounded-xl p-4 my-4 space-y-4">
      <h3 className="font-bold flex justify-between items-center text-[var(--lens-text)]">
        Economy Simulator
        <span className="text-[10px] bg-[var(--lens-primary)]/20 text-[#c4b5fd] px-2 py-0.5 rounded font-medium">Demo economy</span>
      </h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--lens-muted)]">Avg Coins / Round</span>
            <span className="text-[var(--lens-text)] font-semibold">{coinsPerRound}</span>
          </div>
          <input 
            type="range" min="10" max="150" value={coinsPerRound} 
            onChange={(e) => setCoinsPerRound(Number(e.target.value))}
            className="w-full accent-[var(--lens-primary)]"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--lens-muted)]">Price Multiplier</span>
            <span className="text-[var(--lens-text)] font-semibold">{priceMultiplier.toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.5" max="3.0" step="0.1" value={priceMultiplier} 
            onChange={(e) => setPriceMultiplier(Number(e.target.value))}
            className="w-full accent-[var(--lens-primary)]"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--lens-muted)]">Rounds / Day</span>
            <span className="text-[var(--lens-text)] font-semibold">{roundsPerDay}</span>
          </div>
          <input 
            type="range" min="1" max="50" value={roundsPerDay} 
            onChange={(e) => setRoundsPerDay(Number(e.target.value))}
            className="w-full accent-[var(--lens-primary)]"
          />
        </div>
      </div>
      
      <div className="bg-[var(--lens-bg)] border border-[var(--lens-border)] rounded p-3 text-sm space-y-2">
        <div className="flex justify-between items-center gap-2">
          <span className="text-[var(--lens-muted)]">Daily earn</span>
          <span className="text-right font-mono font-medium text-[var(--lens-text)]">{dailyEarn}</span>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <span className="text-[var(--lens-muted)]">Time to first reward</span>
          <span className="text-right font-mono font-medium text-[var(--lens-text)]">{timeToFirstReward}</span>
        </div>
        
        <div className="flex justify-between items-center gap-2">
          <span className="text-[var(--lens-muted)]">Days to Everyday tier (400-900 coins)</span>
          <span className="text-right font-mono font-medium text-[var(--lens-text)]">{daysToEverydayTier}</span>
        </div>
      </div>
      
      <button 
        onClick={handleSimulateRound}
        className="w-full bg-[var(--lens-surface)] text-white border border-[var(--lens-border)] hover:bg-[#22253a] rounded py-2 text-sm font-bold transition-colors"
      >
        Simulate round (+{coinsPerRound})
      </button>
    </div>
  );
};
