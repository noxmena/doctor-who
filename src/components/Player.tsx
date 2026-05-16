import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Play, Pause, Zap, Radio, RefreshCw, 
  Volume2, VolumeX, Maximize, SkipForward, SkipBack,
  Clock, Activity, Shield, AlertTriangle, MessageSquare, Globe, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode, AppSettings } from '../types';
import { storageService } from '../services/storageService';

interface PlayerProps {
  episode: Episode;
  initialTime?: number;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  recommendedEpisodes?: Episode[];
  onSelectEpisode?: (episode: Episode) => void;
  settings: AppSettings;
}

export const Player: React.FC<PlayerProps> = ({ episode, initialTime = 0, onBack, onNext, onPrev, recommendedEpisodes, onSelectEpisode, settings }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playedSeconds, setPlayedSeconds] = useState(initialTime);
  const [selectedQuality, setSelectedQuality] = useState(settings.defaultQuality); // Default to settings
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  
  const [dataSource, setDataSource] = useState<'english' | 'arabic'>(settings.dataSource);
  const [subtitleLang, setSubtitleLang] = useState('en');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);

  const [isOptimizing, setIsOptimizing] = useState(true); // Loading state
  const [showNotice, setShowNotice] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Auto-save progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isOptimizing) {
      // In English VidAPI we could listen to postMessage events, but timer provides a fallback
      interval = setInterval(() => {
        setPlayedSeconds(prev => {
          const next = prev + 5;
          storageService.saveWatchState({
            episodeId: episode.id,
            timestamp: Math.floor(next),
            lastUpdated: Date.now()
          });
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOptimizing, episode.id]);
  
  // Listen for VidAPI progress events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PLAYER_EVENT') {
        const { player_status, player_progress } = e.data.data;
        if (player_status === 'playing') {
          setIsPlaying(true);
          storageService.saveWatchState({
            episodeId: episode.id,
            timestamp: Math.floor(player_progress),
            lastUpdated: Date.now()
          });
          setPlayedSeconds(player_progress);
        } else if (player_status === 'paused') {
          setIsPlaying(false);
          setPlayedSeconds(player_progress);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [episode.id]);

  useEffect(() => {
    setIsOptimizing(true);
    const timer = setTimeout(() => setIsOptimizing(false), 2000);
    return () => clearTimeout(timer);
  }, [dataSource, subtitleLang, episode]);

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
    setTimeout(() => setIsOptimizing(false), 1500);
  };
  
  const handleDataSourceChange = (source: 'english' | 'arabic') => {
    setDataSource(source);
    setShowSourceMenu(false);
  };
  
  const handleSubtitleChange = (lang: string) => {
    setSubtitleLang(lang);
    setShowSubMenu(false);
  };

  // Google Drive URL for Arabic vs VidAPI URL for English
  const getRenderUrl = () => {
    if (dataSource === 'arabic') {
      if (!episode.driveId) {
        return ''; // Handle missing drive ID gracefully
      }
      return `https://drive.google.com/file/d/${episode.driveId}/preview?t=${initialTime}s`;
    } else {
      // English Version (VidAPI) - Doctor Who IMDB: tt0436992
      // Using resumeAt and subtitle matching the user requests
      const titleParam = encodeURIComponent(episode.title);
      const posterParam = encodeURIComponent(episode.thumbnailUrl);
      return `https://vaplayer.ru/embed/tv/tt0436992/${episode.season}/${episode.episodeNumber}?ds_lang=${subtitleLang}&primaryColor=%2300edd2&resumeAt=${initialTime}&title=${titleParam}&poster=${posterParam}`;
    }
  };

  const videoUrl = getRenderUrl();
  const unsupportedArabic = dataSource === 'arabic' && !episode.driveId;

  return (
    <div className="fixed inset-0 z-50 bg-[#00050a] h-screen w-screen overflow-hidden flex flex-col font-sans group">
      
      {/* Cinematic Background Ambience */}
      {settings.ambientAnimations && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1)_0%,transparent_100%)]" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-tardis-glow/40 animate-scan" style={{ animationDuration: '4s' }} />
        </div>
      )}

      {/* Header HUD */}
      <div className="flex-none h-20 w-full px-8 flex items-center justify-between z-50 bg-gradient-to-b from-black via-black/80 to-transparent border-b border-tardis-glow/10 backdrop-blur-md relative">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-tardis-glow transition-all group/back"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover/back:bg-tardis-glow/20 group-hover/back:border-tardis-glow/50 transition-all">
            <ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none opacity-50 mb-1">Archive Entry</span>
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Return to console</span>
          </div>
        </button>

        <div className="text-center absolute left-1/2 -translate-x-1/2 mt-2">
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
          
             {/* Subtitle Selector */}
             {dataSource === 'english' && (
               <div className="relative">
                 <button 
                   onClick={() => setShowSubMenu(!showSubMenu)}
                   className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-tardis-glow hover:border-tardis-glow/30 hover:bg-tardis-glow/10 transition-all"
                 >
                   <MessageSquare size={14} />
                   {subtitleLang.toUpperCase()}
                 </button>
                 {showSubMenu && (
                   <div className="absolute top-full right-0 mt-2 w-32 glass rounded-xl border border-white/10 p-2 shadow-[0_0_30px_rgba(34,211,238,0.15)] z-50">
                     {['en', 'ar', 'es', 'fr', 'de'].map(l => (
                       <button
                         key={l}
                         onClick={() => handleSubtitleChange(l)}
                         className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${subtitleLang === l ? 'bg-tardis-glow/20 text-tardis-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                       >
                         {l === 'en' ? 'English' : l === 'ar' ? 'Arabic' : l === 'es' ? 'Spanish' : l === 'fr' ? 'French' : 'German'}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             )}

             {/* Source Selector */}
             <div className="relative">
               <button 
                 onClick={() => setShowSourceMenu(!showSourceMenu)}
                 className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-tardis-glow hover:border-tardis-glow/30 hover:bg-tardis-glow/10 transition-all"
               >
                 <Globe size={14} />
                 {dataSource === 'english' ? 'ENG (VidAPI)' : 'AR (Drive)'}
               </button>
               {showSourceMenu && (
                 <div className="absolute top-full right-0 mt-2 w-48 glass rounded-xl border border-white/10 p-2 shadow-[0_0_30px_rgba(34,211,238,0.15)] z-50">
                   <button
                     onClick={() => handleDataSourceChange('english')}
                     className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${dataSource === 'english' ? 'bg-tardis-glow/20 text-tardis-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                   >
                     English (VidAPI)
                   </button>
                   <button
                     onClick={() => handleDataSourceChange('arabic')}
                     className={`w-full text-left px-3 py-2 mt-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors ${dataSource === 'arabic' ? 'bg-tardis-glow/20 text-tardis-glow' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                   >
                     Arabic Dub (Drive)
                   </button>
                 </div>
               )}
             </div>

             {/* Quality Selector */}
             <div className="relative">
               <button 
                 onClick={() => setShowQualityMenu(!showQualityMenu)}
                 className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-tardis-glow hover:border-tardis-glow/30 hover:bg-tardis-glow/10 transition-all"
                 title="Note: Actual quality should be managed in the player. Used as metadata here."
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
          <div className="w-12 h-12 rounded-xl border border-tardis-glow/20 flex items-center justify-center bg-tardis-glow/5">
            <Shield size={20} className="text-tardis-glow" />
          </div>
        </div>
      </div>

      {/* Main Video Viewport & Sidebar Elements */}
      <div className={`flex-1 overflow-hidden relative w-full z-10 ${dataSource === 'english' ? 'flex flex-col no-scrollbar overflow-y-auto' : 'flex'}`}>
        
        {/* Video Area */}
        <div className={`relative flex flex-col ${dataSource === 'english' ? 'w-full flex-none' : 'flex-1 pt-8 px-8 pb-32 overflow-y-auto no-scrollbar'}`}>
          <div className={`w-full mx-auto flex flex-col ${dataSource === 'english' ? 'max-w-none' : 'max-w-[1400px] gap-6'}`}>
            
            <div className={`w-full relative shadow-[0_0_100px_rgba(0,0,0,0.8),0_0_50px_rgba(34,211,238,0.05)] text-center flex flex-col justify-center bg-[#020617] flex-none ${dataSource === 'english' ? 'h-[75vh] border-b border-white/10' : 'aspect-video rounded-2xl overflow-hidden glass border border-white/5'}`}>
              
              {isOptimizing && !unsupportedArabic && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-tardis-glow/10 rounded-full" />
                  <div className="absolute inset-0 border-t-4 border-tardis-glow rounded-full animate-spin" />
                  <Zap size={32} className="absolute inset-0 m-auto text-tardis-glow animate-pulse" />
               </div>
               <div className="text-center">
                  <h4 className="text-tardis-glow text-xs font-black uppercase tracking-[0.5em] mb-2">Connecting to Archive</h4>
                  <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">Optimizing stream</p>
               </div>
            </div>
          )}

          {unsupportedArabic ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
               <AlertTriangle size={48} className="mb-4 text-tardis-accent opacity-50" />
               <h3 className="text-white text-lg font-bold mb-2">Drive Record Missing</h3>
               <p className="text-sm max-w-md">The Arabic dubbed version for this temporal coordinate has not been archived yet. Please switch to the English (VidAPI) source.</p>
               <button 
                 onClick={() => handleDataSourceChange('english')}
                 className="mt-6 px-6 py-3 bg-tardis-glow text-slate-900 font-bold rounded-lg uppercase tracking-widest text-xs hover:bg-white transition-colors"
               >
                 Switch to English
               </button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={videoUrl}
              className="w-full h-full border-none relative z-10"
              allow="autoplay; fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
              title={episode.title}
              onLoad={() => setIsOptimizing(false)}
            />
          )}

          {/* Drive Limitation Notice overlay */}
          <AnimatePresence>
            {showNotice && dataSource === 'arabic' && episode.driveId && (
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
                  Direct stream interception is blocked by Google Drive security protocols.
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-2 border-t border-white/5 pt-2">
                  <strong className="text-white">Note on Resume:</strong> The archive may not automatically jump to <span className="text-tardis-accent">{formatTime(initialTime)}</span> due to iframe restrictions. Please seek manually.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
            </div>

            {/* Current Episode Info */}
            <div className={`w-full text-left relative overflow-hidden flex flex-col sm:flex-row gap-6 ${dataSource === 'english' ? 'px-8 py-8 mx-auto max-w-[1600px] w-full' : 'p-6 glass rounded-2xl border border-white/5'}`}>
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Zap size={120} />
               </div>
               <div className="flex-1 relative z-10">
                 <h2 className="text-2xl font-black italic uppercase text-white mb-3">{episode.title}</h2>
                 <p className="text-slate-400 text-sm leading-relaxed">{episode.description}</p>
                 <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                   <div className="flex items-center gap-4">
                     <div className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                       S{episode.season} E{episode.episodeNumber < 10 ? '0': ''}{episode.episodeNumber}
                     </div>
                     <div className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Clock size={12} /> {episode.duration || '45m'}
                     </div>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 transition-colors">
                       <Zap size={14} className="text-tardis-glow" /> Boost Signal
                     </button>
                     <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2 transition-colors">
                       <History size={14} /> Add to Log
                     </button>
                     <button className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 flex items-center justify-center text-white transition-colors">
                       <ArrowLeft size={14} className="rotate-90" />
                     </button>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

        {/* Recommended Sidebar / Grid */}
        {recommendedEpisodes && recommendedEpisodes.length > 0 && (
          <div className={dataSource === 'english' 
            ? "w-full max-w-[1600px] mx-auto px-8 pb-40 flex flex-col flex-none" 
            : "w-[320px] lg:w-[400px] flex-none border-l border-white/5 bg-black/60 backdrop-blur-xl flex flex-col p-6 overflow-y-auto pb-32"}>
             
             <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-6 flex items-center gap-2">
               <Play size={14} className="text-tardis-glow" /> 
               Up Next In Archive
             </h3>
             
             <div className={dataSource === 'english' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "flex flex-col gap-4"}>
                {recommendedEpisodes.map((rec) => (
                   <button 
                     key={rec.id}
                     onClick={() => onSelectEpisode?.(rec)}
                     className={dataSource === 'english'
                       ? "group flex flex-col text-left hover:bg-white/5 p-3 rounded-xl transition-colors border border-transparent hover:border-white/10"
                       : "group flex gap-3 lg:gap-4 items-start text-left hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors border border-transparent hover:border-white/10"
                     }
                   >
                     <div className={dataSource === 'english'
                       ? "w-full aspect-video rounded-lg overflow-hidden relative flex-none mb-3"
                       : "w-28 lg:w-36 aspect-video rounded-lg overflow-hidden relative flex-none"
                     }>
                       <img src={rec.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                       <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur text-[9px] font-mono px-1 rounded text-white border border-white/10">
                         {rec.duration || '45m'}
                       </div>
                     </div>
                     <div className="flex flex-col py-1">
                       <h4 className="text-xs lg:text-sm font-bold text-white leading-tight group-hover:text-tardis-glow transition-colors line-clamp-2">{rec.title}</h4>
                       <span className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-wider">
                         S{rec.season} E{rec.episodeNumber}
                       </span>
                     </div>
                   </button>
                ))}
             </div>
          </div>
        )}

      </div>

      {/* Decorative TARDIS Controls HUD (Bottom Bar) */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end px-12 pb-8 pointer-events-none z-40">
         <div className="w-full flex justify-between items-end border-b-2 border-tardis-glow/20 pb-4 relative">
            <div className="absolute bottom-0 left-0 w-1/3 h-[2px] bg-tardis-glow shadow-[0_0_15px_cyan]" />
            <div className="flex flex-col gap-1 pointer-events-auto cursor-pointer" onClick={() => {
              if(dataSource === 'arabic') setIsPlaying(!isPlaying);
            }}>
               <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center gap-2">
                 <RefreshCw size={12} className={isPlaying ? "animate-spin text-tardis-glow" : ""} />
                 Tracking Chronos
               </span>
               <div className="flex items-center gap-4">
                 <span className="text-3xl font-mono font-black text-white italic drop-shadow-md">
                   {formatTime(playedSeconds)}
                 </span>
                 <div className="flex gap-2">
                   {onPrev && (
                     <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-tardis-glow/20 hover:border-tardis-glow/50 transition-all text-slate-400 hover:text-white">
                       <SkipBack size={16} />
                     </button>
                   )}
                   {onNext && (
                     <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-tardis-glow/20 hover:border-tardis-glow/50 transition-all text-slate-400 hover:text-white">
                       <SkipForward size={16} />
                     </button>
                   )}
                 </div>
               </div>
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

