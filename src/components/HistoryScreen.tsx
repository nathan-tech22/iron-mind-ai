import React, { useState } from 'react';
import { History, Calendar, Dumbbell, ChevronRight, X, Activity } from 'lucide-react';

export const HistoryScreen = ({ logs }: { logs: any[] }) => {
  const [selectedLog, setSelectedLog] = useState<any>(null);

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
          logs.map((log, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedLog(log)}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between hover:border-zinc-700 transition-colors cursor-pointer group active:scale-[0.98]"
            >
              <div className="flex items-center gap-5">
                <div className="bg-zinc-800 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
                  <Dumbbell size={22} className="text-zinc-400 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{log.date}</div>
                  <div className="text-xl font-black italic mt-0.5">{log.lift}</div>
                  <div className="text-xs font-bold text-zinc-600 mt-1">{log.sets} sets • {log.volume} lbs</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-zinc-800 group-hover:text-blue-500" />
            </div>
          ))
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
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 mb-6">
            <div className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">{selectedLog.date}</div>
            <h3 className="text-5xl font-black italic mb-6">{selectedLog.lift}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Volume</div>
                <div className="text-xl font-black italic">{selectedLog.volume} <span className="text-[10px] not-italic text-zinc-600">LBS</span></div>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Effort</div>
                <div className="text-xl font-black italic">{selectedLog.sets} <span className="text-[10px] not-italic text-zinc-600">SETS</span></div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
             <div className="flex items-center gap-3 text-zinc-500 px-2">
                <Activity size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Detailed Analytics coming in Phase 2</span>
             </div>
             <div className="h-32 bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl flex items-center justify-center">
                <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest text-center px-8 leading-relaxed">Advanced breakdown including velocity and heart rate sync will appear here.</span>
             </div>
          </div>

          <button 
            onClick={() => setSelectedLog(null)}
            className="mt-6 w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-900/40 tracking-widest"
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
