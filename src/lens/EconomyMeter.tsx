import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const EconomyMeter: React.FC = () => {
  const { ledger, balance } = useAppStore(state => state);
  const roundsPlayed = useAppStore(state => state.session.roundsPlayed);
  
  const totalEarned = ledger.filter(l => l.type === 'earn').reduce((sum, l) => sum + l.amount, 0);
  const totalSpent = ledger.filter(l => l.type === 'redeem').reduce((sum, l) => sum + l.amount, 0);
  
  const sinkRatio = totalEarned > 0 ? (totalSpent / totalEarned) * 100 : 0;
  const avgEarn = roundsPlayed > 0 ? Math.round(totalEarned / roundsPlayed) : 0;
  
  const isHealthy = sinkRatio >= 40 && sinkRatio <= 70;
  
  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4 space-y-4">
      <h3 className="font-bold">Economy Meter</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted">Total Earned</div>
          <div className="text-xl font-bold">{totalEarned} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-muted">Total Spent</div>
          <div className="text-xl font-bold">{totalSpent} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-muted">Avg / Round</div>
          <div className="text-xl font-bold">{avgEarn} 🟡</div>
        </div>
        <div>
          <div className="text-xs text-muted">Balance (Outstanding)</div>
          <div className="text-xl font-bold">{balance} 🟡</div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Sink Ratio</span>
          <span className={`font-bold ${isHealthy ? 'text-success' : 'text-[#ff4444]'}`}>
            {sinkRatio.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 w-full bg-background rounded-full overflow-hidden flex">
          <div 
            className={`h-full ${isHealthy ? 'bg-success' : 'bg-[#ff4444]'}`} 
            style={{ width: `${Math.min(100, sinkRatio)}%` }}
          />
        </div>
        <div className="text-[10px] text-muted mt-1 text-right">Healthy target: 40-70%</div>
      </div>
    </div>
  );
};
