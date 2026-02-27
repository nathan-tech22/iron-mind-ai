import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, Trophy, Calendar, Target, Activity, X, Flame } from 'lucide-react';
import { estimate1RM } from '@/lib/iron-logic';
import { supabase } from '@/lib/supabase';

import { WorkoutLog, CalculatedPR } from '@/lib/types';

const IntensityHeatmap = ({ history }: { history: WorkoutLog[] }): React.ReactElement => {
  // Generate last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toLocaleDateString();
  });

  const intensityMap = history.reduce((acc: Record<string, number>, curr) => {
    const date = new Date(curr.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mt-8 bg-[var(--color-card-bg)]/30 border border-[var(--color-border)]/50 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Flame size={16} className="text-[var(--color-warning)]" />
          <h3 className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Intensity Heatmap</h3>
        </div>
        <span className="text-[9px] font-bold text-[var(--color-text-muted)]/70 uppercase tracking-widest">Last 14 Days</span>
      </div>
      <div className="flex justify-between items-end gap-1.5 h-12">
        {days.map((date, i) => {
          const count = intensityMap[date] || 0;
          const opacity = count === 0 ? 0.05 : Math.min(0.2 + (count * 0.2), 1);
          return (
            <div 
              key={i} 
              className="flex-1 rounded-sm bg-[var(--color-primary)] transition-all duration-700"
              style={{ 
                height: count === 0 ? '20%' : `${Math.min(40 + (count * 20), 100)}%`,
                opacity 
              }}
              title={`${date}: ${count} sessions`}
            />
          );
        })}
      </div>
    </div>
  );
};

const StructuralBalance = ({ history }: { history: CalculatedPR[] }): React.ReactElement | null => {
  const getBest = (name: string) => {
    const logs = history.filter(h => h.lift?.toUpperCase() === name.toUpperCase());
    return logs.length > 0 ? Math.max(...logs.map(l => l.est1RM)) : 0;
  };

  const squat = getBest('SQUAT');
  const deadlift = getBest('DEADLIFT');
  const bench = getBest('BENCH');
  const press = getBest('PRESS');

  const ratios = [
    { label: 'PRESS : BENCH', val: bench > 0 ? (press / bench) * 100 : 0, target: 65 },
    { label: 'BENCH : SQUAT', val: squat > 0 ? (bench / squat) * 100 : 0, target: 75 },
    { label: 'SQUAT : DEAD', val: deadlift > 0 ? (squat / deadlift) * 100 : 0, target: 90 },
  ];

  if (squat === 0 && bench === 0) return null;

  return (
    <div className="mt-8 bg-[var(--color-card-bg)]/30 border border-[var(--color-border)]/50 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[var(--color-primary)]" />
          <h3 className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.2em]">Structural Balance</h3>
        </div>
        <span className="text-[9px] font-bold text-[var(--color-text-muted)]/70 uppercase tracking-widest">Ideal Ratios</span>
      </div>
      <div className="space-y-5">
        {ratios.map(r => (
          <div key={r.label} className="space-y-2">
            <div className="flex justify-between items-end px-1">
              <span className="text-[9px] font-black text-[var(--color-text-muted)]/80 tracking-widest">{r.label}</span>
              <span className={`text-[10px] font-black italic ${r.val >= r.target ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                {Math.round(r.val)}% / {r.target}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-[var(--color-background)] rounded-full overflow-hidden border border-[var(--color-border)] relative">
               {/* Target Marker */}
               <div className="absolute top-0 bottom-0 w-0.5 bg-[var(--color-border)] z-10" style={{ left: `${r.target}%` }} />
               <div 
                className={`h-full transition-all duration-1000 ${r.val >= r.target ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary)]'}`} 
                style={{ width: `${Math.min(r.val, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressChart = ({ history, liftName }: { history: CalculatedPR[], liftName: string }) => {
  const liftData = history
    .filter(h => h.lift?.toUpperCase() === liftName?.toUpperCase())
    .reverse();

  if (liftData.length < 2) return null;

  const max = Math.max(...liftData.map(d => d.est1RM));
  const min = Math.min(...liftData.map(d => d.est1RM));
  const range = max - min || 10;

  return (
    <div className="mt-8 space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-end px-1">
        <h3 className="text-[10px] font-black text-[var(--color-text-muted)]/70 uppercase tracking-[0.2em]">7-Session Trend</h3>
        <span className="text-[9px] font-bold text-[var(--color-success)] uppercase tracking-widest">Calculated Peak</span>
      </div>
      <div className="h-24 flex items-end justify-between gap-1 px-2">
        {liftData.map((d, i) => {
          const height = ((d.est1RM - min) / range) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex justify-center items-end h-full">
                <div 
                  className="w-full bg-[var(--color-primary)]/20 rounded-t-lg group-hover:bg-[var(--color-primary)]/40 transition-all duration-500"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <div 
                  className="absolute bottom-0 w-full bg-[var(--color-primary)] rounded-t-lg shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-500"
                  style={{ height: `${Math.max(height, 5)}%`, opacity: 0.8 }}
                />
              </div>
              <span className="text-[8px] font-black text-[var(--color-text-muted)]/70 italic">{d.est1RM}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PRTracker = () => {
  const [prHistory, setPrHistory] = useState<any[]>([]);
  const [fullHistory, setFullHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPR, setSelectedPR] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | 'all'>('all'); // New state for time range

  const filterHistoryByTimeRange = (data: CalculatedPR[], range: '3m' | '6m' | 'all') => {
    if (range === 'all') return data;

    const now = new Date();
    let cutoffDate = new Date();

    if (range === '3m') {
      cutoffDate.setMonth(now.getMonth() - 3);
    } else if (range === '6m') {
      cutoffDate.setMonth(now.getMonth() - 6);
    }

    return data.filter(d => new Date(d.date) >= cutoffDate);
  };

  const filteredHistory = filterHistoryByTimeRange(fullHistory, timeRange);

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
          const allCalculated = workouts.map((w: any) => ({
            lift: w.lifts?.name?.toUpperCase() || 'UNKNOWN',
            est1RM: estimate1RM.epley(w.weight_used || 0, w.reps_completed || 0),
            date: new Date(w.workout_date).toLocaleDateString()
          }));

          const bests: Record<string, any> = {};
          allCalculated.forEach((item: any) => {
            if (!bests[item.lift] || item.est1RM > bests[item.lift].est1RM) {
              bests[item.lift] = item;
            }
          });

          setFullHistory(allCalculated);
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
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-muted)] italic">Calculating Gains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)] text-[var(--color-text)] p-6 pb-32">
      <header className="mb-8 pt-6">
        <h1 className="text-3xl font-black tracking-tighter italic text-[var(--color-primary)] flex items-center gap-3">
          <TrendingUp size={32} />
          STRENGTH <span className="text-[var(--color-text)]">INTEL</span>
        </h1>
        <p className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-widest mt-2">Personal Records & Estimation</p>
      </header>

      {king ? (
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl mb-8">
          <div className="absolute -top-4 -right-4 opacity-10 rotate-12">
            <Trophy size={120} className="text-[var(--color-primary)]" />
          </div>
          <span className="text-[var(--color-text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">Current King</span>
          <h2 className="text-2xl font-black italic mt-1">{king.lift}</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-6xl font-black italic text-[var(--color-primary)]">{king.est1RM}</span>
            <span className="text-lg font-bold text-[var(--color-text-muted)] italic uppercase">Est. 1RM</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[var(--color-success)] text-xs font-bold uppercase tracking-wider">
            <ArrowUpRight size={16} />
            <span>Top Tier Performance</span>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--color-border)]/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Milestone Tracker</span>
              <span className="text-[9px] font-bold text-[var(--color-primary)] uppercase tracking-widest italic">Road to 2-Plate</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--color-background)] rounded-full overflow-hidden border border-[var(--color-border)]">
               <div 
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000" 
                style={{ width: `${Math.min((king.est1RM / 225) * 100, 100)}%` }}
              />
            </div>
          </div>

          <ProgressChart history={filteredHistory} liftName={king.lift} />

          <div className="flex justify-center gap-2 mt-4">
            <button 
              onClick={() => setTimeRange('3m')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                timeRange === '3m' ? 'bg-[var(--color-primary)] text-[var(--color-text)]' : 'bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'}
              }`}
            >
              3 Months
            </button>
            <button 
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                timeRange === '6m' ? 'bg-[var(--color-primary)] text-[var(--color-text)]' : 'bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'}
              }`}
            >
              6 Months
            </button>
            <button 
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                timeRange === 'all' ? 'bg-[var(--color-primary)] text-[var(--color-text)]' : 'bg-[var(--color-card-bg)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]'}
              }`}
            >
              All Time
            </button>
          </div>

        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-[var(--color-border)] rounded-[3rem] mb-8">
           <p className="text-[var(--color-text-muted)]/70 font-bold uppercase tracking-widest text-xs px-12">Log your first session to see Strength Intel</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[var(--color-card-bg)]/50 border border-[var(--color-border)]/50 rounded-3xl p-5">
           <Target size={20} className="text-[var(--color-text-muted)]/70 mb-2" />
           <div className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Active Focus</div>
           <div className="text-xl font-black italic mt-1 text-[var(--color-text)]">FOUNDER</div>
        </div>
        <div className="bg-[var(--color-card-bg)]/50 border border-[var(--color-border)]/50 rounded-3xl p-5">
           <Activity size={20} className="text-[var(--color-text-muted)]/70 mb-2" />
           <div className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">Rank</div>
           <div className="text-xl font-black italic mt-1 text-[var(--color-text)]">ELITE</div>
        </div>
      </div>

      <IntensityHeatmap history={fullHistory} />
      <StructuralBalance history={fullHistory} />

      <div className="space-y-4 mt-8">
        <h3 className="text-[10px] font-black text-[var(--color-text-muted)]/70 uppercase tracking-[0.2em] px-1">Hall of Fame</h3>
        {prHistory.map((pr, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedPR(pr)}
            className="bg-[var(--color-card-bg)]/40 border border-[var(--color-border)]/40 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:border-[var(--color-primary)]/50 transition-colors active:scale-95"
          >
            <div className="flex items-center gap-4">
              <div className="bg-[var(--color-border)] p-2.5 rounded-xl text-[var(--color-text-muted)]">
                <Trophy size={18} />
              </div>
              <div>
                <div className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">{pr.lift}</div>
                <div className="text-lg font-black italic text-[var(--color-text)]">{pr.est1RM} lbs</div>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-[var(--color-border)] hover:text-[var(--color-primary)]" />
          </div>
        ))}
      </div>

      {selectedPR && (
        <div className="fixed inset-0 z-[200] bg-[var(--color-background)]/95 backdrop-blur-xl flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-8 pt-4">
            <h2 className="text-2xl font-black italic text-[var(--color-text)] tracking-tight uppercase">Strength Record</h2>
            <button onClick={() => setSelectedPR(null)} className="p-2 bg-[var(--color-card-bg)] rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <X size={24} />
            </button>
          </div>
          
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-[2.5rem] p-8 mb-6 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
              <Trophy size={160} className="text-[var(--color-primary)]" />
            </div>
            <div className="text-xs font-black text-[var(--color-primary)] uppercase tracking-[0.2em] mb-2">Record Set: {selectedPR.date}</div>
            <h3 className="text-5xl font-black italic mb-6">{selectedPR.lift}</h3>
            
            <div className="space-y-1">
              <div className="text-6xl font-black italic text-[var(--color-text)] tracking-tighter">{selectedPR.est1RM}</div>
              <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Calculated Peak 1RM (LBS)</div>
            </div>

            <ProgressChart history={fullHistory} liftName={selectedPR.lift} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-card-bg)]/50 border border-[var(--color-border)] rounded-2xl p-5">
                <div className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Consistency</div>
                <div className="text-xl font-black italic text-[var(--color-success)]">ELITE</div>
              </div>
              <div className="bg-[var(--color-card-bg)]/50 border border-[var(--color-border)] rounded-2xl p-5">
                <div className="text-[9px] font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Status</div>
                <div className="text-xl font-black italic text-[var(--color-primary)]">VERIFIED</div>
              </div>
            </div>
            
            <p className="text-[var(--color-text-muted)] text-sm font-medium leading-relaxed px-2">
              This record represents your highest calculated output for {selectedPR.lift}. Stay consistent to push the ceiling higher.
            </p>
          </div>

          <button 
            onClick={() => setSelectedPR(null)}
            className="mt-6 w-full bg-[var(--color-primary)] text-[var(--color-text)] font-black py-5 rounded-2xl shadow-lg shadow-[var(--color-primary)]/40 tracking-widest italic"
          >
            DISMISS
          </button>
        </div>
      )}
    </div>
  );
};
