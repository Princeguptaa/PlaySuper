import React, { useState } from 'react';
import { AnalyticsEvent } from '../state/types';
import { motion, AnimatePresence } from 'framer-motion';

export const EventRow: React.FC<{ event: AnalyticsEvent }> = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  const time = new Date(event.timestamp).toLocaleTimeString([], { hour12: false });
  
  return (
    <div className="border-b border-surface/50 last:border-0 py-2 text-sm">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-surface/30 p-1 rounded"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-muted text-xs font-mono">{time}</span>
          <span className="font-semibold text-text">{event.event_name}</span>
        </div>
        <span className="text-xs text-muted">{expanded ? '▼' : '▶'}</span>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <pre className="bg-background/50 p-2 mt-1 rounded text-xs text-muted font-mono overflow-x-auto">
              {JSON.stringify(event, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
