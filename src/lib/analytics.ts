import { AnalyticsEvent, AppState } from '../state/types';

const MAX_EVENTS = 500;

export function enrichAndLogEvent(
  state: AppState,
  partialEvent: Omit<AnalyticsEvent, 'timestamp' | 'session_id' | 'variant' | 'skin' | 'coin_balance'>
): AnalyticsEvent[] {
  let visitId = (partialEvent as { visit_id?: string }).visit_id;
  if (!visitId && partialEvent.event_name === 'store_opened') {
    visitId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  } else if (!visitId && state.session?.currentVisitId) {
    visitId = state.session.currentVisitId;
  }

  const newEvent: AnalyticsEvent = {
    ...partialEvent,
    timestamp: Date.now(),
    player_id: 'p_12345',
    session_id: state.session.id,
    variant: state.ui.variant,
    skin: state.ui.skin,
    coin_balance: state.balance,
    ...(visitId ? { visit_id: visitId } : {}),
  } as AnalyticsEvent;

  const newEvents = [newEvent, ...state.events];
  if (newEvents.length > MAX_EVENTS) {
    newEvents.pop();
  }

  // In a real app we would also send this to a backend here
  console.log(`[Analytics] ${newEvent.event_name}`, newEvent);

  return newEvents;
}

export interface FunnelStep {
  name: string;
  count: number;
  percentLabel: string;
}

export function computeFunnel(events: AnalyticsEvent[], sessionId?: string): FunnelStep[] {
  // Sort events chronologically (oldest to newest)
  const chronEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  // Group events by distinct visit_id (only visits that have a store_opened event)
  const visitOrder: string[] = [];
  const visitsMap = new Map<string, AnalyticsEvent[]>();

  for (const e of chronEvents) {
    if (sessionId && e.session_id !== sessionId) {
      continue;
    }
    if (e.event_name === 'store_opened' && e.visit_id) {
      if (!visitsMap.has(e.visit_id)) {
        visitOrder.push(e.visit_id);
        visitsMap.set(e.visit_id, []);
      }
    }
    if (e.visit_id && visitsMap.has(e.visit_id)) {
      visitsMap.get(e.visit_id)!.push(e);
    }
  }

  // Distinct visit IDs that reached each step in order
  const step1StoreOpened = new Set<string>();
  const step2RewardViewed = new Set<string>();
  const step3Intent = new Set<string>();
  const step4Redeemed = new Set<string>();
  const step5ReceiptRevealed = new Set<string>();
  const step6ReturnedToGame = new Set<string>();

  for (const visitId of visitOrder) {
    const vEvents = visitsMap.get(visitId) || [];
    const storeOpenEvt = vEvents.find(e => e.event_name === 'store_opened');
    if (!storeOpenEvt) continue;

    // Step 1: Store opened
    step1StoreOpened.add(visitId);

    // Step 2: Reward viewed
    const pdpEvt = vEvents.find(e => e.event_name === 'pdp_viewed' && e.timestamp >= storeOpenEvt.timestamp);
    if (!pdpEvt) continue;
    step2RewardViewed.add(visitId);

    // Step 3: Goal pinned or Redeem started
    const intentEvt = vEvents.find(e => 
      ['goal_pinned', 'redeem_initiated', 'redeem_confirmed'].includes(e.event_name) &&
      e.timestamp >= pdpEvt.timestamp
    );
    if (!intentEvt) continue;
    step3Intent.add(visitId);

    // Step 4: Redeemed
    const redeemEvt = vEvents.find(e => e.event_name === 'redeem_confirmed' && e.timestamp >= intentEvt.timestamp);
    if (!redeemEvt) continue;
    step4Redeemed.add(visitId);

    // Step 5: Receipt revealed
    const revealedEvt = vEvents.find(e => e.event_name === 'reward_revealed' && e.timestamp >= redeemEvt.timestamp);
    if (!revealedEvt) continue;
    step5ReceiptRevealed.add(visitId);

    // Step 6: Returned to game = visits in which reward_revealed was followed by a round_started in the same session
    const returnEvt = chronEvents.find(e => 
      e.event_name === 'round_started' &&
      e.session_id === revealedEvt.session_id &&
      e.timestamp >= revealedEvt.timestamp
    );
    if (!returnEvt) continue;
    step6ReturnedToGame.add(visitId);
  }

  const rawSteps = [
    { name: 'Store opened', count: step1StoreOpened.size },
    { name: 'Reward viewed', count: step2RewardViewed.size },
    { name: 'Goal pinned or Redeem started', count: step3Intent.size },
    { name: 'Redeemed', count: step4Redeemed.size },
    { name: 'Receipt revealed', count: step5ReceiptRevealed.size },
    { name: 'Returned to game', count: step6ReturnedToGame.size },
  ];

  // Enforce each step must be <= the step before it
  let prevCountForEnforce = Infinity;
  const enforcedCounts: number[] = [];
  for (const s of rawSteps) {
    const c = Math.min(s.count, prevCountForEnforce);
    enforcedCounts.push(c);
    prevCountForEnforce = c;
  }

  // Percent = count / previous step count; show "-" if previous step is 0. Never show above 100%.
  return rawSteps.map((step, idx) => {
    const count = enforcedCounts[idx];
    let percentLabel = '-';

    if (idx === 0) {
      percentLabel = count > 0 ? '100%' : '-';
    } else {
      const prevCount = enforcedCounts[idx - 1];
      if (prevCount === 0) {
        percentLabel = '-';
      } else {
        const pct = Math.min(100, Math.round((count / prevCount) * 100));
        percentLabel = `${pct}%`;
      }
    }

    return {
      name: step.name,
      count,
      percentLabel,
    };
  });
}
