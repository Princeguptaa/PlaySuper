import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { avgCoinsPerRound } from '../lib/economy';

export const EconomyMeter: React.FC = () => {
  const ledger = useAppStore(state => state.ledger);
  const balance = useAppStore(state => state.balance);
  const coinsHistory = useAppStore(state => state.session.coinsHistory);
  
  const totalEarned = ledger.filter(l => l.type === 'earn').reduce((sum, l) => sum + l.amount, 0);
  const totalSpent = ledger.filter(l => l.type === 'redeem').reduce((sum, l) => sum + l.amount, 0);
  
  const rawSink = totalEarned > 0 ? (totalSpent / totalEarned) * 100 : 0;
  const sinkRatio = Math.min(100, Math.max(0, rawSink));
  const avgEarn = Math.round(coinsHistory.length > 0 ? avgCoinsPerRound(coinsHistory) : 70);
  
  const inBand = sinkRatio >= 40 && sinkRatio <= 70;
  const barColor = inBand ? 'bg-zinc-300' : 'bg-amber-500';
  const textColor = inBand ? 'text-zinc-200' : 'text-amber-400';
  
  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4 space-y-4">
      <h3 className="font-bold">Economy Meter</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[#a1a1aa]">Total Earned</div>
          <div className="text-xl font-bold">{totalEarned} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-[#a1a1aa]">Total Spent</div>
          <div className="text-xl font-bold">{totalSpent} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-[#a1a1aa]">Avg / round (last 3)</div>
          <div className="text-xl font-bold">{avgEarn} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-[#a1a1aa]">Balance (Outstanding)</div>
          <div className="text-xl font-bold">{balance} 🟡</div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#a1a1aa]">Sink Ratio</span>
          <span className={`font-bold ${textColor}`}>
            {sinkRatio.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full bg-background rounded-full overflow-hidden flex">
          <div 
            className={`h-full ${barColor}`} 
            style={{ width: `${Math.min(100, sinkRatio)}%` }}
          />
        </div>
        <div className="text-[10px] text-[#a1a1aa] mt-1 text-right">Healthy target: 40-70%</div>
      </div>
    </div>
  );
};
