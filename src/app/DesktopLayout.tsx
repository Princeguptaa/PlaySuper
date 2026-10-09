import React from 'react';
import { PhoneFrame } from './PhoneFrame';
import { ScreenRouter } from './ScreenRouter';
import { BriefPanel } from './BriefPanel';
import { LensPanel } from '../lens/LensPanel';
import { LensFAB } from '../lens/LensFAB';
import { GuidedTour } from './GuidedTour';

export const DesktopLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center items-center p-0 md:p-8">
      <div className="w-full max-w-[1440px] h-full md:h-[844px] flex">
        <BriefPanel />
        <div className="flex-1 flex justify-center items-center w-full">
          <PhoneFrame>
            <ScreenRouter />
          </PhoneFrame>
        </div>
        <LensPanel />
      </div>
      <LensFAB />
      <GuidedTour />
    </div>
  );
};
