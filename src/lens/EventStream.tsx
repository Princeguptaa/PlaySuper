import React, { useState } from 'react';
import { useAppStore } from '../state/useAppStore';
import { EventRow } from './EventRow';

export const EventStream: React.FC = () => {
  const events = useAppStore(state => state.events);
  const [filter, setFilter] = useState<string>('all');
  
  // get unique event types
  const types = Array.from(new Set(events.map(e => e.event_name)));
  
  const filteredEvents = filter === 'all' ? events : events.filter(e => e.event_name === filter);
  
  return (
    <div className="flex flex-col h-64 border border-surface rounded-xl overflow-hidden bg-surface/10">
      <div className="p-2 border-b border-surface flex justify-between items-center bg-surface/30">
        <h3 className="font-bold text-sm">Event Stream ({events.length})</h3>
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)}
          className="bg-background text-text text-xs p-1 rounded border border-surface"
        >
          <option value="all">All Events</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filteredEvents.map((e, idx) => (
          <EventRow key={`${e.timestamp}-${e.event_name}-${idx}`} event={e} />
        ))}
        {filteredEvents.length === 0 && (
          <div className="text-center text-muted text-sm py-8">No events yet</div>
        )}
      </div>
    </div>
  );
};
