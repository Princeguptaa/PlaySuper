export type RewardCategory = 'Food' | 'Entertainment' | 'Gaming' | 'Shopping' | 'Fashion' | 'Gadgets';
export type RewardType = 'coupon' | 'giftcard' | 'digital' | 'physical';

export interface Reward {
  id: string;
  brand: string;
  title: string;
  valueInr: number;
  type: RewardType;
  category: RewardCategory;
  priceCoins: number;
  validityDays: number;
  tag?: 'quick_win';
  popularityRank: number;       // 1 = most popular
  brandColor: string;
  terms: string[];
  howToUse: string[];
}

export interface LedgerEntry {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  ts: number;
  refId?: string;
}

export interface Order {
  id: string;
  rewardId: string;
  priceCoins: number;
  code: string;
  ts: number;
}

export type Screen = 
  | 'game'
  | 'round_end'
  | 'store_home'
  | 'category_view'
  | 'reward_detail'
  | 'redeem_sheet'
  | 'receipt';

export interface AnalyticsEvent {
  event_name: string;
  timestamp: number;
  player_id: string;
  session_id: string;
  variant: 'classic' | 'goal';
  skin: 'neon' | 'jungle' | 'retail';
  coin_balance: number;
  source: 'user' | 'simulated';
  [key: string]: unknown;
}

export interface AppState {
  balance: number;
  goalId: string | null;
  ledger: LedgerEntry[];
  orders: Order[];
  session: {
    id: string;
    roundsPlayed: number;
    coinsHistory: number[];
    nudgesShown: number;
    nudgesDismissed: number;
    redemptionsThisSession: string[];
  };
  ui: {
    screen: Screen;
    variant: 'classic' | 'goal';
    skin: 'neon' | 'jungle' | 'retail';
    lensOpen: boolean;
    tourDone: boolean;
    selectedRewardId: string | null;
  };
  events: AnalyticsEvent[];
  
  // Actions
  earnCoins: (amount: number, refId: string) => void;
  redeemReward: (rewardId: string) => void; // Changed from returning LedgerEntry to void to match typical Zustand
  pinGoal: (rewardId: string | null) => void;
  navigate: (screen: Screen) => void;
  logEvent: (event: Omit<AnalyticsEvent, 'timestamp' | 'session_id' | 'variant' | 'skin' | 'coin_balance'>) => void;
  switchVariant: (variant: 'classic' | 'goal') => void;
  switchSkin: (skin: 'neon' | 'jungle' | 'retail') => void;
  setLensOpen: (isOpen: boolean) => void;
  resetDemo: () => void;
}
