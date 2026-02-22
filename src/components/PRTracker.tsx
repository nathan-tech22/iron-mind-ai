import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Trophy, Calendar, Target, Activity, X } from 'lucide-react';
import { estimate1RM } from '@/lib/iron-logic';
import { supabase } from '@/lib/supabase';

export const PRTracker = () => {
  const [prHistory, setPrHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPR, setSelectedPR] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Try Supabase first
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== 'demo-user') {
        const { data: workouts } = await supabase
          .from('workouts')
          .select('*, lifts(name)')
          .order('workout_date', { ascending: false });
        
        if (workouts && workouts.length > 0) {
          const bests: Record<string, any> = {};
          workouts.forEach((w: any) => {
            const weightUsed = w.weight_used || 0;
            const reps = w.reps_completed || 0;
            const est = estimate1RM.epley(weightUsed, reps);
            const liftName = w.lifts?.name?.toUpperCase() || 'UNKNOWN';
            
            if (!bests[liftName] || est > bests[liftName].est1RM) {
              bests[liftName] = { 
                lift: liftName, 
                est1RM: est, 
                date: new Date(w.workout_date).toLocaleDateString() 
              };
            }
          });
          setPrHistory(Object.values(bests).sort((a, b) => b.est1RM - a.est1RM));
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to LocalStorage
      const saved = localStorage.getItem('iron-mind-history');
      if (saved) {
        const history = JSON.parse(saved);
        const bests: Record<string, any> = {};
        history.forEach((log: any) => {
          const weight = parseInt(log.volume.replace(/,/g, '')) / log.sets;
          const est = estimate1RM.epley(weight, 5);
          if (!bests[log.lift] || est > bests[log.lift].est1RM) {
            bests[log.lift] = { ...log, est1RM: est };
          }
        });
        setPrHistory(Object.values(bests));
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const king = prHistory.length > 0 ? prHistory.reduce((prev, current) => (prev.est1RM > current.est1RM) ? prev : current) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Calculating Gains...</p>
        </div>
      </div>
    );
  }

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
          <div 
            key={i} 
            onClick={() => setSelectedPR(pr)}
            className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-blue-500/50 transition-colors active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-zinc-800 p-2.5 rounded-xl text-zinc-500">
                <Trophy size={18} />
              </div>
              <div>
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{pr.lift}</div>
                <div className="text-lg font-black italic text-zinc-300">{pr.est1RM} lbs</div>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-zinc-800 hover:text-blue-500" />
          </div>
        ))}
      </div>

      {selectedPR && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8 pt-4">
            <h2 className="text-2xl font-black italic text-white tracking-tight uppercase">Strength Record</h2>
            <button onClick={() => setSelectedPR(null)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 mb-6 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
              <Trophy size={160} className="text-blue-500" />
            </div>
            <div className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Record Set: {selectedPR.date}</div>
            <h3 className="text-5xl font-black italic mb-6">{selectedPR.lift}</h3>
            
            <div className="space-y-1">
              <div className="text-6xl font-black italic text-white tracking-tighter">{selectedPR.est1RM}</div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Calculated Peak 1RM (LBS)</div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Consistency</div>
                <div className="text-xl font-black italic text-emerald-500">ELITE</div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</div>
                <div className="text-xl font-black italic text-blue-500">VERIFIED</div>
              </div>
            </div>
            
            <p className="text-zinc-500 text-sm font-medium leading-relaxed px-2">
              This record represents your highest calculated output for {selectedPR.lift}. Stay consistent to push the ceiling higher.
            </p>
          </div>

          <button 
            onClick={() => setSelectedPR(null)}
            className="mt-6 w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-900/40 tracking-widest italic"
          >
            DISMISS
          </button>
        </div>
      )}
    </div>
  );
};
