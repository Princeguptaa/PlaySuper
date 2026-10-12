import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Orb } from './Orb';
import { vibrate } from '../lib/utils';
import { calculateCoins } from '../lib/economy';


const GAME_DURATION = 20;
const PLAY_AREA_W = 340;
const PLAY_AREA_H = 460;
const ORB_RADIUS = 30;

function getNonOverlappingPosition(
  existingOrbs: { x: number; y: number; radius?: number }[],
  newRadius: number,
  areaW: number,
  areaH: number,
  maxRetries = 10
): { x: number; y: number } | null {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const x = Math.random() * (areaW - newRadius * 2);
    const y = Math.random() * (areaH - newRadius * 2);
    const newCx = x + newRadius;
    const newCy = y + newRadius;

    const overlaps = existingOrbs.some(orb => {
      const orbRadius = orb.radius ?? newRadius;
      const orbCx = orb.x + orbRadius;
      const orbCy = orb.y + orbRadius;
      const largerRadius = Math.max(newRadius, orbRadius);
      const minDistance = 2 * largerRadius;
      const dist = Math.hypot(newCx - orbCx, newCy - orbCy);
      return dist < minDistance;
    });

    if (!overlaps) {
      return { x, y };
    }
  }
  return null;
}

export const PulseTap: React.FC<{ onRoundEnd: (hits: number, combo: number, coins: number) => void }> = ({ onRoundEnd }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [orbs, setOrbs] = useState<{ id: string; x: number; y: number; radius?: number }[]>([]);
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

    const spawnOrb = () => {
      setOrbs(prev => {
        const pos = getNonOverlappingPosition(prev, ORB_RADIUS, PLAY_AREA_W, PLAY_AREA_H, 10);
        if (!pos) return prev;
        const id = `orb-${orbIdCounter.current++}`;
        return [...prev, { id, x: pos.x, y: pos.y, radius: ORB_RADIUS }];
      });
    };

    const scheduleNext = () => {
      const nextDelay = 400 + Math.random() * 300;
      timerId = setTimeout(() => {
        if (!active) return;
        spawnOrb();
        scheduleNext();
      }, nextDelay);
    };

    timerId = setTimeout(() => {
      if (!active) return;
      spawnOrb();
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
            radius={orb.radius ?? ORB_RADIUS}
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
