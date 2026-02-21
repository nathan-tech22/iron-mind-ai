import React from 'react';
import { TrendingUp, ArrowUpRight, Trophy, Calendar } from 'lucide-react';

// This will eventually be powered by the Supabase 'workouts' table
const mockHistory = [
  { id: '1', date: '2026-02-15', lift: 'SQUAT', weight: 315, reps: 5, est1RM: 367 },
  { id: '2', date: '2026-02-10', lift: 'BENCH', weight: 225, reps: 3, est1RM: 247 },
  { id: '3', date: '2026-01-28', lift: 'DEADLIFT', weight: 405, reps: 1, est1RM: 405 },
];

export const PRTracker = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter italic text-blue-500 flex items-center gap-3">
          <TrendingUp size={32} />
          STRENGTH <span className="text-white">INTEL</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Personal Records & Estimation</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={80} className="text-blue-500" />
          </div>
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Current King</span>
          <h2 className="text-2xl font-black italic mt-1">SQUAT</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-black italic text-blue-500">367</span>
            <span className="text-lg font-bold text-zinc-500 italic">EST. 1RM</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-emerald-500 text-xs font-bold">
            <ArrowUpRight size={14} />
            <span>+12 LBS THIS MONTH</span>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">Recent Breakthroughs</h3>
        {mockHistory.map((pr) => (
          <div key={pr.id} className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-zinc-800 p-3 rounded-xl">
                <Calendar size={20} className="text-zinc-400" />
              </div>
              <div>
                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">{pr.lift}</div>
                <div className="text-lg font-black italic">{pr.weight} <span className="text-zinc-500 not-italic">×</span> {pr.reps}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Est. 1RM</div>
              <div className="text-xl font-black italic">{pr.est1RM}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon: Chart.js Integration */}
      <div className="mt-8 p-6 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center py-12">
        <TrendingUp className="text-zinc-800 mb-4" size={40} />
        <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Strength Graph Rendering...</p>
      </div>
    </div>
  );
};
