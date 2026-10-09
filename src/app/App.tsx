import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { DesktopLayout } from './DesktopLayout';

export const App: React.FC = () => {
  const { skin } = useAppStore((state) => state.ui);

  return (
    <div data-skin={skin} className="w-full h-full min-h-screen bg-background">
      <DesktopLayout />
    </div>
  );
};
