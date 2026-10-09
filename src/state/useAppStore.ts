import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Screen } from './types';
import { SEED_CATALOGUE, INITIAL_BALANCE } from '../lib/seed';
import { generateId, generateCouponCode } from '../lib/utils';
import { enrichAndLogEvent } from '../lib/analytics';

const createInitialState = () => ({
  balance: INITIAL_BALANCE,
  goalId: null,
  ledger: [],
  orders: [],
  session: {
    id: generateId(),
    roundsPlayed: 0,
    coinsHistory: [],
    nudgesShown: 0,
    nudgesDismissed: 0,
    redemptionsThisSession: [],
  },
  ui: {
    screen: 'game' as Screen,
    variant: 'goal' as 'classic' | 'goal',
    skin: 'neon' as 'neon' | 'jungle' | 'retail',
    lensOpen: false,
    tourDone: false,
    selectedRewardId: null,
  },
  events: [],
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...createInitialState(),

      earnCoins: (amount, refId) => set((state) => {
        const entry = { id: generateId(), type: 'earn' as const, amount, ts: Date.now(), refId };
        return {
          balance: state.balance + amount,
          ledger: [...state.ledger, entry],
          session: {
            ...state.session,
            roundsPlayed: state.session.roundsPlayed + 1,
            coinsHistory: [...state.session.coinsHistory, amount].slice(-10), // Keep last 10
          },
        };
      }),

      redeemReward: (rewardId) => set((state) => {
        const reward = SEED_CATALOGUE.find(r => r.id === rewardId);
        if (!reward) return state;

        const entry = { id: generateId(), type: 'redeem' as const, amount: reward.priceCoins, ts: Date.now(), refId: rewardId };
        const code = generateCouponCode(reward.brand, reward.valueInr);
        const order = { id: generateId(), rewardId, priceCoins: reward.priceCoins, code, ts: Date.now() };

        const events = enrichAndLogEvent(state, {
          event_name: 'redeem_confirmed',
          reward_id: rewardId,
          price: reward.priceCoins,
          source: 'user'
        });

        return {
          balance: state.balance - reward.priceCoins,
          ledger: [...state.ledger, entry],
          orders: [...state.orders, order],
          session: {
            ...state.session,
            redemptionsThisSession: [...state.session.redemptionsThisSession, rewardId],
          },
          events
        };
      }),

      pinGoal: (rewardId) => set((state) => {
        const prevGoalId = state.goalId;
        const events = enrichAndLogEvent(state, {
          event_name: rewardId ? 'goal_pinned' : 'goal_unpinned',
          previous_goal_id: prevGoalId,
          source: 'user'
        });
        return { goalId: rewardId, events };
      }),

      navigate: (screen) => set((state) => ({ ui: { ...state.ui, screen } })),

      logEvent: (partialEvent) => set((state) => ({
        events: enrichAndLogEvent(state, partialEvent)
      })),

      switchVariant: (variant) => set((state) => {
        const events = enrichAndLogEvent(state, {
          event_name: 'variant_changed',
          from: state.ui.variant,
          to: variant,
          source: 'user'
        });
        
        return {
          session: {
            ...state.session,
            id: generateId(),
            nudgesShown: 0,
            nudgesDismissed: 0,
            redemptionsThisSession: [],
          },
          ui: { ...state.ui, variant },
          events
        };
      }),

      switchSkin: (skin) => set((state) => ({ ui: { ...state.ui, skin } })),

      setLensOpen: (isOpen) => set((state) => ({ ui: { ...state.ui, lensOpen: isOpen } })),

      resetDemo: () => set(() => ({
        ...createInitialState(),
      })),
    }),
    {
      name: 'goal-store-state',
      partialize: (state) => {
        // Don't persist events
        const { events, ...rest } = state;
        return rest;
      },
    }
  )
);
