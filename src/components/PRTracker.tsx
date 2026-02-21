import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Trophy, Calendar, Target, Activity } from 'lucide-react';
import { estimate1RM } from '@/lib/iron-logic';

export const PRTracker = () => {
  const [prHistory, setPrHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('iron-mind-history');
    if (saved) {
      const history = JSON.parse(saved);
      // Logic to find max PRs per lift
      const bests: Record<string, any> = {};
      history.forEach((log: any) => {
        const weight = parseInt(log.volume.replace(/,/g, '')) / log.sets; // rough calc for now
        const est = estimate1RM.epley(weight, 5); // assuming standard reps for now
        if (!bests[log.lift] || est > bests[log.lift].est1RM) {
          bests[log.lift] = { ...log, est1RM: est };
        }
      });
      setPrHistory(Object.values(bests));
    }
  }, []);

  const king = prHistory.length > 0 ? prHistory.reduce((prev, current) => (prev.est1RM > current.est1RM) ? prev : current) : null;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-32">
      <header className="mb-8 pt-6">
        <h1 className="text-3xl font-black tracking-tighter italic text-blue-500 flex items-center gap-3">
          <TrendingUp size={32} />
          STRENGTH <span className="text-white">INTEL</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Personal Records & Estimation</p>
      </header>

      {king ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl mb-8">
          <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
            <Trophy size={120} className="text-blue-500" />
          </div>
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Current King</span>
          <h2 className="text-2xl font-black italic mt-1">{king.lift}</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-6xl font-black italic text-blue-500">{king.est1RM}</span>
            <span className="text-lg font-bold text-zinc-500 italic uppercase">Est. 1RM</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-wider">
            <ArrowUpRight size={16} />
            <span>Top Tier Performance</span>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] mb-8">
           <p className="text-zinc-700 font-bold uppercase tracking-widest text-xs px-12">Log your first session to see Strength Intel</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-5">
           <Target size={20} className="text-zinc-600 mb-2" />
           <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Active Focus</div>
           <div className="text-xl font-black italic mt-1 text-white">FOUNDER</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-5">
           <Activity size={20} className="text-zinc-600 mb-2" />
           <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Rank</div>
           <div className="text-xl font-black italic mt-1 text-white">ELITE</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-1">Hall of Fame</h3>
        {prHistory.map((pr, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-zinc-800 p-2.5 rounded-xl text-zinc-500">
                <Trophy size={18} />
              </div>
              <div>
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{pr.lift}</div>
                <div className="text-lg font-black italic text-zinc-300">{pr.est1RM} lbs</div>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
};
