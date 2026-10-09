import React, { useState, useEffect } from 'react';
import { PulseTap } from './PulseTap';
import { HUD } from './HUD';
import { RoundEnd } from './RoundEnd';
import { useAppStore } from '../state/useAppStore';

export const GameScreen: React.FC = () => {
  const [roundState, setRoundState] = useState<'playing' | 'ended'>('playing');
  const [roundStats, setRoundStats] = useState({ hits: 0, combo: 0, coins: 0 });
  const earnCoins = useAppStore(state => state.earnCoins);
  const navigate = useAppStore(state => state.navigate);
  const logEvent = useAppStore(state => state.logEvent);

  useEffect(() => {
    if (roundState === 'playing') {
      logEvent({
        event_name: 'round_started',
        source: 'user'
      });
    }
  }, [roundState, logEvent]);

  const handleRoundEnd = (hits: number, combo: number, coins: number) => {
    setRoundStats({ hits, combo, coins });
    earnCoins(coins, `round-${Date.now()}`);
    setRoundState('ended');
  };

  const handlePlayAgain = () => {
    setRoundState('playing');
  };

  const handleOpenStore = () => {
    navigate('store_home');
  };

  return (
    <div id="tour-step-1" className="relative w-full h-full bg-background overflow-hidden">
      <HUD />
      
      {roundState === 'playing' ? (
        <PulseTap onRoundEnd={handleRoundEnd} />
      ) : (
        <RoundEnd 
          hits={roundStats.hits}
          combo={roundStats.combo}
          coinsEarned={roundStats.coins}
          onPlayAgain={handlePlayAgain}
          onOpenStore={handleOpenStore}
        />
      )}
    </div>
  );
};
