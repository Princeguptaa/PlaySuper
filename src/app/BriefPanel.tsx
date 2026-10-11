import React from 'react';

export const BriefPanel: React.FC = () => {
  return (
    <div className="hidden xl:flex flex-col w-72 p-8 space-y-6 text-[#a1a1aa] border-r border-surface/40">
      <div>
        <h2 className="text-xl font-display font-bold text-white mb-2">The Goal Store</h2>
        <p className="text-sm text-[#a1a1aa] leading-relaxed">A playable prototype exploring in-game commerce that feels like a natural part of the game loop, not a detour.</p>
      </div>
      
      <div>
        <h3 className="font-semibold text-white mb-2">Design Pillars</h3>
        <ul className="text-sm space-y-2 list-disc list-inside text-[#a1a1aa]">
          <li>Play first, shop second</li>
          <li>Goals over catalogues</li>
          <li>Price in effort</li>
          <li>Receipt as retention</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-white mb-2">60-second Demo</h3>
        <ul className="text-sm space-y-2 list-decimal list-inside text-[#a1a1aa]">
          <li>Play a round of Pulse Tap</li>
          <li>Pin your first goal</li>
          <li>Play until affordable</li>
          <li>Claim and pick your next goal</li>
        </ul>
      </div>
    </div>
  );
};
