import React from 'react';
import { WalletPill } from '../components/WalletPill';
import { GoalChip } from './GoalChip';

export const HUD: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none z-10">
      <div className="pointer-events-auto">
        <WalletPill />
      </div>
      <div className="pointer-events-auto">
        <GoalChip />
      </div>
    </div>
  );
};
