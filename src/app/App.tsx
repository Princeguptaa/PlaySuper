import React from 'react';
import { DesktopLayout } from './DesktopLayout';

export const App: React.FC = () => {
  return (
    <div className="w-full h-full min-h-screen bg-[#050505]">
      <DesktopLayout />
    </div>
  );
};
