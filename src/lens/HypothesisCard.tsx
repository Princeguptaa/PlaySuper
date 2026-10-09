import React from 'react';

export const HypothesisCard: React.FC = () => {
  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4 space-y-3">
      <h3 className="font-bold flex items-center space-x-2">
        <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs">A/B Test</span>
        <span>Goal Store Hypothesis</span>
      </h3>
      
      <div className="text-sm space-y-2">
        <p className="text-text">
          <strong className="text-muted block text-xs">Primary Hypothesis</strong>
          Giving players an explicit goal and translating prices into effort ("3 rounds") will increase D7 retention compared to a standard store.
        </p>
        
        <div className="bg-background/50 p-2 rounded text-xs space-y-1">
          <strong className="text-muted block">Guardrails</strong>
          <ul className="list-disc pl-4 space-y-1 text-muted">
            <li>Gameplay minutes per session</li>
            <li>D1 retention</li>
            <li>Sink ratio (40-70%)</li>
            <li>Redeem failure rate</li>
            <li>Nudge dismissal rate (&lt; 20%)</li>
          </ul>
        </div>
        
        <div className="text-xs text-muted">
          Sample size: 50,000 per variant for 5% MDE over 14 days.
        </div>
      </div>
    </div>
  );
};
