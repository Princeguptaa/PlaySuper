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
    <div className="bg-[var(--lens-surface)] border border-[var(--lens-border)] rounded-xl p-4 my-4">
      <h3 className="font-bold mb-3 text-[var(--lens-text)]">Theme Skin</h3>
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
                ? 'bg-[var(--lens-primary)] text-white font-bold shadow-sm' 
                : 'bg-[var(--lens-bg)] text-[#e2e8f0] hover:text-white font-semibold border border-[var(--lens-border)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};
