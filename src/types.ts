export interface Episode {
  id: string;
  season: number;
  episodeNumber: number;
  title: string;
  description: string;
  driveId: string;
  thumbnailUrl?: string;
  duration?: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface WatchState {
  episodeId: string;
  timestamp: number; // in seconds
  lastUpdated: number;
}
