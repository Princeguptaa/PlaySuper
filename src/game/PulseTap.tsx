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
  
  const reducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isPlaying = timeLeft > 0;
  const orbIdCounter = useRef(0);
  const hasEndedRef = useRef(false);
  const currentComboRef = useRef(0);
  const longestComboRef = useRef(0);

  // Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Spawner - cleanly scheduled without creating multiple recursive branches
  useEffect(() => {
    if (!isPlaying) return;
    let timerId: ReturnType<typeof setTimeout>;
    let active = true;

    const scheduleNext = () => {
      const nextDelay = 400 + Math.random() * 300;
      timerId = setTimeout(() => {
        if (!active) return;
        const id = `orb-${orbIdCounter.current++}`;
        const x = Math.random() * (PLAY_AREA_W - ORB_RADIUS * 2);
        const y = Math.random() * (PLAY_AREA_H - ORB_RADIUS * 2);
        setOrbs(prev => [...prev, { id, x, y }]);
        scheduleNext();
      }, nextDelay);
    };

    timerId = setTimeout(() => {
      if (!active) return;
      const id = `orb-${orbIdCounter.current++}`;
      const x = Math.random() * (PLAY_AREA_W - ORB_RADIUS * 2);
      const y = Math.random() * (PLAY_AREA_H - ORB_RADIUS * 2);
      setOrbs(prev => [...prev, { id, x, y }]);
      scheduleNext();
    }, 400);

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [isPlaying]);

  // End Game - execute once when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !hasEndedRef.current) {
      hasEndedRef.current = true;
      const coins = calculateCoins(hits, longestComboRef.current);
      onRoundEnd(hits, longestComboRef.current, coins);
    }
  }, [timeLeft, hits, onRoundEnd]);

  const handleOrbTap = useCallback((id: string) => {
    setOrbs(prev => prev.filter(o => o.id !== id));
    setHits(h => h + 1);
    const newCombo = currentComboRef.current + 1;
    currentComboRef.current = newCombo;
    setCurrentCombo(newCombo);
    if (newCombo > longestComboRef.current) {
      longestComboRef.current = newCombo;
    }
    if (newCombo === 5 || newCombo === 10) vibrate(100);
    else vibrate(50);
  }, []);

  const handleOrbExpire = useCallback((id: string) => {
    setOrbs(prev => prev.filter(o => o.id !== id));
    currentComboRef.current = 0;
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
            lifetime={1400}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </div>
  );
};
