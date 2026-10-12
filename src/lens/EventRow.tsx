import React, { useState } from 'react';
import { AnalyticsEvent } from '../state/types';
import { motion, AnimatePresence } from 'framer-motion';

const COMMON_KEYS = new Set([
  'timestamp',
  'player_id',
  'session_id',
  'variant',
  'skin',
  'coin_balance',
  'event_name',
]);

export const EventRow: React.FC<{ event: AnalyticsEvent }> = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  const time = new Date(event.timestamp).toLocaleTimeString([], { hour12: false });

  // Key properties from taxonomy (excluding the boilerplate common metadata)
  const keyProps = Object.entries(event).filter(
    ([k, v]) => !COMMON_KEYS.has(k) && v !== undefined && v !== null && v !== ''
  );
  
  return (
    <div className="border-b border-[var(--lens-border)] last:border-0 py-2 text-xs">
      <div 
        className="flex items-start justify-between cursor-pointer hover:bg-[var(--lens-surface)]/60 p-1.5 rounded transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[var(--lens-text)]">{event.event_name}</span>
            <span className="text-[var(--lens-muted)] font-mono text-[11px]">{time}</span>
          </div>
          {keyProps.length > 0 && (
            <div className="text-[var(--lens-muted)] font-mono text-[11px] mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
              {keyProps.map(([k, v]) => (
                <span key={k} className="bg-[var(--lens-bg)] border border-[var(--lens-border)] px-1 py-0.5 rounded">
                  <span className="text-[var(--lens-muted)]">{k}:</span>{' '}
                  <span className="text-[var(--lens-text)]">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="text-[10px] text-[var(--lens-muted)] pt-0.5 shrink-0">{expanded ? '▼' : '▶'}</span>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <pre className="bg-[var(--lens-bg)] border border-[var(--lens-border)] p-2 mt-1 rounded text-[11px] text-[var(--lens-muted)] font-mono overflow-x-auto">
              {JSON.stringify(event, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
