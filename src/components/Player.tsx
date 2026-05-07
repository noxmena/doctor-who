import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { 
  ArrowLeft, Play, Pause, Zap, Radio, RefreshCw, 
  Volume2, VolumeX, Maximize, SkipForward, SkipBack,
  Clock, Activity, Shield
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
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [hasSeekedInitial, setHasSeekedInitial] = useState(false);

  // Auto-save progress
  useEffect(() => {
    const handleSave = () => {
      if (playedSeconds > 1) {
        storageService.saveWatchState({
          episodeId: episode.id,
          timestamp: Math.floor(playedSeconds),
          lastUpdated: Date.now()
        });
      }
    };

    const interval = setInterval(handleSave, 5000);
    return () => {
      handleSave();
      clearInterval(interval);
    };
  }, [playedSeconds, episode.id]);

  const handleSeek = (amount: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + amount);
    }
  };

  const handleProgress = (state: { played: number, playedSeconds: number, loaded: number, loadedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
  };

  const handleDuration = (d: number) => {
    setDuration(d);
  };

  const handleReady = () => {
    setIsReady(true);
    if (initialTime > 0 && playerRef.current && !hasSeekedInitial) {
      playerRef.current.seekTo(initialTime, 'seconds');
      setHasSeekedInitial(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Direct video URL logic - Using the raw drive link
  const videoUrl = `https://drive.google.com/uc?id=${episode.driveId}&export=download`;

  const PlayerCore = ReactPlayer as any;

  return (
    <div className="fixed inset-0 z-50 bg-[#00050a] h-screen w-screen overflow-hidden flex flex-col font-sans group cursor-default"
         onMouseMove={() => {
           setShowControls(true);
           const timer = setTimeout(() => setShowControls(false), 3000);
           return () => clearTimeout(timer);
         }}>
      
      {/* Cinematic Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05)_0%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-tardis-glow/20 animate-scan" style={{ animationDuration: '4s' }} />
      </div>

      {/* Header HUD */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 w-full h-20 px-8 flex items-center justify-between z-50 bg-gradient-to-b from-black/80 to-transparent border-b border-tardis-glow/10 backdrop-blur-sm"
          >
            <button 
              onClick={onBack}
              className="flex items-center gap-3 text-slate-400 hover:text-tardis-glow transition-all"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-tardis-glow/10 hover:border-tardis-glow/30 transition-all">
                <ArrowLeft size={18} />
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
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-tardis-glow uppercase tracking-tighter">Signal Stability: 98.4%</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">Encryption: Time-Locked</span>
              </div>
              <div className="w-12 h-12 rounded-xl border border-tardis-glow/20 flex items-center justify-center bg-white/5">
                <Shield size={20} className="text-tardis-glow" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Video Viewport */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full relative z-0 flex items-center justify-center">
          {!isReady && (
            <div className="absolute inset-0 z-10 bg-[#00050a] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-white/5 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-t-4 border-tardis-glow rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="text-center">
                <p className="text-tardis-glow text-xs font-black uppercase tracking-[0.4em] animate-pulse">Initializing Vortex Bridge...</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-2">{episode.title}</p>
              </div>
            </div>
          )}

          <PlayerCore
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            onProgress={(state: any) => handleProgress(state)}
            onDuration={handleDuration}
            onReady={handleReady}
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  disablePictureInPicture: 'true',
                }
              }
            } as any}
          />

          {/* Click to Toggle Play overlay */}
          <div 
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        </div>

        {/* Fancy TARDIS Controls HUD */}
        <AnimatePresence>
          {showControls && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-0 left-0 w-full z-50 p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            >
              {/* Progress Slider */}
              <div className="relative group/progress mb-8">
                <div className="absolute -top-10 left-0 px-3 py-1.5 glass rounded-lg border border-tardis-glow/20 pointer-events-none">
                  <span className="text-[10px] font-mono text-tardis-glow font-bold">
                    {formatTime(playedSeconds)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-hidden cursor-pointer">
                  <input 
                    type="range"
                    min={0}
                    max={duration || 1}
                    value={playedSeconds}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setPlayedSeconds(val);
                      playerRef.current?.seekTo(val, 'seconds');
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-tardis-glow/50 to-tardis-glow relative"
                    style={{ width: `${(playedSeconds / (duration || 1)) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_cyan] scale-0 group-hover/progress:scale-100 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Main Console Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-2xl bg-tardis-glow flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSeek(-10)} className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                      <SkipBack size={18} />
                    </button>
                    <button onClick={() => handleSeek(10)} className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                      <SkipForward size={18} />
                    </button>
                  </div>

                  <div className="h-10 w-[1px] bg-white/10" />

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input 
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-24 h-1 bg-white/10 rounded-full accent-tardis-glow cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Quality Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl glass border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-tardis-glow transition-all"
                    >
                      <Radio size={14} />
                      {selectedQuality}
                    </button>
                    {showQualityMenu && (
                      <div className="absolute bottom-full right-0 mb-4 w-40 glass rounded-xl border border-white/10 p-2 shadow-2xl">
                        {['360p', '720p', '1080p'].map(q => (
                          <button
                            key={q}
                            onClick={() => {
                              setSelectedQuality(q);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${selectedQuality === q ? 'bg-tardis-glow/20 text-tardis-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="text-slate-400 hover:text-tardis-glow transition-colors">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time-Rotor Ambience (Center of Console) */}
        {!showControls && (
          <div className="absolute right-10 bottom-10 opacity-30 pointer-events-none flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-tardis-glow tracking-widest">TEMPORAL_POINT:</span>
               <span className="text-xl font-mono text-white font-black italic">{formatTime(playedSeconds)}</span>
            </div>
            <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-tardis-glow shadow-[0_0_10px_cyan]" 
                 style={{ width: `${(playedSeconds / (duration || 1)) * 100}%` }}
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
