export type StoryState =
  | 'homeLoading'
  | 'homeReady'
  | 'homeError'
  | 'openingDoors'
  | 'scene1Ready'
  | 'releasing'
  | 'transitioning'
  | 'scene2Ready';
export type StoryEvent =
  | 'loaded'
  | 'failed'
  | 'retry'
  | 'open'
  | 'opened'
  | 'release'
  | 'released'
  | 'arrived'
  | 'replay'
  | 'back';

export function transition(state: StoryState, event: StoryEvent): StoryState {
  if (event === 'replay' && state === 'scene2Ready') return 'scene1Ready';
  const table: Partial<Record<StoryState, Partial<Record<StoryEvent, StoryState>>>> = {
    homeLoading: { loaded: 'homeReady', failed: 'homeError' },
    homeError: { retry: 'homeLoading' },
    homeReady: { open: 'openingDoors' },
    openingDoors: { opened: 'scene1Ready' },
    scene1Ready: { release: 'releasing', back: 'homeReady' },
    releasing: { released: 'transitioning' },
    transitioning: { arrived: 'scene2Ready' },
  };
  return table[state]?.[event] ?? state;
}
