import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { computeFunnel } from '../lib/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Funnel: React.FC = () => {
  const events = useAppStore(state => state.events);
  const sessionId = useAppStore(state => state.session.id);
  
  const data = computeFunnel(events, sessionId);

  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4">
      <h3 className="font-bold mb-4">Funnel (This Session)</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'var(--surface)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-[#111] border border-surface p-2 rounded text-xs">
                      <div className="font-bold text-white">{d.name}</div>
                      <div className="text-muted">Count: {d.count}</div>
                      <div className="text-success">Conv: {d.conversion}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill="var(--primary)" fillOpacity={0.8 - (index * 0.1)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
