import React, { memo } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import { Episode } from '../types';

interface EpisodeCardProps {
  episode: Episode;
  onClick: (episode: Episode) => void;
  progress?: number;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = memo(({ episode, onClick, progress }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(episode)}
      className="bg-black/40 border border-white/5 group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:border-tardis-glow/30"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={episode.thumbnailUrl}
          alt={episode.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-tardis-glow flex items-center justify-center text-black shadow-lg shadow-tardis-glow/30">
            <Play fill="currentColor" size={20} />
          </div>
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
            <div 
              className="h-full bg-tardis-glow shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            S{episode.season} E{episode.episodeNumber} • {episode.duration}
          </span>
        </div>
        <h3 className="font-bold text-sm text-white group-hover:text-tardis-glow transition-colors truncate">
          {episode.title}
        </h3>
        <div className="w-full h-0.5 bg-slate-800 mt-2 opacity-30 group-hover:opacity-100 transition-opacity">
          <div className="w-0 group-hover:w-full h-full bg-tardis-glow transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
});
