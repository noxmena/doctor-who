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
  },

  saveLastSeason: (season: number) => {
    localStorage.setItem('tardis_last_season', season.toString());
  },

  getLastSeason: (): number | null => {
    const s = localStorage.getItem('tardis_last_season');
    return s ? parseInt(s, 10) : null;
  },

  saveLastTab: (tab: 'all' | 'recent') => {
    localStorage.setItem('tardis_last_tab', tab);
  },

  getLastTab: (): 'all' | 'recent' | null => {
    return localStorage.getItem('tardis_last_tab') as 'all' | 'recent' | null;
  },

  savePlayerActive: (active: boolean, episodeId: string | null) => {
    localStorage.setItem('tardis_player_active', JSON.stringify({ active, episodeId }));
  },

  getPlayerActive: (): { active: boolean; episodeId: string | null } => {
    const data = localStorage.getItem('tardis_player_active');
    return data ? JSON.parse(data) : { active: false, episodeId: null };
  }
};
