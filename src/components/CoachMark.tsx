import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CoachMarkProps {
  targetId: string | string[];
  text: string;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export const CoachMark: React.FC<CoachMarkProps> = ({ targetId, text, step, totalSteps, onNext, onSkip }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const ids = Array.isArray(targetId) ? targetId : [targetId];
      let foundRect: DOMRect | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            foundRect = rect;
            break;
          }
        }
      }
      setTargetRect(prev => {
        if (!foundRect && !prev) return null;
        if (
          foundRect &&
          prev &&
          Math.round(foundRect.top) === Math.round(prev.top) &&
          Math.round(foundRect.left) === Math.round(prev.left) &&
          Math.round(foundRect.width) === Math.round(prev.width) &&
          Math.round(foundRect.height) === Math.round(prev.height)
        ) {
          return prev;
        }
        return foundRect;
      });
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    // Poll just in case of animations/layout shifts
    const interval = setInterval(updateRect, 500);
    
    return () => {
      window.removeEventListener('resize', updateRect);
      clearInterval(interval);
    };
  }, [targetId]);

  if (!targetRect) return null;

  const CARD_WIDTH = 280;
  const CARD_HEIGHT = 160;
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1000;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;

  const spaceBelow = viewportH - targetRect.bottom;
  const spaceAbove = targetRect.top;
  const placeBelow = spaceBelow >= CARD_HEIGHT + 24 || spaceBelow >= spaceAbove;

  let top = placeBelow ? targetRect.bottom + 12 : targetRect.top - CARD_HEIGHT - 12;
  top = Math.max(16, Math.min(top, viewportH - CARD_HEIGHT - 16));

  let left = targetRect.left + (targetRect.width / 2) - (CARD_WIDTH / 2);
  left = Math.max(16, Math.min(left, viewportW - CARD_WIDTH - 16));

  const targetCenter = targetRect.left + (targetRect.width / 2);
  const arrowX = Math.max(20, Math.min(CARD_WIDTH - 20, targetCenter - left));

  const style: React.CSSProperties = {
    position: 'fixed',
    top,
    left,
    width: CARD_WIDTH,
    zIndex: 100,
  };

  return createPortal(
    <>
      {/* Target highlight ring without dimming Lens or left panel */}
      <div 
        className="fixed pointer-events-none z-[90] rounded-xl ring-4 ring-primary shadow-[0_0_24px_rgba(124,92,255,0.7)] animate-pulse"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: placeBelow ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: placeBelow ? -10 : 10 }}
          style={style}
          className="bg-surface border border-primary/30 p-4 rounded-xl shadow-2xl flex flex-col space-y-3 pointer-events-auto"
        >
          {placeBelow ? (
            <div 
              className="absolute -top-2 w-4 h-4 bg-surface border-t border-l border-primary/30"
              style={{ left: `${arrowX}px`, transform: 'translateX(-50%) rotate(45deg)' }}
            />
          ) : (
            <div 
              className="absolute -bottom-2 w-4 h-4 bg-surface border-b border-r border-primary/30"
              style={{ left: `${arrowX}px`, transform: 'translateX(-50%) rotate(45deg)' }}
            />
          )}
          
          <div className="relative text-white font-medium text-sm">
            {text}
          </div>
          
          <div className="relative flex justify-between items-center pt-2">
            <span className="text-xs text-muted">
              {step} of {totalSteps}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={onSkip} 
                className="text-xs text-white/80 hover:text-white px-2 py-1 min-h-[44px] min-w-[44px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Skip
              </button>
              <button 
                onClick={onNext} 
                className="text-xs bg-primary text-white font-bold px-3 py-1 rounded min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                {step === totalSteps ? 'Done' : 'Next'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>,
    document.body
  );
};
