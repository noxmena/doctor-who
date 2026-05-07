import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Play, Pause, Zap, Radio, RefreshCw, 
  Volume2, VolumeX, Maximize, SkipForward, SkipBack,
  Clock, Activity, Shield, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode } from '../types';
import { storageService } from '../services/storageService';

interface PlayerProps {
  episode: Episode;
  initialTime?: number;
  onBack: () => void;
}

export const Player: React.FC<PlayerProps> = ({ episode, initialTime = 0, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(initialTime);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(true); // Loading state
  const [showNotice, setShowNotice] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-save progress via a manual timer, since Google Drive iframe blocks access to actual video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isOptimizing) {
      interval = setInterval(() => {
        setPlayedSeconds(prev => {
          const next = prev + 1;
          storageService.saveWatchState({
            episodeId: episode.id,
            timestamp: Math.floor(next),
            lastUpdated: Date.now()
          });
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOptimizing, episode.id]);

  useEffect(() => {
    // Initial load simulation
    const timer = setTimeout(() => setIsOptimizing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleQualityChange = (q: string) => {
    setSelectedQuality(q);
    setShowQualityMenu(false);
    setIsOptimizing(true);
    // Simulate loading for quality change
    setTimeout(() => setIsOptimizing(false), 1500);
  };

  // Google Drive iframe embed.
  // Note: Google Drive blocks time synchronization natively, we add &t= in hopes the player respects it.
  const videoUrl = `https://drive.google.com/file/d/${episode.driveId}/preview?t=${initialTime}s`;

  return (
    <div className="fixed inset-0 z-50 bg-[#00050a] h-screen w-screen overflow-hidden flex flex-col font-sans group">
      
      {/* Cinematic Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1)_0%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-tardis-glow/40 animate-scan" style={{ animationDuration: '4s' }} />
      </div>

      {/* Header HUD */}
      <div className="absolute top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-50 bg-gradient-to-b from-black via-black/80 to-transparent border-b border-tardis-glow/10 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-tardis-glow transition-all group/back"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover/back:bg-tardis-glow/20 group-hover/back:border-tardis-glow/50 transition-all">
            <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none opacity-50 mb-1">Archive Entry</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Return to console</span>
          </div>
        </button>

        <div className="text-center absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-4 justify-center">
             <div className="w-1 h-1 bg-tardis-glow rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
             <h2 className="text-tardis-glow text-[10px] font-black tracking-[0.5em] uppercase">
               Vortex Channel: S{episode.season < 10 ? '0' : ''}{episode.season}.{episode.episodeNumber < 10 ? '0' : ''}{episode.episodeNumber}
             </h2>
             <div className="w-1 h-1 bg-tardis-glow rounded-full animate-pulse shadow-[0_0_8px_cyan]" />
          </div>
          <h3 className="text-white font-black text-xl uppercase italic tracking-tight drop-shadow-lg">{episode.title}</h3>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
             {/* Quality Selector */}
             <div className="relative">
               <button 
                 onClick={() => setShowQualityMenu(!showQualityMenu)}
                 className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-tardis-glow hover:border-tardis-glow/30 hover:bg-tardis-glow/10 transition-all"
               >
                 <Radio size={14} className={isOptimizing ? 'animate-pulse text-tardis-glow' : ''} />
                 {selectedQuality}
               </button>
               {showQualityMenu && (
                 <div className="absolute top-full right-0 mt-2 w-32 glass rounded-xl border border-white/10 p-2 shadow-[0_0_30px_rgba(34,211,238,0.15)] z-50">
                   {['360p', '720p', '1080p'].map(q => (
                     <button
                       key={q}
                       onClick={() => handleQualityChange(q)}
                       className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedQuality === q ? 'bg-tardis-glow/20 text-tardis-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                     >
                       {q}
                     </button>
                   ))}
                 </div>
               )}
             </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-mono text-tardis-glow uppercase tracking-tighter">Signal Stability: 98.4%</span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">Encryption: Time-Locked</span>
          </div>
          <div className="w-12 h-12 rounded-xl border border-tardis-glow/20 flex items-center justify-center bg-tardis-glow/5">
            <Shield size={20} className="text-tardis-glow" />
          </div>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="flex-1 relative bg-black flex items-center justify-center mt-20 p-8 pb-32">
        <div className="w-full h-full max-w-[1600px] relative rounded-2xl overflow-hidden glass border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_50px_rgba(34,211,238,0.05)] text-center flex flex-col justify-center bg-[#020617]">
          
          {isOptimizing && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-tardis-glow/10 rounded-full" />
                  <div className="absolute inset-0 border-t-4 border-tardis-glow rounded-full animate-spin" />
                  <Zap size={32} className="absolute inset-0 m-auto text-tardis-glow animate-pulse" />
               </div>
               <div className="text-center">
                  <h4 className="text-tardis-glow text-xs font-black uppercase tracking-[0.5em] mb-2">Connecting to Archive</h4>
                  <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Optimizing {selectedQuality} stream</p>
               </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={videoUrl}
            className="w-full h-full border-none relative z-10"
            allow="autoplay; fullscreen"
            title={episode.title}
            onLoad={() => setIsOptimizing(false)}
          />

          {/* Drive Limitation Notice overlay */}
          <AnimatePresence>
            {showNotice && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-6 left-6 z-30 max-w-sm glass border border-tardis-accent/30 bg-black/60 backdrop-blur-lg p-5 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.15)] text-left"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-tardis-accent">
                    <AlertTriangle size={16} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Temporal Sync Notice</h4>
                  </div>
                  <button onClick={() => setShowNotice(false)} className="text-slate-500 hover:text-white transition-colors">×</button>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  Direct stream interception is blocked by Google Drive security protocols. We are rendering the secure archive embed directly.
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-2 border-t border-white/5 pt-2">
                  <strong className="text-white">Note on Resume:</strong> The archive may not automatically jump to <span className="text-tardis-accent">{formatTime(initialTime)}</span> due to iframe restrictions. Please seek manually.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative TARDIS Controls HUD (Bottom Bar) */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end px-12 pb-8 pointer-events-none z-40">
         <div className="w-full flex justify-between items-end border-b-2 border-tardis-glow/20 pb-4 relative">
            <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-tardis-glow shadow-[0_0_15px_cyan]" />
            <div className="flex flex-col gap-1 pointer-events-auto cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
               <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2">
                 <RefreshCw size={12} className={isPlaying ? "animate-spin text-tardis-glow" : ""} />
                 Tracking Chronos
               </span>
               <span className="text-3xl font-mono font-black text-white italic drop-shadow-md">
                 {formatTime(playedSeconds)}
               </span>
            </div>
            
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full border border-tardis-glow/30 flex items-center justify-center opacity-50">
                 <div className="w-2 h-2 rounded-full bg-tardis-glow animate-pulse" />
               </div>
               <div className="flex flex-col text-right">
                 <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Resonance Load</span>
                 <span className="text-sm font-mono tracking-widest text-tardis-glow font-bold uppercase">{selectedQuality} OK</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
