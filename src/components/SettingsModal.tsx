import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Trash2, MonitorPlay, Zap, Globe, HardDrive } from 'lucide-react';
import { storageService } from '../services/storageService';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChanged?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsChanged }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(storageService.getSettings());
    }
  }, [isOpen]);

  const handleSave = () => {
    if (settings) {
      storageService.saveSettings(settings);
      onSettingsChanged?.();
      onClose();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to purge all Gallifreyan Data Extraction history? This cannot be undone.")) {
      storageService.clearWatchHistory();
      window.location.reload();
    }
  };

  if (!isOpen || !settings) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-slate-900 border border-tardis-glow/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tardis-glow/10 flex items-center justify-center text-tardis-glow">
                <HardDrive size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black italic uppercase text-white tracking-widest">Archive Settings</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">System Configuration Preferences</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            
            {/* Playback Settings */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MonitorPlay size={14} /> Playback Protocol
              </h3>
              <div className="space-y-4 bg-black/30 rounded-xl p-4 border border-white/5">
                
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-bold text-white uppercase tracking-wider">Auto-Play Next Episode</p>
                     <p className="text-xs text-slate-500 font-mono mt-1">Automatically engage chronal drive for next log</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={settings.autoPlayNext} onChange={(e) => setSettings({...settings, autoPlayNext: e.target.checked})} />
                     <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tardis-glow"></div>
                   </label>
                </div>

                <div className="h-px w-full bg-white/5" />

                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-bold text-white uppercase tracking-wider">Default Stream Quality</p>
                     <p className="text-xs text-slate-500 font-mono mt-1">Resolution of incoming transmission</p>
                   </div>
                   <div className="flex gap-2">
                     {['360p', '720p', '1080p'].map(q => (
                       <button 
                         key={q}
                         onClick={() => setSettings({...settings, defaultQuality: q})}
                         className={`px-3 py-1.5 rounded border text-xs font-bold uppercase tracking-widest transition-colors ${settings.defaultQuality === q ? 'bg-tardis-glow text-black border-tardis-glow' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'}`}
                       >
                         {q}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Content & Data */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Globe size={14} /> Data Source Grid
              </h3>
              <div className="space-y-4 bg-black/30 rounded-xl p-4 border border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                   <div>
                     <p className="text-sm font-bold text-white uppercase tracking-wider">Primary Language Track</p>
                     <p className="text-xs text-slate-500 font-mono mt-1">Translation matrix preference</p>
                   </div>
                   <div className="flex bg-slate-900 rounded-lg p-1 border border-white/10">
                      <button 
                        onClick={() => setSettings({...settings, dataSource: 'arabic'})}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${settings.dataSource === 'arabic' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Arabic (Original)
                      </button>
                      <button 
                        onClick={() => setSettings({...settings, dataSource: 'english'})}
                        className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${settings.dataSource === 'english' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        English
                      </button>
                   </div>
                </div>
              </div>
            </section>

            {/* Interface & Visuals */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Zap size={14} /> Interface Matrix
              </h3>
              <div className="space-y-4 bg-black/30 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between">
                   <div>
                     <p className="text-sm font-bold text-white uppercase tracking-wider">Ambient Animations</p>
                     <p className="text-xs text-slate-500 font-mono mt-1">Toggle background Gallifreyan clock & effects</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" checked={settings.ambientAnimations} onChange={(e) => setSettings({...settings, ambientAnimations: e.target.checked})} />
                     <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tardis-glow"></div>
                   </label>
                </div>
              </div>
            </section>

            {/* Danger Zone */}
            <section>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Trash2 size={14} /> System Purge
              </h3>
              <div className="bg-red-950/20 rounded-xl p-4 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div>
                   <p className="text-sm font-bold text-red-400 uppercase tracking-wider">Clear Memory Banks</p>
                   <p className="text-xs text-red-500/60 font-mono mt-1">Erase all watch history and progress logs</p>
                 </div>
                 <button 
                   onClick={handleClearHistory}
                   className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                 >
                   <Trash2 size={14} /> Execute Purge
                 </button>
              </div>
            </section>

          </div>

          <div className="p-6 border-t border-white/5 bg-black/50 flex justify-end gap-4">
             <button 
               onClick={onClose}
               className="px-6 py-2 rounded-full border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
             >
               Discard
             </button>
             <button 
               onClick={handleSave}
               className="px-6 py-2 rounded-full bg-tardis-glow text-black text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
             >
               <Save size={14} /> Save Configuration
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
