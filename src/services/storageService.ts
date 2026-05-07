import { WatchState } from '../types';

const STORAGE_KEY = 'tardis_watch_state';

export const storageService = {
  getWatchStates: (): Record<string, WatchState> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  getWatchState: (episodeId: string): WatchState | undefined => {
    return storageService.getWatchStates()[episodeId];
  },

  saveWatchState: (state: WatchState) => {
    const states = storageService.getWatchStates();
    states[state.episodeId] = {
      ...state,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  },

  getLastWatchedEpisodeId: (): string | null => {
    const states = storageService.getWatchStates();
    const sorted = Object.values(states).sort((a, b) => b.lastUpdated - a.lastUpdated);
    return sorted.length > 0 ? sorted[0].episodeId : null;
  }
};
