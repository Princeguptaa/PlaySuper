import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { formatCoins } from '../lib/utils';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

export const WalletPill: React.FC = () => {
  const balance = useAppStore(state => state.balance);
  
  return (
    <motion.div 
      key={balance} // Force re-animation on balance change
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-surface"
    >
      <Coins className="w-4 h-4 text-accent-coin" />
      <span className="font-bold text-text font-display">{formatCoins(balance)}</span>
    </motion.div>
  );
};
