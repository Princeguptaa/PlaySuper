import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { useAvgCoinsPerRound } from '../state/selectors';

export const EconomyMeter: React.FC = () => {
  const ledger = useAppStore(state => state.ledger);
  const balance = useAppStore(state => state.balance);
  const avgPerRound = useAppStore(useAvgCoinsPerRound);
  
  const totalEarned = ledger.filter(l => l.type === 'earn').reduce((sum, l) => sum + l.amount, 0);
  const totalSpent = ledger.filter(l => l.type === 'redeem').reduce((sum, l) => sum + l.amount, 0);
  
  const rawSink = totalEarned > 0 ? (totalSpent / totalEarned) * 100 : 0;
  const sinkRatio = Math.min(100, Math.max(0, rawSink));
  const avgEarn = Math.round(avgPerRound);
  
  const inBand = sinkRatio >= 40 && sinkRatio <= 70;
  const barColor = inBand ? 'bg-zinc-300' : 'bg-amber-500';
  const textColor = inBand ? 'text-zinc-200' : 'text-amber-400';
  
  return (
    <div className="bg-[var(--lens-surface)] border border-[var(--lens-border)] text-[var(--lens-text)] rounded-xl p-4 my-4 space-y-4">
      <h3 className="font-bold text-[var(--lens-text)]">Economy Meter</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[var(--lens-muted)]">Total Earned</div>
          <div className="text-xl font-bold text-[var(--lens-text)]">{totalEarned} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-[var(--lens-muted)]">Total Spent</div>
          <div className="text-xl font-bold text-[var(--lens-text)]">{totalSpent} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-[var(--lens-muted)]">Avg / round (last 3)</div>
          <div className="text-xl font-bold text-[var(--lens-text)]">{avgEarn} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-[var(--lens-muted)]">Balance (Outstanding)</div>
          <div className="text-xl font-bold text-[var(--lens-text)]">{balance} 🟡</div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[var(--lens-muted)]">Sink Ratio</span>
          <span className={`font-bold ${textColor}`}>
            {sinkRatio.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full bg-[var(--lens-bg)] border border-[var(--lens-border)] rounded-full overflow-hidden flex">
          <div 
            className={`h-full ${barColor}`} 
            style={{ width: `${Math.min(100, sinkRatio)}%` }}
          />
        </div>
        <div className="text-[10px] text-[var(--lens-muted)] mt-1 text-right">Healthy target: 40-70%</div>
      </div>
    </div>
  );
};
