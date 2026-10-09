import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrbProps {
  id: string;
  x: number;
  y: number;
  radius: number;
  onTap: (id: string) => void;
  onExpire: (id: string) => void;
  lifetime: number;
  reducedMotion: boolean;
}

export const Orb: React.FC<OrbProps> = ({ id, x, y, radius, onTap, onExpire, lifetime, reducedMotion }) => {
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    if (popped) return;
    const timer = setTimeout(() => {
      onExpire(id);
    }, lifetime);
    return () => clearTimeout(timer);
  }, [id, onExpire, lifetime, popped]);

  const handleTap = () => {
    if (popped) return;
    setPopped(true);
    onTap(id);
  };

  return (
    <AnimatePresence>
      {!popped && (
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { scale: 1.3, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          onPointerDown={handleTap}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            boxShadow: '0 0 15px var(--primary)',
            touchAction: 'none',
            cursor: 'pointer'
          }}
        />
      )}
    </AnimatePresence>
  );
};
