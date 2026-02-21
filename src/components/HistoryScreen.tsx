import React from 'react';
import { History, Calendar, Dumbbell, ChevronRight } from 'lucide-react';

const mockLogs = [
  { id: '1', date: 'Feb 20, 2026', lift: 'SQUAT', sets: '3 sets', volume: '3,240 lbs' },
  { id: '2', date: 'Feb 18, 2026', lift: 'BENCH', sets: '3 sets', volume: '1,890 lbs' },
  { id: '3', date: 'Feb 15, 2026', lift: 'DEADLIFT', sets: '3 sets', volume: '4,100 lbs' },
  { id: '4', date: 'Feb 12, 2026', lift: 'PRESS', sets: '3 sets', volume: '1,100 lbs' },
];

export const HistoryScreen = () => {
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
        {mockLogs.map((log) => (
          <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between hover:border-zinc-700 transition-colors cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className="bg-zinc-800 p-3 rounded-2xl group-hover:bg-blue-600 transition-colors">
                <Dumbbell size={22} className="text-zinc-400 group-hover:text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{log.date}</div>
                <div className="text-xl font-black italic mt-0.5">{log.lift}</div>
                <div className="text-xs font-bold text-zinc-600 mt-1">{log.sets} • {log.volume} total volume</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-zinc-800 group-hover:text-blue-500" />
          </div>
        ))}
      </div>

      {/* Empty State / Footer */}
      <div className="mt-12 text-center">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">End of History</p>
      </div>
    </div>
  );
};
