import React, { useState } from 'react';
import { History, Calendar, Dumbbell, ChevronRight, X, Activity, TrendingUp, Zap } from 'lucide-react';
import { estimate1RM } from '@/lib/iron-logic';

import { WorkoutLog } from '@/lib/types';

export const HistoryScreen = ({ logs }: { logs: WorkoutLog[] }) => {
  const [selectedLog, setSelectedLog] = useState<WorkoutLog | null>(null);

  // Helper to calculate intensity (relative to some baseline or just raw est1RM)
  const calculateIntensity = (log: WorkoutLog) => {
    const vol = parseFloat(String(log.volume || '0').replace(/,/g, ''));
    const sets = parseInt(String(log.sets)) || 1;
    const avgWeight = vol / sets;
    return estimate1RM.epley(avgWeight, 5); // Estimate 1RM for this specific session
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-32">
      <header className="mb-8 pt-6">
        <h1 className="text-3xl font-black tracking-tighter italic text-blue-500 flex items-center gap-3">
          <History size={32} />
          IRON <span className="text-white">LOGS</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Your Training Journey</p>
      </header>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
             <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No sessions logged yet</p>
          </div>
        ) : (
          logs.map((log, i) => {
            const intensity = calculateIntensity(log);
            return (
              <div 
                key={i} 
                onClick={() => setSelectedLog({ ...log, intensity })}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between hover:border-zinc-700 transition-colors cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className="bg-zinc-800 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
                    <Dumbbell size={22} className="text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{log.date}</div>
                    <div className="text-xl font-black italic mt-0.5">{log.lift}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="text-xs font-bold text-zinc-600">{log.sets} sets • {log.volume} lbs</div>
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
                        <Zap size={10} strokeWidth={3} />
                        {intensity}
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-800 group-hover:text-blue-500" />
              </div>
            );
          })
        )}
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8 pt-4">
            <h2 className="text-2xl font-black italic text-white tracking-tight uppercase">Session Intel</h2>
            <button onClick={() => setSelectedLog(null)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity size={120} className="text-blue-500" />
            </div>
            <div className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">{selectedLog.date}</div>
            <h3 className="text-5xl font-black italic mb-6">{selectedLog.lift}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Volume</div>
                <div className="text-2xl font-black italic tabular-nums">{selectedLog.volume}</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Pounds moved</div>
              </div>
              <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Peak Intensity</div>
                <div className="text-2xl font-black italic tabular-nums text-emerald-500">{selectedLog.intensity}</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Est. 1RM Output</div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto">
             <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity size={18} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">CNS Workload</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-zinc-500 uppercase">Intensity Rank</span>
                    <span className={`text-sm font-black italic ${(selectedLog.intensity ?? 0) > 300 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {(selectedLog.intensity ?? 0) > 350 ? 'ELITE' : (selectedLog.intensity ?? 0) > 250 ? 'HEAVY' : 'MODERATE'}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-1000" 
                      style={{ width: `${Math.min(((selectedLog.intensity ?? 0) / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
             </div>

             <div className="px-2">
                <p className="text-zinc-500 text-[10px] font-bold uppercase leading-relaxed tracking-widest">
                  This session represents a {(selectedLog.intensity ?? 0) > 300 ? 'heavy' : 'moderate'} load for your central nervous system. Prioritize protein and sleep for the next 24 hours to maximize adaptation.
                </p>
             </div>
          </div>

          <button 
            onClick={() => setSelectedLog(null)}
            className="mt-6 w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-900/40 tracking-widest italic"
          >
            CLOSE INTEL
          </button>
        </div>
      )}

      <div className="mt-12 text-center pb-20">
        <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em]">End of History</p>
      </div>
    </div>
  );
};
