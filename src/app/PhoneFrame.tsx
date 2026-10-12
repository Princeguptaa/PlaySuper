import React from 'react';
import { useAppStore } from '../state/useAppStore';

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const skin = useAppStore((state) => state.ui.skin);

  return (
    <div 
      data-skin={skin}
      className="phone-viewport-container relative bg-background overflow-hidden mx-auto flex flex-col"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Fake notch for desktop viewing */}
      <div className="hidden min-[700px]:block absolute top-0 inset-x-0 h-6 bg-surface z-50 rounded-b-3xl w-40 mx-auto" />
      <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};
