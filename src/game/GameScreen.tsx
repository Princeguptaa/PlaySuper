import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PulseTap } from './PulseTap';
import { HUD } from './HUD';
import { RoundEnd } from './RoundEnd';
import { useAppStore } from '../state/useAppStore';

export const GameScreen: React.FC = () => {
  const roundsPlayed = useAppStore(state => state.session.roundsPlayed);
  const tourDone = useAppStore(state => state.ui.tourDone);
  const [roundState, setRoundState] = useState<'ready' | 'playing' | 'ended'>(
    roundsPlayed === 0 && !tourDone ? 'ready' : 'playing'
  );
  const [roundStats, setRoundStats] = useState({ hits: 0, combo: 0, coins: 0 });
  const earnCoins = useAppStore(state => state.earnCoins);
  const navigate = useAppStore(state => state.navigate);
  const logEvent = useAppStore(state => state.logEvent);
  const roundStartedLogged = useRef(false);

  const handleStartRound = useCallback(() => {
    useAppStore.setState(state => ({ ui: { ...state.ui, tourDone: true } }));
    setRoundState('playing');
  }, []);

  useEffect(() => {
    if (roundState === 'playing' && !roundStartedLogged.current) {
      roundStartedLogged.current = true;
      logEvent({
        event_name: 'round_started',
        source: 'user'
      });
    } else if (roundState === 'ended' || roundState === 'ready') {
      roundStartedLogged.current = false;
    }
  }, [roundState, logEvent]);

  const handleRoundEnd = useCallback((hits: number, combo: number, coins: number) => {
    setRoundStats({ hits, combo, coins });
    earnCoins(coins, `round-${Date.now()}`);
    setRoundState('ended');
  }, [earnCoins]);

  const handlePlayAgain = useCallback(() => {
    setRoundState('playing');
  }, []);

  const handleOpenStore = useCallback(() => {
    navigate('store_home');
  }, [navigate]);

  return (
    <div id="tour-step-1" className="relative w-full h-full bg-background overflow-hidden">
      <HUD />
      
      {roundState === 'ready' ? (
        <div 
          onClick={handleStartRound}
          className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <div className="text-center p-6 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[var(--primary)] text-white text-3xl font-bold flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              ▶
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[var(--text)]">Pulse Tap</h2>
              <p className="text-sm text-[var(--muted)] mt-1">Tap orbs quickly to build combos and earn coins</p>
            </div>
            <button 
              onClick={handleStartRound}
              className="px-6 py-2.5 bg-[var(--primary)] text-white font-bold rounded-full text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Start Round
            </button>
          </div>
        </div>
      ) : roundState === 'playing' ? (
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
