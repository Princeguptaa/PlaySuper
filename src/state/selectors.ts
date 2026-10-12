import { AppState } from './types';
import { SEED_CATALOGUE } from '../lib/seed';
import { avgCoinsPerRound } from '../lib/economy';

export const useGoalReward = (state: AppState) => {
  if (!state.goalId) return null;
  return SEED_CATALOGUE.find(r => r.id === state.goalId) || null;
};

export const useAvgCoinsPerRound = (state: AppState) => {
  return avgCoinsPerRound(state.session.coinsHistory);
};

export const useRewardState = (state: AppState, price: number) => {
  if (state.balance >= price) return 'affordable';
  if (price <= state.balance * 1.3) return 'within_reach';
  return 'far';
};

export const useTotalEarned = (state: AppState) => {
  return state.ledger
    .filter(entry => entry.type === 'earn')
    .reduce((sum, entry) => sum + entry.amount, 0);
};

export const useTotalSpent = (state: AppState) => {
  return state.ledger
    .filter(entry => entry.type === 'redeem')
    .reduce((sum, entry) => sum + entry.amount, 0);
};

export const useSinkRatio = (state: AppState) => {
  const earned = useTotalEarned(state);
  const spent = useTotalSpent(state);
  return earned > 0 ? Math.min(1, Math.max(0, spent / earned)) : 0;
};
