import React from 'react';

export const HypothesisCard: React.FC = () => {
  return (
    <div className="bg-[var(--lens-surface)] border border-[var(--lens-border)] text-[var(--lens-text)] rounded-xl p-4 my-4 space-y-3">
      <h3 className="font-bold flex items-center space-x-2 text-[var(--lens-text)]">
        <span className="bg-[var(--lens-primary)]/20 text-[#c4b5fd] px-1.5 py-0.5 rounded text-xs font-medium">A/B Test</span>
        <span>Goal Store Hypothesis</span>
      </h3>
      
      <div className="text-sm space-y-3">
        <div>
          <strong className="text-[var(--lens-muted)] block text-xs uppercase tracking-wider mb-1">Hypothesis</strong>
          <p className="text-[var(--lens-text)] text-xs leading-relaxed">
            A pinned goal, effort-based pricing, capped nudges and a next-goal loop will raise D7 retention versus a classic store, without reducing gameplay time.
          </p>
        </div>
        
        <div className="bg-[var(--lens-bg)] border border-[var(--lens-border)] p-3 rounded-lg text-xs space-y-1">
          <strong className="text-[var(--lens-muted)] block uppercase tracking-wider mb-1">Guardrails</strong>
          <p className="text-[var(--lens-text)] leading-relaxed">
            Gameplay minutes per DAU (no more than 3% decline); D1 retention (no decline); sink ratio 40-70%; redeem failure rate under 1%; nudge dismissal rate under 70%.
          </p>
        </div>
        
        <div>
          <strong className="text-[var(--lens-muted)] block text-xs uppercase tracking-wider mb-1">Sample size</strong>
          <p className="text-xs text-[var(--lens-muted)] leading-relaxed">
            ~7,500 players per arm detects +1 pp D7 lift at a 5% baseline (80% power, 5% significance).
          </p>
        </div>
      </div>
    </div>
  );
};
