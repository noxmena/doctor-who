import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Maximize, Play, Pause, Save, Zap, Radio, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode, WatchState } from '../types';
import { storageService } from '../services/storageService';

interface PlayerProps {
  episode: Episode;
  initialTime?: number;
  onBack: () => void;
}

export const Player: React.FC<PlayerProps> = ({ episode, initialTime = 0, onBack }) => {
  const [secondsWatched, setSecondsWatched] = useState(initialTime);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showResumedHUD, setShowResumedHUD] = useState(initialTime > 0);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Resume logic: Google Drive doesn't support seeking via URL parameters reliably in iframes.
  // We'll provide a "Last Known Position" HUD that persists to help the user manually seek.
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsWatched(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSaveProgress = () => {
    storageService.saveWatchState({
      episodeId: episode.id,
      timestamp: secondsWatched,
      lastUpdated: Date.now()
    });
  };

  useEffect(() => {
    // Auto-save every 15 seconds for more precision
    const interval = setInterval(handleSaveProgress, 15000);
    return () => {
      handleSaveProgress();
      clearInterval(interval);
    };
  }, [secondsWatched]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const changeQuality = (q: string) => {
    setIsOptimizing(true);
    setSelectedQuality(q);
    setTimeout(() => setIsOptimizing(false), 2000);
    setShowQualityMenu(false);
  };

  const embedUrl = `https://drive.google.com/file/d/${episode.driveId}/preview`;

  return (
    <div className="fixed inset-0 z-50 bg-[#020617] h-screen w-screen overflow-hidden flex flex-col font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-tardis-glow animate-[scan_8s_linear_infinite]" />
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Top Console Bar */}
      <div className="h-16 px-8 flex items-center justify-between glass z-50 border-b border-tardis-glow/20 relative">
        <div className="absolute bottom-0 left-0 h-[2px] bg-tardis-glow/30 w-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        
        <button 
          onClick={onBack}
          className="flex items-center text-slate-400 hover:text-tardis-glow transition-all group relative"
        >
          <div className="absolute -inset-2 bg-tardis-glow/0 group-hover:bg-tardis-glow/5 rounded-lg transition-all" />
          <ArrowLeft size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Collapse Records</span>
        </button>
        
        <div className="text-center">
          <div className="flex items-center gap-3 justify-center mb-0.5">
             <div className="w-1.5 h-1.5 bg-tardis-glow rounded-full animate-ping" />
             <h2 className="text-tardis-glow text-[10px] font-black tracking-[0.4em] uppercase">
               Transmitting: S{episode.season < 10 ? '0' : ''}{episode.season} E{episode.episodeNumber < 10 ? '0' : ''}{episode.episodeNumber}
             </h2>
             <div className="w-1.5 h-1.5 bg-tardis-glow rounded-full animate-ping" />
          </div>
          <motion.h3 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-black text-base uppercase italic tracking-tight drop-shadow-sm"
          >
            {episode.title}
          </motion.h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Quality Console */}
          <div className="relative">
            <button 
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="flex items-center text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10"
            >
              <Radio size={14} className={`mr-2 ${isOptimizing ? 'animate-pulse text-tardis-glow' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{selectedQuality}</span>
            </button>
            
            <AnimatePresence>
              {showQualityMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 glass rounded-xl overflow-hidden border border-tardis-glow/20 p-2 z-[60]"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Bandwidth</span>
                  </div>
                  {['360p', '720p', '1080p'].map((q) => (
                    <button
                      key={q}
                      onClick={() => changeQuality(q)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedQuality === q ? 'bg-tardis-glow/20 text-tardis-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      {q} {q === '1080p' ? '(High Res)' : ''}
                    </button>
                  ))}
                  <div className="p-2 mt-1 bg-tardis-glow/5 rounded-lg border border-tardis-glow/10">
                    <p className="text-[8px] leading-relaxed text-tardis-glow opacity-80 italic">
                      Note: Ensure the Drive Player gear icon is set to match for optimal sync.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleSaveProgress}
            className="flex items-center bg-tardis-accent/10 text-tardis-accent hover:bg-tardis-accent hover:text-white transition-all px-5 py-2 rounded-lg border border-tardis-accent/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          >
            <RefreshCw size={14} className={`mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sync Temporal State</span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-black flex items-center justify-center p-4">
        {/* Decorative HUD Frames */}
        <div className="absolute inset-4 pointer-events-none border border-tardis-glow/10 rounded-2xl flex flex-col justify-between p-6 overflow-hidden">
           {/* Top HUD Data */}
           <div className="flex justify-between items-start opacity-40">
              <div className="flex flex-col gap-1">
                 <div className="h-[2px] w-20 bg-tardis-glow/30" />
                 <span className="text-[9px] font-mono tracking-tighter text-tardis-glow uppercase">Vortex Latency: 0.04ms</span>
                 <span className="text-[9px] font-mono tracking-tighter text-tardis-glow uppercase">Source: Archive_DB_#0{episode.season}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <div className="h-[2px] w-20 bg-tardis-glow/30" />
                 <span className="text-[9px] font-mono tracking-tighter text-tardis-glow uppercase text-right">Coordinate: 51.4923° N, 0.1278° W</span>
                 <span className="text-[9px] font-mono tracking-tighter text-tardis-glow uppercase text-right">Phase Shift: Normalized</span>
              </div>
           </div>

           {/* Central Scan Line */}
           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-tardis-glow/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]" />

           {/* Bottom HUD Data */}
           <div className="flex justify-between items-end opacity-40">
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-mono tracking-tighter text-tardis-glow uppercase">Status: Connected</span>
                 <div className="h-[2px] w-20 bg-tardis-glow/30" />
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[9px] font-mono tracking-tighter text-tardis-glow uppercase">Engine: TARDIS v.8.4</span>
                 <div className="h-[2px] w-20 bg-tardis-glow/30" />
              </div>
           </div>
        </div>

        <div className="w-full h-full max-w-[1600px] aspect-video relative rounded-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_50px_rgba(34,211,238,0.05)] border border-white/5">
          {isOptimizing && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-6">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-tardis-glow/10 rounded-full" />
                  <div className="absolute inset-0 border-t-4 border-tardis-glow rounded-full animate-spin" />
                  <Zap size={32} className="absolute inset-0 m-auto text-tardis-glow animate-pulse" />
               </div>
               <div className="text-center">
                  <h4 className="text-tardis-glow text-xs font-black uppercase tracking-[0.5em] mb-2">Re-Calibrating Signal</h4>
                  <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Optimizing stream for {selectedQuality}</p>
               </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="w-full h-full border-none"
            allow="autoplay; crossorigin; encrypted-media; fullscreen"
            title={episode.title}
          />
          
          {/* Progress HUD overlay */}
          <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3">
            {/* Resume Callout */}
            <AnimatePresence>
              {showResumedHUD && initialTime > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass p-4 rounded-xl border border-tardis-accent/30 shadow-[0_0_30px_rgba(249,115,22,0.1)] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-tardis-accent" />
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle size={16} className="text-tardis-accent" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Temporal Point Recorded</span>
                    <button 
                      onClick={() => setShowResumedHUD(false)}
                      className="ml-auto text-slate-500 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    Last session ended at <span className="text-tardis-accent font-bold">{formatTime(initialTime)}</span>. 
                    Please use the timeline above to resync.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="glass p-5 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-5 group backdrop-blur-xl">
              <div className="flex flex-col text-right">
                <span className="text-tardis-glow text-[9px] font-black tracking-[0.2em] uppercase opacity-60">Elapsed Period</span>
                <span className="text-white text-xl font-mono font-black italic tracking-tighter tabular-nums">
                  {formatTime(secondsWatched)}
                </span>
                <div className="w-full h-[2px] bg-white/5 mt-2 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-tardis-glow" 
                     initial={{ width: 0 }}
                     animate={{ width: '100%' }}
                     transition={{ duration: 1, repeat: Infinity }}
                   />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-tardis-glow/5 border border-tardis-glow/20 flex items-center justify-center group-hover:bg-tardis-glow/10 group-hover:border-tardis-glow/40 transition-all">
                 <Zap size={20} className="text-tardis-glow group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

