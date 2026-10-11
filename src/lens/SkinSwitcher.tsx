import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const SkinSwitcher: React.FC = () => {
  const skin = useAppStore(state => state.ui.skin);
  const switchSkin = useAppStore(state => state.switchSkin);
  const logEvent = useAppStore(state => state.logEvent);

  const handleSwitch = (newSkin: 'neon' | 'jungle' | 'retail') => {
    switchSkin(newSkin);
    logEvent({
      event_name: 'skin_changed',
      source: 'user',
      new_skin: newSkin
    });
  };

  return (
    <div className="bg-surface/10 border border-surface rounded-xl p-4 my-4">
      <h3 className="font-bold mb-3">Theme Skin</h3>
      <div className="flex gap-1.5">
        {[
          { id: 'neon', label: 'Neon Arcade' },
          { id: 'jungle', label: 'Jungle Pop' },
          { id: 'retail', label: 'Retail Light' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleSwitch(id as 'neon' | 'jungle' | 'retail')}
            className={`flex-1 py-1.5 px-1 text-[11px] rounded transition-colors text-center whitespace-nowrap ${
              skin === id 
                ? 'bg-primary text-background font-bold' 
                : 'bg-surface/50 text-[#a1a1aa] hover:bg-surface hover:text-white font-medium'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
