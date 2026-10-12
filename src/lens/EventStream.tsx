import React, { useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { EventRow } from './EventRow';

export const EventStream: React.FC = () => {
  const events = useAppStore(state => state.events);
  const [filter, setFilter] = useState<string>('all');
  
  // get unique event types from all logged events
  const types = Array.from(new Set(events.map(e => e.event_name))).filter(Boolean).sort();
  
  // Filter and show newest first (up to 50 events)
  const filteredEvents = (filter === 'all' ? events : events.filter(e => e.event_name === filter)).slice(0, 50);
  
  return (
    <div className="bg-[var(--lens-surface)] border border-[var(--lens-border)] text-[var(--lens-text)] rounded-xl p-4 my-4 space-y-3">
      <div className="flex justify-between items-center pb-1">
        <h3 className="font-bold text-sm text-[var(--lens-text)] flex items-center space-x-2">
          <span>Live Event Stream</span>
          <span className="text-xs text-[var(--lens-muted)] font-normal">({filteredEvents.length})</span>
        </h3>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="bg-[var(--lens-bg)] text-[var(--lens-text)] text-xs py-1 px-2 rounded border border-[var(--lens-border)] focus:outline-none"
        >
          <option value="all">All Events</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
        {filteredEvents.map((e, idx) => (
          <EventRow key={`${e.timestamp}-${e.event_name}-${idx}`} event={e} />
        ))}
        {filteredEvents.length === 0 && (
          <div className="text-center text-[var(--lens-muted)] text-xs py-6">No events logged yet</div>
        )}
      </div>
    </div>
  );
};
