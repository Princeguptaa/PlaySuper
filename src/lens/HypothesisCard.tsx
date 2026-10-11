import React from 'react';

export const HypothesisCard: React.FC = () => {
  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4 space-y-3">
      <h3 className="font-bold flex items-center space-x-2">
        <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs">A/B Test</span>
        <span>Goal Store Hypothesis</span>
      </h3>
      
      <div className="text-sm space-y-3">
        <div>
          <strong className="text-[#a1a1aa] block text-xs uppercase tracking-wider mb-1">Hypothesis</strong>
          <p className="text-white text-xs leading-relaxed">
            A pinned goal, effort-based pricing, capped nudges and a next-goal loop will raise D7 retention versus a classic store, without reducing gameplay time.
          </p>
        </div>
        
        <div className="bg-background/50 p-3 rounded-lg text-xs space-y-1">
          <strong className="text-[#a1a1aa] block uppercase tracking-wider mb-1">Guardrails</strong>
          <p className="text-[#e4e4e7] leading-relaxed">
            Gameplay minutes per DAU (no more than 3% decline); D1 retention (no decline); sink ratio 40-70%; redeem failure rate under 1%; nudge dismissal rate under 70%.
          </p>
        </div>
        
        <div>
          <strong className="text-[#a1a1aa] block text-xs uppercase tracking-wider mb-1">Sample size</strong>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            ~7,500 players per arm detects +1 pp D7 lift at a 5% baseline (80% power, 5% significance).
          </p>
        </div>
      </div>
    </div>
  );
};
