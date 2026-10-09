import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Orb } from './Orb';
import { vibrate } from '../lib/utils';
import { calculateCoins } from '../lib/economy';


const GAME_DURATION = 20;
const PLAY_AREA_W = 340;
const PLAY_AREA_H = 460;
const ORB_RADIUS = 30;

export const PulseTap: React.FC<{ onRoundEnd: (hits: number, combo: number, coins: number) => void }> = ({ onRoundEnd }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [orbs, setOrbs] = useState<{ id: string; x: number; y: number }[]>([]);
  const [hits, setHits] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [longestCombo, setLongestCombo] = useState(0);
  
  const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isPlaying = timeLeft > 0;
  const orbIdCounter = useRef(0);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Spawner
  useEffect(() => {
    if (!isPlaying) return;
    const spawnOrb = () => {
      const id = `orb-${orbIdCounter.current++}`;
      const x = Math.random() * (PLAY_AREA_W - ORB_RADIUS * 2);
      const y = Math.random() * (PLAY_AREA_H - ORB_RADIUS * 2);
      setOrbs(prev => [...prev, { id, x, y }]);
      
      const nextSpawn = 450 + Math.random() * 350;
      if (timeLeft > 0) setTimeout(spawnOrb, nextSpawn);
    };
    
    const initialTimer = setTimeout(spawnOrb, 500);
    return () => clearTimeout(initialTimer);
  }, [isPlaying, timeLeft]);

  // End Game
  useEffect(() => {
    if (timeLeft === 0) {
      const coins = calculateCoins(hits, longestCombo);
      onRoundEnd(hits, longestCombo, coins);
    }
  }, [timeLeft, hits, longestCombo, onRoundEnd]);

  const handleOrbTap = useCallback((id: string) => {
    setOrbs(prev => prev.filter(o => o.id !== id));
    setHits(h => h + 1);
    setCurrentCombo(c => {
      const newCombo = c + 1;
      setLongestCombo(lc => Math.max(lc, newCombo));
      if (newCombo === 5 || newCombo === 10) vibrate(100);
      else vibrate(50);
      return newCombo;
    });
  }, []);

  const handleOrbExpire = useCallback((id: string) => {
    setOrbs(prev => prev.filter(o => o.id !== id));
    setCurrentCombo(0);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
      <div className="absolute top-10 flex flex-col items-center">
        <div className="text-4xl font-display font-bold text-text">{timeLeft}</div>
        <div className="text-sm text-muted">Combo: x{currentCombo}</div>
      </div>
      
      <div 
        className="relative pointer-events-auto"
        style={{ width: PLAY_AREA_W, height: PLAY_AREA_H }}
      >
        {orbs.map(orb => (
          <Orb
            key={orb.id}
            id={orb.id}
            x={orb.x}
            y={orb.y}
            radius={ORB_RADIUS}
            onTap={handleOrbTap}
            onExpire={handleOrbExpire}
            lifetime={1100}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
};
