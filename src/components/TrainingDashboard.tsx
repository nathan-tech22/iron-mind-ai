import React, { useState } from 'react';
import { VisualBarbell } from './VisualBarbell';
import { Dumbbell, History, TrendingUp, Settings as SettingsIcon, CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateWorkout } from '@/lib/workout-logic';
import { PRTracker } from './PRTracker';
import { HistoryScreen } from './HistoryScreen';
import { SettingsScreen } from './SettingsScreen';

const initialLifts = [
  { id: '1', name: 'SQUAT', tm: 315 },
  { id: '2', name: 'BENCH', tm: 225 },
  { id: '3', name: 'DEADLIFT', tm: 405 },
  { id: '4', name: 'PRESS', tm: 135 },
];

const TrainingDashboard = ({ initialLifts }: { initialLifts: any[] }) => {
  const [selectedLift, setSelectedLift] = useState(initialLifts[0]);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [week, setWeek] = useState(1);

  const workoutSets = calculateWorkout(selectedLift.tm, week);

  const toggleSet = (index: number) => {
    setCompletedSets(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const cycleWeek = (dir: number) => {
    setWeek(prev => {
      const next = prev + dir;
      if (next > 4) return 1;
      if (next < 1) return 4;
      return next;
    });
    setCompletedSets([]);
  };

  const activeWeight = completedSets.length > 0 
    ? workoutSets[Math.min(completedSets.length, workoutSets.length - 1)].weight 
    : workoutSets[0].weight;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32 font-sans text-center md:text-left">
      <header className="p-6 pt-12 flex justify-between items-center max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-black tracking-tighter italic text-blue-500">
          IRON-MIND <span className="text-white">AI</span>
        </h1>
        <div className="flex items-center gap-4 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">
          <button onClick={() => cycleWeek(-1)}><ChevronLeft size={20} className="text-zinc-500" /></button>
          <span className="text-[10px] font-black uppercase tracking-widest w-16 text-center">
            {week === 4 ? 'Deload' : `Week ${week}`}
          </span>
          <button onClick={() => cycleWeek(1)}><ChevronRight size={20} className="text-zinc-500" /></button>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-6 max-w-2xl mx-auto w-full">
        <VisualBarbell weight={activeWeight} />

        <div className="grid grid-cols-2 gap-3">
          {initialLifts.map((lift) => (
            <button
              key={lift.id}
              onClick={() => {
                setSelectedLift(lift);
                setCompletedSets([]);
              }}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
                selectedLift.id === lift.id 
                  ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                selectedLift.id === lift.id ? 'text-blue-100' : 'text-zinc-500'
              }`}>
                {lift.name}
              </div>
              <div className="text-xl font-black italic">{lift.tm}</div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Main Sets</h2>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">90% Training Max</span>
          </div>
          
          {workoutSets.map((set, i) => (
            <div 
              key={i}
              onClick={() => toggleSet(i)}
              className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                completedSets.includes(i) 
                  ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`text-xs font-black w-8 ${completedSets.includes(i) ? 'text-emerald-500' : 'text-zinc-600'}`}>
                  {set.percentage}%
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black italic tabular-nums">
                    {set.weight} <span className="text-sm not-italic text-zinc-500 font-bold ml-1">LBS</span>
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest ${completedSets.includes(i) ? 'text-emerald-500/70' : 'text-zinc-500'}`}>
                    Target: {set.reps} Reps
                  </div>
                </div>
              </div>
              {completedSets.includes(i) ? (
                <div className="bg-emerald-500 rounded-full p-1">
                  <CheckCircle2 className="text-black" size={24} />
                </div>
              ) : (
                <Circle className="text-zinc-700" size={28} />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export const AppContent = () => {
  const [activeTab, setActiveTab] = useState('train');
  const [lifts, setLifts] = useState([
    { id: '1', name: 'SQUAT', tm: 315 },
    { id: '2', name: 'BENCH', tm: 225 },
    { id: '3', name: 'DEADLIFT', tm: 405 },
    { id: '4', name: 'PRESS', tm: 135 },
  ]);

  // Persistent Storage Logic
  useEffect(() => {
    const saved = localStorage.getItem('iron-mind-lifts');
    if (saved) setLifts(JSON.parse(saved));
  }, []);

  const updateLifts = (newLifts: any[]) => {
    setLifts(newLifts);
    localStorage.setItem('iron-mind-lifts', JSON.stringify(newLifts));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {activeTab === 'train' && <TrainingDashboard initialLifts={lifts} />}
      {activeTab === 'stats' && <PRTracker />}
      {activeTab === 'history' && <HistoryScreen />}
      {activeTab === 'settings' && <SettingsScreen lifts={lifts} onUpdateLifts={updateLifts} />}
      
      {/* Navigation */}
      <nav className="fixed bottom-0 w-full bg-black/80 backdrop-blur-2xl border-t border-zinc-800/50 px-8 py-6 pb-10 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveTab('train')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'train' ? 'text-blue-500' : 'text-zinc-600'}`}
        >
          <Dumbbell size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Train</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'history' ? 'text-blue-500' : 'text-zinc-600'}`}
        >
          <History size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'stats' ? 'text-blue-500' : 'text-zinc-600'}`}
        >
          <TrendingUp size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Progress</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'settings' ? 'text-blue-500' : 'text-zinc-600'}`}
        >
          <SettingsIcon size={22} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase tracking-widest">Settings</span>
        </button>
      </nav>
    </div>
  );
};
