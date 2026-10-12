import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { computeFunnel } from '../lib/analytics';

export const Funnel: React.FC = () => {
  const events = useAppStore(state => state.events);
  const data = computeFunnel(events);

  const maxCount = Math.max(...data.map(d => d.count), 0);

  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4 space-y-3">
      <h3 className="font-bold text-sm text-white">Funnel</h3>
      <div className="space-y-3">
        {data.map((step, idx) => {
          const barWidthPct = maxCount > 0 ? (step.count / maxCount) * 100 : 0;
          const prevPct = idx === 0 
            ? (step.count > 0 ? '100%' : '0%') 
            : `${step.conversion}%`;

          return (
            <div key={step.name} className="space-y-1">
              <div 
                className="text-left font-medium text-white"
                style={{ fontSize: '12px' }}
              >
                {step.name}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex-1 h-3.5 bg-surface/30 rounded overflow-hidden">
                  <div
                    className="h-full bg-primary rounded transition-all duration-300"
                    style={{ width: `${barWidthPct}%` }}
                  />
                </div>
                <div 
                  className="font-mono text-white whitespace-nowrap shrink-0 text-right min-w-[70px]"
                  style={{ fontSize: '12px' }}
                >
                  <span className="font-bold">{step.count}</span>{' '}
                  <span className="text-[#a1a1aa] font-normal">({prevPct})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
