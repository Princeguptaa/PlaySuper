import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const SkinSwitcher: React.FC = () => {
  const { skin, switchSkin, logEvent } = useAppStore(state => ({
    skin: state.ui.skin,
    switchSkin: state.switchSkin,
    logEvent: state.logEvent
  }));

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
      <div className="flex space-x-2">
        {(['neon', 'jungle', 'retail'] as const).map(s => (
          <button
            key={s}
            onClick={() => handleSwitch(s)}
            className={`flex-1 py-1 px-2 text-xs rounded capitalize transition-colors ${
              skin === s 
                ? 'bg-primary text-background font-bold' 
                : 'bg-surface/50 text-muted hover:bg-surface'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};
