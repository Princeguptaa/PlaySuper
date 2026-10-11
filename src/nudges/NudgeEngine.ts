import { AppState, Reward } from '../state/types';
import { SEED_CATALOGUE } from '../lib/seed';
import { avgCoinsPerRound, effortETA } from '../lib/economy';

export type NudgeType = 'N1_NEAR_GOAL' | 'N2_UNLOCK' | 'N3_FIRST_GOAL';

export interface NudgeResult {
  type: NudgeType;
  reward: Reward;
  message: string;
}

export function evaluateNudge(state: AppState): NudgeResult | null {
  // Variant guard: Nudges only appear in Goal variant
  if (state.ui.variant !== 'goal') return null;

  // Session caps
  if (state.session.nudgesDismissed >= 2) return null;
  if (state.session.nudgesShown >= 3) return null;

  const { balance, goalId, session } = state;
  const avgPerRound = avgCoinsPerRound(session.coinsHistory);

  // N3 First goal - after round 1, if no goal is pinned, show the "Pick your first goal" nudge
  if (!goalId && session.roundsPlayed >= 1) {
    const suggestion = SEED_CATALOGUE.find(r => r.tag === 'quick_win') || SEED_CATALOGUE[0];
    return {
      type: 'N3_FIRST_GOAL',
      reward: suggestion,
      message: "Pick your first goal"
    };
  }
  
  // Calculate coins earned this round (it's the last entry in coinsHistory)
  const earnedThisRound = session.coinsHistory.length > 0 ? session.coinsHistory[session.coinsHistory.length - 1] : 0;
  const balanceBeforeRound = balance - earnedThisRound;

  // Find if any unredeemed reward was just crossed this round
  const unredeemedRewards = SEED_CATALOGUE.filter(r => !session.redemptionsThisSession.includes(r.id));
  
  // N2 Unlock - crossed a reward price this round
  for (const reward of unredeemedRewards) {
    if (balanceBeforeRound < reward.priceCoins && balance >= reward.priceCoins) {
      // Prioritize the current goal if it just unlocked
      if (goalId === reward.id) {
        return {
          type: 'N2_UNLOCK',
          reward,
          message: `You can now claim ${reward.brand} ${reward.title}`
        };
      }
    }
  }
  
  // If no goal unlocked, check if any other reward unlocked
  for (const reward of unredeemedRewards) {
    if (balanceBeforeRound < reward.priceCoins && balance >= reward.priceCoins) {
      return {
        type: 'N2_UNLOCK',
        reward,
        message: `You can now claim ${reward.brand} ${reward.title}`
      };
    }
  }

  // N1 Near-goal - remaining <= 2x avg/round
  if (goalId) {
    const goalReward = SEED_CATALOGUE.find(r => r.id === goalId);
    if (goalReward) {
      const remaining = Math.max(0, goalReward.priceCoins - balance);
      if (remaining > 0 && remaining <= avgPerRound * 2) {
        const eta = effortETA(goalReward.priceCoins, balance, avgPerRound);
        return {
          type: 'N1_NEAR_GOAL',
          reward: goalReward,
          message: `You're ${remaining} coins from ${goalReward.brand} ${goalReward.title} (${eta}). One more round?`
        };
      }
    }
  }

  return null;
}
