import React from 'react';
import { PhoneFrame } from './PhoneFrame';
import { ScreenRouter } from './ScreenRouter';
import { BriefPanel } from './BriefPanel';
import { LensPanel } from '../lens/LensPanel';
import { LensFAB } from '../lens/LensFAB';
import { GuidedTour } from './GuidedTour';

export const DesktopLayout: React.FC = () => {
  return (
    <div className="desktop-layout-wrapper min-h-screen bg-[#050505] text-white flex justify-center items-center p-0 min-[700px]:p-8">
      <div className="w-full max-w-[1440px] h-full min-[700px]:h-[844px] flex">
        <BriefPanel />
        <div className="flex-1 flex justify-center items-center w-full h-full">
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
