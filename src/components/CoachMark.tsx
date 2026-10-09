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
      setTargetRect(foundRect);
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

  const style: React.CSSProperties = {
    position: 'absolute',
    top: targetRect.bottom + 12 + window.scrollY,
    left: Math.max(16, targetRect.left + (targetRect.width / 2) - 140),
    width: 280,
    zIndex: 100,
  };

  // Adjust if overflowing right
  if (style.left && (Number(style.left) + 280 > window.innerWidth - 16)) {
    style.left = window.innerWidth - 296;
  }

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-[90] bg-black/60 pointer-events-auto"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%, 
            ${targetRect.left - 4}px 100%, 
            ${targetRect.left - 4}px ${targetRect.top - 4}px, 
            ${targetRect.right + 4}px ${targetRect.top - 4}px, 
            ${targetRect.right + 4}px ${targetRect.bottom + 4}px, 
            ${targetRect.left - 4}px ${targetRect.bottom + 4}px, 
            ${targetRect.left - 4}px 100%, 
            100% 100%, 100% 0%
          )`
        }}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={style}
          className="bg-surface border border-primary/30 p-4 rounded-xl shadow-2xl flex flex-col space-y-3 pointer-events-auto"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-primary/30 rotate-45" />
          
          <div className="relative text-white font-medium text-sm">
            {text}
          </div>
          
          <div className="relative flex justify-between items-center pt-2">
            <span className="text-xs text-muted">
              {step} of {totalSteps}
            </span>
            <div className="flex space-x-2">
              <button onClick={onSkip} className="text-xs text-muted hover:text-white px-2 py-1 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Skip</button>
              <button onClick={onNext} className="text-xs bg-primary text-background font-bold px-3 py-1 rounded min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary">
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
