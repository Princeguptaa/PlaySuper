export function calculateCoins(hits: number, longestCombo: number): number {
  if (hits === 0) return 0;
  const coins = hits * 4 + longestCombo * 2;
  return Math.min(120, Math.max(30, coins));
}

export function avgCoinsPerRound(history: number[]): number {
  if (history.length === 0) return 70;
  const recent = history.slice(-3);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

export function effortETA(price: number, balance: number, avgPerRound: number): string {
  const remaining = Math.max(0, price - balance);
  if (remaining === 0) return 'Ready to claim';
  const roundsNeeded = Math.ceil(remaining / avgPerRound);
  
  if (roundsNeeded <= 3) {
    return `about ${roundsNeeded} round${roundsNeeded === 1 ? '' : 's'}`;
  }
  if (roundsNeeded <= 20) {
    return `about ${roundsNeeded} rounds (~${roundsNeeded * 0.5} min)`;
  }
  const days = Math.ceil(roundsNeeded / 15);
  return `about ${days} day${days === 1 ? '' : 's'} at your pace`;
}

export function rewardState(price: number, balance: number): 'affordable' | 'within_reach' | 'far' {
  if (balance >= price) return 'affordable';
  if (price <= balance * 1.3) return 'within_reach';
  return 'far';
}

import { Reward, RewardCategory } from '../state/types';

export function rankWithinReach(
  rewards: Reward[],
  balance: number,
  goalCategory: RewardCategory | null,
  recentCategories: RewardCategory[]
): Reward[] {
  const eligible = rewards.filter(r => r.priceCoins <= balance * 1.3);

  return eligible.map(reward => {
    const proximity = balance >= reward.priceCoins ? 1 : balance / reward.priceCoins;
    
    let categoryAffinity = 0;
    if (goalCategory && reward.category === goalCategory) {
      categoryAffinity = 1;
    } else if (recentCategories.includes(reward.category)) {
      categoryAffinity = 0.5;
    }
    
    const popularityScore = 1 / Math.max(1, reward.popularityRank);
    const score = 0.5 * proximity + 0.3 * categoryAffinity + 0.2 * popularityScore;
    
    return { reward, score };
  }).sort((a, b) => b.score - a.score).map(x => x.reward);
}

export function nextGoalSuggestions(
  rewards: Reward[],
  redeemedReward: Reward,
  redeemedIds: string[]
): Reward[] {
  const excludeSet = new Set([...redeemedIds, redeemedReward.id]);
  const available = rewards.filter(r => !excludeSet.has(r.id));
  const suggestions: Reward[] = [];

  const sameCategoryUp = available
    .filter(r => r.category === redeemedReward.category && r.priceCoins > redeemedReward.priceCoins)
    .sort((a, b) => a.priceCoins - b.priceCoins)[0];
  if (sameCategoryUp) suggestions.push(sameCategoryUp);

  const quickWin = available
    .filter(r => r.id !== sameCategoryUp?.id && r.priceCoins <= 900)
    .sort((a, b) => a.priceCoins - b.priceCoins)[0];
  if (quickWin) suggestions.push(quickWin);

  const aspirational = available
    .filter(r => r.id !== sameCategoryUp?.id && r.id !== quickWin?.id && r.priceCoins >= 1000)
    .sort((a, b) => a.priceCoins - b.priceCoins)[0];
  if (aspirational) suggestions.push(aspirational);

  return suggestions.slice(0, 3);
}
