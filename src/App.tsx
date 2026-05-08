import React, { useState, useEffect, useMemo } from 'react';
import { Compass, Library, History, Settings, ExternalLink, Box, ChevronRight, Zap, FolderPlus, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode, WatchState } from './types';
import { EPISODES } from './data/episodes';
import { EpisodeCard } from './components/EpisodeCard';
import { Player } from './components/Player';
import { storageService } from './services/storageService';
import { GallifreyanClock } from './components/GallifreyanClock';

export default function App() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [watchStates, setWatchStates] = useState<Record<string, WatchState>>({});
  const [selectedSeason, setSelectedSeason] = useState<number | null>(5);
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const seasons = useMemo(() => {
    const s = Array.from(new Set(EPISODES.map(e => e.season))).sort((a, b) => a - b);
    return s;
  }, []);

  useEffect(() => {
    setWatchStates(storageService.getWatchStates());
  }, [selectedEpisode]);

  const filteredEpisodes = useMemo(() => {
    let result = [...EPISODES]; // Always work on a copy
    
    // Default sorting: Season first, then Episode Number
    result.sort((a, b) => {
      if (a.season !== b.season) return a.season - b.season;
      return a.episodeNumber - b.episodeNumber;
    });

    if (activeTab === 'recent') {
      const recentIds = Object.keys(watchStates);
      result = result.filter(e => recentIds.includes(e.id));
      result.sort((a, b) => (watchStates[b.id]?.lastUpdated || 0) - (watchStates[a.id]?.lastUpdated || 0));
    } else {
      // Filter by season if in "all" tab
      if (selectedSeason !== null) {
        result = result.filter(e => e.season === selectedSeason);
      }
    }
    
    if (searchQuery) {
      result = result.filter(e => 
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeTab, watchStates, searchQuery, selectedSeason]);

  const resumeEpisodeId = useMemo(() => storageService.getLastWatchedEpisodeId(), [watchStates]);
  const resumeEpisode = EPISODES.find(e => e.id === resumeEpisodeId);

  const sortedAllEpisodes = useMemo(() => {
    return [...EPISODES].sort((a, b) => {
      if (a.season !== b.season) return a.season - b.season;
      return a.episodeNumber - b.episodeNumber;
    });
  }, []);

  const currentEpisodeIndex = selectedEpisode ? sortedAllEpisodes.findIndex(e => e.id === selectedEpisode.id) : -1;
  const hasNext = currentEpisodeIndex >= 0 && currentEpisodeIndex < sortedAllEpisodes.length - 1;
  const hasPrev = currentEpisodeIndex > 0;

  return (
    <div className="min-h-screen flex relative overflow-hidden font-sans">
      {/* Immersive Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 border-[40px] border-tardis-glow/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
           <GallifreyanClock />
        </div>
      </div>

      {/* Left Sidebar: Navigation */}
      <aside className="w-20 bg-black/40 border-r border-cyan-500/10 flex flex-col items-center py-8 z-40 relative">
        <div className="w-12 h-12 bg-tardis-glow rounded-xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.4)] mb-12">
          <Box size={24} />
        </div>
        
        <div className="flex flex-col gap-6">
          <SidebarIcon 
            active={activeTab === 'recent'} 
            onClick={() => setActiveTab('recent')} 
            icon={<History size={20} />}
          />
          <div className="h-px bg-white/5 my-2 w-8 mx-auto" />
          
          {seasons.map(season => (
            <SidebarIcon 
              key={season}
              active={activeTab === 'all' && selectedSeason === season} 
              onClick={() => {
                setActiveTab('all');
                setSelectedSeason(season);
              }} 
              label={season === 0 || season === 10 ? 'SP' : `S${season < 10 ? '0' : ''}${season}`}
            />
          ))}
        </div>

        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-tardis-glow transition-colors cursor-pointer">
            <Settings size={18} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10 relative">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 bg-tardis-blue/80 backdrop-blur-md z-30 border-b border-white/5">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              TARDIS <span className="text-tardis-glow">Archive</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold">Gallifreyan Data Extraction v.4.1</p>
          </div>
          
          <div className="flex items-center gap-6">
            {resumeEpisode && (
              <div className="hidden md:flex bg-tardis-accent/10 border border-tardis-accent/30 px-4 py-2 rounded-full items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-tardis-accent animate-pulse" />
                <span className="text-[10px] font-bold text-tardis-accent uppercase tracking-wider">
                  RESUME: {resumeEpisode.title} — {Math.floor((watchStates[resumeEpisode.id]?.timestamp || 0) / 60)}m
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-white uppercase tracking-tighter">The Doctor</p>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">ID: DW-2342-99</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tardis-glow to-blue-600 border border-white/10" />
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Hero / Resume Section (Enhanced Layout) */}
          {resumeEpisode && !selectedEpisode && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 relative overflow-hidden rounded-2xl bg-black border border-white/5 p-1 group shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row items-stretch bg-slate-900/40 rounded-xl overflow-hidden">
                <div className="w-full lg:w-[600px] aspect-video relative overflow-hidden">
                  <img src={resumeEpisode.thumbnailUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setSelectedEpisode(resumeEpisode)}
                      className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                    >
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-center">
                   <span className="px-2 py-0.5 bg-tardis-glow text-black text-[10px] font-black rounded uppercase mb-4 w-fit">Currently Priority</span>
                   <h2 className="text-4xl font-black text-white mb-2 leading-tight uppercase italic">{resumeEpisode.title}</h2>
                   <p className="text-sm text-slate-400 mb-8 max-w-md leading-relaxed">{resumeEpisode.description}</p>
                   
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setSelectedEpisode(resumeEpisode)}
                        className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-tardis-glow transition-colors"
                      >
                        Launch Stream
                      </button>
                      <div className="font-mono text-xs text-slate-500">
                        S{resumeEpisode.season} • E0{resumeEpisode.episodeNumber} / POS: {Math.floor((watchStates[resumeEpisode.id]?.timestamp || 0) / 60)}:00
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                {activeTab === 'recent' ? 'Recent Discoveries' : 
                 (selectedSeason === 0 || selectedSeason === 10 ? 'Archive Records / Special Content' : 
                 `Archive Records / S${selectedSeason && selectedSeason < 10 ? '0' : ''}${selectedSeason} Episodes`)}
              </h2>
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 opacity-50 cursor-not-allowed">
                    <ChevronRight className="rotate-180" size={14} />
                 </div>
                 <div className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-tardis-glow hover:border-tardis-glow transition-colors cursor-pointer">
                    <ChevronRight size={14} />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEpisodes.map((episode, index) => (
                <motion.div
                  key={episode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EpisodeCard 
                    episode={episode} 
                    onClick={setSelectedEpisode}
                    progress={watchStates[episode.id]?.timestamp ? 80 : 0}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-24 p-12 bg-black/40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          <div>TARDIS ARCHIVE // S.N. 2342-99 // SECTOR: LONDON 2024</div>
          <div className="flex gap-12">
            <span>Progress Encryption Stable</span>
            <span>Quantum Link: ACTIVE</span>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {selectedEpisode && (
          <Player 
            key={selectedEpisode.id}
            episode={selectedEpisode} 
            initialTime={watchStates[selectedEpisode.id]?.timestamp || 0}
            onBack={() => setSelectedEpisode(null)} 
            onNext={hasNext ? () => setSelectedEpisode(sortedAllEpisodes[currentEpisodeIndex + 1]) : undefined}
            onPrev={hasPrev ? () => setSelectedEpisode(sortedAllEpisodes[currentEpisodeIndex - 1]) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarIcon({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon?: React.ReactNode, label?: string, key?: React.Key }) {
  return (
    <button 
      onClick={onClick}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        active 
          ? 'border-2 border-tardis-glow text-tardis-glow shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
          : 'border border-slate-800 text-slate-600 hover:text-slate-300 hover:border-slate-600'
      }`}
    >
      {label ? <span className="text-xs font-bold">{label}</span> : icon}
    </button>
  );
}

