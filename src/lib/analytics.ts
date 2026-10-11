import { AnalyticsEvent, AppState } from '../state/types';

const MAX_EVENTS = 500;

export function enrichAndLogEvent(
  state: AppState,
  partialEvent: Omit<AnalyticsEvent, 'timestamp' | 'session_id' | 'variant' | 'skin' | 'coin_balance'>
): AnalyticsEvent[] {
  const newEvent = {
    ...partialEvent,
    timestamp: Date.now(),
    player_id: 'p_12345',
    session_id: state.session.id,
    variant: state.ui.variant,
    skin: state.ui.skin,
    coin_balance: state.balance,
  } as AnalyticsEvent;

  const newEvents = [newEvent, ...state.events];
  if (newEvents.length > MAX_EVENTS) {
    newEvents.pop();
  }

  // In a real app we would also send this to a backend here
  console.log(`[Analytics] ${newEvent.event_name}`, newEvent);

  return newEvents;
}

export function computeFunnel(events: AnalyticsEvent[], sessionId: string) {
  const sessionEvents = events.filter(e => e.session_id === sessionId);
  
  const storeOpened = sessionEvents.filter(e => e.event_name === 'store_opened').length;
  const pdpViewed = sessionEvents.filter(e => e.event_name === 'pdp_viewed').length;
  const intent = sessionEvents.filter(e => ['goal_pinned', 'redeem_initiated', 'redeem_confirmed'].includes(e.event_name)).length;
  const redeemed = sessionEvents.filter(e => e.event_name === 'redeem_confirmed').length;
  const revealed = sessionEvents.filter(e => e.event_name === 'reward_revealed').length;
  const returned = sessionEvents.filter(e => e.event_name === 'store_closed').length;

  const steps = [
    { name: 'Store open', count: storeOpened },
    { name: 'Reward viewed', count: pdpViewed },
    { name: 'Goal pinned or Redeem started', count: intent },
    { name: 'Redeemed', count: redeemed },
    { name: 'Receipt revealed', count: revealed },
    { name: 'Returned to game', count: returned },
  ];

  return steps.map((step, i) => {
    const prevCount = i === 0 ? step.count : steps[i - 1].count;
    const conversion = prevCount > 0 ? Math.round((step.count / prevCount) * 100) : (step.count > 0 ? 100 : 0);
    return { ...step, conversion };
  });
}
