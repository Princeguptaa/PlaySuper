import React from 'react';
import { useAppStore } from '../state/useAppStore';
import { GameScreen } from '../game/GameScreen';

import { StoreHome } from '../store/StoreHome';
import { RewardDetail } from '../store/RewardDetail';
import { RedeemSheet } from '../store/RedeemSheet';
import { Receipt } from '../store/Receipt';

import { ClassicHome } from '../store/ClassicHome';
import { ClassicRewardDetail } from '../store/ClassicRewardDetail';
import { ClassicConfirmation } from '../store/ClassicConfirmation';

export const ScreenRouter: React.FC = () => {
  const { ui } = useAppStore();
  const { screen, variant } = ui;

  switch (screen) {
    case 'game':
      return <GameScreen />;
    case 'store_home':
      return variant === 'classic' ? <ClassicHome /> : <StoreHome />;
    case 'reward_detail':
      return variant === 'classic' ? <ClassicRewardDetail /> : <RewardDetail />;
    case 'redeem_sheet':
      return (
        <div className="relative h-full w-full overflow-hidden">
          {variant === 'classic' ? <ClassicRewardDetail /> : <RewardDetail />}
          <RedeemSheet />
        </div>
      );
    case 'receipt':
      return variant === 'classic' ? <ClassicConfirmation /> : <Receipt />;
    default:
      return <div>404</div>;
  }
};
