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
  
  const minPrice = Math.min(...SEED_CATALOGUE.map(r => r.priceCoins * priceMultiplier));
  const everydayPrice = SEED_CATALOGUE.find(r => r.id === 'r01')?.priceCoins || 250;
  const everydayAdjusted = everydayPrice * priceMultiplier;
  
  const roundsToFirst = Math.ceil(minPrice / coinsPerRound);
  const daysToFirst = +(roundsToFirst / roundsPerDay).toFixed(1);
  const daysToEveryday = +(everydayAdjusted / dailyEarn).toFixed(1);
  
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
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4 space-y-4">
      <h3 className="font-bold flex justify-between items-center">
        Economy Simulator
        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">Demo economy</span>
      </h3>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#a1a1aa]">Avg Coins / Round</span>
            <span>{coinsPerRound}</span>
          </div>
          <input 
            type="range" min="10" max="150" value={coinsPerRound} 
            onChange={(e) => setCoinsPerRound(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#a1a1aa]">Price Multiplier</span>
            <span>{priceMultiplier.toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.5" max="3.0" step="0.1" value={priceMultiplier} 
            onChange={(e) => setPriceMultiplier(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#a1a1aa]">Rounds / Day</span>
            <span>{roundsPerDay}</span>
          </div>
          <input 
            type="range" min="1" max="50" value={roundsPerDay} 
            onChange={(e) => setRoundsPerDay(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>
      
      <div className="bg-background/50 rounded p-3 text-sm grid grid-cols-2 gap-y-2">
        <div className="text-[#a1a1aa]">Daily Earn:</div>
        <div className="text-right font-mono">{dailyEarn}</div>
        
        <div className="text-[#a1a1aa]">First Reward in:</div>
        <div className="text-right font-mono">{daysToFirst} days ({roundsToFirst} rnds)</div>
        
        <div className="text-[#a1a1aa]">Everyday (Zomato) in:</div>
        <div className="text-right font-mono">{daysToEveryday} days</div>
      </div>
      
      <button 
        onClick={handleSimulateRound}
        className="w-full bg-surface hover:bg-surface/80 text-white rounded py-2 text-sm font-medium transition-colors"
      >
        Simulate round (+{coinsPerRound})
      </button>
    </div>
  );
};
