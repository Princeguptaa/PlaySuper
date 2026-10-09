import { AppState } from './types';
import { SEED_CATALOGUE } from '../lib/seed';

export const useGoalReward = (state: AppState) => {
  if (!state.goalId) return null;
  return SEED_CATALOGUE.find(r => r.id === state.goalId) || null;
};

export const useAvgCoinsPerRound = (state: AppState) => {
  const history = state.session.coinsHistory;
  if (history.length === 0) return 70;
  const recent = history.slice(-3);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
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
  return earned > 0 ? spent / earned : 0;
};
