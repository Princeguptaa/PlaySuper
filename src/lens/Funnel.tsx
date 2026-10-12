import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { computeFunnel } from '../lib/analytics';

export const Funnel: React.FC = () => {
  const events = useAppStore(state => state.events);
  const data = computeFunnel(events);

  const maxCount = Math.max(...data.map(d => d.count), 0);

  return (
    <div className="bg-[var(--lens-surface)] border border-[var(--lens-border)] rounded-xl p-4 my-4 space-y-3">
      <h3 className="font-bold text-sm text-[var(--lens-text)]">Funnel</h3>
      <div className="space-y-3">
        {data.map((step) => {
          const barWidthPct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;

          return (
            <div key={step.name} className="space-y-1">
              <div 
                className="text-left font-medium text-[var(--lens-text)]"
                style={{ fontSize: '12px' }}
              >
                {step.name}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-3.5 bg-[var(--lens-bg)] border border-[var(--lens-border)] rounded overflow-hidden">
                  <div
                    className="h-full bg-[var(--lens-primary)] rounded transition-all duration-300"
                    style={{ width: `${barWidthPct}%` }}
                  />
                </div>
                <div 
                  className="font-mono text-[var(--lens-text)] whitespace-nowrap shrink-0 text-right min-w-[70px]"
                  style={{ fontSize: '12px' }}
                >
                  <span className="font-bold">{step.count}</span>{' '}
                  <span className="text-[var(--lens-muted)] font-normal">({step.percentLabel})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
